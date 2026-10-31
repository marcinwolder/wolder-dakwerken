import classNames from 'classnames';
import {
    AsYouType,
    type CountryCode,
    getCountries,
    getCountryCallingCode,
    getExampleNumber,
    parsePhoneNumberFromString,
} from 'libphonenumber-js';
import examples from 'libphonenumber-js/mobile/examples';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { FaChevronDown } from 'react-icons/fa';

import {
    LANGUAGES,
    type Language,
    useErrorText,
    useTranslation,
} from '../i18n';
import { LANGUAGE_COUNTRY } from '../i18n/country';
import Flag from './Flag';

const PINNED_COUNTRIES: CountryCode[] = LANGUAGES.map((l) => l.country);

// Country names and their order depend on the language, so the list is built per language.
function buildCountries(language: Language) {
    const regionNames = new Intl.DisplayNames([language], { type: "region" });
    const all = getCountries()
        .map((code) => ({
            code,
            name: regionNames.of(code) ?? code,
            callingCode: getCountryCallingCode(code),
        }))
        .sort((a, b) => a.name.localeCompare(b.name, language));
    // Pinned countries are listed first and also stay at their place in the alphabet.
    const pinned = PINNED_COUNTRIES.flatMap((code) => all.find((c) => c.code === code) ?? []);
    return { pinned, all };
}

const countriesCache = new Map<Language, ReturnType<typeof buildCountries>>();

const countriesFor = (language: Language) => {
    let countries = countriesCache.get(language);
    if (!countries) {
        countries = buildCountries(language);
        countriesCache.set(language, countries);
    }
    return countries;
};

// Calling codes shared by many countries: the main one, instead of the first in the alphabet.
const MAIN_COUNTRY_FOR_CALLING_CODE: Record<string, CountryCode> = {
    "1": "US",
    "7": "RU",
    "39": "IT",
    "44": "GB",
    "47": "NO",
    "61": "AU",
    "212": "MA",
    "262": "RE",
    "290": "SH",
    "358": "FI",
    "590": "GP",
    "599": "CW",
};

const countryForCallingCode = (
    callingCode: string,
    fallback: CountryCode,
    preferred?: CountryCode,
) => {
    if (preferred && getCountryCallingCode(preferred) === callingCode) {
        return preferred;
    }
    // Keep the current country when the prefix still fits it (e.g. Jersey stays "+44").
    if (getCountryCallingCode(fallback) === callingCode) {
        return fallback;
    }
    return (
        MAIN_COUNTRY_FOR_CALLING_CODE[callingCode] ??
        getCountries().find((c) => getCountryCallingCode(c) === callingCode) ??
        fallback
    );
};

// National format of a sample mobile number of the country, e.g. "0151 23456789" in DE.
const examplePlaceholder = (country: CountryCode) =>
    getExampleNumber(country, examples)?.formatNational();

function initialState(
    value: string | undefined,
    defaultCountry: CountryCode,
): {
    country: CountryCode;
    text: string;
} {
    const parsed = value ? parsePhoneNumberFromString(value) : undefined;
    if (!parsed) {
        return { country: defaultCountry, text: "" };
    }
    return {
        country: countryForCallingCode(
            parsed.countryCallingCode,
            defaultCountry,
            parsed.country,
        ),
        text: parsed.nationalNumber,
    };
}

/**
 * Phone input with a country prefix dropdown. The form value is the full
 * international number without spaces (e.g. "+48123456789").
 * Typing a full prefix like "+48" in the input moves it to the dropdown.
 * The country is preselected from the page language.
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
    const { t, language } = useTranslation();
    const errorText = useErrorText();
    const countries = countriesFor(language);
    const [{ country, text }, setState] = useState(() =>
        initialState(field.value, LANGUAGE_COUNTRY[language]),
    );
    const isCountryTouched = useRef(Boolean(field.value));
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const isError = Boolean(error);

    // Follow the language's country until the user picks one or starts typing.
    useEffect(() => {
        if (!isCountryTouched.current) {
            setState((state) => ({
                ...state,
                country: LANGUAGE_COUNTRY[language],
            }));
        }
    }, [language]);

    const commit = (nextCountry: CountryCode, nextText: string) => {
        isCountryTouched.current = true;
        setState({ country: nextCountry, text: nextText });
        clearErrors(props.id);
        const digits = nextText.replace(/\D/g, "");
        if (!digits) {
            field.onChange("");
            return;
        }
        const raw = nextText.trim().startsWith("+")
            ? `+${digits}`
            : `+${getCountryCallingCode(nextCountry)}${digits}`;
        // A valid number is stored in E.164, which drops the national trunk "0" ("0151..." in DE).
        const parsed = parsePhoneNumberFromString(raw);
        field.onChange(parsed?.isValid() ? parsed.number : raw);
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
                        country,
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

    const { pinned, filtered } = useMemo(() => {
        const q = query.trim().toLowerCase().replace(/^\+/, "");
        if (!q) {
            return { pinned: countries.pinned, filtered: countries.all };
        }
        // A search lists each match once, so the pinned section is hidden.
        return {
            pinned: [],
            filtered: countries.all.filter(
                (c) =>
                    c.name.toLowerCase().includes(q) ||
                    c.code.toLowerCase() === q ||
                    c.callingCode.startsWith(q),
            ),
        };
    }, [query, countries]);

    const close = () => {
        setIsOpen(false);
        setQuery("");
    };

    const renderCountry = (c: (typeof filtered)[number], key: string) => (
        <li key={key}>
            <button
                type="button"
                className={classNames(
                    "flex w-full items-center gap-3 rounded-field px-2 py-1.5 text-left hover:bg-base-200",
                    { "font-bold": c.code === country },
                )}
                onClick={() => {
                    commit(c.code, text);
                    close();
                }}>
                <Flag country={c.code} />
                <span className="grow truncate">{c.name}</span>
                <span className="opacity-60">+{c.callingCode}</span>
            </button>
        </li>
    );

    return (
        <fieldset className="fieldset w-full min-w-0">
            <label
                className={classNames("label w-full whitespace-normal leading-tight", {
                    "text-error": isError,
                })}
                htmlFor={props.id}>
                {props.name}
            </label>
            <div className="flex gap-2 relative">
                <button
                    type="button"
                    aria-label={t("phone.choosePrefix")}
                    aria-expanded={isOpen}
                    className={classNames("btn btn-lg px-3 font-normal", {
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
                    className={classNames("input input-lg w-full", {
                        "input-error": isError,
                    })}
                    placeholder={props.placeholder ?? examplePlaceholder(country)}
                    value={text}
                    onBlur={field.onBlur}
                    onChange={(e) => handleInput(e.target.value)}
                />
                {isOpen && (
                    <>
                        <button
                            type="button"
                            aria-label={t("phone.close")}
                            className="fixed inset-0 z-10 cursor-default"
                            onClick={close}
                        />
                        <div className="absolute top-full left-0 z-20 mt-1 w-full max-w-sm rounded-box border border-base-300 bg-base-100 p-2 shadow-lg">
                            <input
                                type="search"
                                autoFocus
                                className="input input-sm w-full mb-2"
                                placeholder={t("phone.search")}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <ul className="max-h-60 overflow-y-auto">
                                {pinned.map((c) => renderCountry(c, `pinned-${c.code}`))}
                                {pinned.length > 0 && (
                                    <li role="separator" className="my-1 border-t border-base-300" />
                                )}
                                {filtered.map((c) => renderCountry(c, c.code))}
                                {filtered.length === 0 && (
                                    <li className="px-2 py-1.5 text-sm opacity-60">
                                        {t("phone.noResults")}
                                    </li>
                                )}
                            </ul>
                        </div>
                    </>
                )}
            </div>
            {error && (
                <p className="label text-error whitespace-normal">{errorText(error.message)}</p>
            )}
        </fieldset>
    );
}
