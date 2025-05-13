import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SelectDrinkModal from './SelectDrinkModal';
import DrinkDetailModal from './DrinkDetailModal';

function AddCaffeineModal({ userId, db, onClose, onSuccess }) {
    const [step, setStep] = useState('select');
    const [drinks, setDrinks] = useState([]);
    const [selectedDrink, setSelectedDrink] = useState(null);
    const [servingSizes, setServingSizes] = useState([]);

    useEffect(() => {
        const loadDrinks = async () => {
            try {
                const drinkList = await db.getDrinks();
                setDrinks(drinkList);
            } catch (error) {
                console.error("Failed to load drinks:", error);
            }
        };
        loadDrinks();
    }, [db]);

    const handleSelectConfirm = async (drink) => {
        try {
            const detailArray = await db.getDrinkDetails(drink.id);
            const detail = detailArray[0];
            setSelectedDrink(detail);

            const sizes = await db.getServingSizes(detail.drink_type);
            setServingSizes(sizes);

            setStep('detail');
        } catch (error) {
            console.error("Failed to load drink details or serving sizes:", error);
        }
    };

    const handleFinalConfirm = async (drinkWithSize) => {
        if (!drinkWithSize) {
            return;
        }

        const {
            mg_per_oz,
            selectedSize,
            customAmount,
            customUnit,
            id: drinkId
        } = drinkWithSize;

        let totalOz = 0;

        if (selectedSize) {
            totalOz = selectedSize.amount_oz;
        } else if (customAmount) {
            const amt = Number(customAmount);
            totalOz = customUnit === 'oz' ? amt : amt / 29.5735;
        }

        const caffeine = Math.round(totalOz * mg_per_oz);

        try {
            await db.addDrinkEntry(userId, drinkId, caffeine);

            if (onSuccess) {
                onSuccess();
            }
            else {
                onClose();
            }
        } catch (error) {
            console.error("Failed to add drink to database:", error);
            alert("Failed to add drink");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
            <div
                className="bg-white rounded-xl shadow-xl max-w-md w-full m-4 relative flex flex-col"
                style={{ width: '400px', height: '500px' }}
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
                        servingSizes={servingSizes}
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
    userId: PropTypes.number.isRequired,
    db: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func
};

export default AddCaffeineModal;
