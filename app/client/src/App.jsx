// App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import DBManager from './DBManager';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import Logs from './Logs';
import Profile from './Profile';
import ProtectedRoute from './ProtectedRoute';
import NotFound from './NotFound';

const db = new DBManager('http://localhost:5000');

function App() {
    const [userId, setUserId] = useState(() => {
        const stored = localStorage.getItem('user_id');
        return stored ? Number(stored) : null;
    });

    useEffect(() => {
        const onStorage = (e) => {
            if (e.key === 'user_id') {
                setUserId(e.newValue ? Number(e.newValue) : null);
            }
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    const handleLogin = (id) => {
        localStorage.setItem('user_id', id);
        setUserId(id);
    };

    const handleLogout = () => {
        localStorage.removeItem('user_id');
        setUserId(null);
    };

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Login db={db} onLogin={handleLogin} />} />
                <Route path="/register" element={<Register db={db} />} />

                {/* Protected Routes */}
                <Route
                    path="/home"
                    element={
                        <ProtectedRoute userId={userId}>
                            <Home db={db} userId={userId} onLogout={handleLogout} />
                        </ProtectedRoute>
                    }
                />
                
                <Route
                    path="/logs"
                    element={
                        <ProtectedRoute userId={userId}>
                            <Logs db={db} userId={userId} onLogout={handleLogout} />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute userId={userId}>
                            <Profile db={db} userId={userId} onLogout={handleLogout} />
                        </ProtectedRoute>
                    }
                />

                {/* Fallback */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;