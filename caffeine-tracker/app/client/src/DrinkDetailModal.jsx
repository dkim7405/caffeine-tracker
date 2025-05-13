import { ArrowLeft, X } from 'lucide-react';
import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import useHorizontalDragScroll from './useHorizontalDragScroll';

function DrinkDetailModal({ drink, servingSizes, onBack, onConfirm, onClose }) {
    const [selectedSize, setSelectedSize] = useState(null);
    const [customAmount, setCustomAmount] = useState('');
    const [customUnit, setCustomUnit] = useState('ml');
    const scrollRef = useRef(null);

    useHorizontalDragScroll(scrollRef);

    const handleSelectSize = (size) => {
        setSelectedSize((prev) => (prev?.serving_id === size.serving_id ? null : size));
        setCustomAmount('');
    };

    const handleCustomAmountChange = (value) => {
        if (/^\d*\.?\d*$/.test(value)) {
            setCustomAmount(value);
            setSelectedSize(null);
        }
    };

    const handleConfirm = () => {
        if (!selectedSize && !customAmount) return;
    
        onConfirm({
            id: drink.id || drink.drink_id,
            mg_per_oz: drink.mg_per_oz,
            image_url: drink.image_url,
            drink_name: drink.drink_name || drink.name,
            manufacturer_name: drink.manufacturer_name,
            drink_type: drink.drink_type,
            selectedSize,
            customAmount: customAmount ? Number(customAmount) : null,
            customUnit,
        });
    };
    

    const isReady = selectedSize || customAmount;

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-4 py-3 border-b bg-coffee-dark text-white text-center font-semibold relative rounded-lg">
                <button onClick={onBack} className="absolute top-3 left-4 text-white hover:text-white/60">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <button onClick={onClose} className="absolute top-3 right-4 text-white hover:text-white/60">
                    <X className="w-5 h-5" />
                </button>
                {drink.drink_name || drink.name}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-4 py-5 text-coffee-dark">
                <div className="flex gap-4 mb-6 items-start justify-center">
                    <img
                        src={`/${drink.image_url}.jpg`}
                        alt={drink.drink_name || drink.name}
                        className="w-24 h-44 rounded-md object-cover"
                        onError={(e) => (e.target.src = '/placeholder-drink.png')}
                    />
                    <div className="text-sm space-y-2 w-full max-w-xs">
                        <div>
                            <p className="font-semibold">Name:</p>
                            <p>{drink.drink_name || drink.name}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Manufacturer:</p>
                            <p>{drink.manufacturer_name || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Type:</p>
                            <p>{drink.drink_type || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Caffeine:</p>
                            <p>{drink.mg_per_oz} mg/oz</p>
                        </div>
                    </div>
                </div>

                {/* Serving Sizes */}
                <div className="mb-4">
                    <p className="font-semibold mb-2">Select Serving Size:</p>
                    <div
                        ref={scrollRef}
                        className="flex overflow-x-auto gap-2 scrollbar-hide -mx-1 px-1 select-none cursor-grab"
                        style={{ WebkitOverflowScrolling: 'touch' }}
                    >
                        {servingSizes.map((size) => (
                            <button
                                key={size.serving_id}
                                onClick={() => handleSelectSize(size)}
                                className={`whitespace-nowrap px-3 py-1 rounded-full border transition-all ${
                                    selectedSize?.serving_id === size.serving_id
                                        ? 'bg-coffee-dark text-white'
                                        : 'bg-white text-coffee-dark border-coffee-dark'
                                }`}
                            >
                                {size.serving_name} {size.amount_ml}ml / {size.amount_oz}oz
                            </button>
                        ))}
                    </div>
                </div>

                {/* Custom Amount */}
                <div className="mb-4">
                    <p className="font-semibold mb-1">Or enter custom amount:</p>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            inputMode="decimal"
                            placeholder={`Amount in ${customUnit}`}
                            value={customAmount}
                            onChange={(e) => handleCustomAmountChange(e.target.value)}
                            className="w-32 px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-dark text-sm"
                        />
                        <button
                            onClick={() => setCustomUnit((prev) => (prev === 'ml' ? 'oz' : 'ml'))}
                            className="text-xs px-2 py-1 border rounded bg-white hover:bg-coffee-dark hover:text-white transition"
                        >
                            {customUnit}
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3">
                <button
                    onClick={handleConfirm}
                    disabled={!isReady}
                    className={`w-full py-2 rounded-lg transition-all ${
                        isReady
                            ? 'bg-coffee-dark text-white hover:bg-coffee-dark/90'
                            : 'bg-coffee-dark/30 text-white cursor-not-allowed'
                    }`}
                >
                    {selectedSize
                        ? `Add ${selectedSize.serving_name} of ${drink.drink_name || drink.name}`
                        : customAmount
                        ? `Add ${customAmount} ${customUnit} of ${drink.drink_name || drink.name}`
                        : 'Select a serving size or enter amount'}
                </button>
            </div>
        </div>
    );
}

DrinkDetailModal.propTypes = {
    drink: PropTypes.object.isRequired,
    servingSizes: PropTypes.array.isRequired,
    onBack: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default DrinkDetailModal;
