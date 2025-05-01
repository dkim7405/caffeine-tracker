import { Plus } from 'lucide-react';

import DBManager from './DBManager';
import GaugeChart from './GaugeChart';
import AddCaffeineModal from './AddCaffeineModal';

import React, { useEffect, useState } from 'react';


function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [drinks, setDrinks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const db = new DBManager('http://127.0.0.1:5000');
        db.getDrinks()
            .then(setDrinks)
            .catch(setError);
    }, []);

    return (
        <>
            <div className="flex flex-row h-screen">
                <GaugeChart caffeineIntake={200} safetyLimit={400} />

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="fixed bottom-8 right-8 bg-white text-coffee-dark rounded-full w-14 h-14 flex items-center justify-center shadow-2xl hover:w-15 hover:h-15 transition-all duration-300 border-2 border-coffee-dark"
                >
                    <Plus className="w-6 h-6" />
                </button>

                {isModalOpen && (
                    <AddCaffeineModal drinks={drinks} onClose={() => setIsModalOpen(false)} />
                )}
            </div>
        </>
    );
}

export default Home;
