import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useEffect, useState } from 'react';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const navigate = useNavigate();

  // Check login status on component mount
  useEffect(() => {
    const token = localStorage.getItem('token'); // Assuming you store token in localStorage
    if (token) {
      setIsLoggedIn(true); // User is logged in
    } else {
      setIsLoggedIn(false); // User is not logged in
    }
  }, []);

  // Logout function to clear the stored user data and redirect to login page
  const handleLogout = (e) => {
    e.preventDefault(); // Prevent default link behavior
    localStorage.removeItem('token'); // Assuming token is stored in localStorage
    localStorage.removeItem('username'); // Clear stored username if necessary
    setIsLoggedIn(false); // Update the state to logged out

    // Redirect to login page
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <h1>Issuance App</h1>
      <ul>
        <li><Link to="/">Home</Link></li>
        {!isLoggedIn && <li><Link to="/login">Login</Link></li>}
        {isLoggedIn && <li><Link to="/dashboard">Dashboard</Link></li>}
        {isLoggedIn && (
          <li>
            <a href="/" onClick={handleLogout}>
              Logout
            </a>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
