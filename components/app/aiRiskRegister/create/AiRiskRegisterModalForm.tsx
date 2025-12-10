"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import AiRiskRegisterForm from "./AiRiskRegisterForm";
import { useCreateAiRiskRegisterMutation } from "@/app/lib/features/aiRiskRegisterApi";
import {
  CreateAiRiskRegisterData,
  UpdateAiRiskRegisterData,
} from "@/interfaces/AiRiskRegister";

/**
 * Inline-create adapter for AI Risk Register to work with SelectWithInlineCreate.
 * Renders the full multi-step form inside the modal and surfaces the created item
 * back to the parent select on success.
 */
const AiRiskRegisterModalForm: React.FC<{
  onSuccess: (item: any) => void;
  onCancel: () => void;
}> = ({ onSuccess, onCancel }) => {
  const [createRisk, { isLoading }] = useCreateAiRiskRegisterMutation();
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (
    payload: CreateAiRiskRegisterData | UpdateAiRiskRegisterData
  ) => {
    setServerErrors({});
    try {
      const result = await createRisk(payload as CreateAiRiskRegisterData).unwrap();
      onSuccess((result as any)?.data ?? result);
    } catch (err: any) {
      if (err?.data?.errors) {
        setServerErrors(err.data.errors);
      }
      // Surface error to keep the wizard state intact
      throw err;
    }
  };

  return (
    <div className="space-y-4">
      {Object.keys(serverErrors).length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-semibold mb-2">Please fix the following errors:</p>
            <ul className="list-disc list-inside space-y-1">
              {Object.entries(serverErrors).map(([field, errors]) => (
                <li key={field}>
                  {field}: {errors[0]}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <AiRiskRegisterForm
        onSubmit={handleSubmit}
        isSubmitting={isLoading}
        serverErrors={serverErrors}
      />

      <div className="flex justify-end">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default AiRiskRegisterModalForm;


