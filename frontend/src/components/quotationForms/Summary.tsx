import { useFormContext } from 'react-hook-form';

import { $currentSection, redirectToSection } from '../../quotationStore';

export default function Summary() {
    const { getValues } = useFormContext();

    const LABELS = [
        "Naprawa i konserwacja dachu",
        "Montaż orynnowania",
        "Obróbki blacharskie",
        "Montaż okien dachowych i wyłazów",
        "Ocieplanie i izolacja dachu",
        "Montaż podbitki dachowej (podsufitki)",
    ];
    const NAMES = [
        "repairRoofRepairAndMaintenance",
        "repairGutterInstallation",
        "repairSheetMetalWork",
        "repairRoofWindowsAndHatches",
        "repairRoofInsulation",
        "repairSoffitInstallation",
    ];

    const repairsList: string[] = [];
    NAMES.forEach((val, i) => {
        if (getValues(val)) {
            repairsList.push(LABELS[i])
        }
    })

    return (
        <>
            <div className="chat chat-end">
                <div className="chat-bubble">
                    Jak się nazywasz?
                </div>
            </div>
            <div className="chat chat-start">
                <div className="chat-bubble chat-bubble-primary">
                    Nazywam się <b>{getValues("firstName")} {getValues("lastName")}</b>
                </div>
            </div>
            <div className="chat chat-end">
                <div className="chat-bubble">
                    Gdzie znajduje się twój budynek?
                </div>
            </div>
            <div className="chat chat-start">
                <div className="chat-bubble chat-bubble-primary">
                    Pod adresem <b>{getValues("streetName")}, {getValues("zipCode")} {getValues("city")}</b>
                </div>
            </div>
            <div className="chat chat-end">
                <div className="chat-bubble">
                    Jakiej naprawy potrzebujesz?
                </div>
            </div>
            <div className="chat chat-start">
                <div className="chat-bubble chat-bubble-primary">
                    {repairsList.length === 1 ? "Interesuje mnie usługa" : "Interesują mnie usługi"} "<b>{repairsList.join(", ")}</b>"
                </div>
            </div>
            <div className="chat chat-end">
                <div className="chat-bubble">
                    Jak się z tobą kontaktować?
                </div>
            </div>
            <div className="chat chat-start">
                <div className="chat-bubble chat-bubble-primary">
                    Mój numer telefonu: <b>{getValues("phoneNumber")}</b>, email: <b>{getValues("email")}</b>. Preferuję kontakt przez: <b></b>
                </div>
            </div>
            <div className="sticky bottom-0 bg-white">
                <div className="divider " />
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                        type="button"
                        className="btn"
                        value={"Poprzedni krok"}
                        onClick={() => {
                            redirectToSection(3);
                        }}
                    />
                    <input
                        type="button"
                        className="btn btn-secondary"
                        value={"Wyślij zgłoszenie!"}
                        onClick={async () => {
                        }}
                    />
                </div>
            </div>
        </>
    );
}
