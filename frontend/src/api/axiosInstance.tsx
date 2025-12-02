import { useAuth } from "@/stores/authStore";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
   baseURL: API_URL,
   withCredentials: true
})

let isRefreshing = false;
let failedQueue: {
   resolve: (token: string) => void,
   reject: (error: unknown) => void
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
   failedQueue.forEach(prom => {
      if (token) {
         prom.resolve(token)
      } else {
         prom.reject(error)
      }
   })

   failedQueue = [];
}

api.interceptors.response.use(res => res, async error => {
   const originalRequest = error.config;

   if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
         return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
         })
            .then(token => {
               originalRequest.headers['Authorization'] = `Bearer ${token}`;
               return api(originalRequest);
            })
            .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
         const res = await axios.post(`${API_URL}/auth/refresh`, {}, {
            withCredentials: true
         });
         const newAccessToken = res.data.newAccessToken;
         
         const user = {
            _id: res.data.user._id,
            email: res.data.user.email,
            role: res.data.user.role,
            displayName: res.data.user.displayName
         }
         useAuth.getState().setUser(user);
         useAuth.getState().setAccessToken(newAccessToken);
         
         api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
         
         processQueue(null, newAccessToken);

         return api(originalRequest);

      } catch (err) {

         processQueue(err, null);
         return Promise.reject(err);

      } finally {

         isRefreshing = false;
      }
   }
   return Promise.reject(error);
})

export default api;