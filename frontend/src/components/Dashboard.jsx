import { useEffect, useState } from 'react';
import { getAllRequests } from '../api';
import RequestForm from './RequestForm';
import RequestList from './RequestList';
import ApprovalPanel from './ApprovalPanel';
import IssuancePanel from './IssuancePanel';
import './Dashboard.css';

function Dashboard() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
        const { data } = await getAllRequests(config);
        setRequests(data);
      } catch (error) {
        console.error('Error fetching requests', error);
      }
    };
    fetchRequests();
  }, []);

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="dashboard-panels">
        <RequestForm />
        <RequestList requests={requests} />
        <ApprovalPanel requests={requests} />
        <IssuancePanel requests={requests} />
      </div>
    </div>
  );
}

export default Dashboard;
