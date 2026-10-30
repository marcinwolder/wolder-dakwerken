import type { CountryCode } from "libphonenumber-js";

import type { Language } from ".";

/** Country preselected for each language (phone prefix, map view). */
export const LANGUAGE_COUNTRY: Record<Language, CountryCode> = {
    pl: "PL",
    en: "GB",
    de: "DE",
    nl: "NL",
};

export type MapView = { center: [number, number]; zoom: number };

export const MAP_VIEWS: Record<Language, MapView> = {
    pl: { center: [52.0, 19.4], zoom: 6 },
    en: { center: [54.0, -2.5], zoom: 6 },
    de: { center: [51.2, 10.4], zoom: 6 },
    nl: { center: [52.2, 5.3], zoom: 7 },
};
