import axios from 'axios';

const apiRequest = axios.create({
  baseURL: 'http://localhost:3000/api/v1/',
  timeout: 5000,
});

apiRequest.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default apiRequest;

export const loginAPI = async (username, password) => {
  const response = await apiRequest.post('/login', { username, password });
  return response.data;
};

export const getShopcatesAPI = async () => {
  const response = await apiRequest.get('/shopcates');
  return response.data;
};

export const addShopcateAPI = async(payload)=>{
  const response = await apiRequest.post('/shopcate',payload);
  return response.data;
}

export const deleteShopcateAPI = async(id) => {
  const response = await apiRequest.delete('/shopcate/'+id );
  return response.data;
};

export const updateShopcateAPI = async(payload) => {
  const response = await apiRequest.put('/shopcate', payload);
  return response.data;
};

export const getShopsAPI = async () => {
  const response = await apiRequest.get('/shops');
  return response.data;
};
export const getShopAPI = async(id)=>{
  const response = await apiRequest.get('/shop/'+id);
  return response.data;
}

export const addShopAPI = async(payload)=>{
  const response = await apiRequest.post('/shop',payload);
  return response.data;
}

export const updateShopAPI = async(payload)=>{
  const response = await apiRequest.put('/shop',payload);
  return response.data;
}

export const deleteShopAPI = async(id)=>{
  const response = await apiRequest.delete('/shop/'+id);
  return response.data;
}

export const updateShopStatusAPI = async(payload)=>{
  const response = await apiRequest.patch('/shop',payload);
  return response.data;
}