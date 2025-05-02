import { useState, useEffect } from 'react';
import { X, Search, ArrowRight } from 'lucide-react';
import PropTypes from 'prop-types';

function SelectDrinkModal({ drinks, onClose, onConfirm }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filtered, setFiltered] = useState([]);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        const results = drinks.filter((drink) =>
            drink.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFiltered(results);
    }, [searchTerm, drinks]);

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-4 py-3 border-b bg-coffee-dark text-white font-semibold text-center relative rounded-lg">
                <button onClick={onClose} className="absolute top-3 right-4 text-white hover:text-white/60">
                    <X className="w-5 h-5" />
                </button>

                Select a Drink

                <div className="flex items-center bg-white/30 px-2 rounded m-4">
                    <Search className="w-5 h-5 text-white" />
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search drinks..."
                        className="w-full ml-2 p-1 bg-transparent focus:outline-none placeholder:text-white/60"
                    />
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
                {filtered.length === 0 ? (
                    <p className="text-center text-gray-500">No drinks found</p>
                ) : (
                    <div className="space-y-2">
                        {filtered.map((drink) => {
                            const selectedClass =
                                selected?.id === drink.id
                                    ? 'bg-coffee-dark/10 border border-coffee-dark'
                                    : '';
                            return (
                                <div
                                    key={drink.id}
                                    onClick={() =>
                                        setSelected((prev) =>
                                            prev?.id === drink.id ? null : drink
                                        )
                                    }
                                    className={`p-3 cursor-pointer rounded-lg hover:bg-coffee-dark/5 ${selectedClass}`}
                                >
                                    <DrinkItem drink={drink} />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3">
                <button
                    onClick={() => selected && onConfirm(selected)}
                    disabled={!selected}
                    className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 ${
                        selected
                            ? 'bg-coffee-dark text-white hover:bg-coffee-dark/90'
                            : 'bg-coffee-dark/30 text-white cursor-not-allowed'
                    }`}
                >
                    {selected ? `Add ${selected.name}` : 'Select a drink to add'}
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

function DrinkItem({ drink }) {
    return (
        <div className="flex flex-row items-center">
            <div className="w-6 h-14 bg-gray-200 rounded-md overflow-hidden mr-3">
                <img
                    src={`/${drink.image_url}.jpg`}
                    alt={drink.name}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.src = '/placeholder-drink.png')}
                />
            </div>
            <div>
                <h3 className="font-medium text-coffee-dark">{drink.name}</h3>
                <p className="text-sm text-gray-500">{drink.mg_per_oz} mg/oz</p>
            </div>
        </div>
    );
}
SelectDrinkModal.propTypes = {
    drinks: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
};

export default SelectDrinkModal;
