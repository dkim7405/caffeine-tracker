// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import DBManager from './DBManager';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import Logs from './Logs';
import NotFound from './NotFound';

const db = new DBManager('http://localhost:5000');

function App() {
    const [userId, setUserId] = useState(() => {
        const stored = localStorage.getItem('user_id');
        return stored ? Number(stored) : null;
    });

    useEffect(() => {
        const onStorage = e => {
            if (e.key === 'user_id') {
                setUserId(e.newValue ? Number(e.newValue) : null);
            }
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    return (
        <Router>
            <Routes>
                {/* Public */}
                <Route path="/" element={<Login db={db} />} />
                <Route path="/register" element={<Register db={db} />} />

                {/* Protected */}
                <Route path="/home" element={<Home db={db} userId={userId} />} />
                <Route path="/logs" element={<Logs db={db} userId={userId} />} />

                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;
