import React from "react";
import { useFormContext } from "react-hook-form";

const FormCheckbox: React.FC<
    React.PropsWithChildren<{
        id: string;
        name: string;
        enterKeyHint?:
        | "search"
        | "enter"
        | "done"
        | "go"
        | "next"
        | "previous"
        | "send";
        clearId?: string;
    }>
> = ({ id, enterKeyHint, name, children, clearId }) => {
    const { register, clearErrors } = useFormContext();
    const registration = register(id);
    return (
        <label className="label flex flex-col-reverse">
            <input
                id={id}
                type="checkbox"
                className="checkbox peer"
                enterKeyHint={enterKeyHint}
                {...registration}
                onChange={(e) => {
                    registration.onChange(e);
                    clearErrors(clearId ?? id);
                }}
            />
            <span className="peer-checked:text-primary">{name}</span>
            {children}
        </label>
    );
};

export default FormCheckbox;
