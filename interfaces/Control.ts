import { Framework } from "./Framework";
import { Requirement } from "./Requirement";
import { Tag } from "./Tag";
import { PaginatedResponse } from "./Pagination";

export enum ControlStatusEnum {
  PROPOSED = "proposed",
  IMPLEMENTED = "implemented",
  DEPRECATED = "deprecated",
}

export enum ControlTestingMethodEnum {
  DESIGN = "design",
  OPERATING = "operating",
  BOTH = "both",
}

export enum ControlTestingFrequencyEnum {
  RELEASE = "release",
  MONTHLY = "monthly",
  QUARTERLY = "quarterly",
  ANNUALLY = "annually",
  EVENT_DRIVEN = "event-driven",
}

export interface Control {
  id: number;
  name: string;
  code?: string;
  reference: string;
  objective?: string | null;
  question?: string | null;
  summary?: string | null;
  description?: string | null;
  testing_method: ControlTestingMethodEnum;
  testing_frequency: ControlTestingFrequencyEnum;
  evidence_expectations?: string | null;
  applicability_criteria?: string | null;
  status: ControlStatusEnum;
  last_test_date?: string | null;
  next_test_due?: string | null;
  user_id?: number;
  created_at: string;
  updated_at: string;
  frameworks?: Framework[];
  requirements?: Requirement[];
  tags?: Tag[];
  frameworks_count?: number;
  requirements_count?: number;
}

export interface ControlFilters extends Record<string, unknown> {
  search?: string;
  status?: ControlStatusEnum;
  testing_method?: ControlTestingMethodEnum;
  testing_frequency?: ControlTestingFrequencyEnum;
  page?: number;
  per_page?: number;
}

export interface CreateControlRequest {
  name: string;
  reference: string;
  objective?: string;
  testing_method: ControlTestingMethodEnum;
  testing_frequency: ControlTestingFrequencyEnum;
  evidence_expectations?: string;
  applicability_criteria?: string;
  status: ControlStatusEnum;
  last_test_date?: string;
  next_test_due?: string;
}

export interface UpdateControlRequest extends Partial<CreateControlRequest> {}

export type ControlListMeta = {
  current_page: number;
  per_page: number;
  total: number;
  last_page?: number;
};

export type ControlListResponse = {
  error?: boolean;
  message?: string;
  data?: {
    data?: Control[];
    meta?: ControlListMeta;
    current_page?: number;
    per_page?: number;
    total?: number;
    last_page?: number;
  };
};

export type ControlSingleResponse = {
  error?: boolean;
  message?: string;
  data?: Control;
};
