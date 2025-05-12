import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SelectDrinkModal from './SelectDrinkModal';
import DrinkDetailModal from './DrinkDetailModal';
import DBManager from './DBManager';

function AddCaffeineModal({ userId, onClose, onSuccess }) {
    const [step, setStep] = useState('select');
    const [drinks, setDrinks] = useState([]);
    const [selectedDrink, setSelectedDrink] = useState(null);
    const [servingSizes, setServingSizes] = useState([]);
    const db = new DBManager('http://localhost:5000');

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
    }, []);

    const handleSelectConfirm = async (drink) => {
        try {
            const detail = await db.getDrinkDetails(drink.id);
            setSelectedDrink(detail[0]);

            const sizes = await db.getServingSizes(detail[0].drink_type);
            setServingSizes(sizes);

            setStep('detail');
        } catch (error) {
            console.error("Failed to load drink details or serving sizes:", error);
        }
    };

    const handleFinalConfirm = async (drinkWithSize) => {
        if (!drinkWithSize) return;
    
        const { mg_per_oz, selectedSize, customAmount, customUnit, id: drinkId } = drinkWithSize;
    
        let totalOz = 0;
    
        if (selectedSize) {
            totalOz = selectedSize.amount_oz;
        } else if (customAmount) {
            const amount = Number(customAmount);
            totalOz = customUnit === 'oz' ? amount : amount / 29.5735;
        }
    
        const caffeine = Math.round(totalOz * mg_per_oz);
    
        console.log(`Caffeine Intake: ${caffeine} mg from ${totalOz.toFixed(2)} oz`);
        console.log(`Drink ID: ${drinkId}`);
    
        try {
            await db.addDrinkEntry(userId, drinkId, caffeine);
            // onClose();
            if (onSuccess) onSuccess();
            else if (onClose) onClose();
        } catch (error) {
            console.error("Failed to add drink to database:", error);
            alert("Failed to add drink");
        }
    };
    
    

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
            <div
                className="bg-white rounded-xl shadow-xl w-full max-w-md m-4 relative flex flex-col"
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
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func
};

export default AddCaffeineModal;
