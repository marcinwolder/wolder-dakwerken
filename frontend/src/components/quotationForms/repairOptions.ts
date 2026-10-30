export const REPAIR_OPTIONS = [
    {
        name: "repairRoofRepairAndMaintenance",
        label: "Naprawa i konserwacja dachu",
    },
    { name: "repairGutterInstallation", label: "Montaż orynnowania" },
    { name: "repairSheetMetalWork", label: "Obróbki blacharskie" },
    {
        name: "repairRoofWindowsAndHatches",
        label: "Montaż okien dachowych i wyłazów",
    },
    { name: "repairRoofInsulation", label: "Ocieplanie i izolacja dachu" },
    {
        name: "repairSoffitInstallation",
        label: "Montaż podbitki dachowej (podsufitki)",
    },
] as const;

export const REPAIR_NAMES = REPAIR_OPTIONS.map((o) => o.name);

export const ADDITIONAL_INFO_MAX_LENGTH = 1000;
