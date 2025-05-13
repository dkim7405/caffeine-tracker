import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DBManager from './DBManager';

export default function Profile({ userId, db }) {
  const [form, setForm] = useState({
    username: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    gender: '',
    body_weight: '',
    caffeine_limit: '',
    date_of_birth: '',
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${db.base_url}/api/user/${userId}`);
        const data = await response.json();
        if (response.ok) {
          setForm({
            username: data.username || '',
            first_name: data.first_name || '',
            middle_name: data.middle_name || '',
            last_name: data.last_name || '',
            gender: data.gender || '',
            body_weight: data.body_weight || '',
            caffeine_limit: data.caffeine_limit || '',
            date_of_birth: data.date_of_birth ? data.date_of_birth.split('T')[0] : '',
          });
        } else {
          setMessage(data.error || 'Failed to load user');
        }
      } catch (error) {
        setMessage('Error fetching user profile');
      }
    };
  
    fetchUser();
  }, [userId]);    

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const result = await db.updateUserProfile({ userId, ...form });
      setMessage('Profile updated successfully');
    } catch (err) {
      setMessage(err.message || 'Update failed');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your profile?')) return;
    try {
      await db.deleteUser(userId);
      localStorage.removeItem('userId');
      setMessage('Profile deleted');
      navigate('/');
    } catch (err) {
      setMessage(err.message || 'Delete failed');
    }
  };  

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>Edit Profile</h2>
      <form onSubmit={handleUpdate}>
        {[
          ['Username', 'username'],
          ['First Name', 'first_name'],
          ['Middle Name', 'middle_name'],
          ['Last Name', 'last_name'],
          ['Gender (M/F)', 'gender'],
          ['Body Weight (kg)', 'body_weight'],
          ['Caffeine Limit (mg)', 'caffeine_limit'],
          ['Date of Birth', 'date_of_birth'],
        ].map(([label, name]) => (
          <div key={name} style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '4px' }}>{label}</label>
            <input
              type={name === 'date_of_birth' ? 'date' : 'text'}
              name={name}
              value={form[name]}
              onChange={handleChange}
              required={['username', 'first_name', 'last_name'].includes(name)}
              style={{
                width: '100%',
                padding: '6px',
                fontSize: '1rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
          </div>
        ))}

        <button type="submit" style={{ marginRight: '10px' }}>
          Update Profile
        </button>

        <button
          type="button"
          onClick={handleDelete}
          style={{ backgroundColor: 'red', color: 'white' }}
        >
          Delete Profile
        </button>
      </form>
      {message && <p style={{ marginTop: '10px', color: 'green' }}>{message}</p>}
    </div>
  );
}
