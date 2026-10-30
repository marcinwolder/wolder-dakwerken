import classNames from 'classnames';
import { useFormContext } from 'react-hook-form';
import { BsChatSquareText, BsEnvelopeAt, BsWhatsapp } from 'react-icons/bs';

import { useErrorText, useTranslation } from '../../i18n';
import { keepInputFocus } from '../../lib/utils';
import { $currentSection, redirectToSection } from '../../quotationStore';
import FormCheckbox from '../FormCheckbox';
import FormInput from '../FormInput';
import PhoneInput from '../PhoneInput';

export default function ContactInfo() {
    const {
        formState: { errors },
        trigger,
    } = useFormContext();
    const { t } = useTranslation();
    const errorText = useErrorText();
    const isContactError: boolean = errors["contactWhatsapp"] ? true : false;
    return (
        <>
            <div className="flex gap-2">
                <FormInput
                    id="firstName"
                    autoComplete="given-name"
                    name={t("contact.firstName")}
                    placeholder={t("contact.firstNamePlaceholder")}
                />
                <FormInput
                    id="lastName"
                    autoComplete="family-name"
                    name={t("contact.lastName")}
                    placeholder={t("contact.lastNamePlaceholder")}
                />
            </div>
            <PhoneInput
                id="phoneNumber"
                name={t("contact.phone")}
            />
            <FormInput
                id="email"
                autoComplete="email"
                name={t("contact.email")}
                type="email"
                placeholder={t("contact.emailPlaceholder")}
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
                    {t("contact.preferred")}
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
                    <p className="label text-error mt-2 whitespace-normal">
                        {errorText(errors["contactWhatsapp"]?.message)}
                    </p>
                )}
            </fieldset>
            <div className="sticky-footer" onMouseDown={keepInputFocus}>
                <div className="divider" />
                <input
                    type="button"
                    className="btn btn-secondary w-full"
                    value={t("button.next")}
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
