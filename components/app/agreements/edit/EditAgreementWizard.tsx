"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { MultiStepWizard } from "@/components/app/useCases/create/MultiStepWizard";
import { agreementSchema, type AgreementFormData } from "@/lib/schemas/agreement.schema";
import {
  useGetAgreementQuery,
  useUpdateAgreementMutation,
  CreateAgreementData,
  AgreementType,
  AgreementStatus,
  RenewalType,
  GoverningLaw,
  TrainingOptOut,
  AuditRights,
  TransferMechanism,
  SubProcessingRights,
  Indemnification,
  DisputeResolution,
  ConfidentialityTerm,
  ParentAgreement,
  ReplacesAgreement,
} from "@/app/lib/features/agreementsApi";
import { BasicInformationStep } from "../create/steps/BasicInformationStep";
import { AgreementCoversStep } from "../create/steps/AgreementCoversStep";
import { RenewalTerminationStep } from "../create/steps/RenewalTerminationStep";
import { DataProtectionStep } from "../create/steps/DataProtectionStep";
import { FinancialLegalStep } from "../create/steps/FinancialLegalStep";
import { AdvancedOptionsStep } from "../create/steps/AdvancedOptionsStep";
import { AGREEMENT_WIZARD_STEPS } from "../constants";

interface EditAgreementWizardProps {
  agreementId: number;
}

const EditAgreementWizard: React.FC<EditAgreementWizardProps> = ({ agreementId }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const { data: agreement, isLoading: isLoadingAgreement } = useGetAgreementQuery(agreementId);
  const [updateAgreement, { isLoading }] = useUpdateAgreementMutation();

  const methods = useForm<AgreementFormData>({
    resolver: zodResolver(agreementSchema) as any,
    mode: "onChange",
  });

  const {
    handleSubmit,
    trigger,
    reset,
    formState: { errors },
  } = methods;

  // Populate form with existing data
  useEffect(() => {
    if (agreement) {
      reset({
        vendor_id: agreement.vendor_id,
        agreement_type: agreement.agreement_type as any,
        status: agreement.status as any,
        agreement_owner_id: agreement.agreement_owner_id,
        asset_types_covered: agreement.asset_types_covered || [],
        renewal_type: agreement.renewal_type as any,
        notice_period_days: agreement.notice_period_days || null,
        termination_for_convenience: agreement.termination_for_convenience || null,
        governing_law: agreement.governing_law as any,
        effective_from: agreement.effective_from,
        effective_to: agreement.effective_to,
        training_opt_out: agreement.training_opt_out as any,
        audit_rights: agreement.audit_rights as any,
        transfer_mechanism: agreement.transfer_mechanism as any,
        sub_processing_rights: agreement.sub_processing_rights as any,
        contract_value: agreement.contract_value || null,
        liability_cap: agreement.liability_cap || null,
        insurance_requirements: agreement.insurance_requirements || null,
        indemnification: agreement.indemnification as any,
        internal_reference_number: agreement.internal_reference_number || null,
        vendor_contract_id: agreement.vendor_contract_id || null,
        dispute_resolution: agreement.dispute_resolution as any,
        confidentiality_term: agreement.confidentiality_term as any,
        parent_agreement: agreement.parent_agreement as any,
        replaces_agreement: agreement.replaces_agreement as any,
        notes: agreement.notes || null,
        doc_ref: agreement.doc_ref,
      });
    }
  }, [agreement, reset]);

  const validateStep = async (step: number): Promise<boolean> => {
    switch (step) {
      case 1:
        return await trigger([
          "vendor_id",
          "agreement_type",
          "status",
          "agreement_owner_id",
          "effective_from",
          "effective_to",
          "doc_ref",
        ]);
      case 2:
        return await trigger(["asset_types_covered"]);
      case 3:
        return true; // All fields are optional in this step
      case 4:
        return true; // All fields are optional in this step
      case 5:
        return true; // All fields are optional in this step
      case 6:
        return true; // All fields are optional in this step
      default:
        return true;
    }
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, AGREEMENT_WIZARD_STEPS.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFormSubmit = handleSubmit(async (data: AgreementFormData) => {
    try {
      // Convert AgreementFormData to CreateAgreementData
      const updateData: Partial<CreateAgreementData> = {
        vendor_id: data.vendor_id,
        agreement_type: data.agreement_type as AgreementType,
        status: data.status as AgreementStatus,
        agreement_owner_id: data.agreement_owner_id,
        asset_types_covered: data.asset_types_covered,
        renewal_type: data.renewal_type ? (data.renewal_type as RenewalType) : null,
        notice_period_days: data.notice_period_days || null,
        termination_for_convenience: data.termination_for_convenience || null,
        governing_law: data.governing_law ? (data.governing_law as GoverningLaw) : null,
        effective_from: data.effective_from,
        effective_to: data.effective_to,
        training_opt_out: data.training_opt_out as TrainingOptOut | null,
        audit_rights: data.audit_rights as AuditRights | null,
        transfer_mechanism: data.transfer_mechanism as TransferMechanism | null,
        sub_processing_rights: data.sub_processing_rights as SubProcessingRights | null,
        contract_value: data.contract_value || null,
        liability_cap: data.liability_cap || null,
        insurance_requirements: data.insurance_requirements || null,
        indemnification: data.indemnification as Indemnification | null,
        internal_reference_number: data.internal_reference_number || null,
        vendor_contract_id: data.vendor_contract_id || null,
        dispute_resolution: data.dispute_resolution as DisputeResolution | null,
        confidentiality_term: data.confidentiality_term as ConfidentialityTerm | null,
        parent_agreement: data.parent_agreement as ParentAgreement | null,
        replaces_agreement: data.replaces_agreement as ReplacesAgreement | null,
        notes: data.notes || null,
        doc_ref: data.doc_ref,
      };
      await updateAgreement({
        id: agreementId,
        data: updateData,
      }).unwrap();
      router.push("/core-assets/agreements");
    } catch (error: any) {
      console.error("Failed to update agreement:", error);
    }
  });

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInformationStep />;
      case 2:
        return <AgreementCoversStep />;
      case 3:
        return <RenewalTerminationStep />;
      case 4:
        return <DataProtectionStep />;
      case 5:
        return <FinancialLegalStep />;
      case 6:
        return <AdvancedOptionsStep />;
      default:
        return null;
    }
  };

  if (isLoadingAgreement) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="flex items-center justify-center py-20">
            <p className="text-[#667085]">Loading agreement details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!agreement) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="text-[#667085]">Agreement not found</p>
            <button
              type="button"
              onClick={() => router.push("/core-assets/agreements")}
              className="bg-[#4FD58F] text-white px-4 py-2 rounded"
            >
              Back to Agreements
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <div className="mb-6">
          <h1 className="font-sans font-semibold text-2xl tracking-normal text-[#1D2939]">
            Edit Agreement
          </h1>
          <p className="font-sans font-normal text-sm tracking-normal text-[#667085] mt-1">
            Complete all steps to update your agreement
          </p>
        </div>

        <CardContent className="space-y-8 w-full p-0">
          {/* Show validation errors */}
          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <p className="font-semibold mb-2">Please fix the following errors:</p>
                <ul className="list-disc list-inside space-y-1">
                  {Object.entries(errors).map(([field, error]) => {
                    const errorMessage = error?.message as string;
                    if (!errorMessage) return null;
                    return (
                      <li key={field}>
                        <span className="font-medium capitalize">
                          {field.replace(/_/g, " ")}:
                        </span>{" "}
                        {errorMessage}
                      </li>
                    );
                  })}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <FormProvider {...methods}>
            <MultiStepWizard
              currentStep={currentStep}
              steps={AGREEMENT_WIZARD_STEPS}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
              canProceed={true}
              submitLabel="Update Agreement"
            >
              {renderStepContent()}
            </MultiStepWizard>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditAgreementWizard;

