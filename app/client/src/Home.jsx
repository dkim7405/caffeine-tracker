import { Plus } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Navigate } from "react-router-dom";

import GaugeChart from './GaugeChart';
import LogoutButton from './LogoutButton';
import AddCaffeineModal from './AddCaffeineModal';

function Home({ userId, db, onLogout  }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [todayCaffeine, setTodayCaffeine] = useState(0);

    const fetchTodayCaffeine = useCallback(async () => {
        if (!userId) return;
        try {
            const { todayCaffeine } = await db.getTodayCaffeine(userId);
            setTodayCaffeine(todayCaffeine);
        } catch (err) {
            console.error(err);
        }
    }, [db, userId]);

    useEffect(() => {
        fetchTodayCaffeine();
    }, [fetchTodayCaffeine]);

    if (!userId) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="flex flex-row h-screen">
            {/* <LogoutButton /> */}
            <LogoutButton onLogout={onLogout} />
            <GaugeChart caffeineIntake={todayCaffeine} safetyLimit={400} />

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
                    onSuccess={() => {
                        fetchTodayCaffeine();
                        setIsModalOpen(false);
                    }}
                />
            )}
        </div>
    );
}

Home.propTypes = {
    // userId: PropTypes.number.isRequired,
    userId: PropTypes.number, 
    db: PropTypes.object.isRequired
};

export default Home;
