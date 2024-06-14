import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../styles/SignUp.css';
import axios from 'axios';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    acct_type: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/signup', formData);
      console.log(response.data);

      if (response.status === 200) {
        navigate('/');  // Redirect to HomePage path
      }

      alert('Sign up successful!');
    } catch (error) {
      console.error(error);
      alert('Error during sign up!');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-header">
        <img src={logo} alt="Logo" className="logo-style" />
        <h1>SharpMind 🧠 User Registration</h1>
      </div>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="acct_type">Account Type:</label>
          <input
            type="text"
            id="acct_type"
            name="acct_type"
            value={formData.acct_type}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <button type="submit" className="button-style">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;