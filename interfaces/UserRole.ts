import type { Permission } from "./Permission";

export interface UserRole {
  id: number;
  name: string;
  guard_name?: string;
  permissions?: Permission[];
  created_at?: string;
  updated_at?: string;
}

export interface UserRoleFilters {
  search?: string;
  page?: number;
  per_page?: number;
}


