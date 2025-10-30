export interface AiModelCard {
  id: number;
  ai_model_id: string | number;
  ai_model_version_id: string | number;
  // Optional fields to align with governance schema
  card_id?: string;
  version_id?: string | number;
  title: string;
  version: string;
  creator_role: string;
  owner_email: string;
  access_level: string;
  format: string;
  status: string;
  workflow_stage: string;
  technical_review_status: string;
  ethics_review_status: string;
  compliance_review_status: string;
  publication_status: string;
  completeness_score: number;
  model_overview?: string | null;
  organizational_context: string | null;
  intended_use: string | null;
  training_data_overview: string | null;
  bias_evaluation_methods: string | null;
  model_limitations: string | null;
  ethical_considerations: string | null;
  risk_summary: string | null;
  performance_summary: string | null;
  latest_performance_date: string | null;
  publication_date: string | null;
  last_review_date: string | null;
  next_review_date: string | null;
  created_at?: string;
  updated_at?: string;
}

export type CreateAiModelCardData = Omit<
  AiModelCard,
  "id" | "created_at" | "updated_at"
>;
