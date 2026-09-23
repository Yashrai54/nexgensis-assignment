import axios from "axios"

const apiClient = axios.create({
    baseURL:"https://dummyjson.com",
    headers:{
        "Content-Type":"application/json"
    }
})


apiClient.interceptors.request.use((config)=>{
    const token = localStorage.getItem("accessToken")
    if(token){
        config.headers.Authorization=`Bearer ${token}`
    }
    return config;
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      typeof window !== "undefined"
    ) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }

    return Promise.reject(error);
  }
);

export default apiClient;