"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BasicInfo from "./BasicInfo";
import Roi from "./Roi";
import UseCaseClassification from "./UseCaseClassification";
import GovernanceRisk from "./GovernanceRisk";
import DataAssesment from "./DataAssesment";
import { useUseCases } from "@/hooks/app/useUseCases";

export interface FormDataType {
  title: string;
  description: string | null;
  status:
  | "draft"
  | "under_review"
  | "approved"
  | "in_development"
  | "testing"
  | "staging"
  | "active"
  | "suspended"
  | "deprecated";
  business_domain: string;
  business_objective: string;
  business_owner_email: string;
  technical_owner_email: string;
  regulatory_scope: string[];
  data_sensitivity: "public" | "internal" | "confidential" | "restricted";
  go_live_date: string | null;

  expected_roi: number | null;
  implementation_cost: number | null;
  reduction_in_time: number | null;
  reduction_in_cost: number | null;
  increase_in_revenue: number | null;
  risk_avoidance: number | null;
  fte_capacity_saved: number | null;

  use_case_type: string;
  value_driver: string;

  overall_risk_score: number | null;
  risk_level: "low" | "medium" | "high" | "critical";
  human_oversight_mode: string;
  dpia: boolean;
  aia: boolean;

  data_availability_status: string;
  data_readiness_level: string;
  data_freshness: string;
}

const initialFormData: FormDataType = {
  title: "",
  description: null,
  status: "draft",
  business_domain: "",
  business_objective: "",
  business_owner_email: "",
  technical_owner_email: "",
  regulatory_scope: [],
  data_sensitivity: "public",
  go_live_date: null,

  expected_roi: null,
  implementation_cost: null,
  reduction_in_time: null,
  reduction_in_cost: null,
  increase_in_revenue: null,
  risk_avoidance: null,
  fte_capacity_saved: null,

  use_case_type: "",
  value_driver: "",

  overall_risk_score: null,
  risk_level: "medium",
  human_oversight_mode: "",
  dpia: false,
  aia: false,

  data_availability_status: "",
  data_readiness_level: "",
  data_freshness: "",
};

const CraeteUseCases: React.FC = () => {
  const [formData, setFormData] = useState<FormDataType>(initialFormData);
  const { createUseCase, loading } = useUseCases();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (
        formData.title &&
        formData.status &&
        formData.business_domain &&
        formData.data_sensitivity
      ) {
        const payload = {
          ...formData,
          regulatory_scope: formData.regulatory_scope
            .map((x) => x.trim())
            .filter((x) => x !== ""),
        };

        const response = await createUseCase(payload);
        if (response) {
          setFormData(initialFormData);
        }
      }
    } catch (err) {
      // Error is already handled in Redux slice with toast notification
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <form onSubmit={handleSave}>
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <div className="flex flex-col sm:flex-row items-start gap-3  justify-start sm:justify-between">
            <div>
              <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">
                New use case
              </h1>
              <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">
                Fill all the details below of your AI Model Use Case
              </p>
            </div>
            <Button
              type="submit"
              className="flex  gap-2 px-4 py-6 rounded-full border bg-[#4FD58F] opacity-100"
              disabled={!!loading}
            >
              {loading ? "Saving..." : "Save new use case"}
            </Button>
          </div>

          <CardContent className="space-y-10 w-full">
            <BasicInfo formData={formData} setFormData={setFormData} />
            <Roi formData={formData} setFormData={setFormData} />
            <UseCaseClassification formData={formData} setFormData={setFormData} />
            <GovernanceRisk formData={formData} setFormData={setFormData} />
            <DataAssesment formData={formData} setFormData={setFormData} />
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default CraeteUseCases;
