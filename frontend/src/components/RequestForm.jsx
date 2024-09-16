import { useState, useEffect } from 'react';
import { createRequest, fetchMachineTypes, fetchMaterialsByMachine, fetchAllManagers } from '../api'; // Add fetchManagers API
import './RequestForm.css';

function RequestForm() {
  const [machineTypes, setMachineTypes] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState('');
  const [materials, setMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [selectedMaterialName, setSelectedMaterialName] = useState('');
  const [quantityRequested, setQuantityRequested] = useState('');
  const [managers, setManagers] = useState([]);  // New state for managers
  const [selectedManager, setSelectedManager] = useState('');  // Selected manager
  const [shift, setShift] = useState(''); // New state for shift

  // Fetch machine types and managers on component mount
  useEffect(() => {
    const getMachineTypes = async () => {
      try {
        const response = await fetchMachineTypes();
        setMachineTypes(response.data);
      } catch (error) {
        console.error('Error fetching machine types', error);
      }
    };

    const getManagers = async () => {
      try {
        const response = await fetchAllManagers();
        setManagers(response.data);
      } catch (error) {
        console.error('Error fetching managers', error);
      }
    };

    getMachineTypes();
    getManagers();
  }, []);

  // Fetch materials based on selected machine
  useEffect(() => {
    if (selectedMachine) {
      const getMaterials = async () => {
        try {
          const response = await fetchMaterialsByMachine(selectedMachine);
          setMaterials(response.data);
        } catch (error) {
          console.error('Error fetching materials', error);
        }
      };

      getMaterials();
    } else {
      setMaterials([]);
    }
  }, [selectedMachine]);

  // Update selected material name based on selected material ID
  useEffect(() => {
    const selectedMaterialData = materials.find(material => material._id === selectedMaterial);
    if (selectedMaterialData) {
      setSelectedMaterialName(selectedMaterialData.material_description);
    } else {
      setSelectedMaterialName('');
    }
  }, [selectedMaterial, materials]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const requestData = {
      description: selectedMaterialName,
      quantityRequested,
      requestedManager: selectedManager,
      shift // Include shift in request data
    };

    try {
      await createRequest(requestData, config);
      setSelectedMaterial('');
      setQuantityRequested('');
      setSelectedManager('');
      setShift('');
      alert('Request created successfully');
    } catch (error) {
      console.error('Error creating request', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="request-form">
      <h3>Create Request</h3>
      <select value={selectedMachine} onChange={(e) => setSelectedMachine(e.target.value)} required>
        <option value="">Select Machine Type</option>
        {machineTypes.map((machine) => (
          <option key={machine} value={machine}>{machine}</option>
        ))}
      </select>
      <select value={selectedMaterial} onChange={(e) => setSelectedMaterial(e.target.value)} required>
        <option value="">Select Material</option>
        {materials.map((material) => (
          <option key={material._id} value={material._id}>{material.material_description}</option>
        ))}
      </select>
      <select value={selectedManager} onChange={(e) => setSelectedManager(e.target.value)} required>
        <option value="">Select Manager</option>
        {managers.map((manager) => (
          <option key={manager._id} value={manager.username}>{manager.username}</option>
        ))}
      </select>
      <select value={shift} onChange={(e) => setShift(e.target.value)} required>
        <option value="">Select Shift</option>
        <option value="Morning">Morning</option>
        <option value="Evening">Evening</option>
        <option value="Night">Night</option>
      </select>
      <input
        type="number"
        placeholder="Quantity Requested"
        value={quantityRequested}
        onChange={(e) => setQuantityRequested(e.target.value)}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
}

export default RequestForm;
