import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    middle_name: '',
    gender: '',
    body_weight: '',
    caffeine_limit: '',
    date_of_birth: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      body: new URLSearchParams(form),
    });

    const result = await response.json();

    if (response.ok) {
      setMessage(' Registration successful');
      navigate('/');
    } else {
      setMessage(` ${result.error}`);
    }
  };

  return (
    <div style={{
      fontFamily: 'sans-serif',
      width: '300px',
      margin: '80px auto '
    }}>
      <h1 style={{ fontSize: '24px' }}>Register</h1>

      <form onSubmit={handleSubmit}>
        {[
          ['Username', 'username', 'text'],
          ['Password', 'password', 'password'],
          ['First Name', 'first_name', 'text'],
          ['Last Name', 'last_name', 'text'],
          ['Middle Name', 'middle_name', 'text'],
          ['Gender (M/F/O)', 'gender', 'text'],
          ['Body Weight (lbs)', 'body_weight', 'number'],
          ['Caffeine Limit (mg)', 'caffeine_limit', 'number'],
          ['Date of Birth', 'date_of_birth', 'date'],
        ].map(([label, name, type]) => (
          <div key={name} style={{ marginBottom: '12px' }}>
            <label htmlFor={name} style={{ display: 'block', marginBottom: '2px' }}>{label}:</label>
            <input
              id={name}
              name={name}
              type={type}
              value={form[name]}
              onChange={handleChange}
              required={name !== 'middle_name'}
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
        ))}

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
                Register
              </button>

      </form>

      <p style={{ marginTop: '10px' }}>
        Already registered? <a href="/" style={{ color: 'blue', textDecoration: 'underline' }}>
  Login here
</a>

      </p>
      <p>{message}</p>
    </div>
  );
}
