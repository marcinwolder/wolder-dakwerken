import classNames from 'classnames';
import {
    AsYouType,
    type CountryCode,
    getCountries,
    getCountryCallingCode,
    parsePhoneNumberFromString,
} from 'libphonenumber-js';
import { useMemo, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { FaChevronDown } from 'react-icons/fa';

const DEFAULT_COUNTRY: CountryCode = "PL";  // TODO: Add automatic country detection
const PINNED_COUNTRIES: CountryCode[] = ["PL", "NL", "DE"];  // TODO: Sync this with supported languages

const flagUrl = (country: CountryCode) =>
    `https://purecatamphetamine.github.io/country-flag-icons/3x2/${country}.svg`;

function Flag({ country }: { country: CountryCode }) {
    return (
        <img
            src={flagUrl(country)}
            alt=""
            loading="lazy"
            className="h-4 w-6 rounded-xs object-cover shadow-sm"
        />
    );
}

const regionNames = new Intl.DisplayNames(["pl"], { type: "region" });

const COUNTRIES = getCountries()
    .map((code) => ({
        code,
        name: regionNames.of(code) ?? code,
        callingCode: getCountryCallingCode(code),
    }))
    .sort((a, b) => {
        const pinA = PINNED_COUNTRIES.indexOf(a.code);
        const pinB = PINNED_COUNTRIES.indexOf(b.code);
        if (pinA !== -1 || pinB !== -1) {
            return (pinA === -1 ? 99 : pinA) - (pinB === -1 ? 99 : pinB);
        }
        return a.name.localeCompare(b.name, "pl");
    });

const countryForCallingCode = (callingCode: string, preferred?: CountryCode) =>
    preferred && getCountryCallingCode(preferred) === callingCode
        ? preferred
        : (COUNTRIES.find((c) => c.callingCode === callingCode)?.code ??
            DEFAULT_COUNTRY);

function initialState(value: string | undefined): {
    country: CountryCode;
    text: string;
} {
    const parsed = value ? parsePhoneNumberFromString(value) : undefined;
    if (!parsed) {
        return { country: DEFAULT_COUNTRY, text: "" };
    }
    return {
        country: countryForCallingCode(
            parsed.countryCallingCode,
            parsed.country,
        ),
        text: parsed.nationalNumber,
    };
}

/**
 * Phone input with a country prefix dropdown. The form value is the full
 * international number without spaces (e.g. "+48123456789").
 * Typing a full prefix like "+48" in the input moves it to the dropdown.
 */
export default function PhoneInput(props: {
    id: string;
    name: string;
    placeholder?: string;
}) {
    const {
        field,
        fieldState: { error },
    } = useController({ name: props.id });
    const { clearErrors } = useFormContext();
    const [{ country, text }, setState] = useState(() =>
        initialState(field.value),
    );
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const isError = Boolean(error);

    const commit = (nextCountry: CountryCode, nextText: string) => {
        setState({ country: nextCountry, text: nextText });
        clearErrors(props.id);
        const digits = nextText.replace(/\D/g, "");
        if (!digits) {
            field.onChange("");
        } else if (nextText.trim().startsWith("+")) {
            field.onChange(`+${digits}`);
        } else {
            field.onChange(`+${getCountryCallingCode(nextCountry)}${digits}`);
        }
    };

    const handleInput = (raw: string) => {
        if (raw.trim().startsWith("+")) {
            const typer = new AsYouType();
            typer.input(raw);
            const callingCode = typer.getCallingCode();
            if (callingCode) {
                commit(
                    countryForCallingCode(
                        callingCode,
                        typer.getCountry() ?? country,
                    ),
                    typer.getNationalNumber(),
                );
                return;
            }
            // Prefix not complete yet (e.g. "+4"): keep what the user typed.
            commit(country, raw);
            return;
        }
        commit(country, raw.replace(/[^\d\s-]/g, ""));
    };

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase().replace(/^\+/, "");
        if (!q) {
            return COUNTRIES;
        }
        return COUNTRIES.filter(
            (c) =>
                c.name.toLowerCase().includes(q) ||
                c.code.toLowerCase() === q ||
                c.callingCode.startsWith(q),
        );
    }, [query]);

    const close = () => {
        setIsOpen(false);
        setQuery("");
    };

    return (
        <fieldset className="fieldset w-full">
            <label
                className={classNames("label", { "text-error": isError })}
                htmlFor={props.id}>
                {props.name}
            </label>
            <div className="flex gap-2 relative">
                <button
                    type="button"
                    aria-label="Wybierz prefiks kraju"
                    aria-expanded={isOpen}
                    className={classNames("btn px-3 font-normal", {
                        "btn-error btn-outline": isError,
                    })}
                    onClick={() => setIsOpen((open) => !open)}>
                    <Flag country={country} />
                    +{getCountryCallingCode(country)}
                    <FaChevronDown className="text-xs opacity-60" />
                </button>
                <input
                    ref={field.ref}
                    id={props.id}
                    type="tel"
                    autoComplete="tel-national"
                    enterKeyHint="next"
                    className={classNames("input w-full", {
                        "input-error": isError,
                    })}
                    placeholder={props.placeholder}
                    value={text}
                    onBlur={field.onBlur}
                    onChange={(e) => handleInput(e.target.value)}
                />
                {isOpen && (
                    <>
                        <button
                            type="button"
                            aria-label="Zamknij"
                            className="fixed inset-0 z-10 cursor-default"
                            onClick={close}
                        />
                        <div className="absolute top-full left-0 z-20 mt-1 w-full max-w-sm rounded-box border border-base-300 bg-base-100 p-2 shadow-lg">
                            <input
                                type="search"
                                autoFocus
                                className="input input-sm w-full mb-2"
                                placeholder="Szukaj kraju lub prefiksu"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <ul className="max-h-60 overflow-y-auto">
                                {filtered.map((c) => (
                                    <li key={c.code}>
                                        <button
                                            type="button"
                                            className={classNames(
                                                "flex w-full items-center gap-3 rounded-field px-2 py-1.5 text-left hover:bg-base-200",
                                                {
                                                    "font-bold":
                                                        c.code === country,
                                                },
                                            )}
                                            onClick={() => {
                                                commit(c.code, text);
                                                close();
                                            }}>
                                            <Flag country={c.code} />
                                            <span className="grow truncate">
                                                {c.name}
                                            </span>
                                            <span className="opacity-60">
                                                +{c.callingCode}
                                            </span>
                                        </button>
                                    </li>
                                ))}
                                {filtered.length === 0 && (
                                    <li className="px-2 py-1.5 text-sm opacity-60">
                                        Brak wyników
                                    </li>
                                )}
                            </ul>
                        </div>
                    </>
                )}
            </div>
            {error && (
                <p className="label text-error whitespace-normal">{error.message?.toString()}</p>
            )}
        </fieldset>
    );
}
