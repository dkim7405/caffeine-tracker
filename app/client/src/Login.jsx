import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, Link } from 'react-router-dom';

function Login({ db }) {
    const [form, setForm] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = e => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            const { userId } = await db.login(form.username, form.password);
            localStorage.setItem('user_id', userId);
            setMessage('Login successful');
            navigate('/home');
        } catch (err) {
            setMessage(err.message || 'Login failed');
        }
    };

    return (
        <div style={{
            fontFamily: 'sans-serif',
            width: '300px',
            margin: '180px auto'
        }}>
            <h1 style={{ fontSize: '24px' }}>Login</h1>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '12px' }}>
                    <label htmlFor="username" style={{ display: 'block', marginBottom: '2px' }}>
                        Username:
                    </label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        value={form.username}
                        onChange={handleChange}
                        required
                        maxLength={50}
                        style={{
                            width: '100%',
                            padding: '6px',
                            fontSize: '1rem',
                            boxSizing: 'border-box',
                            border: '1px solid #999',
                            borderRadius: '4px',
                            outline: 'none'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '12px' }}>
                    <label htmlFor="password" style={{ display: 'block', marginBottom: '2px' }}>
                        Password:
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        maxLength={72}
                        style={{
                            width: '100%',
                            padding: '6px',
                            fontSize: '1rem',
                            boxSizing: 'border-box',
                            border: '1px solid #999',
                            borderRadius: '4px',
                            outline: 'none'
                        }}
                    />
                </div>

                <button
                    type="submit"
                    style={{
                        padding: '6px 12px',
                        backgroundColor: '#f0f0f0',
                        border: '1px solid #888',
                        borderRadius: '4px',
                        fontSize: '14px',
                        cursor: 'pointer'
                    }}
                >
                    Login
                </button>
            </form>

            <p style={{ marginTop: '10px' }}>
                Don’t have an account?{' '}
                <Link to="/register" style={{ color: 'blue', textDecoration: 'underline' }}>
                    Register here
                </Link>
            </p>
            {message && <p>{message}</p>}
        </div>
    );
}

Login.propTypes = {
    db: PropTypes.shape({
        login: PropTypes.func.isRequired
    }).isRequired
};

export default Login;
