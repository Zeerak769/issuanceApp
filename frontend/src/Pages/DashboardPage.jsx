import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { getAllRequests } from '../api';
import RequestList from '../components/RequestList';
import RequestForm from '../components/RequestForm';
import ApprovalPanel from '../components/ApprovalPanel';
import IssuancePanel from '../components/IssuancePanel';
import './Dashboard.css';

function DashboardPage() {
  const [requests, setRequests] = useState([]);
  const [role, setRole] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    // Get the token from local storage to check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      // If token is missing, redirect to login page
      navigate('/login');
      return;
    }

    // Get the role from local storage
    const userRole = localStorage.getItem('role');
    console.log('Retrieved role from localStorage:', userRole); // Log to check
    setRole(userRole);

    // Fetch requests from the API
    const fetchRequests = async () => {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
        const { data } = await getAllRequests(config);
        setRequests(data);
      } catch (error) {
        console.error('Error fetching requests', error);
      }
    };
    fetchRequests();
  }, [navigate]);

  return (
    <div className="dashboard">
      {role === 'manager' && (
        <div className="dashboard-panels">
          <h2>Manager Dashboard</h2>
          <ApprovalPanel requests={requests} />
        </div>
      )}
      {role === 'fitter' && (
        <div className="dashboard-panels">
          <h2>Fitter Dashboard</h2>
          <RequestForm />
        </div>
      )}
      {role === 'issuer' && (
        <div className="dashboard-panels">
          <h2>Engineering Store Dashboard</h2>
          <IssuancePanel requests={requests} />
        </div>
      )}
      {!['manager', 'fitter', 'issuer'].includes(role) && (
        <p>Invalid role. Access denied.</p>
      )}
      <div className="request-list-container">
        <RequestList requests={requests} />
      </div>
    </div>
  );
}

export default DashboardPage;
