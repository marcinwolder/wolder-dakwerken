import { isValidPhoneNumber } from 'libphonenumber-js';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { useStore } from '@nanostores/react';

import ContactInfo from '../../components/quotationForms/ContactInfo';
import RepairDetails from '../../components/quotationForms/RepairDetails';
import { useEffect } from 'react';
import classNames from 'classnames';

import {
    $currentSection,
    $maxSection,
    redirectToSection,
    STEPS,
    syncSectionWithUrl,
} from '../../quotationStore';
import LocationDetails from '../../components/quotationForms/LocationDetails';
import Summary from '../../components/quotationForms/Summary';
import { ADDITIONAL_INFO_MAX_LENGTH } from '../../components/quotationForms/repairOptions';

const REQUIRED_ERROR_MESSAGE = "Pole jest wymagane";

// TODO: Make better validation for phone number - add country selector and/or automatic detection
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
                "Niepoprawny format numeru telefonu",
            ),
        email: z
            .string()
            .trim()
            .min(1, REQUIRED_ERROR_MESSAGE)
            .pipe(z.email("Niepoprawny format adresu email")),
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
            .max(ADDITIONAL_INFO_MAX_LENGTH, `Maksymalnie ${ADDITIONAL_INFO_MAX_LENGTH} znaków`)
            .optional(),
        streetName: z.string().min(1, REQUIRED_ERROR_MESSAGE),
        apartmentNumber: z.string().trim().optional(),
        zipCode: z.string().trim().min(1, REQUIRED_ERROR_MESSAGE).regex(/^(\d\d-\d\d\d|\d{5})$/, "Niepoprawny format pocztowego"),
        city: z.string().min(1, REQUIRED_ERROR_MESSAGE),
    })
    .refine(
        (data) => data.contactEmail || data.contactSms || data.contactWhatsapp,
        {
            error: "Wybierz przynajmniej jedną formę kontaktu",
            path: ["contactWhatsapp"], // Chosen the first option as the error path. Must match error detection in checkbox component
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
            error: "Wybierz przynajmniej jedną usługę lub opisz swoje potrzeby",
            path: ["repairRoofRepairAndMaintenance"], // Chosen the first option as the error path. Must match error detection in RepairDetails
        },
    );

type QuotationFormData = z.infer<typeof quotationSchema>;

export default function Quotation() {
    const methods = useForm<QuotationFormData>({
        resolver: zodResolver(quotationSchema),
        // Controlled fields (e.g. PhoneInput) have no DOM value to fall back on, so they need explicit defaults.
        defaultValues: { phoneNumber: "" },
    });
    const { handleSubmit } = methods;
    const currentSection = useStore($currentSection);
    const maxSection = useStore($maxSection);

    useEffect(() => {
        // Form data is not persisted yet, so a fresh load always starts at step 1.
        syncSectionWithUrl(true);
        const onPopState = () => syncSectionWithUrl();
        window.addEventListener("popstate", onPopState);
        return () => window.removeEventListener("popstate", onPopState);
    }, []);

    return (
        <>
            <ul className="steps my-8 text-sm w-full">
                {STEPS.map((label, i) => (
                    <li
                        key={label}
                        className={classNames("step", {
                            "step-secondary": i < currentSection,
                            "cursor-pointer": i + 1 < currentSection,
                        })}
                        onClick={() => {
                            if (i + 1 < currentSection && i + 1 <= maxSection) {
                                redirectToSection(i + 1);
                            }
                        }}>
                        {label}
                    </li>
                ))}
            </ul>
            <div className="mx-4">
                {/* TODO: Make modal for exiting before compleating */}
                {/* TODO: Make next/done keaybord keys switch inputs */}
                {/* TODO: Make form progress persist in the localStorage */}
                <div className="text-xl mb-2">
                    {currentSection === 1 && "Powiedz mi o sobie trochę więcej"}
                    {currentSection === 2 && "Jaka naprawa cię interesuje"}
                    {currentSection === 3 && "A gdzie znajduje się budynek?"}
                    {currentSection === 4 && "To podsumujmy"}
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
