import { Plus } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// import { useNavigate } from "react-router-dom";

import GaugeChart from './GaugeChart';
import LogoutButton from './LogoutButton';
import AddCaffeineModal from './AddCaffeineModal';
import { Navigate }    from "react-router-dom";

function Home({ userId, db }) {
  const [isModalOpen, setIsModalOpen]     = useState(false);
  const [todayCaffeine, setTodayCaffeine] = useState(0);
  const userId = localStorage.getItem('user_id');
  

  const fetchTodayCaffeine = async () => {
    if (!userId) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/today-caffeine?user_id=${userId}`
      );
      if (!res.ok) throw new Error('Fetch failed');
      const { todayCaffeine } = await res.json();
      setTodayCaffeine(todayCaffeine);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if (userId) {
      fetchTodayCaffeine();
    }
  }, [userId]);

  if (!userId) {
    return <Navigate to="/" replace />;
  }
      


    

    return (
        <div className="flex flex-row h-screen">
          <LogoutButton /> 
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
