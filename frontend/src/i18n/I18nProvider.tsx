import { type ReactNode, useState } from "react";

import { $language, type Language } from ".";

/**
 * Seeds the language store from the page's URL language before the children render.
 * Server rendering and hydration then produce the same markup, with no flash of another language.
 * Setting the store inside one synchronous render pass is safe: each island is rendered on its own.
 */
export default function I18nProvider(props: {
    lang: Language;
    children: ReactNode;
}) {
    useState(() => $language.set(props.lang));
    return <>{props.children}</>;
}
