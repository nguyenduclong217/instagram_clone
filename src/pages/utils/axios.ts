// import axios from "axios";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const baseURL = import.meta.env.VITE_BASE_URL as string;

console.log(baseURL);

const instance = axios.create({
  baseURL,
});

const refreshInstance = axios.create({ baseURL });

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token !== "") {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

type RefreshTokenResponse = {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
};

type RefreshData = RefreshTokenResponse["data"];

const getNewToken = async (): Promise<RefreshData> => {
  const refreshToken = localStorage.getItem("refresh_token");

  const res = await refreshInstance.post<RefreshTokenResponse>(
    "/api/auth/refresh-token",
    {
      refreshToken,
    },
  );
  // refresh fail → coi là lỗi auth
  if (!res.data.success || !res.data.data.accessToken) {
    throw new Error("Refresh token expired");
  }

  return res.data.data;
};

// Lay du lieu

let refreshPromise: Promise<RefreshData> | null = null;
const isAuthError = (status?: number) => status === 401;

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | CustomAxiosRequestConfig
      | undefined;

    if (
      originalRequest &&
      isAuthError(error.response?.status) &&
      originalRequest._retry !== true &&
      originalRequest.url?.includes("/auth/refresh-token") !== true
    ) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = getNewToken();
        }

        const newToken = await refreshPromise;
        refreshPromise = null;

        localStorage.setItem("access_token", newToken.accessToken);
        localStorage.setItem("refresh_token", newToken.refreshToken);

        if (originalRequest.headers) {
          originalRequest.headers.set(
            "Authorization",
            `Bearer ${newToken.accessToken}`,
          );
        }
        return instance(originalRequest);
      } catch (error) {
        refreshPromise = null;

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(new Error("message"));
      }
    }

    return Promise.reject(error);
  },
);

export default instance;
