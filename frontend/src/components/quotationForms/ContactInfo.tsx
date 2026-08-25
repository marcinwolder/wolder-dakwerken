import classNames from 'classnames';
import { useFormContext } from 'react-hook-form';
import { BsChatSquareText, BsEnvelopeAt, BsWhatsapp } from 'react-icons/bs';

import { $currentSection, redirectToSection } from '../../quotationStore';
import FormCheckbox from '../FormCheckbox';
import FormInput from '../FormInput';

export default function ContactInfo() {
    const {
        formState: { errors },
        trigger,
    } = useFormContext();
    const isContactError: boolean = errors["contactWhatsapp"] ? true : false;
    return (
        <>
            <div className="flex gap-2">
                <FormInput id="firstName" name="Imię" placeholder="Jan" />
                <FormInput
                    id="lastName"
                    name="Nazwisko"
                    placeholder="Kowalski"
                />
            </div>
            <FormInput
                id="phoneNumber"
                name="Numer telefonu"
                type="tel"
                placeholder="+48 111 222 333"
            />
            <FormInput
                id="email"
                name="Adres email"
                type="email"
                placeholder="kontakt@wolderdakwerken.pl"
            />
            <fieldset
                className={classNames(
                    "fieldset bg-base-100 border-base-300 rounded-box w-full border p-4 mt-2",
                    { "border-error": isContactError },
                )}>
                <legend
                    className={classNames("label", {
                        "text-error": isContactError,
                    })}>
                    Jakie formy kontaktu preferujesz?
                </legend>
                <div className="grid grid-cols-3">
                    <FormCheckbox id="contactWhatsapp" name="WhatsApp">
                        <BsWhatsapp className="text-4xl peer-checked:text-primary peer-checked:scale-110 transition-all" />
                    </FormCheckbox>
                    <FormCheckbox
                        id="contactEmail"
                        name="Email"
                        clearId="contactWhatsapp">
                        <BsEnvelopeAt className="text-4xl peer-checked:text-primary peer-checked:scale-110 transition-all" />
                    </FormCheckbox>
                    <FormCheckbox
                        id="contactSms"
                        name="SMS"
                        clearId="contactWhatsapp">
                        <BsChatSquareText className="text-4xl peer-checked:text-primary peer-checked:scale-110 transition-all" />
                    </FormCheckbox>
                </div>
                {isContactError && (
                    <p className="label text-error mt-2">
                        {errors["contactWhatsapp"]?.message?.toString()}
                    </p>
                )}
            </fieldset>
            <div className="sticky bottom-0">
                <div className="divider" />
                <input
                    type="button"
                    className="btn btn-secondary mb-4 w-full"
                    value={"Następny krok"}
                    onClick={async () => {
                        const isSetepValid = await trigger(
                            [
                                "firstName",
                                "lastName",
                                "phoneNumber",
                                "email",
                                "contactWhatsapp",
                                "contactEmail",
                                "contactSms",
                            ],
                            { shouldFocus: true },
                        );
                        if (isSetepValid) {
                            const nextStep = $currentSection.get() + 1;
                            redirectToSection(nextStep);
                        }
                    }}
                />
            </div>
        </>
    );
}
