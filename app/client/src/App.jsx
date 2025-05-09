import Home from './Home';
import Logs from './Logs';
import Login from './Login';
import Register from './Register';

import DBManager from './DBManager';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const db = new DBManager('http://localhost:5000');

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/home" element={<Home userId={1} db={db} />} />
                <Route path="/logs" element={<Logs userId={1} db={db} />} />
            </Routes>
        </Router>
    );
}

export default App;
