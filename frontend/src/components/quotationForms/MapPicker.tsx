import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import { useEffect, useRef, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';

import { type Language, useTranslation } from '../../i18n';
import { MAP_VIEWS } from '../../i18n/country';

export type PickedAddress = {
    streetName: string;
    zipCode: string;
    city: string;
};

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

const reverseGeocode = async (
    [lat, lon]: Coords,
    language: Language,
): Promise<PickedAddress> => {
    const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&accept-language=${language}&lat=${lat}&lon=${lon}`,
    );
    if (!response.ok) {
        throw new Error("Reverse geocoding failed");
    }
    const { address } = (await response.json()) as NominatimResponse;
    if (!address) {
        throw new Error("No address found");
    }
    const street = address.road ?? address.pedestrian ?? address.hamlet ?? "";
    return {
        streetName: [street, address.house_number].filter(Boolean).join(" "),
        zipCode: address.postcode ?? "",
        city:
            address.city ??
            address.town ??
            address.village ??
            address.municipality ??
            "",
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
    onSelect,
    onClose,
}: {
    onSelect: (address: PickedAddress) => void;
    onClose: () => void;
}) {
    const { t, language } = useTranslation();
    // Fixed per opening, so the map does not jump if the language changes meanwhile.
    const [initialView] = useState(() => MAP_VIEWS[language]);
    const [position, setPosition] = useState<Coords | null>(null);
    const [address, setAddress] = useState<PickedAddress | null>(null);
    const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

    const latestRequest = useRef(0);

    const pick = async (coords: Coords) => {
        const requestId = ++latestRequest.current;
        setPosition(coords);
        setAddress(null);
        setStatus("loading");
        try {
            const result = await reverseGeocode(coords, language);
            if (requestId !== latestRequest.current) return;
            setAddress(result);
            setStatus("idle");
        } catch {
            if (requestId !== latestRequest.current) return;
            setStatus("error");
        }
    };

    const locateMe = () => {
        navigator.geolocation?.getCurrentPosition((p) =>
            pick([p.coords.latitude, p.coords.longitude]),
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
                <h3 className="text-lg font-bold mb-3">
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
                    {status === "error" && t("map.error")}
                    {address && (addressText || t("map.noAddress"))}
                </div>
                <div className="modal-action grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        className="btn col-span-2"
                        onClick={locateMe}>
                        {t("map.locate")}
                    </button>
                    <button type="button" className="btn" onClick={onClose}>
                        {t("map.cancel")}
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
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
