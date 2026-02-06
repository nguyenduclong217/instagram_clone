import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

console.log(baseURL);

const instance = axios.create({
  baseURL,
});

const refreshInstance = axios.create({ baseURL });

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
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

const getNewToken = async (): Promise<RefreshData> => {
  const refreshToken = localStorage.getItem("refresh_token");

  const res = await refreshInstance.post("/api/auth/refresh-token", {
    refreshToken,
  });
  // refresh fail → coi là lỗi auth
  if (!res.data?.success || !res.data?.data?.accessToken) {
    throw new Error("Refresh token expired");
  }

  return res.data.data;
};

// Lay du lieu

type RefreshData = RefreshTokenResponse["data"];

let refreshPromise: Promise<RefreshData> | null = null;
const isAuthError = (status?: number) => status === 401;

// instance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (
//       isAuthError(error.response?.status) &&
//       !originalRequest._retry &&
//       !originalRequest.url.includes("/auth/refresh-token")
//     ) {
//       originalRequest._retry = true;

//       if (!refreshPromise) {
//         refreshPromise = getNewToken();
//       }

//       const newToken = await refreshPromise;

//       refreshPromise = null;

//       if (!newToken) {
//         localStorage.removeItem("access_token");
//         localStorage.removeItem("refresh_token");
//         localStorage.removeItem("user");

//         window.location.href = "/login";
//         return Promise.reject(error);
//       }

//       localStorage.setItem("access_token", newToken.accessToken);
//       localStorage.setItem("refresh_token", newToken.refreshToken);

//       originalRequest.headers.Authorization = `Bearer ${newToken.accessToken}`;
//       return instance(originalRequest);
//     }

//     return Promise.reject(error);
//   },
// );
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      isAuthError(error.response?.status) &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = getNewToken();
        }

        const newToken = await refreshPromise;

        // reset ở đây
        refreshPromise = null;

        localStorage.setItem("access_token", newToken.accessToken);
        localStorage.setItem("refresh_token", newToken.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${newToken.accessToken}`;

        return instance(originalRequest);
      } catch (err) {
        // reset ở đây khi fail
        refreshPromise = null;

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");

        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default instance;
