import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  type Method,
} from "axios";
import { saveAs } from "file-saver";
import { envConfig } from "../../configs/env.config";
import { getCache, removeCache, clearAllCache, setCache } from "../cache";
import { TOKEN_CURRENT, REFRESH_TOKEN } from "../constants";
import { persistor } from "app/redux/store";

export interface IRequestStrategy {
  request<T = any>(
    endpoint: string,
    method: Method,
    data?: any,
    params?: Record<string, any>,
    headers?: Record<string, string>
  ): Promise<T>;

  downloadFile(
    endpoint: string,
    params?: Record<string, any>,
    method?: Method,
    headers?: Record<string, string>
  ): Promise<void>;

  uploadFile<T = any>(
    endpoint: string,
    files: File | File[] | Record<string, File | File[]>,
    extraData?: Record<string, any>,
    method?: Method,
    headers?: Record<string, string>
  ): Promise<T>;
}

export class AxiosStrategy implements IRequestStrategy {
  private axiosInstance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: ((token: string) => void)[] = [];

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: envConfig.baseUrl,
      timeout: 10 * 60 * 1000,
      withCredentials: false,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.axiosInstance.interceptors.request.use(
      (config: AxiosRequestConfig | any) => {
        const token = getCache<string>(TOKEN_CURRENT);

        if (token && config.headers) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
          };
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest: InternalAxiosRequestConfig | any = error.config;
        if (error.response?.status === 403) {
          this.redirectLogin();
        }

        if (error.response?.status === 401 && !originalRequest?._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve) => {
              this.failedQueue.push((token: string) => {
                originalRequest.headers["Authorization"] = "Bearer " + token;
                resolve(this.axiosInstance(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = localStorage.getItem(REFRESH_TOKEN);
            const response = await axios.post(
              `${envConfig.baseUrl}/auth/refresh`,
              { refreshToken }
            );
            const { accessToken, refreshToken: newRefreshToken } =
              response.data;

            setCache(TOKEN_CURRENT, accessToken);
            setCache(REFRESH_TOKEN, newRefreshToken);

            this.failedQueue.forEach((cb) => cb(accessToken));
            this.failedQueue = [];

            return this.axiosInstance(originalRequest);
          } catch (err) {
            this.redirectLogin();
            return Promise.reject(err);
          } finally {
            this.isRefreshing = false;
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async redirectLogin() {
    removeCache(TOKEN_CURRENT);
    removeCache(REFRESH_TOKEN);
    clearAllCache();
    await persistor.pause();
    window.location.href = "/login";
  }

  async request<T>(
    endpoint: string,
    method: Method,
    data?: any,
    params?: Record<string, any>,
    headers: Record<string, string> = {}
  ): Promise<T> {
    const config: AxiosRequestConfig = {
      url: endpoint,
      method,
      data,
      params,
      headers,
    };

    const response = await this.axiosInstance.request<T>(config);
    return response.data;
  }

  async downloadFile(
    endpoint: string,
    params: Record<string, any> = {},
    method: Method,
    headers: Record<string, string> = {}
  ): Promise<void> {
    const response: AxiosResponse<Blob> = await this.axiosInstance.request({
      url: endpoint,
      method,
      params,
      headers,
      responseType: "blob",
    });

    const disposition = response.headers["content-disposition"];
    let filename = "download";

    if (disposition && disposition.includes("filename=")) {
      const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (match?.[1]) {
        filename = decodeURIComponent(match[1].replace(/['"]/g, ""));
      }
    }

    saveAs(response.data, filename);
  }

  async uploadFile<T = any>(
    endpoint: string,
    files: File | File[] | Record<string, File | File[]>,
    extraData: Record<string, any> = {},
    method: Method,
    headers: Record<string, string> = {}
  ): Promise<T> {
    const formData = new FormData();

    if (files instanceof File || Array.isArray(files)) {
      const fileList = Array.isArray(files) ? files : [files];
      fileList.forEach((file) => formData.append("files", file));
    } else {
      Object.entries(files).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((f) => formData.append(`${key}[]`, f));
        } else {
          formData.append(key, value);
        }
      });
    }

    Object.entries(extraData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const config: AxiosRequestConfig = {
      url: endpoint,
      method,
      data: formData,
      headers: {
        ...headers,
        "Content-Type": "multipart/form-data",
      },
    };

    const response = await this.axiosInstance.request<T>(config);
    return response.data;
  }
}
