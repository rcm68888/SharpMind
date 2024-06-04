import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import axios from 'axios';

const logoStyle = {
  width: '110px',
  height: '110px',
  marginBottom: '10px',
  marginRight: '20px'
};

const buttonStyle = {
  padding: '10px 20px',
  fontSize: '16px',
  cursor: 'pointer',
  border: 'none',
  borderRadius: '5px',
  backgroundColor: '#007BFF',
  color: '#FFF',
  margin: '10px'
};

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
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <img src={logo} alt="Logo" style={logoStyle} />
      <h1>SharpMind AI User Registration</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div>
          <label>Account Type:</label>
          <input type="text" name="acct_type" value={formData.acct_type} onChange={handleChange} required />
        </div>
        <button style={buttonStyle} type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;