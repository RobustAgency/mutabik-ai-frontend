export interface Permission {
  id: number;
  name: string;
  guard_name?: string;
  module?: string;
  screen?: string;
  description?: string | null;
}


