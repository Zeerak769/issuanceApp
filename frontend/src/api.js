import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const login = (formData) => API.post('/auth/login', formData);
export const register = (formData) => API.post('/auth/register', formData);

export const getAllRequests = (config) => API.get('/requests', config);
export const updateRequestStatus = (id, statusData, config) => API.patch(`/requests/${id}`, statusData, config);

export const createRequest = (requestData, config) => {
    return API  .post('/requests/', requestData, config);
  };


export const fetchMachineTypes = () => {
  return API.get('/materials/');
};

export const fetchMaterialsByMachine = (machine) => {
  return API.get(`/materials/machine/${machine}`);
};

export const fetchUserById = (id) => {
    return API.get(`/users/${id._id}`);
};


export const fetchMaterialsByMaterialDescription = (description) => {
return API.get(`/materials/description/${description}`);
};

export const fetchAllManagers = () => {
  return API.get('/users/fetch/managers');
}

export const fetchIssuer = (id) =>{
  return API.get(`/users/${id}`)
}


export const uploadExcelFile = (formData) => {
  return axios.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const fetchUserByUsername = (username) => API.get(`/users/username/${username}`);


export const fetchMaterials = () => API.get('/materials');
export const fetchMaterialById = (id) => API.get(`/materials/${id}`);
export const updateMaterial = (id, data) => API.put(`/materials/${id}`, data);
export const deleteMaterial = (id) => API.delete(`/materials/${id}`);
