import axios from "axios";
import { store } from "@/redux/store";
import { selectUserInfo } from "@/redux/selectors/userSelectors";

// Optional: logout function
const logoutAndRedirect = (message?: string) => {
  localStorage.clear();
  window.location.href = "/login";
  window.location.reload();
};

export default class BaseApi {
  protected axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
  });

  constructor() {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const state = store.getState();
        const token = selectUserInfo(state)?.token;

        if (token) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
          };
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for 401 handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;
        const url = error.config?.url;

        if (status === 401) {
          console.warn(`🔐 401 error on: ${url}`);
          logoutAndRedirect("Session expired. Please login again.");
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T = any>(url: string, config?: any): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  async post<T = any>(url: string, body: any, config?: any): Promise<T> {
    const isFormData =
      typeof FormData !== "undefined" && body instanceof FormData;

    const finalConfig = {
      ...config,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(config?.headers || {}),
      },
    };

    const response = await this.axiosInstance.post<T>(url, body, finalConfig);
    return response.data;
  }

  async patch<T = any>(url: string, body: any, config?: any): Promise<T> {
    const response = await this.axiosInstance.patch<T>(url, body, config);
    return response.data;
  }

  async put<T = any>(url: string, body: any, config?: any): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, body, config);
    return response.data;
  }

  async delete<T = any>(url: string, body?: any, config?: any): Promise<T> {
    const finalConfig = config || {};
    if (body) finalConfig.data = body;
    const response = await this.axiosInstance.delete<T>(url, finalConfig);
    return response.data;
  }
}
