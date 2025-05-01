import { useEffect } from 'react';
import './App.css';

function App() {
    useEffect(() => {
        fetch('http://localhost:5000/drinks')
            .then((res) => res.json())
            .then((data) => {
                console.log('Drinks from backend:', data);
            })
            .catch((err) => {
                console.error('Failed to fetch drinks:', err);
            });
    }, []);

    return (
        <>
            <h1>Frontend-Backend Test</h1>
        </>
    );
}

export default App;
