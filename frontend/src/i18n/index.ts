import { atom } from "nanostores";
import { useStore } from "@nanostores/react";

import { ADDITIONAL_INFO_MAX_LENGTH } from "../components/quotationForms/repairOptions";
import { withBase } from "../utils/withBase";
import de from "./locales/de";
import en from "./locales/en";
import nl from "./locales/nl";
import pl, { type Dictionary, type TranslationKey } from "./locales/pl";

export type { TranslationKey };

export const LANGUAGES = [
    { code: "pl", name: "Polski", country: "PL" },
    { code: "en", name: "English", country: "GB" },
    { code: "de", name: "Deutsch", country: "DE" },
    { code: "nl", name: "Nederlands", country: "NL" },
] as const;

export type Language = (typeof LANGUAGES)[number]["code"];

const DICTIONARIES: Record<Language, Dictionary> = { pl, en, de, nl };

// Used by the root redirect when the browser reports no supported language.
export const FALLBACK_LANGUAGE: Language = "en";
export const STORAGE_KEY = "language";

/**
 * The language comes from the URL (`/nl/...`), which every page receives as a prop
 * and passes to `I18nProvider`. The atom only lets islands on the same page follow
 * an in-page language switch without a reload (a reload would lose the form).
 */
export const $language = atom<Language>("pl");

/** Path of a page in a language, e.g. `localizedPath("nl", "/quotation")`. */
export const localizedPath = (language: Language, path = "") =>
    withBase(`/${language}${path}`);

/** Switches the language in place: updates islands, the URL and the saved choice. */
export const setLanguage = (language: Language) => {
    $language.set(language);
    document.documentElement.lang = language;
    // Keep the URL in sync, so reloading or sharing the page keeps the language.
    const base = withBase("/").replace(/\/$/, "");
    const rest = window.location.pathname
        .slice(base.length)
        .replace(/^\/[^/]*/, "");
    const url = new URL(window.location.href);
    url.pathname = localizedPath(language, rest);
    window.history.replaceState(window.history.state, "", url);
    try {
        localStorage.setItem(STORAGE_KEY, language);
    } catch {
        // Storage may be blocked (private mode); the choice then lasts for the page only.
    }
};

type Vars = Record<string, string | number>;

export type Translate = (key: TranslationKey, vars?: Vars) => string;

export const translate = (
    language: Language,
    key: TranslationKey,
    vars?: Vars,
): string => {
    const template = DICTIONARIES[language][key];
    if (!vars) {
        return template;
    }
    return template.replace(/\{(\w+)\}/g, (match, name) =>
        name in vars ? String(vars[name]) : match,
    );
};

export function useTranslation() {
    const language = useStore($language);
    const t: Translate = (key, vars) => translate(language, key, vars);
    return { t, language };
}

/**
 * Validation messages are stored in the form state as translation keys, so
 * they follow the language when it changes after the error was raised.
 */
export function useErrorText() {
    const { t } = useTranslation();
    return (message: unknown): string | undefined => {
        if (typeof message !== "string") {
            return undefined;
        }
        return message in DICTIONARIES.pl
            ? t(message as TranslationKey, { max: ADDITIONAL_INFO_MAX_LENGTH })
            : message;
    };
}
