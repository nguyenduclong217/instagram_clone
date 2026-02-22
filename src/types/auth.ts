export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

export interface User {
  _id: string;
  email: string;
  username: string;
  fullName: string;
  profilePicture: string | null;
  bio: string | null;
}

export interface VerifyUser {
  _id: string;
  email: string;
  username: string;
  isVerified: boolean;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  data: {
    user: VerifyUser;
  };
}
