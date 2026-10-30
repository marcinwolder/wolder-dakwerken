import type { CountryCode } from "libphonenumber-js";

const flagUrl = (country: CountryCode) =>
    `https://purecatamphetamine.github.io/country-flag-icons/3x2/${country}.svg`;

export default function Flag({ country }: { country: CountryCode }) {
    return (
        <img
            src={flagUrl(country)}
            alt=""
            loading="lazy"
            className="h-4 w-6 rounded-xs object-cover shadow-sm"
        />
    );
}
