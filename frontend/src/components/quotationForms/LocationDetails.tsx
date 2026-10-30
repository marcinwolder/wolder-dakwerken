import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FaMapMarkerAlt } from 'react-icons/fa';

import { useTranslation } from '../../i18n';
import {
    ADDRESS_COUNTRIES,
    ADDRESS_COUNTRY_FOR_LANGUAGE,
    type AddressCountry,
    COUNTRY_RULES,
    normalizePostalCode,
} from '../../i18n/country';
import { keepInputFocus } from '../../lib/utils';
import { redirectToSection } from '../../quotationStore';
import FormInput from '../FormInput';

// Leaflet touches `window` on import, so the map is loaded only in the browser.
const MapPicker = lazy(() => import('./MapPicker'));

export default function LocationDetails() {
    const {
        trigger,
        setValue,
        getValues,
        watch,
        register,
        clearErrors,
        setFocus,
        formState: { dirtyFields },
    } = useFormContext();
    const [isMapOpen, setIsMapOpen] = useState(false);
    const { t, language } = useTranslation();
    const country = watch('country') as AddressCountry;
    const countryNames = useMemo(
        () => new Intl.DisplayNames([language], { type: 'region' }),
        [language],
    );
    const countryRegistration = register('country');

    // The address country follows the page language until the user picks one (or the map does).
    useEffect(() => {
        if (!dirtyFields.country) {
            setValue('country', ADDRESS_COUNTRY_FOR_LANGUAGE[language]);
        }
    }, [language, dirtyFields.country, setValue]);

    return (
        <>
            <div className="flex flex-col mt-4">
                <button
                    type="button"
                    className="btn btn-outline w-full mb-2"
                    onClick={() => setIsMapOpen(true)}>
                    <FaMapMarkerAlt />
                    {t("location.pickOnMap")}
                </button>
                <fieldset className="fieldset w-full">
                    <label className="label" htmlFor="country">
                        {t("location.country")}
                    </label>
                    <select
                        id="country"
                        className="select w-full"
                        autoComplete="country"
                        {...countryRegistration}
                        onChange={(e) => {
                            countryRegistration.onChange(e);
                            // The postal code format depends on the country.
                            if (getValues('zipCode')) {
                                trigger('zipCode');
                            }
                        }}>
                        {ADDRESS_COUNTRIES.map((code) => (
                            <option key={code} value={code}>
                                {countryNames.of(code) ?? code}
                            </option>
                        ))}
                    </select>
                </fieldset>
                <div className="grid grid-cols-[minmax(0,1fr)_9rem] gap-2">
                    <FormInput
                        id={'streetName'}
                        name={t("location.street")}
                        autoComplete="address-line1"
                    />
                    <FormInput
                        id={'apartmentNumber'}
                        name={t("location.apartment")}
                        placeholder={t("location.apartmentPlaceholder")}
                        autoComplete="address-line2"
                    />
                </div>
                <div className="grid grid-cols-[9rem_minmax(0,1fr)] gap-2">
                    <FormInput
                        id={'zipCode'}
                        name={t("location.zip")}
                        placeholder={COUNTRY_RULES[country]?.postalExample}
                        autoComplete="postal-code"
                    />
                    <FormInput
                        id={'city'}
                        name={t("location.city")}
                        autoComplete="address-level2"
                    />
                </div>
            </div>
            {isMapOpen && (
                <Suspense fallback={null}>
                    <MapPicker
                        country={country}
                        onClose={() => setIsMapOpen(false)}
                        onSelect={(address) => {
                            Object.entries(address).forEach(([key, value]) =>
                                setValue(key, value, { shouldDirty: true }),
                            );
                            clearErrors(['streetName', 'zipCode', 'city']);
                            setIsMapOpen(false);
                            // The map cannot know the apartment number, so prompt for it.
                            setFocus('apartmentNumber');
                        }}
                    />
                </Suspense>
            )}
            <div className="sticky-footer" onMouseDown={keepInputFocus}>
                <div className="divider " />
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="button"
                        className="btn"
                        value={t("button.previous")}
                        onClick={() => {
                            redirectToSection(2);
                        }}
                    />
                    <input
                        type="button"
                        className="btn btn-secondary"
                        value={t("button.next")}
                        onClick={async () => {
                            const isCorrect = await trigger(['country', 'streetName', 'zipCode', 'city']);
                            if (isCorrect) {
                                // Store the code the way it is printed on a letter ("1234 AB").
                                setValue(
                                    'zipCode',
                                    normalizePostalCode(country, getValues('zipCode')),
                                );
                                redirectToSection(4);
                            }
                        }}
                    />
                </div>
            </div>
        </>
    );
}
