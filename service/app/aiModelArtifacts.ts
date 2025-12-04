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
    version_number: string;
    ai_model?: {
      id: number;
      name: string;
      version_number: string;
    };
  };
}

export interface CreateAiModelArtifactData {
  ai_model_version_id: number | string; // Required, exists in ai_model_versions
  name: string; // Required, string, max:255
  uri?: string | null; // Nullable, url, max:2048, required_without:file
  file?: File | null; // Nullable, file, max:26214400, required_without:uri
  checksum_algorithm?: string | null; // Nullable enum
  // checksum_value?: string | null; // Backend calculates this automatically - not sent from frontend
  environment?: string | null; // Nullable enum
  file_format?: string | null; // Nullable enum
  size_bytes?: number | null; // Nullable, integer, min:1
  artifact_type: ArtifactType | string; // Required, string, max:255
  notes?: string | null; // Nullable, string, max:1000
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
