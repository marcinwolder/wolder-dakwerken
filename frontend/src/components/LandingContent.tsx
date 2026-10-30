import { FaAnglesDown } from "react-icons/fa6";

import { type Language, localizedPath, useTranslation } from "../i18n";
import I18nProvider from "../i18n/I18nProvider";
import AnimatedHouse from "./AnimatedHouse";

function Content() {
    const { t, language } = useTranslation();
    return (
        <div className="lg:flex lg:flex-col lg:items-start">
            <div className="font-bold flex flex-col w-fit mx-auto my-8 lg:mx-0 lg:my-0">
                <span className="text-4xl lg:text-6xl">{t("landing.guess")}</span>
                <span className="text-xl lg:text-3xl">
                    <span>{t("landing.mustReplace")}</span>
                    <span className="text-rotate">
                        <span className="text-secondary">
                            <span>{t("landing.word1")}</span>
                            <span>{t("landing.word2")}</span>
                            <span>{t("landing.word3")}</span>
                        </span>
                    </span>
                </span>
            </div>
            <div className="flex my-12 mx-auto w-fit lg:mx-0 lg:my-10">
                <AnimatedHouse />
                <div className="flex flex-col items-end w-fit font-bold text-2xl lg:text-4xl">
                    <span>{t("landing.hit")}</span>
                    <span className="text-accent">{t("landing.perfect")}</span>
                    <span>{t("landing.place")}</span>
                </div>
            </div>
            <div className="flex justify-center lg:justify-start lg:w-full">
                <a
                    href={localizedPath(language, "/quotation")}
                    className="btn btn-xl btn-ghost w-[80vw] lg:w-full lg:max-w-md border-2 border-primary rounded-3xl shadow-lg font-bold">
                    {t("landing.cta")}
                </a>
            </div>
            <div className="flex flex-col items-center m-8 lg:hidden">
                <span className="flex gap-4 items-center mb-4">
                    {t("landing.seeWork")}
                    <FaAnglesDown className="animate-bounce" />
                </span>
            </div>
        </div>
    );
}

export default function LandingContent(props: { lang: Language }) {
    return (
        <I18nProvider lang={props.lang}>
            <Content />
        </I18nProvider>
    );
}
