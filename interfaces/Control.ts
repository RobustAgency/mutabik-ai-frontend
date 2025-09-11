import { Framework } from './Framework';
import { Requirement } from './Requirement';
import { Tag } from './Tag';
import { PaginatedResponse } from './Pagination';

export interface Control {
  id: number;
  name: string;
  code: string;
  question?: string;
  summary?: string;
  description?: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  frameworks?: Framework[];
  requirements?: Requirement[];
  tags?: Tag[];
}

export interface ControlFilters extends Record<string, unknown> {
  search?: string;
  framework_ids?: number[];
  requirement_ids?: number[];
  tag_ids?: number[];
  page?: number;
  per_page?: number;
}

export interface CreateControlRequest {
  name: string;
  code: string;
  question?: string;
  summary?: string;
  description?: string;
  framework_ids?: number[];
  requirement_ids?: number[];
  tag_ids?: number[];
}

export interface UpdateControlRequest extends Partial<CreateControlRequest> {}

export interface ControlsApiResponse {
  data: PaginatedResponse<Control>;
  status: number;
  message: string;
  error: boolean;
}

export interface ControlApiResponse {
  data: Control;
  status: number;
  message: string;
  error: boolean;
}
