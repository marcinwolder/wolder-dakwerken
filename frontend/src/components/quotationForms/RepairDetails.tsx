import classNames from 'classnames';
import { useFormContext } from 'react-hook-form';

import { redirectToSection } from '../../quotationStore';
import {
    ADDITIONAL_INFO_MAX_LENGTH,
    REPAIR_NAMES,
    REPAIR_OPTIONS,
} from './repairOptions';

const SERVICE_ERROR_FIELD = "repairRoofRepairAndMaintenance";

function Checkbox(props: { label: string; name: string }) {
    const { register, clearErrors } = useFormContext();
    const registration = register(props.name);
    return (
        <input
            type="checkbox"
            aria-label={props.label}
            className="btn w-full h-auto aspect-4/3"
            {...registration}
            onChange={(e) => {
                registration.onChange(e);
                clearErrors(SERVICE_ERROR_FIELD);
            }}
        />
    );
}

export default function RepairDetails() {
    const {
        trigger,
        register,
        watch,
        clearErrors,
        formState: { errors },
    } = useFormContext();
    const serviceError = errors[SERVICE_ERROR_FIELD]?.message?.toString();
    const infoRegistration = register("additionalInfo");
    const isInfoError = Boolean(errors["additionalInfo"]);
    const infoLength = (watch("additionalInfo") ?? "").length;
    return (
        <>
            <div className="grid grid-cols-2 gap-4 mt-4">
                {REPAIR_OPTIONS.map(({ name, label }) => (
                    <Checkbox key={name} label={label} name={name} />
                ))}
            </div>
            {serviceError && (
                <p className="label text-error mt-2 whitespace-normal">{serviceError}</p>
            )}
            <fieldset className="fieldset w-full mt-4">
                <div className="flex items-center justify-between">
                    <label
                        className={classNames("label", {
                            "text-error": isInfoError,
                        })}
                        htmlFor="additionalInfo">
                        Inne potrzeby lub dodatkowe informacje
                    </label>
                    <span
                        className={classNames("label", {
                            "text-error": infoLength > ADDITIONAL_INFO_MAX_LENGTH,
                        })}>
                        {infoLength}/{ADDITIONAL_INFO_MAX_LENGTH}
                    </span>
                </div>
                <textarea
                    id="additionalInfo"
                    rows={4}
                    className={classNames("textarea w-full resize-none", {
                        "textarea-error": isInfoError,
                    })}
                    placeholder="Opisz problem, np. przeciek w okolicy komina albo inną usługę, której nie ma na liście"
                    {...infoRegistration}
                    onChange={(e) => {
                        infoRegistration.onChange(e);
                        clearErrors(SERVICE_ERROR_FIELD);
                    }}
                />
                {isInfoError && (
                    <p className="label text-error whitespace-normal">
                        {errors["additionalInfo"]?.message?.toString()}
                    </p>
                )}
            </fieldset>
            <div className="sticky bottom-0 bg-white">
                <div className="divider " />
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                        type="button"
                        className="btn"
                        value={"Poprzedni krok"}
                        onClick={() => {
                            redirectToSection(1);
                        }}
                    />
                    <input
                        type="button"
                        className="btn btn-secondary"
                        value={"Następny krok"}
                        onClick={async () => {
                            const isSetepValid = await trigger([...REPAIR_NAMES, "additionalInfo"], {
                                shouldFocus: true,
                            });
                            if (isSetepValid) {
                                redirectToSection(3);
                            }
                        }}
                    />
                </div>
            </div>
        </>
    );
}
