import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import { useEffect, useRef, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';

import { useTranslation } from '../../i18n';
import {
    type AddressCountry,
    COUNTRY_RULES,
    isAddressCountry,
    normalizePostalCode,
} from '../../i18n/country';

export type PickedAddress = {
    streetName: string;
    zipCode: string;
    city: string;
    country: AddressCountry;
};

type Status = "idle" | "loading" | "error" | "locateError" | "unsupportedCountry";

const STATUS_MESSAGES = {
    error: "map.error",
    locateError: "map.locateError",
    unsupportedCountry: "map.unsupportedCountry",
} as const;

type Coords = [number, number];

const pinIcon = L.divIcon({
    html: renderToStaticMarkup(
        <FaMapMarkerAlt size={40} color="#ed254e" />,
    ),
    className: "bg-transparent border-0",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
});

type NominatimResponse = {
    address?: Record<string, string>;
};

// Prefixes of administrative units in PL, DE, NL and EN, which are not part of a place name.
const ADMINISTRATIVE_PREFIX =
    /^(gmina miejsko-wiejska|gmina miejska|gmina wiejska|gmina|miasto|municipality of|gemeente|gemeinde|stadt|city of)\s+/i;

const fetchAddress = async (
    [lat, lon]: Coords,
    placeLanguage: string,
): Promise<Record<string, string>> => {
    const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&accept-language=${placeLanguage}&lat=${lat}&lon=${lon}`,
    );
    if (!response.ok) {
        throw new Error("Reverse geocoding failed");
    }
    const { address } = (await response.json()) as NominatimResponse;
    if (!address) {
        throw new Error("No address found");
    }
    return address;
};

/**
 * Resolves the address of a point. Place names come in the language of the country the point
 * lies in (not the page language), so "München" is not translated to "Monachium".
 * Returns null for a country the form does not support.
 */
const reverseGeocode = async (
    coords: Coords,
    selectedCountry: AddressCountry,
): Promise<PickedAddress | null> => {
    let address = await fetchAddress(coords, COUNTRY_RULES[selectedCountry].placeLanguage);
    const country = address.country_code?.toUpperCase();
    if (!isAddressCountry(country)) {
        return null;
    }
    if (country !== selectedCountry) {
        address = await fetchAddress(coords, COUNTRY_RULES[country].placeLanguage);
    }
    const street =
        address.road ??
        address.pedestrian ??
        address.footway ??
        address.path ??
        address.cycleway ??
        address.residential ??
        address.square ??
        address.hamlet ??
        "";
    // `municipality` is the administrative unit (e.g. "gmina Lipsko"), so it is only a last resort.
    const city =
        address.city ??
        address.town ??
        address.village ??
        address.hamlet ??
        address.municipality ??
        "";
    // OSM may list several codes ("10115;10117") or prefix the country ("NL-1234 AB").
    const postcode = (address.postcode ?? "")
        .split(";")[0]
        .replace(/^[A-Za-z]{2}-/, "");
    return {
        streetName: [street, address.house_number].filter(Boolean).join(" "),
        zipCode: normalizePostalCode(country, postcode),
        city: city.replace(ADMINISTRATIVE_PREFIX, "").trim(),
        country,
    };
};

function ClickHandler({ onPick }: { onPick: (coords: Coords) => void }) {
    useMapEvents({
        click: (e) => onPick([e.latlng.lat, e.latlng.lng]),
    });
    return null;
}

function FlyTo({ coords }: { coords: Coords | null }) {
    const map = useMap();
    useEffect(() => {
        if (coords) {
            map.flyTo(coords, Math.max(map.getZoom(), 17));
        }
    }, [coords, map]);
    return null;
}

export default function MapPicker({
    country,
    onSelect,
    onClose,
}: {
    country: AddressCountry;
    onSelect: (address: PickedAddress) => void;
    onClose: () => void;
}) {
    const { t } = useTranslation();
    // Fixed per opening, so the map does not jump if the country changes meanwhile.
    const [initialView] = useState(() => COUNTRY_RULES[country].mapView);
    const [position, setPosition] = useState<Coords | null>(null);
    const [address, setAddress] = useState<PickedAddress | null>(null);
    const [status, setStatus] = useState<Status>("idle");

    const latestRequest = useRef(0);

    const pick = async (coords: Coords) => {
        const requestId = ++latestRequest.current;
        setPosition(coords);
        setAddress(null);
        setStatus("loading");
        try {
            const result = await reverseGeocode(coords, country);
            if (requestId !== latestRequest.current) return;
            setAddress(result);
            setStatus(result ? "idle" : "unsupportedCountry");
        } catch {
            if (requestId !== latestRequest.current) return;
            setStatus("error");
        }
    };

    const locateMe = () => {
        // Geolocation is missing on insecure (http) pages and fails when the permission is denied.
        if (!navigator.geolocation) {
            setStatus("locateError");
            return;
        }
        setStatus("loading");
        navigator.geolocation.getCurrentPosition(
            (p) => pick([p.coords.latitude, p.coords.longitude]),
            () => setStatus("locateError"),
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
        );
    };

    const addressText = address
        ? [address.streetName, [address.zipCode, address.city].filter(Boolean).join(" ")]
              .filter(Boolean)
              .join(", ")
        : "";

    return (
        <dialog className="modal modal-open" onClose={onClose}>
            <div className="modal-box p-4 max-w-2xl">
                <h3 className="text-2xl font-bold mb-3">
                    {t("map.title")}
                </h3>
                <div className="h-80 rounded-box overflow-hidden relative z-0">
                    <MapContainer
                        center={initialView.center}
                        zoom={initialView.zoom}
                        className="h-full w-full">
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <ClickHandler onPick={pick} />
                        <FlyTo coords={position} />
                        {position && (
                            <Marker position={position} icon={pinIcon} />
                        )}
                    </MapContainer>
                </div>
                <div className="min-h-12 mt-3 text-sm">
                    {!position && t("map.hint")}
                    {status === "loading" && (
                        <span className="loading loading-dots loading-sm" />
                    )}
                    {address && (addressText || t("map.noAddress"))}
                    {status in STATUS_MESSAGES && (
                        <p className="text-error mt-2">
                            {t(STATUS_MESSAGES[status as keyof typeof STATUS_MESSAGES])}
                        </p>
                    )}
                </div>
                <div className="modal-action grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        className="btn btn-lg h-auto min-h-14 py-3 px-3 leading-tight rounded-3xl font-bold col-span-2"
                        onClick={locateMe}>
                        {t("map.locate")}
                    </button>
                    <button type="button" className="btn btn-lg h-auto min-h-14 py-3 px-3 leading-tight btn-ghost border-primary rounded-3xl font-bold" onClick={onClose}>
                        {t("map.cancel")}
                    </button>
                    <button
                        type="button"
                        className="btn btn-lg h-auto min-h-14 py-3 px-3 leading-tight btn-secondary rounded-3xl font-bold"
                        disabled={!address || !addressText}
                        onClick={() => address && onSelect(address)}>
                        {t("map.use")}
                    </button>
                </div>
            </div>
            <div className="modal-backdrop" onClick={onClose} />
        </dialog>
    );
}
