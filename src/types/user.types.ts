import { UserRole } from "@/lib/authUtils";

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface IRegisterFormData {
  name: string;
  email: string;
  password: string;
  role: "MEMBER";
}
