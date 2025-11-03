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
  model_overview?: string | null;
  organizational_context: string[] | null;
  intended_use: string | null;
  training_data_overview: string | null;
  bias_evaluation_methods: string | null;
  model_limitations: string | null;
  ethical_considerations: string | null;
  risk_summary: string | null;
  performance_summary: string | null;
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
