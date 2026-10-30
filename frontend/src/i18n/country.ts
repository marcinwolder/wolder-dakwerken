import type { CountryCode } from "libphonenumber-js";

import type { Language } from ".";

/** Country preselected for each language (phone prefix, address country). */
export const LANGUAGE_COUNTRY: Record<Language, CountryCode> = {
    pl: "PL",
    en: "GB",
    de: "DE",
    nl: "NL",
};

/** Countries the roofer works in. The address country is independent of the page language. */
export const ADDRESS_COUNTRIES = ["NL", "DE", "BE"] as const;

export type AddressCountry = (typeof ADDRESS_COUNTRIES)[number];

/** Address country preselected for each page language (PL and EN have no country of their own). */
export const ADDRESS_COUNTRY_FOR_LANGUAGE: Record<Language, AddressCountry> = {
    pl: "NL",
    en: "NL",
    de: "DE",
    nl: "NL",
};

export const isAddressCountry = (code: unknown): code is AddressCountry =>
    ADDRESS_COUNTRIES.includes(code as AddressCountry);

export type MapView = { center: [number, number]; zoom: number };

type CountryRules = {
    mapView: MapView;
    /** Language of place names returned by reverse geocoding. A list is allowed (BE). */
    placeLanguage: string;
    /** Valid postal code, with the optional separators the user may leave out. */
    postalPattern: RegExp;
    postalExample: string;
    /** Writes the code the way it is printed on a letter. */
    formatPostal: (value: string) => string;
};

const compact = (value: string) => value.replace(/[\s-]/g, "");

export const COUNTRY_RULES: Record<AddressCountry, CountryRules> = {
    DE: {
        mapView: { center: [51.2, 10.4], zoom: 6 },
        placeLanguage: "de",
        postalPattern: /^\d{5}$/,
        postalExample: "10115",
        formatPostal: compact,
    },
    NL: {
        mapView: { center: [52.2, 5.3], zoom: 7 },
        placeLanguage: "nl",
        // Dutch codes never start with 0.
        postalPattern: /^[1-9]\d{3}\s?[A-Za-z]{2}$/,
        postalExample: "1012 AB",
        formatPostal: (value) => {
            const code = compact(value).toUpperCase();
            return `${code.slice(0, 4)} ${code.slice(4)}`;
        },
    },
    BE: {
        mapView: { center: [50.6, 4.7], zoom: 8 },
        placeLanguage: "nl,fr,de",
        postalPattern: /^[1-9]\d{3}$/,
        postalExample: "1000",
        formatPostal: compact,
    },
};

export const isValidPostalCode = (country: AddressCountry, value: string) =>
    COUNTRY_RULES[country].postalPattern.test(value.trim());

/** Returns the code in its printed form, or the trimmed input when it does not fit the country. */
export const normalizePostalCode = (country: AddressCountry, value: string) => {
    const trimmed = value.trim();
    return isValidPostalCode(country, trimmed)
        ? COUNTRY_RULES[country].formatPostal(trimmed)
        : trimmed;
};
