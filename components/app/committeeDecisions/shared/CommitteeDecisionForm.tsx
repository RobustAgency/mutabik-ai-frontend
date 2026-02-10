"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { CreateCommitteeDecisionData } from "@/interfaces/CommitteeDecision";
import type { CommitteeDecision } from "@/interfaces/CommitteeDecision";
import {
  committeeDecisionSchema,
  type CommitteeDecisionFormData,
} from "@/lib/schemas/committeeDecision.schema";
import {
  DecisionType,
  DecisionScope,
  VoteMethod,
  VoteResult,
} from "@/interfaces/CommitteeDecision";
import {
  CommitteeMeetingField,
  DecisionTypeField,
  DecisionScopeField,
  AiModelField,
  UseCaseField,
  ControlField,
  RelatedRefField,
  RationaleField,
  ConditionsField,
  ExpiryDateField,
  VoteMethodField,
  VoteResultField,
  OwnerTeamField,
} from "./fields";

const initialFormData: CommitteeDecisionFormData = {
  committee_meeting_id: 0,
  decision_type: DecisionType.APPROVE,
  decision_scope: DecisionScope.MODEL,
  ai_model_id: null,
  use_case_id: null,
  control_id: null,
  related_ref: null,
  rationale: "",
  conditions: null,
  expiry_date: null,
  vote_method: VoteMethod.SIMPLE_MAJORITY,
  vote_result: VoteResult.PASSED,
  owner_team: "",
};

interface CommitteeDecisionFormProps {
  mode: "create" | "edit";
  initialData?: CommitteeDecision;
  isLoading?: boolean;
  onSubmit: (
    data: CreateCommitteeDecisionData | Partial<CreateCommitteeDecisionData>
  ) => Promise<void>;
  onSuccess?: () => void;
  title: string;
  description: string;
  hideHeader?: boolean;
}

export const CommitteeDecisionForm: React.FC<CommitteeDecisionFormProps> = ({
  mode,
  initialData,
  isLoading = false,
  onSubmit,
  onSuccess,
  title,
  description,
  hideHeader = false,
}) => {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const methods = useForm<CommitteeDecisionFormData>({
    resolver: zodResolver(committeeDecisionSchema) as any,
    defaultValues: initialFormData,
    mode: "onChange",
  });

  const {
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = methods;

  useEffect(() => {
    if (mode === "edit" && initialData) {
      const expiryDate = initialData.expiry_date
        ? new Date(initialData.expiry_date).toISOString().split("T")[0]
        : null;

      reset({
        committee_meeting_id: initialData.committee_meeting_id,
        decision_type: initialData.decision_type,
        decision_scope: initialData.decision_scope,
        ai_model_id: initialData.ai_model_id,
        use_case_id: initialData.use_case_id,
        control_id: initialData.control_id,
        related_ref: initialData.related_ref || null,
        rationale: initialData.rationale,
        conditions: initialData.conditions || null,
        expiry_date: expiryDate,
        vote_method: initialData.vote_method,
        vote_result: initialData.vote_result,
        owner_team: initialData.owner_team,
      });
    }
  }, [mode, initialData, reset]);

  // Collect all validation errors
  const validationErrors = useMemo(() => {
    const errorObj: Record<string, string[]> = {};
    Object.entries(errors).forEach(([key, error]) => {
      if (error?.message) {
        errorObj[key] = [error.message as string];
      }
    });
    return errorObj;
  }, [errors]);

  const handleFormSubmit = handleSubmit(async (data: CommitteeDecisionFormData) => {
    setSubmitError(null);
    try {
      // Convert expiry_date to ISO string format if provided
      const expiryDateISO = data.expiry_date
        ? new Date(data.expiry_date).toISOString()
        : null;

      const submitData: CreateCommitteeDecisionData = {
        ...data,
        expiry_date: expiryDateISO,
        related_ref: data.related_ref || null,
        conditions: data.conditions || null,
        ai_model_id: data.ai_model_id || null,
        use_case_id: data.use_case_id || null,
        control_id: data.control_id || null,
      };

      await onSubmit(submitData);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      const errorMessage =
        error?.error?.data?.message || "Failed to save Committee Decision";
      setSubmitError(errorMessage);
    }
  });

  return (
    <FormProvider {...methods}>
      <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white flex flex-col gap-4 mx-auto px-4 sm:px-6 py-4">
        {!hideHeader && (
          <CardContent className="flex flex-col gap-2 pb-4">
            <h2 className="font-sans font-medium text-lg leading-6 tracking-normal text-[#000000]">
              {title}
            </h2>
            <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
              {description}
            </p>
          </CardContent>
        )}

        <CardContent>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Show validation errors in alert */}
            {Object.keys(validationErrors).length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <p className="font-semibold mb-2">Please fix the following errors:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {Object.entries(validationErrors).map(([field, fieldErrors]) => (
                      <li key={field}>
                        <span className="font-medium capitalize">
                          {field.replace(/_/g, " ")}:
                        </span>{" "}
                        {fieldErrors[0]}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Show submit error if any */}
            {submitError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              {/* Committee Meeting and Decision Type in one row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CommitteeMeetingField />
                <DecisionTypeField />
              </div>

              {/* Decision Scope and Owner Team in one row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DecisionScopeField />
                <OwnerTeamField />
              </div>

              {/* AI Model, Use Case, and Control in one row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <AiModelField />
                <UseCaseField />
                <ControlField />
              </div>

              {/* Related Reference */}
              <RelatedRefField />

              {/* Rationale full width */}
              <RationaleField />

              {/* Vote Method and Vote Result in one row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <VoteMethodField />
                <VoteResultField />
              </div>

              {/* Conditions and Expiry Date in one row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ConditionsField />
                <ExpiryDateField />
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? mode === "create"
                    ? "Creating..."
                    : "Updating..."
                  : mode === "create"
                  ? "Create Decision"
                  : "Update Decision"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </FormProvider>
  );
};

