import { useStore } from "@nanostores/react";

import { $language, type Language, LANGUAGES, setLanguage } from "../i18n";
import I18nProvider from "../i18n/I18nProvider";
import Flag from "./Flag";

function Picker() {
    const language = useStore($language);
    const current = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

    return (
        <div className="dropdown">
            <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost w-24 m-1 gap-2 text-center">
                {current.code.toUpperCase()}
                <Flag country={current.country} />
            </div>
            <ul
                tabIndex={-1}
                className="menu dropdown-content rounded-box bg-base-100 z-50 shadow-sm w-44">
                {LANGUAGES.map((l) => (
                    <li key={l.code}>
                        <button
                            type="button"
                            className={l.code === language ? "menu-active" : ""}
                            onClick={() => {
                                setLanguage(l.code);
                                if (document.activeElement instanceof HTMLElement) {
                                    document.activeElement.blur();
                                }
                            }}>
                            <Flag country={l.country} />
                            {l.name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function LanguagePicker(props: { lang: Language }) {
    return (
        <I18nProvider lang={props.lang}>
            <Picker />
        </I18nProvider>
    );
}
