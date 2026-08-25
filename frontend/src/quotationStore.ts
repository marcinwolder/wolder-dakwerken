import { atom } from 'nanostores';

export const $currentSection = atom<number>(1);

export const redirectToSection = (sectionNumber: number) => {
    const url = new URL(window.location.href);
    url.pathname = "/quotation";
    url.searchParams.set("step", sectionNumber.toString());
    window.history.pushState({}, "", url);
    $currentSection.set(sectionNumber);
};
