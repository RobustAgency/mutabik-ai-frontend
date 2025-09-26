import { api, ApiResponse } from '@/lib/api';
import { PaginatedResponse } from '@/interfaces/Pagination';

export interface FrameworkMedia {
  id: number;
  original_url: string;
  preview_url: string;
  name: string;
  file_name: string;
  mime_type: string;
}

export interface Framework {
  id: number;
  user_id: number;
  name: string;
  code: string;
  type: string;
  geography: string;
  category: string;
  version: string;
  release_date: string;
  is_published: boolean;
  description?: string;
  authority_publisher?: string;
  binding_level?: string;
  sector_applicability?: string;
  risk_class_coverage?: string;
  certification_attestation?: string;
  assessment_mode?: string;
  created_at: string;
  updated_at: string;
  controls_count: number;
  requirements_count: number;
  media: FrameworkMedia[];
}

export class FrameworkService {
  async getFrameworks(): Promise<ApiResponse<PaginatedResponse<Framework>>> {
    return api.get('/frameworks');
  }

  async getFramework(id: number): Promise<ApiResponse<Framework>> {
    return api.get(`/frameworks/${id}`);
  }
}

export const frameworkService = new FrameworkService();