import { useFormContext } from 'react-hook-form';

import { $currentSection, redirectToSection } from '../../quotationStore';
import FormInput from '../FormInput';

export default function LocationDetails() {
    const { trigger } = useFormContext();
    return (
        <>
            <div className="flex flex-col mt-4">
                <FormInput id={'streetName'} name={'Ulica i numer'} />
                <FormInput id={'zipCode'} name={'Kod pocztowy'} />
                <FormInput id={'city'} name={'Miejscowość'} />
            </div>
            <div className="sticky bottom-0 bg-white">
                <div className="divider " />
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                        type="button"
                        className="btn"
                        value={"Poprzedni krok"}
                        onClick={() => {
                            redirectToSection(2);
                        }}
                    />
                    <input
                        type="button"
                        className="btn btn-secondary"
                        value={"Następny krok"}
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
