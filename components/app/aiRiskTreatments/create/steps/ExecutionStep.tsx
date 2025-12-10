"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import CAPAModalFormAdapter from "@/components/app/incidents/capa/CAPAModalFormAdapter";
import { FormState } from "../types";
import { ResultVerification } from "@/interfaces/AiRiskTreatment";

interface ExecutionStepProps {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  validationErrors: Record<string, string[]>;
  capas: any[];
  isCapasLoading: boolean;
}

export const ExecutionStep: React.FC<ExecutionStepProps> = ({
  formState,
  setFormState,
  validationErrors,
  capas,
  isCapasLoading,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
          Execution
        </h3>
        <hr className="border-gray-200" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="assignee">Assignee (emails, comma separated)</Label>
          <Input
            id="assignee"
            value={formState.assignee}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, assignee: e.target.value }))
            }
            placeholder="john@example.com, jane@example.com"
            className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expected_residual_level">Expected Residual Level</Label>
          <Input
            id="expected_residual_level"
            value={formState.expected_residual_level}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                expected_residual_level: e.target.value,
              }))
            }
            placeholder="medium"
            className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="result_verification">Result Verification</Label>
          <Select
            value={formState.result_verification || "none"}
            onValueChange={(value) =>
              setFormState((prev) => ({
                ...prev,
                result_verification:
                  value === "none" ? "" : (value as ResultVerification),
              }))
            }
          >
            <SelectTrigger className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {Object.values(ResultVerification).map((item) => (
                <SelectItem key={item} value={item}>
                  {item.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="evidence_link">Evidence Link</Label>
          <Input
            id="evidence_link"
            value={formState.evidence_link}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, evidence_link: e.target.value }))
            }
            placeholder="https://example.com/evidence"
            className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="linked_capa_id">Linked CAPA</Label>
          <SelectWithInlineCreate
            key={`linked_capa_id-${formState.linked_capa_id || "none"}`}
            value={formState.linked_capa_id || undefined}
            onValueChange={(value) =>
              setFormState((prev) => ({
                ...prev,
                linked_capa_id: value || "",
              }))
            }
            options={capas.map((capa: any) => ({
              id: capa.id,
              label: capa.title || `CAPA ${capa.id}`,
              value: String(capa.id),
            }))}
            isLoading={isCapasLoading}
            isEmpty={!isCapasLoading && capas.length === 0}
            entityName="CAPA"
            modalForm={CAPAModalFormAdapter}
            canCreate
            placeholder={isCapasLoading ? "Loading..." : "Select CAPA"}
            triggerClassName="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
            error={!!validationErrors.linked_capa_id}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="closed_at">Closed At</Label>
          <Input
            id="closed_at"
            type="date"
            value={formState.closed_at}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, closed_at: e.target.value }))
            }
            className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
          />
        </div>
      </div>
    </div>
  );
};


