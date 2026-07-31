import { isValidPhoneNumber } from "libphonenumber-js";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useStore } from "@nanostores/react";

import ContactInfo from "../../components/quotationForms/ContactInfo";
import { $currentSection } from "../../quotationStore";

const REQUIRED_ERROR_MESSAGE = "Pole jest wymagane";

// TODO: Make better validation for phone number - add country selector and/or automatic detection
// TODO: remove spaces in phone number
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
    })
    .refine(
        (data) => data.contactEmail || data.contactSms || data.contactWhatsapp,
        {
            error: "Wybierz przynajmniej jedną formę kontaktu",
            path: ["contactWhatsapp"], // Chosen the first option as the error path. Must match error detection in checkbox component
        },
    );

type QuotationFormData = z.infer<typeof quotationSchema>;

export default function Quotation() {
    const methods = useForm<QuotationFormData>({
        resolver: zodResolver(quotationSchema),
    });
    const { handleSubmit } = methods;
    const currentSection = useStore($currentSection);
    // console.log(currentSection);
    return (
        <>
            <div className="mx-4">
                {/* TODO: Make modal for exiting before compleating */}
                {/* TODO: Make next/done keaybord keys switch inputs */}
                {/* TODO: Make form progress persist in the localStorage */}
                <div className="text-xl mb-2">
                    {currentSection === 1 && "Powiedz mi o sobie trochę więcej"}
                </div>
                <FormProvider {...methods}>
                    <form
                        onSubmit={handleSubmit((data) => {
                            console.log(data);
                        })}
                        className="flex flex-col justify-center">
                        {currentSection === 1 && <ContactInfo />}
                    </form>
                </FormProvider>
            </div>
        </>
    );
}
