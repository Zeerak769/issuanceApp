import { useState, useEffect } from 'react';
import { fetchMachineTypes, fetchMaterialsByMachine, fetchMaterialsByMaterialDescription, fetchMaterialById, updateMaterial } from '../api'; // Import API functions
import './InventoryPage.css';

function InventoryPage() {
  const [machineTypes, setMachineTypes] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateData, setUpdateData] = useState({
    material: '',
    machine: '',
    material_description: '',
    quantity: '',
    min: '',
    max: '',
    unit_price: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const machineResponse = await fetchMachineTypes();
        setMachineTypes(machineResponse.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching machine types:', err);
        setError('Error fetching machine types');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMachineChange = async (e) => {
    setSelectedMachine(e.target.value);
    setDescription(''); // Clear description when machine type changes
    try {
      const response = await fetchMaterialsByMachine(e.target.value);
      setMaterials(response.data);
    } catch (err) {
      console.error('Error fetching materials by machine:', err);
      setError('Error fetching materials');
    }
  };

  const handleDescriptionChange = async (e) => {
    setDescription(e.target.value);
    try {
      const response = await fetchMaterialsByMaterialDescription(e.target.value);
      setMaterials(response.data);
    } catch (err) {
      console.error('Error fetching materials by description:', err);
      setError('Error fetching materials');
    }
  };

  const handleMaterialSelect = async (e) => {
    const selectedId = e.target.value;
    try {
      const response = await fetchMaterialById(selectedId);
      setSelectedMaterial(response.data);
      setUpdateData({
        material: response.data.material,
        machine: response.data.machine,
        material_description: response.data.material_description,
        quantity: response.data.quantity,
        min: response.data.min,
        max: response.data.max,
        unit_price: response.data.unit_price
      });
    } catch (err) {
      console.error('Error fetching material by ID:', err);
      setError('Error fetching material');
    }
  };

  const handleUpdate = async () => {
    try {
      await updateMaterial(selectedMaterial._id, updateData);
      alert('Material updated successfully');
      // Refresh the materials list or handle update success as needed
    } catch (err) {
      console.error('Error updating material:', err);
      alert('Error updating material');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="inventory-page">
      <h3>Inventory Management</h3>

      {/* Machine Type Selection */}
      <div className="dropdown-container">
        <label htmlFor="machine-select">Select Machine Type: </label>
        <select
          id="machine-select"
          value={selectedMachine}
          onChange={handleMachineChange}
          className="select-input"
        >
          <option value="">Select a machine type</option>
          {machineTypes.map(machine => (
            <option key={machine} value={machine}>{machine}</option>
          ))}
        </select>
      </div>

      {/* Material Description Search */}
      <div className="input-container">
        <label htmlFor="material-description">Search by Material Description: </label>
        <input
          id="material-description"
          type="text"
          value={description}
          onChange={handleDescriptionChange}
          className="text-input"
        />
      </div>

      {/* Material Selection */}
      <div className="dropdown-container">
        <label htmlFor="material-select">Select Material: </label>
        <select
          id="material-select"
          value={selectedMaterial ? selectedMaterial._id : ''}
          onChange={handleMaterialSelect}
          className="select-input"
        >
          <option value="">Select a material</option>
          {materials.map(material => (
            <option key={material._id} value={material._id}>{material.material}</option>
          ))}
        </select>
      </div>

      {/* Material Update Form */}
      {selectedMaterial && (
        <div className="update-form">
          <h4>Update Material</h4>
          <div className="input-container">
            <label htmlFor="material">Material: </label>
            <input
              id="material"
              type="text"
              value={updateData.material}
              onChange={(e) => setUpdateData({ ...updateData, material: e.target.value })}
              className="text-input"
            />
          </div>
          <div className="input-container">
            <label htmlFor="machine">Machine: </label>
            <input
              id="machine"
              type="text"
              value={updateData.machine}
              onChange={(e) => setUpdateData({ ...updateData, machine: e.target.value })}
              className="text-input"
            />
          </div>
          <div className="input-container">
            <label htmlFor="material_description">Material Description: </label>
            <input
              id="material_description"
              type="text"
              value={updateData.material_description}
              onChange={(e) => setUpdateData({ ...updateData, material_description: e.target.value })}
              className="text-input"
            />
          </div>
          <div className="input-container">
            <label htmlFor="quantity">Quantity: </label>
            <input
              id="quantity"
              type="number"
              value={updateData.quantity}
              onChange={(e) => setUpdateData({ ...updateData, quantity: e.target.value })}
              className="text-input"
            />
          </div>
          <div className="input-container">
            <label htmlFor="min">Minimum: </label>
            <input
              id="min"
              type="number"
              value={updateData.min}
              onChange={(e) => setUpdateData({ ...updateData, min: e.target.value })}
              className="text-input"
            />
          </div>
          <div className="input-container">
            <label htmlFor="max">Maximum: </label>
            <input
              id="max"
              type="number"
              value={updateData.max}
              onChange={(e) => setUpdateData({ ...updateData, max: e.target.value })}
              className="text-input"
            />
          </div>
          <div className="input-container">
            <label htmlFor="unit_price">Unit Price: </label>
            <input
              id="unit_price"
              type="number"
              value={updateData.unit_price}
              onChange={(e) => setUpdateData({ ...updateData, unit_price: e.target.value })}
              className="text-input"
            />
          </div>
          <button onClick={handleUpdate} className="update-button">Update Material</button>
        </div>
      )}
    </div>
  );
}

export default InventoryPage;
