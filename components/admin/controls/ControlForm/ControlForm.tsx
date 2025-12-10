"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useControl, useControlMutations } from "@/hooks/admin/useControls";
import {
  ControlStatusEnum,
  ControlTestingFrequencyEnum,
  ControlTestingMethodEnum,
  CreateControlRequest,
  UpdateControlRequest,
} from "@/interfaces/Control";
import { createValidationErrors, validateDateRange, validateTextField } from "@/lib/utils/validation";
import FormErrorAlert from "@/components/admin/shared/FormErrorAlert";
import FormActions from "@/components/admin/shared/FormActions";

type ControlFormState = {
  name: string;
  reference: string;
  objective?: string;
  testing_method?: ControlTestingMethodEnum;
  testing_frequency?: ControlTestingFrequencyEnum;
  evidence_expectations?: string;
  applicability_criteria?: string;
  status?: ControlStatusEnum;
  last_test_date?: string;
  next_test_due?: string;
};

interface ControlFormProps {
  controlId?: string;
  mode?: "create" | "edit";
}

const testingMethodOptions = Object.values(ControlTestingMethodEnum).map((value) => ({
  value,
  label: value.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
}));

const testingFrequencyOptions = Object.values(ControlTestingFrequencyEnum).map((value) => ({
  value,
  label: value.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
}));

const statusOptions = Object.values(ControlStatusEnum).map((value) => ({
  value,
  label: value.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
}));

const ControlForm = ({ controlId, mode = "create" }: ControlFormProps) => {
  const router = useRouter();
  const { control, loading: controlLoading } = useControl(mode === "edit" ? controlId : undefined);
  const { createControl, updateControl, creating, updating } = useControlMutations();

  const [formData, setFormData] = useState<ControlFormState>({
    name: "",
    reference: "",
    objective: "",
    testing_method: undefined,
    testing_frequency: undefined,
    evidence_expectations: "",
    applicability_criteria: "",
    status: undefined,
    last_test_date: undefined,
    next_test_due: undefined,
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (mode === "edit" && control) {
      setFormData({
        name: control.name || "",
        reference: control.reference || "",
        objective: control.objective || "",
        testing_method: control.testing_method,
        testing_frequency: control.testing_frequency,
        evidence_expectations: control.evidence_expectations || "",
        applicability_criteria: control.applicability_criteria || "",
        status: control.status,
        last_test_date: control.last_test_date ? control.last_test_date.split("T")[0] : undefined,
        next_test_due: control.next_test_due ? control.next_test_due.split("T")[0] : undefined,
      });
    }
  }, [mode, control]);

  const combinedErrors = useMemo(
    () => ({ ...validationErrors, ...(serverErrors || {}) }),
    [validationErrors, serverErrors]
  );

  const handleInputChange = <K extends keyof ControlFormState>(field: K, value: ControlFormState[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    const fieldErrors: Record<string, string[]> = {
      name: validateTextField(formData.name, {
        required: true,
        maxLength: 255,
        messages: { required: "Name is required", maxLength: "Name must be at most 255 characters" },
      }),
      reference: validateTextField(formData.reference, {
        required: true,
        maxLength: 255,
        messages: { required: "Reference is required", maxLength: "Reference must be at most 255 characters" },
      }),
      testing_method: validateTextField(formData.testing_method, {
        required: true,
        messages: { required: "Testing method is required" },
      }),
      testing_frequency: validateTextField(formData.testing_frequency, {
        required: true,
        messages: { required: "Testing frequency is required" },
      }),
      status: validateTextField(formData.status, {
        required: true,
        messages: { required: "Status is required" },
      }),
      last_test_date: validateDateRange(formData.last_test_date, formData.next_test_due, {
        messages: { invalidRange: "Next test due must be after or equal to last test date" },
      }),
      next_test_due: validateDateRange(formData.last_test_date, formData.next_test_due, {
        messages: { invalidRange: "Next test due must be after or equal to last test date" },
      }),
    };

    const errors = createValidationErrors(fieldErrors);
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
    setServerErrors({});

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const payload: CreateControlRequest = {
      name: formData.name,
      reference: formData.reference,
      objective: formData.objective,
      testing_method: formData.testing_method as ControlTestingMethodEnum,
      testing_frequency: formData.testing_frequency as ControlTestingFrequencyEnum,
      evidence_expectations: formData.evidence_expectations,
      applicability_criteria: formData.applicability_criteria,
      status: formData.status as ControlStatusEnum,
      last_test_date: formData.last_test_date || undefined,
      next_test_due: formData.next_test_due || undefined,
    };

    try {
      if (mode === "create") {
        await createControl(payload);
      } else if (mode === "edit" && controlId) {
        await updateControl(controlId, payload as UpdateControlRequest);
      }
    } catch (err: any) {
      if (err?.data?.errors) {
        setServerErrors(err.data.errors);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const isLoading = creating || updating || (mode === "edit" && controlLoading);

  const handleCancel = () => router.push("/admin/compliance-library/controls");

  return (
    <Card className="w-full shadow-none p-6">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <FormErrorAlert errors={combinedErrors} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-900">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Control name"
              className={`mt-1 ${combinedErrors.name ? "border-red-500" : ""}`}
              disabled={isLoading}
            />
            {combinedErrors.name && <p className="text-sm text-red-500 mt-1">{combinedErrors.name[0]}</p>}
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-900">
              Reference <span className="text-red-500">*</span>
            </Label>
            <Input
              value={formData.reference}
              onChange={(e) => handleInputChange("reference", e.target.value)}
              placeholder="Unique reference"
              className={`mt-1 ${combinedErrors.reference ? "border-red-500" : ""}`}
              disabled={isLoading}
            />
            {combinedErrors.reference && <p className="text-sm text-red-500 mt-1">{combinedErrors.reference[0]}</p>}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-900">Objective</Label>
          <Textarea
            value={formData.objective || ""}
            onChange={(e) => handleInputChange("objective", e.target.value)}
            placeholder="Control objective"
            disabled={isLoading}
            className="mt-1 min-h-32 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-900">
              Testing Method <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.testing_method}
              onValueChange={(value) => handleInputChange("testing_method", value as ControlTestingMethodEnum)}
              disabled={isLoading}
            >
              <SelectTrigger className={`mt-1 w-full ${combinedErrors.testing_method ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                {testingMethodOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {combinedErrors.testing_method && (
              <p className="text-sm text-red-500 mt-1">{combinedErrors.testing_method[0]}</p>
            )}
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-900">
              Testing Frequency <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.testing_frequency}
              onValueChange={(value) =>
                handleInputChange("testing_frequency", value as ControlTestingFrequencyEnum)
              }
              disabled={isLoading}
            >
              <SelectTrigger className={`mt-1 w-full ${combinedErrors.testing_frequency ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                {testingFrequencyOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {combinedErrors.testing_frequency && (
              <p className="text-sm text-red-500 mt-1">{combinedErrors.testing_frequency[0]}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-900">Evidence Expectations</Label>
            <Textarea
              value={formData.evidence_expectations || ""}
              onChange={(e) => handleInputChange("evidence_expectations", e.target.value)}
              placeholder="Describe expected evidence"
              disabled={isLoading}
              className="min-h-32 mt-1 resize-none"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-900">Applicability Criteria</Label>
            <Textarea
              value={formData.applicability_criteria || ""}
              onChange={(e) => handleInputChange("applicability_criteria", e.target.value)}
              placeholder="Define applicability criteria"
              disabled={isLoading}
              className="min-h-32 mt-1 resize-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-900">
              Status <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange("status", value as ControlStatusEnum)}
              disabled={isLoading}
            >
              <SelectTrigger className={`mt-1 w-full ${combinedErrors.status ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {combinedErrors.status && <p className="text-sm text-red-500 mt-1">{combinedErrors.status[0]}</p>}
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-900">Last Test Date</Label>
            <Input
              type="date"
              value={formData.last_test_date || ""}
              onChange={(e) => handleInputChange("last_test_date", e.target.value)}
              className={`mt-1 ${combinedErrors.last_test_date ? "border-red-500" : ""}`}
              disabled={isLoading}
            />
            {combinedErrors.last_test_date && (
              <p className="text-sm text-red-500 mt-1">{combinedErrors.last_test_date[0]}</p>
            )}
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-900">Next Test Due</Label>
            <Input
              type="date"
              value={formData.next_test_due || ""}
              onChange={(e) => handleInputChange("next_test_due", e.target.value)}
              className={`mt-1 ${combinedErrors.next_test_due ? "border-red-500" : ""}`}
              disabled={isLoading}
            />
            {combinedErrors.next_test_due && (
              <p className="text-sm text-red-500 mt-1">{combinedErrors.next_test_due[0]}</p>
            )}
          </div>
        </div>

        <FormActions
          isLoading={isLoading}
          isEditing={mode === "edit"}
          onCancel={handleCancel}
          submitLabel={isLoading ? (mode === "create" ? "Creating..." : "Updating...") : undefined}
          submitClassName="bg-primary text-white px-6 py-2 rounded-lg"
          cancelClassName="px-6 py-2 rounded-lg"
        />
      </form>
    </Card>
  );
};

export default ControlForm;