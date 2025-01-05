import axios from 'axios';

const apiRequest = axios.create({
  baseURL: 'http://localhost:3000/api/v1/',
  timeout: 5000,
});

// 请求拦截器
apiRequest.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器
apiRequest.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // 将错误响应转换为正常返回
      return Promise.resolve({
        data: {
          success: false,
          message: error.response.data.message || '请求失败',
          status: error.response.status
        }
      });
    }
    // 对于网络错误等其他错误，仍然抛出异常
    return Promise.reject(error);
  }
);

export default apiRequest;

export const loginAPI = async (username, password) => {
  const response = await apiRequest.post('/login', { username, password });
  return response.data;
};

export const registerAPI = async(payload)=>{
  const response = await apiRequest.post('/signup', payload);
  return response.data;
}

// users
export const getUserAPI = async()=>{
  const response = await apiRequest.get('/user');
  return response.data;
}

export const changeUserFieldAPI = async(payload)=>{
  const response = await apiRequest.patch('/userfield',payload);
  return response.data;
}

export const changePasswordAPI = async(payload)=>{
  const response = await apiRequest.patch('/password',payload);
  return response.data;
}

// shopcate

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

export const getShopsAPI = async (payload) => {
  const response = await apiRequest.get('/shops', {params:payload});
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

// order

export const getOrdersAPI = async(payload)=>{
  const response = await apiRequest.get('/orders',{params:payload});
  return response.data;
}

export const getOrderAPI = async(id)=>{
  const response = await apiRequest.get('/order/'+id);
  return response.data;
}

export const updateOrderStatusAPI = async(payload)=>{
  const response = await apiRequest.patch('/order', payload);
  return response.data;
}

// file
export const uploadFileAPI = async(payload)=>{
  const response = await apiRequest.post('/upload/image', 
    payload, 
    {headers:{
    'Content-Type':"multipart/form-data"
  }});
  return response.data;
}

export const uploadFilesAPI = async(payload)=>{
  const response = await apiRequest.post('/upload/photos', 
    payload,
    {headers:{
    'Content-Type':"multipart/form-data"
  }});
  return response.data;
}
