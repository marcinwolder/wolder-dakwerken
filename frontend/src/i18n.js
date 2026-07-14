import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './locales/en/translation.json';
import translationPL from './locales/pl/translation.json';

i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: translationEN,
            flag: 'gb',
            name: 'English',
        },
        pl: {
            translation: translationPL,
            flag: 'pl',
            name: 'Polski',
        },
    },
    lng: 'pl',
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;