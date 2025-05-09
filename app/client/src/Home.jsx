import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import GaugeChart from './GaugeChart';
import AddCaffeineModal from './AddCaffeineModal';

function Home({ userId, db }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="flex flex-row h-screen">
            <GaugeChart caffeineIntake={200} safetyLimit={400} />

            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-8 right-8 bg-white text-coffee-dark rounded-full w-14 h-14 flex items-center justify-center shadow-2xl hover:w-15 hover:h-15 transition-all duration-300 border-2 border-coffee-dark"
            >
                <Plus className="w-6 h-6" />
            </button>

            {isModalOpen && (
                <AddCaffeineModal
                    userId={userId}
                    db={db}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
}

Home.propTypes = {
    userId: PropTypes.number.isRequired,
    db: PropTypes.object.isRequired,
};

export default Home;
