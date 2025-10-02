"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BasicInfo from "./BasicInfo";
import Roi from "./Roi";
import UseCaseClassification from "./UseCaseClassification";
import GovernanceRisk from "./GovernanceRisk";
import DataAssesment from "./DataAssesment";

export interface FormDataType {
  title: string;
  status: string;
  description: string;
  businessObjective: string;
  businessDomain: string;
  businessOwnerEmail: string;
  technicalOwnerEmail: string;
  regulatoryScope: string;
  dataSensitivity: string;
  targetDate: string;

  // ROI
  expectedRoi: string;
  implementationCost: string;
  reductionTime: string;
  reductionCost: string;
  increaseRevenue: string;
  riskAvoidance: string;
  fteCapacity: string;

  // Use Case Classification
  useCaseType: string;
  valueDriver: string;

  // Governance Risk
  overallRiskScore: string;
  riskLevel: string;
  humanOversight: string;
  dpiaRequired: boolean;
  aiaRequired: boolean;

  // Data Assessment
  dataAvailability: string;
  dataReadiness: string;
  dataFreshness: string;
}


const initialFormData: FormDataType = {

  title: "",
  status: "",
  description: "",
  businessObjective: "",
  businessDomain: "",
  businessOwnerEmail: "",
  technicalOwnerEmail: "",
  regulatoryScope: "",
  dataSensitivity: "",
  targetDate: "",

  expectedRoi: "",
  implementationCost: "",
  reductionTime: "",
  reductionCost: "",
  increaseRevenue: "",
  riskAvoidance: "",
  fteCapacity: "",

  useCaseType: "",
  valueDriver: "",

  overallRiskScore: "",
  riskLevel: "",
  humanOversight: "",
  dpiaRequired: false,
  aiaRequired: false,

  dataAvailability: "",
  dataReadiness: "",
  dataFreshness: "",
};

const CraeteUseCases: React.FC = () => {
  const [formData, setFormData] = useState<FormDataType>(initialFormData);

  const handleSave = () => {
    console.log("Form Data:", formData);
    alert("Form data saved! (check console)");
    setFormData(initialFormData);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">
              New use case
            </h1>
            <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">
              Fill all the details below of your AI Model Use Case
            </p>
          </div>
          <Button
            onClick={handleSave}
            className="flex items-center justify-center gap-2 px-4 py-6 rounded-full border bg-[#4FD58F] opacity-100"
          >
            Save new use case
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
    </div>
  );
};

export default CraeteUseCases;
