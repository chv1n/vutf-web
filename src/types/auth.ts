// (Request)
export interface LoginRequest {
  email: string;
  password?: string;
}

// (Response)
export interface UserProfile {
  userId: string;
  email: string;
  role: string;
}

export interface LoginResponseData {
  userId: string;
  email: string;  
  role: string;   
  message: string;
}