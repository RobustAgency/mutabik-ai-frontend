"use client";

import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import type { AiRiskRegisterFormData } from "@/lib/schemas/aiRiskRegister.schema";
import AiIncidentModalFormAdapter from "@/components/app/incidents/create/AiIncidentModalFormAdapter";
import CAPAModalFormAdapter from "@/components/app/incidents/capa/CAPAModalFormAdapter";

interface LinksEvidenceStepProps {
  incidents: any[];
  isIncidentsLoading: boolean;
  capas: any[];
  isCapasLoading: boolean;
}

export const LinksEvidenceStep: React.FC<LinksEvidenceStepProps> = ({
  incidents,
  isIncidentsLoading,
  capas,
  isCapasLoading,
}) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<AiRiskRegisterFormData>();
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
          Links & Evidence
        </h3>
        <hr className="border-gray-200" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="linked_assessment_id">Linked Assessment ID</Label>
          <Input
            id="linked_assessment_id"
            type="number"
            {...register("linked_assessment_id")}
            placeholder="Assessment ID"
            className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="linked_incident_id">Linked Incident ID</Label>
          <Controller
            name="linked_incident_id"
            control={control}
            render={({ field }) => (
              <SelectWithInlineCreate
                key={`linked_incident_id-${field.value ?? "none"}`}
                value={field.value || undefined}
                onValueChange={(value) => field.onChange(value || "")}
                options={incidents.map((incident: any) => ({
                  id: incident.id,
                  label: incident.title || `Incident ${incident.id}`,
                  value: String(incident.id),
                }))}
                isLoading={isIncidentsLoading}
                isEmpty={!isIncidentsLoading && incidents.length === 0}
                entityName="AI Incident"
                modalForm={AiIncidentModalFormAdapter}
                placeholder="Select Incident (optional)"
                error={!!errors.linked_incident_id}
              />
            )}
          />
          {errors.linked_incident_id && (
            <p className="text-sm text-red-500">
              {errors.linked_incident_id.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="linked_capa_id">Linked CAPA ID</Label>
          <Controller
            name="linked_capa_id"
            control={control}
            render={({ field }) => (
              <SelectWithInlineCreate
                key={`linked_capa_id-${field.value ?? "none"}`}
                value={field.value || undefined}
                onValueChange={(value) => field.onChange(value || "")}
                options={capas.map((capa: any) => ({
                  id: capa.id,
                  label: capa.title || `CAPA ${capa.id}`,
                  value: String(capa.id),
                }))}
                isLoading={isCapasLoading}
                isEmpty={!isCapasLoading && capas.length === 0}
                entityName="CAPA"
                modalForm={CAPAModalFormAdapter}
                placeholder="Select CAPA (optional)"
                error={!!errors.linked_capa_id}
              />
            )}
          />
          {errors.linked_capa_id && (
            <p className="text-sm text-red-500">
              {errors.linked_capa_id.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="evidence_link">Evidence Link</Label>
        <Input
          id="evidence_link"
          {...register("evidence_link")}
          placeholder="https://example.com/evidence"
          className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="likelihood_label_snapshot">
            Likelihood Label Snapshot
          </Label>
          <Input
            id="likelihood_label_snapshot"
            {...register("likelihood_label_snapshot")}
            placeholder="Medium"
            className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="impact_label_snapshot">Impact Label Snapshot</Label>
          <Input
            id="impact_label_snapshot"
            {...register("impact_label_snapshot")}
            placeholder="High"
            className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="method_name_snapshot">Method Name Snapshot</Label>
          <Input
            id="method_name_snapshot"
            {...register("method_name_snapshot")}
            placeholder="Risk Matrix v1"
            className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
          />
        </div>
      </div>
    </div>
  );
};

