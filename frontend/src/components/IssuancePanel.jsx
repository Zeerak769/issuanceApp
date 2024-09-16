import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { updateRequestStatus, fetchAllManagers } from '../api'; // Import API functions
import './IssuancePanel.css';

function IssuancePanel({ requests }) {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedManager, setSelectedManager] = useState('');
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state
  const [error, setError] = useState(null); // Add an error state
  const navigate = useNavigate(); // Hook for navigation

  // Fetch managers on component mount
  useEffect(() => {
    const getManagers = async () => {
      try {
        const response = await fetchAllManagers(); // Fetch managers from API
        setManagers(response.data);
        if (response.data.length > 0) {
          setSelectedManager(response.data[0].username); // Set default manager if available
        }
        setLoading(false); // Set loading to false when done
      } catch (error) {
        console.error('Error fetching managers:', error);
        setError('Error fetching managers'); // Set error message
        setLoading(false); // Set loading to false on error
      }
    };

    getManagers();
  }, []);

  // Filter approved requests based on the selected manager
  const filteredRequests = requests.filter(request => 
    request.status === 'Approved' && request.requestedManager === selectedManager
  );

  const handleIssue = async () => {
    if (!selectedRequest) return;

    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await updateRequestStatus(selectedRequest._id, { status: 'Issued' }, config);
      alert('Request issued');
      setSelectedRequest(null); // Clear selection after issuance
    } catch (error) {
      console.error('Error issuing request', error);
      alert('Error issuing request'); // Alert user on error
    }
  };

  const handleNavigateToInventory = () => {
    navigate('/inventory'); // Adjust the path as needed
  };

  if (loading) return <p>Loading managers...</p>; // Show loading message
  if (error) return <p>{error}</p>; // Show error message

  return (
    <div className="issuance-panel">
      <h3>Issuance Panel</h3>

      {/* Manager selection dropdown */}
      <div className="dropdown-container">
        <label htmlFor="manager-select">Select Manager: </label>
        <select
          id="manager-select"
          value={selectedManager}
          onChange={(e) => setSelectedManager(e.target.value)}
          className="manager-select"
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
          className="request-select"
        >
          <option value="">Select a request</option>
          {filteredRequests.map(request => (
            <option key={request._id} value={request._id}>{request.description}</option>
          ))}
        </select>
      </div>

      {/* Issue button */}
      <button onClick={handleIssue} disabled={!selectedRequest} className="issue-button">
        Issue
      </button>

      {/* Navigate to Inventory Management */}
      <button onClick={handleNavigateToInventory} className="navigate-button">
        Go to Inventory Management
      </button>
    </div>
  );
}

export default IssuancePanel;
