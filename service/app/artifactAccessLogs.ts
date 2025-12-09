export enum AccessAction {
  READ = "read",
  WRITE = "write",
  DELETE = "delete",
}

export enum AccessContext {
  CI_CD = "ci_cd",
  NOTEBOOK = "notebook",
  CONSOLE = "console",
  API = "api",
}

export interface ArtifactAccessLog {
  id: number;
  display_id: string;
  artifact_id: number;
  accessor_stakeholder_id: number;
  action: AccessAction | string;
  context: AccessContext | string;
  ts: string; // ISO timestamp with timezone
  ip_or_agent?: string | null;
  request_id?: string | null;
  reason?: string | null;
  created_at: string;
  updated_at?: string | null;

  // Related data
  artifact?: {
    id: number;
    artifact_id?: string;
    artifact_type: string;
    uri: string;
    ai_model_version?: {
      id: number;
      version_number: string;
      ai_model?: {
        id: number;
        name: string;
        version_number: string;
      };
    };
  };
  accessor_stakeholder?: {
    id: number;
    display_name: string;
    email?: string;
    type: string;
  };
}

export interface CreateArtifactAccessLogData {
  artifact_id: number;
  accessor_stakeholder_id: number;
  action: AccessAction | string;
  context: AccessContext | string;
  ts: string; // ISO timestamp with timezone
  ip_or_agent?: string | null;
  request_id?: string | null;
  reason?: string | null;
}

export interface ArtifactAccessLogFilters {
  artifact_id?: number;
  accessor_stakeholder_id?: number;
  action?: string;
  context?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface PaginatedArtifactAccessLogsResponse {
  current_page: number;
  data: ArtifactAccessLog[];
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}
