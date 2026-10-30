import { atom } from 'nanostores';

import { clamp } from './lib/utils';

export const STEPS = [
    "step.contact",
    "step.repair",
    "step.details",
    "step.summary",
] as const;

export const $currentSection = atom<number>(1);
// Furthest step the user reached by passing validation. Steps beyond it cannot be opened via the URL.
export const $maxSection = atom<number>(1);

const stepFromUrl = () =>
    Number(new URLSearchParams(window.location.search).get("step")) || 1;

const writeStepToUrl = (sectionNumber: number, replace: boolean) => {
    const url = new URL(window.location.href);
    url.searchParams.set("step", sectionNumber.toString());
    if (replace) {
        window.history.replaceState({}, "", url);
    } else {
        window.history.pushState({}, "", url);
    }
};

export const redirectToSection = (sectionNumber: number) => {
    const target = clamp(sectionNumber, 1, STEPS.length);
    $maxSection.set(Math.max($maxSection.get(), target));
    writeStepToUrl(target, false);
    $currentSection.set(target);
    window.scrollTo({ top: 0 });
};

// Syncs the store with the URL (initial load and browser back/forward buttons).
export const syncSectionWithUrl = (replace = false) => {
    const target = clamp(stepFromUrl(), 1, $maxSection.get());
    if (replace || target !== stepFromUrl()) {
        writeStepToUrl(target, true);
    }
    $currentSection.set(target);
};
