import Home from './Home';
import Login from './Login';
import Register from './Register';
import Profile from './Profile';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
    const storedUserId = parseInt(localStorage.getItem('userId'), 10);
    if (isNaN(storedUserId)) {
        console.warn("Invalid or missing userId in localStorage");
      }
      
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/home" element={<Home userId={storedUserId} />} />
                <Route path="/profile" element={<Profile userId={storedUserId} />} />
            </Routes>
        </Router>
    );
}

export default App;
