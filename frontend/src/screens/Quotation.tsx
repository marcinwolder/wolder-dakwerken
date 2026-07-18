import { useForm } from "react-hook-form";

export default function Quotation() {
    const { handleSubmit, register } = useForm();
    return (
        <>
            <div className="my-8 text-sm">
                <ul className="steps">
                    <li className="step step-accent">Dane kontaktowe</li>
                    <li className="step">Rodzaj naprawy</li>
                    <li className="step">Szczegóły</li>
                    <li className="step">Podsumo-wanie</li>
                </ul>
            </div>
            <div className="mx-8">
                <div className="text-xl mb-2">
                    Powiedz mi o sobie trochę więcej
                </div>
                {/* TODO: Make this form data driven */}
                {/* TODO: Make modal for exiting before compleating */}
                {/* TODO: Make next/done keaybord keys switch inputs */}
                {/* TODO: Make form progress persist in the localStorage */}
                <form
                    onSubmit={handleSubmit(() => {})}
                    className="flex flex-col justify-center">
                    <div className="flex gap-2">
                        <fieldset className="fieldset w-full">
                            <label className="label" htmlFor="firstName">
                                Imię
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                className="input"
                                autoComplete="given-name"
                                enterKeyHint="next"
                                {...register("firstName")}
                            />
                        </fieldset>
                        <fieldset className="fieldset w-full">
                            <label className="label" htmlFor="lastName">
                                Nazwisko
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                className="input"
                                autoComplete="family-name"
                                enterKeyHint="next"
                                {...register("lastName")}
                            />
                        </fieldset>
                    </div>
                    <fieldset className="fieldset w-full">
                        <label className="label" htmlFor="phoneNumber">
                            Numer telefonu
                        </label>
                        <input
                            type="text"
                            id="phoneNumber"
                            className="input w-full"
                            autoComplete="tel"
                            enterKeyHint="next"
                            placeholder="+48 111 222 333"
                            {...register("phoneNumber")}
                        />
                    </fieldset>
                    <fieldset className="fieldset w-full">
                        <label className="label" htmlFor="email">
                            Numer telefonu
                        </label>
                        <input
                            type="text"
                            id="email"
                            className="input w-full"
                            autoComplete="email"
                            enterKeyHint="done"
                            placeholder="contact@wolderdakwerken.nl"
                            {...register("email")}
                        />
                    </fieldset>
                </form>
            </div>
        </>
    );
}
