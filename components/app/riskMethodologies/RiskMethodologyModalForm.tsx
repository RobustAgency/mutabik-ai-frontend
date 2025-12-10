"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useCreateRiskMethodologyMutation } from "@/app/lib/features/riskMethodologyApi";
import { CreateRiskMethodologyData } from "@/interfaces/RiskMethodology";
import {
  validateTextField,
  createValidationErrors,
} from "@/lib/utils/validation";

interface RiskMethodologyModalFormProps {
  onSuccess: (item: any) => void;
  onCancel: () => void;
}

const SCALE_OPTIONS = ["rare", "unlikely", "possible", "likely", "almost_certain"];
const IMPACT_SCALE_OPTIONS = ["insignificant", "minor", "moderate", "major", "severe"];

const RiskMethodologyModalForm: React.FC<RiskMethodologyModalFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [createMethodology, { isLoading }] = useCreateRiskMethodologyMutation();
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [formData, setFormData] = useState({
    name: "",
    likelihood_scale: "likely",
    impact_scale: "major",
    matrix_rule: "{\n  \"L_L\": \"Low\",\n  \"M_M\": \"Medium\",\n  \"H_H\": \"High\"\n}",
    acceptance_thresholds: "",
    aggregation_logic: "",
    review_policy: "",
    effective_from: "",
    effective_to: "",
    owner_team: "",
    source_created_at: "",
  });

  const parseJsonField = (value: string) => {
    try {
      return JSON.parse(value || "{}");
    } catch {
      return undefined;
    }
  };

  const validateForm = (): boolean => {
    const effectiveFromDate = formData.effective_from ? new Date(formData.effective_from) : null;
    const effectiveToDate = formData.effective_to ? new Date(formData.effective_to) : null;

    const fieldErrors: Record<string, string[]> = {
      name: validateTextField(formData.name, {
        required: true,
        messages: { required: "Name is required" },
      }),
      acceptance_thresholds: validateTextField(formData.acceptance_thresholds, {
        required: true,
        messages: { required: "Acceptance thresholds are required" },
      }),
      review_policy: validateTextField(formData.review_policy, {
        required: true,
        messages: { required: "Review policy is required" },
      }),
      owner_team: validateTextField(formData.owner_team, {
        required: true,
        messages: { required: "Owner team is required" },
      }),
      source_created_at: validateTextField(formData.source_created_at, {
        required: true,
        messages: { required: "Source created date is required" },
      }),
      matrix_rule: parseJsonField(formData.matrix_rule)
        ? []
        : ["Matrix rule must be valid JSON"],
    };

    if (effectiveFromDate && effectiveToDate && effectiveToDate < effectiveFromDate) {
      fieldErrors.effective_to = ["Effective to must be on or after effective from"];
    }

    const validationErrors = createValidationErrors(fieldErrors);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      const payload: CreateRiskMethodologyData = {
        name: formData.name.trim(),
        likelihood_scale: formData.likelihood_scale,
        impact_scale: formData.impact_scale,
        matrix_rule: parseJsonField(formData.matrix_rule)!,
        acceptance_thresholds: formData.acceptance_thresholds.trim(),
        aggregation_logic: formData.aggregation_logic.trim() || undefined,
        review_policy: formData.review_policy.trim(),
        effective_from: formData.effective_from.trim() || undefined,
        effective_to: formData.effective_to.trim() || undefined,
        owner_team: formData.owner_team.trim(),
        source_created_at: formData.source_created_at.trim(),
      };

      const result = await createMethodology(payload).unwrap();
      onSuccess(result);
    } catch (error: any) {
      if (error?.data?.errors) {
        setErrors(error.data.errors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {Object.keys(errors).length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-semibold mb-2">Please fix the following errors:</p>
            <ul className="list-disc list-inside space-y-1">
              {Object.entries(errors).map(([field, fieldErrors]) => (
                <li key={field}>
                  <span className="font-medium capitalize">{field.replace(/_/g, " ")}:</span> {fieldErrors[0]}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="rm-name">Name *</Label>
        <Input
          id="rm-name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="ISO 31010 Risk Matrix"
          className={`h-[44px] w-full px-4 rounded-lg border ${
            errors.name ? "border-red-500" : "border-[#D0D5DD]"
          } focus:border-[#D0D5DD] focus:-ring-0`}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name[0]}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rm-likelihood-scale">Likelihood Scale</Label>
          <Select
            value={formData.likelihood_scale}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, likelihood_scale: value }))}
          >
            <SelectTrigger className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD]">
              <SelectValue placeholder="Select likelihood scale" />
            </SelectTrigger>
            <SelectContent>
              {SCALE_OPTIONS.map((item) => (
                <SelectItem key={item} value={item}>
                  {item.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="rm-impact-scale">Impact Scale</Label>
          <Select
            value={formData.impact_scale}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, impact_scale: value }))}
          >
            <SelectTrigger className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD]">
              <SelectValue placeholder="Select impact scale" />
            </SelectTrigger>
            <SelectContent>
              {IMPACT_SCALE_OPTIONS.map((item) => (
                <SelectItem key={item} value={item}>
                  {item.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="rm-matrix-rule">Matrix Rule (JSON) *</Label>
        <Textarea
          id="rm-matrix-rule"
          value={formData.matrix_rule}
          onChange={(e) => setFormData((prev) => ({ ...prev, matrix_rule: e.target.value }))}
          rows={4}
          className={`font-mono text-sm ${
            errors.matrix_rule ? "border-red-500" : ""
          }`}
          placeholder='{\n  "L_L": "Low",\n  "M_M": "Medium",\n  "H_H": "High"\n}'
        />
        {errors.matrix_rule && <p className="text-sm text-red-500">{errors.matrix_rule[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="rm-acceptance">Acceptance Thresholds *</Label>
        <Input
          id="rm-acceptance"
          value={formData.acceptance_thresholds}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, acceptance_thresholds: e.target.value }))
          }
          placeholder="Medium"
          className={`h-[44px] w-full px-4 rounded-lg border ${
            errors.acceptance_thresholds ? "border-red-500" : "border-[#D0D5DD]"
          } focus:border-[#D0D5DD] focus:-ring-0`}
        />
        {errors.acceptance_thresholds && (
          <p className="text-sm text-red-500">{errors.acceptance_thresholds[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="rm-aggregation">Aggregation Logic</Label>
        <Input
          id="rm-aggregation"
          value={formData.aggregation_logic}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, aggregation_logic: e.target.value }))
          }
          placeholder="Maximum inherent risk across all identified risks"
          className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="rm-review-policy">Review Policy *</Label>
        <Textarea
          id="rm-review-policy"
          value={formData.review_policy}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, review_policy: e.target.value }))
          }
          placeholder="Annual review with ad-hoc updates"
          rows={3}
          className={`min-h-24 resize-none ${
            errors.review_policy ? "border-red-500" : ""
          }`}
        />
        {errors.review_policy && (
          <p className="text-sm text-red-500">{errors.review_policy[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rm-effective-from">Effective From</Label>
          <Input
            id="rm-effective-from"
            type="date"
            value={formData.effective_from}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, effective_from: e.target.value }))
            }
            className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rm-effective-to">Effective To</Label>
          <Input
            id="rm-effective-to"
            type="date"
            value={formData.effective_to}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, effective_to: e.target.value }))
            }
            className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rm-owner-team">Owner Team *</Label>
          <Input
            id="rm-owner-team"
            value={formData.owner_team}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, owner_team: e.target.value }))
            }
            placeholder="Risk Management"
            className={`h-[44px] w-full px-4 rounded-lg border ${
              errors.owner_team ? "border-red-500" : "border-[#D0D5DD]"
            } focus:border-[#D0D5DD] focus:-ring-0`}
          />
          {errors.owner_team && (
            <p className="text-sm text-red-500">{errors.owner_team[0]}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="rm-source-created-at">Source Created At *</Label>
        <Input
          id="rm-source-created-at"
          type="date"
          value={formData.source_created_at}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, source_created_at: e.target.value }))
          }
          className={`h-[44px] w-full px-4 rounded-lg border ${
            errors.source_created_at ? "border-red-500" : "border-[#D0D5DD]"
          } focus:border-[#D0D5DD] focus:-ring-0`}
        />
        {errors.source_created_at && (
          <p className="text-sm text-red-500">{errors.source_created_at[0]}</p>
        )}
      </div>

      <div className="flex gap-3 mt-6">
        <Button type="submit" disabled={isLoading} className="bg-[#4FD58F] text-white">
          {isLoading ? "Creating..." : "Create Methodology"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default RiskMethodologyModalForm;

