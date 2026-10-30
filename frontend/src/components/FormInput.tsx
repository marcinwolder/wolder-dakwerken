import classNames from "classnames";
import React from "react";
import { useFormContext } from "react-hook-form";

import { useErrorText } from "../i18n";

const FormInput: React.FC<
    React.PropsWithChildren<{
        id: string;
        name: string;
        type?: React.HTMLInputTypeAttribute;
        placeholder?: string;
        autoComplete?: string;
        enterKeyHint?:
            | "search"
            | "enter"
            | "done"
            | "go"
            | "next"
            | "previous"
            | "send";
    }>
> = ({
    id,
    autoComplete,
    enterKeyHint,
    name,
    type = "text",
    placeholder = "",
}) => {
    const {
        register,
        formState: { errors },
        clearErrors,
    } = useFormContext();
    const errorText = useErrorText();
    const isError: boolean = errors[id] ? true : false;
    const registration = register(id);
    return (
        <fieldset className="fieldset w-full">
            <label
                className={classNames("label", { "text-error": isError })}
                htmlFor={id}>
                {name}
            </label>
            <input
                type={type}
                id={id}
                className={classNames("input input-lg w-full", {
                    "input-error": isError,
                })}
                autoComplete={autoComplete}
                enterKeyHint={enterKeyHint}
                placeholder={placeholder}
                {...registration}
                onChange={(e) => {
                    registration.onChange(e);
                    if (errors[id]) {
                        clearErrors(id);
                    }
                }}
            />
            {errors[id] && (
                <p className={classNames("label whitespace-normal", { "text-error": isError })}>
                    {errorText(errors[id]?.message)}
                </p>
            )}
        </fieldset>
    );
};

export default FormInput;
