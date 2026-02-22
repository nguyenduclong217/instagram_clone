export interface SearchUser {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  profilePicture: string | null;
  bio: string | null;
  website?: string | null;
}

export interface SearchUserResponse {
  success: boolean;
  message: string;
  data: SearchUser[];
}

export interface SearchHistory {
  _id: string;
  userId: string;
  searchedUserId: string;
  searchQuery: string;
  createdAt: string;
}
export interface AddSearchHistoryResponse {
  success: boolean;
  message: string;
  data: SearchHistory;
}

export interface SearchHistoryItem {
  _id: string;
  searchQuery: string;
  searchedUserId: SearchUser;
  createdAt: string;
}

export interface GetSearchHistoryResponse {
  success: boolean;
  message: string;
  data: SearchHistoryItem[];
}
