"use client";

import {
  AiRiskTreatment,
  ResultVerification,
  TreatmentStatus,
  TreatmentType,
} from "@/interfaces/AiRiskTreatment";
import { formatDateForInput } from "@/lib/helpers/date";

export type FormState = {
  ai_risk_register_id: string;
  treatment_type: TreatmentType;
  plan_summary: string;
  owner_stakeholder_id: string;
  assignee: string;
  due_date: string;
  status: TreatmentStatus;
  expected_residual_level: string;
  result_verification: ResultVerification | "";
  evidence_link: string;
  linked_capa_id: string;
  closed_at: string;
};

export const getInitialState = (initial?: AiRiskTreatment): FormState => ({
  ai_risk_register_id: initial?.ai_risk_register_id?.toString() ?? "",
  treatment_type: initial?.treatment_type ?? TreatmentType.CORRECTIVE,
  plan_summary: initial?.plan_summary ?? "",
  owner_stakeholder_id: initial?.owner_stakeholder_id?.toString() ?? "",
  assignee: initial?.assignee?.join(", ") ?? "",
  due_date: formatDateForInput(initial?.due_date),
  status: initial?.status ?? TreatmentStatus.NEW,
  expected_residual_level: initial?.expected_residual_level ?? "",
  result_verification: initial?.result_verification ?? "",
  evidence_link: initial?.evidence_link ?? "",
  linked_capa_id: initial?.linked_capa_id?.toString() ?? "",
  closed_at: formatDateForInput(initial?.closed_at),
});


