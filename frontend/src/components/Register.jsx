import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { register } from '../api'; // Adjust the path if necessary
import './Register.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    role: '',
    employeeId: '', // New field for employee ID
  });

  const navigate = useNavigate(); // Initialize the navigate function

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      await register(formData);
      alert('Registration successful');
      navigate('/login'); // Redirect to login after successful registration
    } catch (error) {
      console.error('Registration failed', error);
      alert('Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <h2>Register</h2>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="employeeId"
        placeholder="Employee ID"
        value={formData.employeeId}
        onChange={handleChange}
      />
      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        required
      >
        <option value="">Select Role</option>
        <option value="manager">Manager</option>
        <option value="fitter">Fitter</option>
        <option value="issuer">Issuer</option>
      </select>
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
