import { ArrowLeft, X } from 'lucide-react';
import PropTypes from 'prop-types';

function DrinkDetailModal({ drink, onBack, onConfirm, onClose }) {
    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-4 py-3 border-b bg-coffee-dark text-white font-semibold text-center relative rounded-lg">
                <button onClick={onBack} className="absolute top-3 left-4 text-white hover:text-white/60">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <button onClick={onClose} className="absolute top-3 right-4 text-white hover:text-white/60">
                    <X className="w-5 h-5" />
                </button>
                Confirm Drink
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-4 py-3 text-coffee-dark">
                <div className="flex items-center gap-12 mb-4 justify-center">
                    <img
                        src={`/${drink.image_url}.jpg`}
                        alt={drink.name}
                        className="w-12 h-28 rounded-md object-cover"
                        onError={(e) => (e.target.src = '/placeholder-drink.png')}
                    />
                    <div>
                        <p className="mb-1"><strong>Name:</strong> {drink.name}</p>
                        <p className="mb-1"><strong>Manufacturer:</strong> {drink.manufacturer_name}</p>
                        <p className="mb-1"><strong>Type:</strong> {drink.type_name}</p>
                        <p className="mb-1"><strong>Caffeine:</strong> {drink.mg_per_oz} mg/oz</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3">
                <button
                    onClick={onConfirm}
                    className="w-full py-2 bg-coffee-dark text-white rounded-lg hover:bg-coffee-dark/90"
                >
                    Confirm Add
                </button>
            </div>
        </div>
    );
}

DrinkDetailModal.propTypes = {
    drink: PropTypes.object.isRequired,
    onBack: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default DrinkDetailModal;
