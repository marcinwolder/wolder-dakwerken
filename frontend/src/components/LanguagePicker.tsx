import { useTranslation } from "../../node_modules/react-i18next";

export default function LanguagePicker() {
    const { i18n } = useTranslation();
    const resources = i18n.options.resources;
    if (!resources) {
        throw new Error("No resources found in i18n options");
    }
    return (
        <>
            <div className="dropdown">
                <div
                    tabIndex={0}
                    className="btn btn-ghost w-20 m-1 text-center">
                    {i18n.language.toUpperCase()}{" "}
                    <span
                        className={`fi fi-${resources[i18n.language].flag} w-max`}
                    />
                </div>
                <ul
                    tabIndex={-1}
                    className="menu dropdown-content rounded-box bg-base-100 z-1 shadow-sm">
                    {Object.keys(resources).map((lng) => (
                        <li key={lng}>
                            <button
                                onClick={() => {
                                    i18n.changeLanguage(lng);
                                    if (
                                        document.activeElement instanceof
                                        HTMLElement
                                    ) {
                                        document.activeElement.blur();
                                    }
                                }}>
                                <span
                                    className={`fi fi-${resources[lng].flag} w-max`}
                                />{" "}
                                {resources[lng].name.toString()}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
