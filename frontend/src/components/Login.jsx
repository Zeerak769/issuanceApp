import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link for navigation
import { fetchUserByUsername, login } from '../api'; // Import function to fetch user by username
import bcrypt from 'bcryptjs'; // Import bcrypt to compare password hashes
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '', role: '' });
  const navigate = useNavigate();
  const [error, setError] = useState(''); // Add state to store error message

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Fetch user by username
      console.log("HIIIIIIIII")
      const { data: user } = await fetchUserByUsername(formData.username);
      // If user doesn't exist
      if (!user) {
        setError('Invalid credentials');
        return;
      }

      // Compare entered password with hashed password from database
      const isMatch = await bcrypt.compare(formData.password, user.password);
      if (!isMatch) {
        setError('Invalid credentials');
        return;
      }

      // Compare the role entered with the role in the database
      if (formData.role !== user.role) {
        setError('Incorrect role selected'); // Show error if role does not match
        return;
      }
      const { data } = await login(formData);
      // If the password and role match, log in the user
      localStorage.setItem('token', data.token); // Assuming token is returned from backend
      localStorage.setItem('role', formData.role); // Store role in local storage
      localStorage.setItem('username', formData.username); // Store username in local storage
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed', error);
      setError('User Not Autorized or not Registered');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <select name="role" onChange={handleChange} required>
        <option value="">Select Role</option>
        <option value="manager">Manager</option>
        <option value="fitter">Fitter</option>
        <option value="issuer">Issuer</option>
      </select>
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
