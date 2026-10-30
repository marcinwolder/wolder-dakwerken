const pl = {
    "landing.guess": "NIECH ZGADNĘ",
    "landing.mustReplace": "MUSISZ WYMIENIĆ ",
    "landing.word1": "OKNA?",
    "landing.word2": "RYNNY?",
    "landing.word3": "DACHÓWKI?",
    "landing.hit": "TRAFIŁEŚ W ",
    "landing.perfect": "IDEALNE",
    "landing.place": "MIEJSCE!",
    "landing.cta": "UMÓW WYCENĘ",
    "landing.seeWork": "ZOBACZ MOJĄ PRACĘ",

    "nav.logoAlt": "Logo",

    "step.contact": "Kontakt",
    "step.repair": "Naprawa",
    "step.details": "Szczegóły",
    "step.summary": "Podsumo­wanie",

    "heading.contact": "Powiedz mi o sobie trochę więcej",
    "heading.repair": "Jaka naprawa cię interesuje",
    "heading.location": "A gdzie znajduje się budynek?",
    "heading.summary": "To podsumujmy",

    "button.next": "Następny krok",
    "button.previous": "Poprzedni krok",
    "button.submit": "Wyślij zgłoszenie!",
    "button.edit": "Edytuj",

    "contact.firstName": "Imię",
    "contact.firstNamePlaceholder": "Jan",
    "contact.lastName": "Nazwisko",
    "contact.lastNamePlaceholder": "Kowalski",
    "contact.phone": "Numer telefonu",
    "contact.email": "Adres email",
    "contact.emailPlaceholder": "kontakt@wolderdakwerken.pl",
    "contact.preferred": "Jakie formy kontaktu preferujesz?",

    "repair.roofRepairAndMaintenance": "Naprawa i konserwacja dachu",
    "repair.gutterInstallation": "Montaż orynnowania",
    "repair.sheetMetalWork": "Obróbki blacharskie",
    "repair.roofWindowsAndHatches": "Montaż okien dachowych i wyłazów",
    "repair.roofInsulation": "Ocieplanie i izolacja dachu",
    "repair.soffitInstallation": "Montaż podbitki dachowej (podsufitki)",
    "repair.additionalLabel": "Inne potrzeby lub dodatkowe informacje",
    "repair.additionalPlaceholder":
        "Opisz problem, np. przeciek w okolicy komina albo inną usługę, której nie ma na liście",

    "location.pickOnMap": "Wybierz adres z mapy",
    "location.street": "Ulica i numer budynku",
    "location.apartment": "Mieszkanie (opc.)",
    "location.apartmentPlaceholder": "np. 12",
    "location.apartmentShort": "m.",
    "location.zip": "Kod pocztowy",
    "location.city": "Miejscowość",

    "map.title": "Wskaż budynek na mapie",
    "map.hint": "Kliknij na mapie, aby postawić pineskę.",
    "map.error": "Nie udało się pobrać adresu. Spróbuj wskazać inne miejsce.",
    "map.noAddress": "Nie znaleziono adresu w tym miejscu.",
    "map.locate": "Użyj mojej lokalizacji",
    "map.locateError": "Nie udało się ustalić lokalizacji. Zezwól przeglądarce na dostęp do lokalizacji lub wskaż miejsce na mapie.",
    "map.cancel": "Anuluj",
    "map.use": "Użyj tego adresu",

    "phone.choosePrefix": "Wybierz prefiks kraju",
    "phone.close": "Zamknij",
    "phone.search": "Szukaj kraju lub prefiksu",
    "phone.noResults": "Brak wyników",

    "summary.contact": "Dane kontaktowe",
    "summary.name": "Imię i nazwisko",
    "summary.phone": "Telefon",
    "summary.email": "Email",
    "summary.preferred": "Preferowany kontakt",
    "summary.repair": "Rodzaj naprawy",
    "summary.additional": "Dodatkowe informacje",
    "summary.location": "Lokalizacja budynku",

    "error.required": "Pole jest wymagane",
    "error.phoneInvalid": "Niepoprawny format numeru telefonu",
    "error.emailInvalid": "Niepoprawny format adresu email",
    "error.tooLong": "Maksymalnie {max} znaków",
    "error.contactRequired": "Wybierz przynajmniej jedną formę kontaktu",
    "error.serviceRequired":
        "Wybierz przynajmniej jedną usługę lub opisz swoje potrzeby",
    "error.zipInvalid": "Niepoprawny format kodu pocztowego",
} as const;

export type TranslationKey = keyof typeof pl;
export type Dictionary = Record<TranslationKey, string>;

export default pl as Dictionary;
