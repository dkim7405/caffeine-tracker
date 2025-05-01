import { useState } from 'react';
import PropTypes from 'prop-types';
import SelectDrinkModal from './SelectDrinkModal';
import DrinkDetailModal from './DrinkDetailModal';

function AddCaffeineModal({ drinks, onClose, onAddDrink }) {
    // 'select' | 'detail'
    const [step, setStep] = useState('select');
    const [selectedDrink, setSelectedDrink] = useState(null);

    const handleSelectConfirm = (drink) => {
        setSelectedDrink(drink);
        setStep('detail');
    };

    const handleFinalConfirm = () => {
        if (selectedDrink) {
            onAddDrink(selectedDrink);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20" onClick={onClose}>
            <div
                className="bg-white rounded-xl shadow-xl w-full max-w-md m-4 relative flex flex-col"
                style={{ width: '400px', height: '500px' }}
                onClick={(e) => e.stopPropagation()}
            >
                {step === 'select' ? (
                    <SelectDrinkModal
                        drinks={drinks}
                        onClose={onClose}
                        onConfirm={handleSelectConfirm}
                    />
                ) : (
                    <DrinkDetailModal
                        drink={selectedDrink}
                        onBack={() => setStep('select')}
                        onConfirm={handleFinalConfirm}
                        onClose={onClose}
                    />
                )}
            </div>
        </div>
    );
}

AddCaffeineModal.propTypes = {
    drinks: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
    onAddDrink: PropTypes.func.isRequired,
};

export default AddCaffeineModal;
