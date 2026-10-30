// `label` is a translation key.
export const REPAIR_OPTIONS = [
    {
        name: "repairRoofRepairAndMaintenance",
        label: "repair.roofRepairAndMaintenance",
    },
    { name: "repairGutterInstallation", label: "repair.gutterInstallation" },
    { name: "repairSheetMetalWork", label: "repair.sheetMetalWork" },
    {
        name: "repairRoofWindowsAndHatches",
        label: "repair.roofWindowsAndHatches",
    },
    { name: "repairRoofInsulation", label: "repair.roofInsulation" },
    {
        name: "repairSoffitInstallation",
        label: "repair.soffitInstallation",
    },
] as const;

export const REPAIR_NAMES = REPAIR_OPTIONS.map((o) => o.name);

export const ADDITIONAL_INFO_MAX_LENGTH = 1000;
