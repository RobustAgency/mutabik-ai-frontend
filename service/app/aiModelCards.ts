export interface AiModelCard {
  id: number;
  version_id: string | number;
  // Optional fields to align with governance schema
  card_id?: string;
  title: string;
  creator_role: string;
  format: string;
  status: string;
  publication_status: string;
  owner_stakeholder_id: string | number;
  model_overview: string;
  organizational_context?: string[] | null;
  intended_use: string;
  training_data_overview: string;
  bias_evaluation_methods: string;
  model_limitations: string;
  ethical_considerations: string;
  risk_summary: string;
  performance_summary: string;
  publication_date?: string | null;
  last_review_date?: string | null;
  next_review_date?: string | null;
  created_at?: string;
  updated_at?: string;
  created_by: string;
  updated_by?: string | null;
}

export type CreateAiModelCardData = Omit<
  AiModelCard,
  "id" | "created_at" | "updated_at"
>;
