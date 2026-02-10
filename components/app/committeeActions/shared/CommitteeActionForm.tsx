"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { CreateCommitteeActionData } from "@/interfaces/CommitteeAction";
import type { CommitteeAction } from "@/interfaces/CommitteeAction";
import {
  committeeActionSchema,
  type CommitteeActionFormData,
} from "@/lib/schemas/committeeAction.schema";
import { ActionType, Status, VerificationResult } from "@/interfaces/CommitteeAction";
import {
  CommitteeDecisionField,
  TitleField,
  ActionTypeField,
  AssigneeField,
  DueDateField,
  StatusField,
  VerificationResultField,
  EvidenceLinkField,
  NotesField,
  ClosedAtField,
} from "./fields";

const initialFormData: CommitteeActionFormData = {
  committee_decision_id: 0,
  title: "",
  action_type: ActionType.IMPLEMENT_CHANGE,
  assignee_id: 0,
  due_date: "",
  status: Status.NEW,
  verification_result: VerificationResult.PENDING,
  evidence_link: null,
  notes: null,
  closed_at: null,
};

interface CommitteeActionFormProps {
  mode: "create" | "edit";
  initialData?: CommitteeAction;
  isLoading?: boolean;
  onSubmit: (
    data: CreateCommitteeActionData | Partial<CreateCommitteeActionData>
  ) => Promise<void>;
  onSuccess?: () => void;
  title: string;
  description: string;
  hideHeader?: boolean;
}

export const CommitteeActionForm: React.FC<CommitteeActionFormProps> = ({
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

  const methods = useForm<CommitteeActionFormData>({
    resolver: zodResolver(committeeActionSchema) as any,
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
      const dueDate = initialData.due_date
        ? new Date(initialData.due_date).toISOString().split("T")[0]
        : "";
      const closedAt = initialData.closed_at
        ? new Date(initialData.closed_at).toISOString().split("T")[0]
        : null;

      reset({
        committee_decision_id: initialData.committee_decision_id,
        title: initialData.title,
        action_type: initialData.action_type,
        assignee_id: initialData.assignee_id,
        due_date: dueDate,
        status: initialData.status,
        verification_result: initialData.verification_result,
        evidence_link: initialData.evidence_link || null,
        notes: initialData.notes || null,
        closed_at: closedAt,
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

  const handleFormSubmit = handleSubmit(async (data: CommitteeActionFormData) => {
    setSubmitError(null);
    try {
      // Convert dates to ISO string format
      const dueDateISO = data.due_date
        ? new Date(data.due_date).toISOString()
        : "";
      const closedAtISO = data.closed_at
        ? new Date(data.closed_at).toISOString()
        : null;

      const submitData: CreateCommitteeActionData = {
        ...data,
        due_date: dueDateISO,
        closed_at: closedAtISO,
        evidence_link: data.evidence_link || null,
        notes: data.notes || null,
      };

      await onSubmit(submitData);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      const errorMessage =
        error?.error?.data?.message || "Failed to save Committee Action";
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
              {/* Committee Decision and Title in one row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CommitteeDecisionField />
                <TitleField />
              </div>

              {/* Action Type and Assignee in one row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ActionTypeField />
                <AssigneeField />
              </div>

              {/* Due Date and Status in one row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DueDateField />
                <StatusField />
              </div>

              {/* Verification Result and Evidence Link in one row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <VerificationResultField />
                <EvidenceLinkField />
              </div>

              {/* Notes full width */}
              <NotesField />

              {/* Closed At */}
              <ClosedAtField />
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
                  ? "Create Action"
                  : "Update Action"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </FormProvider>
  );
};

