import { lazy, Suspense, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FaMapMarkerAlt } from 'react-icons/fa';

import { useTranslation } from '../../i18n';
import { keepInputFocus } from '../../lib/utils';
import { redirectToSection } from '../../quotationStore';
import FormInput from '../FormInput';

// Leaflet touches `window` on import, so the map is loaded only in the browser.
const MapPicker = lazy(() => import('./MapPicker'));

export default function LocationDetails() {
    const { trigger, setValue, clearErrors, setFocus } = useFormContext();
    const [isMapOpen, setIsMapOpen] = useState(false);
    const { t } = useTranslation();
    return (
        <>
            <div className="flex flex-col mt-4">
                <button
                    type="button"
                    className="btn btn-outline w-full mb-2"
                    onClick={() => setIsMapOpen(true)}>
                    <FaMapMarkerAlt />
                    {t("location.pickOnMap")}
                </button>
                <div className="grid grid-cols-[minmax(0,1fr)_9rem] gap-2">
                    <FormInput id={'streetName'} name={t("location.street")} />
                    <FormInput
                        id={'apartmentNumber'}
                        name={t("location.apartment")}
                        placeholder={t("location.apartmentPlaceholder")}
                    />
                </div>
                <div className="grid grid-cols-[9rem_minmax(0,1fr)] gap-2">
                    <FormInput id={'zipCode'} name={t("location.zip")} />
                    <FormInput id={'city'} name={t("location.city")} />
                </div>
            </div>
            {isMapOpen && (
                <Suspense fallback={null}>
                    <MapPicker
                        onClose={() => setIsMapOpen(false)}
                        onSelect={(address) => {
                            Object.entries(address).forEach(([key, value]) =>
                                setValue(key, value, { shouldDirty: true }),
                            );
                            clearErrors(['streetName', 'zipCode', 'city']);
                            setIsMapOpen(false);
                            // The map cannot know the apartment number, so prompt for it.
                            setFocus('apartmentNumber');
                        }}
                    />
                </Suspense>
            )}
            <div className="sticky-footer" onMouseDown={keepInputFocus}>
                <div className="divider " />
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="button"
                        className="btn"
                        value={t("button.previous")}
                        onClick={() => {
                            redirectToSection(2);
                        }}
                    />
                    <input
                        type="button"
                        className="btn btn-secondary"
                        value={t("button.next")}
                        onClick={async () => {
                            const isCorrect = await trigger(['streetName', 'zipCode', 'city']);
                            if (isCorrect) {
                                redirectToSection(4);
                            }
                        }}
                    />
                </div>
            </div>
        </>
    );
}
