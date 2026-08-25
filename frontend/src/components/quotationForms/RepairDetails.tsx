import { useFormContext } from 'react-hook-form';

import { $currentSection, redirectToSection } from '../../quotationStore';

function Checkbox(props: { label: string; name: string }) {
    const { register } = useFormContext();
    return (
        <input
            type="checkbox"
            aria-label={props.label}
            className="btn w-full h-auto aspect-4/3"
            {...register(props.name)}
        />
    );
}

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

export default function ContactInfo() {
    const { trigger } = useFormContext();
    // TODO: Add text input for additional info about rapair
    return (
        <>
            <div className="grid grid-cols-2 gap-4 mt-4">
                {NAMES.map((val, index) => (
                    <Checkbox label={LABELS[index]} name={val} />
                ))}
            </div>
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
                            const isSetepValid = await trigger(NAMES, {
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
