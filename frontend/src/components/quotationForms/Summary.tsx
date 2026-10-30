import type { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';
import {
    BsChatSquareText,
    BsEnvelopeAt,
    BsGeoAlt,
    BsPerson,
    BsTools,
    BsWhatsapp,
} from 'react-icons/bs';

import { useTranslation } from '../../i18n';
import { redirectToSection } from '../../quotationStore';
import { REPAIR_OPTIONS } from './repairOptions';

function SummaryCard(props: {
    icon: ReactNode;
    title: string;
    step: number;
    children: ReactNode;
}) {
    const { t } = useTranslation();
    return (
        <section className="card card-border bg-base-100 border-base-300">
            <div className="card-body p-4 gap-3">
                <div className="flex items-center gap-3">
                    <span className="text-2xl text-secondary">
                        {props.icon}
                    </span>
                    <h3 className="card-title text-base grow">{props.title}</h3>
                    <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => redirectToSection(props.step)}>
                        {t("button.edit")}
                    </button>
                </div>
                {props.children}
            </div>
        </section>
    );
}

function Field(props: { label: string; children: ReactNode }) {
    return (
        <div className="flex flex-col">
            <dt className="text-xs uppercase tracking-wide opacity-60">
                {props.label}
            </dt>
            <dd className="font-medium break-words">{props.children}</dd>
        </div>
    );
}

const CONTACT_METHODS = [
    { name: "contactWhatsapp", label: "WhatsApp", icon: <BsWhatsapp /> },
    { name: "contactEmail", label: "Email", icon: <BsEnvelopeAt /> },
    { name: "contactSms", label: "SMS", icon: <BsChatSquareText /> },
] as const;

export default function Summary() {
    const { getValues } = useFormContext();
    const { t } = useTranslation();

    const repairs = REPAIR_OPTIONS.filter((o) => getValues(o.name));
    const contactMethods = CONTACT_METHODS.filter((m) => getValues(m.name));

    return (
        <>
            <div className="flex flex-col gap-3 mt-4">
                <SummaryCard icon={<BsPerson />} title={t("summary.contact")} step={1}>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label={t("summary.name")}>
                            {getValues("firstName")} {getValues("lastName")}
                        </Field>
                        <Field label={t("summary.phone")}>{getValues("phoneNumber")}</Field>
                        <Field label={t("summary.email")}>{getValues("email")}</Field>
                        <Field label={t("summary.preferred")}>
                            <span className="flex flex-wrap gap-2">
                                {contactMethods.map((m) => (
                                    <span
                                        key={m.name}
                                        className="badge badge-secondary gap-1">
                                        {m.icon}
                                        {m.label}
                                    </span>
                                ))}
                            </span>
                        </Field>
                    </dl>
                </SummaryCard>
                <SummaryCard icon={<BsTools />} title={t("summary.repair")} step={2}>
                    <ul className="flex flex-wrap gap-2">
                        {repairs.map((r) => (
                            <li
                                key={r.name}
                                className="badge badge-outline h-auto py-1">
                                {t(r.label)}
                            </li>
                        ))}
                    </ul>
                    {getValues("additionalInfo") && (
                        <Field label={t("summary.additional")}>
                            <span className="whitespace-pre-wrap">
                                {getValues("additionalInfo")}
                            </span>
                        </Field>
                    )}
                </SummaryCard>
                <SummaryCard
                    icon={<BsGeoAlt />}
                    title={t("summary.location")}
                    step={3}>
                    <address className="not-italic font-medium">
                        {getValues("streetName")}
                        {getValues("apartmentNumber") &&
                            `, ${t("location.apartmentShort")} ${getValues("apartmentNumber")}`}
                        <br />
                        {getValues("zipCode")} {getValues("city")}
                    </address>
                </SummaryCard>
            </div>
            <div className="sticky bottom-0 bg-white">
                <div className="divider " />
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                        type="button"
                        className="btn"
                        value={t("button.previous")}
                        onClick={() => {
                            redirectToSection(3);
                        }}
                    />
                    <input
                        type="submit"
                        className="btn btn-secondary"
                        value={t("button.submit")}
                    />
                </div>
            </div>
        </>
    );
}
