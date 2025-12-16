import {
  AiRiskRegister,
  RiskCategory,
  RiskDecision,
  RiskLevel,
  RiskStatus,
  ReviewCadence,
} from "@/interfaces/AiRiskRegister";
import { formatDateForInput } from "@/lib/helpers/date";

export type FormState = {
  title: string;
  risk_category: RiskCategory;
  ai_model_id: string;
  ai_model_version_id: string;
  use_case_id: string;
  description: string;
  related_controls: string;
  risk_methodology_id: string;
  likelihood_code: string;
  impact_code: string;
  inherent_score: string;
  residual_score: string;
  risk_level: RiskLevel;
  decision: RiskDecision;
  risk_owner: string;
  review_cadence: ReviewCadence;
  next_review_due: string;
  status: RiskStatus;
  linked_assessment_id: string;
  linked_incident_id: string;
  linked_capa_id: string;
  evidence_link: string;
  likelihood_label_snapshot: string;
  impact_label_snapshot: string;
  method_name_snapshot: string;
  created_by: string;
  descriptionInput: string; // For controlled input with character count
};

export const getInitialState = (initial?: AiRiskRegister): FormState => ({
  title: initial?.title ?? "",
  risk_category: initial?.risk_category ?? RiskCategory.SAFETY,
  ai_model_id: initial?.ai_model_id?.toString() ?? "",
  ai_model_version_id: initial?.ai_model_version_id?.toString() ?? "",
  use_case_id: initial?.use_case_id?.toString() ?? "",
  description: initial?.description ?? "",
  descriptionInput: initial?.description ?? "",
  related_controls: initial?.related_controls?.join(", ") ?? "",
  risk_methodology_id: initial?.risk_methodology_id?.toString() ?? "",
  likelihood_code: initial?.likelihood_code ?? "",
  impact_code: initial?.impact_code ?? "",
  inherent_score: initial?.inherent_score ?? "",
  residual_score: initial?.residual_score ?? "",
  risk_level: initial?.risk_level ?? RiskLevel.MEDIUM,
  decision: initial?.decision ?? RiskDecision.TREAT,
  risk_owner: initial?.risk_owner?.toString() ?? "",
  review_cadence: initial?.review_cadence ?? ReviewCadence.QUARTERLY,
  next_review_due: formatDateForInput(initial?.next_review_due),
  status: initial?.status ?? RiskStatus.IDENTIFIED,
  linked_assessment_id: initial?.linked_assessment_id?.toString() ?? "",
  linked_incident_id: initial?.linked_incident_id?.toString() ?? "",
  linked_capa_id: initial?.linked_capa_id?.toString() ?? "",
  evidence_link: initial?.evidence_link ?? "",
  likelihood_label_snapshot: initial?.likelihood_label_snapshot ?? "",
  impact_label_snapshot: initial?.impact_label_snapshot ?? "",
  method_name_snapshot: initial?.method_name_snapshot ?? "",
  created_by: initial?.created_by ?? "",
});

