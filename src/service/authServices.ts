import instance from "@/pages/utils/axios";
import { useRegisterStore } from "@/stores/authStore";
import {
  LoginResponse,
  VerifyUser,
  type VerifyEmailResponse,
} from "@/types/auth";
import axios from "axios";
import toast from "react-hot-toast";

//Register

// const instance;

export const handleRegister = async (
  email: string,
  username: string,
  password: string,
  confirmPassword: string,
  fullName: string,
): Promise<void> => {
  try {
    await instance.post(
      "/api/auth/register",
      {
        email,
        username,
        password,
        confirmPassword,
        fullName,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    useRegisterStore.getState().setEmail(email);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = "Đăng kí thất bại";
      toast.error(message);
    } else {
      toast.error("Đã có lỗi xày ra ở đâu đó");
      throw error;
    }
  }
};

//Login

export const handleLogin = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  const response = await instance.post<LoginResponse>("/api/auth/login", {
    email,
    password,
  });

  return response.data;
};

// VERIFY email

// export const handleVerifyEmail = async (token: string) => {
//   try {
//     const response = await instance.post(
//       `/api/auth/verify-email/${token}`,
//       {
//         token,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       },
//     );
//     const data = response.data;
//     console.log(data);
//     return data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       const message = "Xác nhận email thất bại";
//       toast.error(message);
//     } else {
//       toast.error("Đã có lỗi xày ra ở đâu đó");
//       throw error;
//     }
//     return null;
//   }
// };

export const handleVerifyEmail = async (token: string): Promise<VerifyUser> => {
  const { data } = await instance.post<VerifyEmailResponse>(
    `/api/auth/verify-email/${token}`,
  );

  return data.data.user;
};

// Resent Email

export const handleResendEmail = async (email: string) => {
  try {
    const response = await instance.post(
      `/api/auth/resend-verification-email`,
      {
        email,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const data = response.data;
    console.log(data);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = "Gửi lại email email thất bại";
      toast.error(message);
    } else {
      toast.error("Đã có lỗi xày ra ở đâu đó");
      throw error;
    }
    return null;
  }
};

// Reset Password

export const handleResetPassword = async (email: string) => {
  try {
    const response = await instance.post(
      `/api/auth/forgot-password`,
      {
        email,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const data = response.data;
    console.log(data);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = "Mật khẩu không được làm mới thành công";
      toast.error(message);
    } else {
      toast.error("Đã có lỗi xày ra ở đâu đó");
      throw error;
    }
    return null;
  }
};

// Change-password

export const handleChangePassword = async (
  token: string,
  password: string,
  confirmPassword: string,
): Promise<void> => {
  try {
    await instance.post(`/api/auth/reset-password/${token}`, {
      password,
      confirmPassword,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error("Mật khẩu không được làm mới thành công");
    }

    throw error;
  }
};

//Log out

export const logout = async (refreshToken: string) => {
  try {
    await instance.post("/api/auth/logout", { refreshToken });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Logout API error:", error.response?.status);
    } else {
      console.error("Unknown logout error:", error);
    }
  }
};

// Change Password after Login

export const changePassword = async (
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
) => {
  try {
    const response = await instance.post(`/api/auth/change-password`, {
      currentPassword,
      newPassword,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Đổi mật khẩu thất bại");
    }
    throw error;
  }
};

// InfoUser _id
