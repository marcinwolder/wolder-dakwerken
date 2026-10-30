import { isValidPhoneNumber } from 'libphonenumber-js';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { useStore } from '@nanostores/react';

import ContactInfo from '../../../components/quotationForms/ContactInfo';
import RepairDetails from '../../../components/quotationForms/RepairDetails';
import { useEffect } from 'react';
import classNames from 'classnames';

import {
    $currentSection,
    $maxSection,
    redirectToSection,
    STEPS,
    syncSectionWithUrl,
} from '../../../quotationStore';
import LocationDetails from '../../../components/quotationForms/LocationDetails';
import Summary from '../../../components/quotationForms/Summary';
import { ADDITIONAL_INFO_MAX_LENGTH } from '../../../components/quotationForms/repairOptions';
import { type Language, type TranslationKey, useTranslation } from '../../../i18n';
import I18nProvider from '../../../i18n/I18nProvider';

// Messages are translation keys (see `useErrorText`), so they are translated when shown.
const REQUIRED_ERROR_MESSAGE: TranslationKey = "error.required";

const quotationSchema = z
    .object({
        firstName: z.string().min(1, REQUIRED_ERROR_MESSAGE),
        lastName: z.string().min(1, REQUIRED_ERROR_MESSAGE),
        phoneNumber: z
            .string()
            .trim()
            .min(1, REQUIRED_ERROR_MESSAGE)
            .refine(
                (val) => isValidPhoneNumber(val),
                "error.phoneInvalid" satisfies TranslationKey,
            ),
        email: z
            .string()
            .trim()
            .min(1, REQUIRED_ERROR_MESSAGE)
            .pipe(z.email("error.emailInvalid" satisfies TranslationKey)),
        contactWhatsapp: z.boolean(),
        contactEmail: z.boolean(),
        contactSms: z.boolean(),
        repairRoofRepairAndMaintenance: z.boolean(),
        repairGutterInstallation: z.boolean(),
        repairSheetMetalWork: z.boolean(),
        repairRoofWindowsAndHatches: z.boolean(),
        repairRoofInsulation: z.boolean(),
        repairSoffitInstallation: z.boolean(),
        additionalInfo: z
            .string()
            .trim()
            .max(ADDITIONAL_INFO_MAX_LENGTH, "error.tooLong" satisfies TranslationKey)
            .optional(),
        streetName: z.string().min(1, REQUIRED_ERROR_MESSAGE),
        apartmentNumber: z.string().trim().optional(),
        zipCode: z
            .string()
            .trim()
            .min(1, REQUIRED_ERROR_MESSAGE)
            // PL "00-000", DE/other 5 digits, NL "1234 AB", BE/AT/CH 4 digits.
            .regex(
                /^(\d\d-\d\d\d|\d{4,5}|\d{4}\s?[A-Za-z]{2})$/,
                "error.zipInvalid" satisfies TranslationKey,
            ),
        city: z.string().min(1, REQUIRED_ERROR_MESSAGE),
    })
    .refine(
        (data) => data.contactEmail || data.contactSms || data.contactWhatsapp,
        {
            error: "error.contactRequired" satisfies TranslationKey,
            path: ["contactWhatsapp"], // Chosen the first option as the error path. Must match error detection in checkbox component
            // Without this, zod skips the rule while any other field (e.g. a later step) is invalid.
            when: () => true,
        },
    )
    .refine(
        (data) =>
            data.repairRoofRepairAndMaintenance ||
            data.repairGutterInstallation ||
            data.repairSheetMetalWork ||
            data.repairRoofWindowsAndHatches ||
            data.repairRoofInsulation ||
            data.repairSoffitInstallation ||
            Boolean(data.additionalInfo),
        {
            error: "error.serviceRequired" satisfies TranslationKey,
            path: ["repairRoofRepairAndMaintenance"], // Chosen the first option as the error path. Must match error detection in RepairDetails
            when: () => true,
        },
    );

type QuotationFormData = z.infer<typeof quotationSchema>;

export default function Quotation(props: { lang: Language }) {
    return (
        <I18nProvider lang={props.lang}>
            <QuotationForm />
        </I18nProvider>
    );
}

function QuotationForm() {
    const methods = useForm<QuotationFormData>({
        resolver: zodResolver(quotationSchema),
        // Controlled fields (e.g. PhoneInput) have no DOM value to fall back on, so they need explicit defaults.
        defaultValues: { phoneNumber: "" },
    });
    const { handleSubmit } = methods;
    const currentSection = useStore($currentSection);
    const maxSection = useStore($maxSection);
    const { t } = useTranslation();

    useEffect(() => {
        // Form data is not persisted yet, so a fresh load always starts at step 1.
        syncSectionWithUrl(true);
        const onPopState = () => syncSectionWithUrl();
        window.addEventListener("popstate", onPopState);
        return () => window.removeEventListener("popstate", onPopState);
    }, []);

    return (
        <>
            <ul className="steps my-8 text-xs w-full">
                {STEPS.map((label, i) => (
                    <li
                        key={label}
                        className={classNames("step min-w-0 px-0.5 break-words hyphens-auto", {
                            "step-secondary": i < currentSection,
                            "cursor-pointer": i + 1 < currentSection,
                        })}
                        onClick={() => {
                            if (i + 1 < currentSection && i + 1 <= maxSection) {
                                redirectToSection(i + 1);
                            }
                        }}>
                        {t(label)}
                    </li>
                ))}
            </ul>
            <div className="mx-4">
                {/* TODO: Make modal for exiting before compleating */}
                {/* TODO: Make next/done keaybord keys switch inputs */}
                {/* TODO: Make form progress persist in the localStorage */}
                <div className="text-xl mb-2">
                    {currentSection === 1 && t("heading.contact")}
                    {currentSection === 2 && t("heading.repair")}
                    {currentSection === 3 && t("heading.location")}
                    {currentSection === 4 && t("heading.summary")}
                </div>
                <FormProvider {...methods}>
                    <form
                        onSubmit={handleSubmit((data) => {
                            // TODO: Send the quotation to the backend once an endpoint exists.
                            console.log(data);
                        })}
                        className="flex flex-col justify-center">
                        {currentSection === 1 && <ContactInfo />}
                        {currentSection === 2 && <RepairDetails />}
                        {currentSection === 3 && <LocationDetails />}
                        {currentSection === 4 && <Summary />}
                    </form>
                </FormProvider>
            </div>
        </>
    );
}
