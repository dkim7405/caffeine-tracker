import { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [message, setMessage] = useState('Loading...');

    useEffect(() => {
        fetch('https://caffeine-tracker-4lpe.onrender.com/')
            .then(res => res.text())
            .then(data => setMessage(data))
            .catch(err => setMessage("Failed to connect to backend"));
    }, []);

    return (
        <>
            <h1>Frontend-Backend Test</h1>
            <p>{message}</p>
        </>
    );
}

export default App;
