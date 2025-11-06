export enum ArtifactType {
  MODEL_BINARY = "model_binary",
  TOKENIZER = "tokenizer",
  PROMPT_PACK = "prompt_pack",
  INDEX = "index",
  FEATURE_STORE_EXPORT = "feature_store_export",
  CONFIG = "config",
  DOCKER_IMAGE = "docker_image",
  SBOM = "sbom",
}

export interface AiModelArtifact {
  id: number;
  artifact_id?: string; // Auto-generated: ART-YYYYMMDD-###
  ai_model_version_id: number | string; // FK to model_versions
  artifact_type: ArtifactType | string;
  uri: string; // Storage URI (up to 1024 chars)
  checksum?: string | null; // Hash (e.g., SHA-256)
  size_bytes?: number | null; // Bigint >= 0
  created_at: string; // Timestamp (UTC)
  created_by?: string | null; // Creator/uploader email
  notes?: string | null; // Text (0-2000 chars)
  updated_at?: string;
  
  // Related data
  ai_model_version?: {
    id: number;
    version: string;
    ai_model?: {
      id: number;
      name: string;
    };
  };
}

export interface CreateAiModelArtifactData {
  version_id: number | string; // Required, exists in ai_model_versions
  url: string; // Required, url, max:2048
  checksum: string; // Required, string, max:255
  size_bytes: number; // Required, integer, min:0
  artifact_type: ArtifactType | string; // Required, string, in ArtifactType enum
  notes?: string | null; // Nullable, string, max:1000
  created_by?: string | null; // Nullable, email, max:255
}

export interface PaginatedArtifactsResponse {
  current_page: number;
  data: AiModelArtifact[];
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}

