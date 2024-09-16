import { useState, useEffect } from 'react';
import RequestItem from './RequestItem';
import { fetchAllManagers } from '../api';  // Import the API to fetch managers
import './RequestList.css';

function RequestList({ requests }) {
  const [activeTab, setActiveTab] = useState('approved');
  const [managers, setManagers] = useState([]);  // State for managers
  const [selectedManager, setSelectedManager] = useState('');  // State for selected manager

  // Fetch managers on component mount
  useEffect(() => {
    const getManagers = async () => {
      try {
        const response = await fetchAllManagers();  // Fetch managers from API
        const managerList = response.data;

        setManagers(managerList); // Set the list of managers
        setSelectedManager(''); // Start with no default selection
      } catch (error) {
        console.error('Error fetching managers:', error);
      }
    };

    getManagers();
  }, []);

  // Filter requests based on status and selected manager
  const filteredRequests = selectedManager
    ? requests.filter(request => request.requestedManager === selectedManager)
    : requests;

  const approvedRequests = filteredRequests.filter(request => request.status === 'Approved');
  const pendingRequests = filteredRequests.filter(request => request.status === 'Pending');
  const issuedRequests = filteredRequests.filter(request => request.status === 'Issued');

  return (
    <div className="request-list">
      <h3>Requests</h3>
      <div className="filter-container">
        <label htmlFor="manager-select">Select Manager: </label>
        <select
          id="manager-select"
          value={selectedManager}
          onChange={(e) => setSelectedManager(e.target.value)}
        >
          <option value="">-- Select a Manager --</option>
          {managers.map(manager => (
            <option key={manager._id} value={manager.username}>
              {manager.username}
            </option>
          ))}
        </select>
      </div>

      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'approved' ? 'active' : ''}`}
          onClick={() => setActiveTab('approved')}
        >
          Approved Requests
        </button>
        <button
          className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending Requests
        </button>
        <button
          className={`tab-button ${activeTab === 'issued' ? 'active' : ''}`}
          onClick={() => setActiveTab('issued')}
        >
          Issued Requests
        </button>
      </div>

      <div className="request-cards-container">
        {activeTab === 'approved' && approvedRequests.length > 0 ? (
          approvedRequests.map((request) => (
            <RequestItem key={request._id} request={request} />
          ))
        ) : activeTab === 'pending' && pendingRequests.length > 0 ? (
          pendingRequests.map((request) => (
            <RequestItem key={request._id} request={request} />
          ))
        ) : activeTab === 'issued' && issuedRequests.length > 0 ? (
          issuedRequests.map((request) => (
            <RequestItem key={request._id} request={request} />
          ))
        ) : (
          <p>No requests found.</p>
        )}
      </div>
    </div>
  );
}

export default RequestList;
