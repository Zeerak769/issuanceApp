import { useState, useEffect } from 'react';
import { updateRequestStatus, fetchAllManagers } from '../api';  // Import API functions
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import './ApprovalPanel.css';

function ApprovalPanel({ requests }) {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedManager, setSelectedManager] = useState('');  // State for selected manager
  const [managers, setManagers] = useState([]);  // State for managers
  const navigate = useNavigate();  // Initialize navigate

  // Fetch managers on component mount
  useEffect(() => {
    const getManagers = async () => {
      try {
        const response = await fetchAllManagers();  // Fetch managers from API
        setManagers(response.data);
        if (response.data.length > 0) {
          setSelectedManager(response.data[0].username); // Set default manager if available
        }
      } catch (error) {
        console.error('Error fetching managers:', error);
      }
    };

    getManagers();
  }, []);

  // Filter requests that are pending and match the selected manager
  const filteredRequests = requests.filter(request => 
    request.status === 'Pending' && request.requestedManager === selectedManager
  );

  const handleApprove = async () => {
    if (!selectedRequest) return;
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await updateRequestStatus(selectedRequest._id, { status: 'Approved' }, config);
      alert('Request approved');
      setSelectedRequest(null); // Clear selection after approval
    } catch (error) {
      console.error('Error approving request', error);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await updateRequestStatus(selectedRequest._id, { status: 'Rejected' }, config);
      alert('Request rejected');
      setSelectedRequest(null); // Clear selection after rejection
    } catch (error) {
      console.error('Error rejecting request', error);
    }
  };

  // Redirect to register page for creating new users
  const handleCreateUser = () => {
    navigate('/register');
  };

  return (
    <div className="approval-panel">
      <h3>Approval Panel</h3>

      {/* Manager selection dropdown */}
      <div className="dropdown-container">
        <label htmlFor="manager-select">Select Manager: </label>
        <select
          id="manager-select"
          value={selectedManager}
          onChange={(e) => setSelectedManager(e.target.value)}
        >
          {managers.map(manager => (
            <option key={manager._id} value={manager.username}>
              {manager.username}
            </option>
          ))}
        </select>
      </div>

      {/* Request selection dropdown */}
      <div className="dropdown-container">
        <label htmlFor="request-select">Select Request: </label>
        <select
          id="request-select"
          value={selectedRequest ? selectedRequest._id : ''}
          onChange={(e) => setSelectedRequest(filteredRequests.find(req => req._id === e.target.value))}
        >
          <option value="">Select a request</option>
          {filteredRequests.map(request => (
            <option key={request._id} value={request._id}>{request.description}</option>
          ))}
        </select>
      </div>

      {/* Action buttons */}
      <button onClick={handleApprove} disabled={!selectedRequest}>Approve</button>
      <button onClick={handleReject} disabled={!selectedRequest}>Reject</button>

      {/* Create New User button visible only to managers */}
      <div className="create-user-container">
        <h3>Assign A New Role</h3>
        <button onClick={handleCreateUser}>Add New User</button>
      </div>
    </div>
  );
}

export default ApprovalPanel;
