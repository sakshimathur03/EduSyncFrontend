import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/Auth/register', {
        name,
        email,
        password,
        role,
      });
      alert('Registration successful! You can now log in.');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Registration failed');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label>Name</label>
          <input className="form-control" onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input className="form-control" type="email" onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input className="form-control" type="password" onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Role</label>
          <select className="form-control" onChange={(e) => setRole(e.target.value)} value={role}>
            <option value="Student">Student</option>
            <option value="Instructor">Instructor</option>
          </select>
        </div>
        <button className="btn btn-success" type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
