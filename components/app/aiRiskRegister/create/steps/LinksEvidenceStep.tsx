"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import { FormState } from "../types";
import AiIncidentModalFormAdapter from "@/components/app/incidents/create/AiIncidentModalFormAdapter";
import CAPAModalFormAdapter from "@/components/app/incidents/capa/CAPAModalFormAdapter";

interface LinksEvidenceStepProps {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  validationErrors: Record<string, string[]>;
  incidents: any[];
  isIncidentsLoading: boolean;
  capas: any[];
  isCapasLoading: boolean;
}

export const LinksEvidenceStep: React.FC<LinksEvidenceStepProps> = ({
  formState,
  setFormState,
  validationErrors,
  incidents,
  isIncidentsLoading,
  capas,
  isCapasLoading,
}) => {
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
            value={formState.linked_assessment_id}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                linked_assessment_id: e.target.value,
              }))
            }
            placeholder="Assessment ID"
            className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="linked_incident_id">Linked Incident ID</Label>
          <SelectWithInlineCreate
            key={`linked_incident_id-${formState.linked_incident_id ?? "none"}`}
            value={formState.linked_incident_id || undefined}
            onValueChange={(value) => {
              setFormState((prev) => ({
                ...prev,
                linked_incident_id: value || "",
              }));
            }}
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
            error={!!validationErrors.linked_incident_id}
          />
          {validationErrors.linked_incident_id && (
            <p className="text-sm text-red-500">
              {validationErrors.linked_incident_id[0]}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="linked_capa_id">Linked CAPA ID</Label>
          <SelectWithInlineCreate
            key={`linked_capa_id-${formState.linked_capa_id ?? "none"}`}
            value={formState.linked_capa_id || undefined}
            onValueChange={(value) => {
              setFormState((prev) => ({
                ...prev,
                linked_capa_id: value || "",
              }));
            }}
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
            error={!!validationErrors.linked_capa_id}
          />
          {validationErrors.linked_capa_id && (
            <p className="text-sm text-red-500">
              {validationErrors.linked_capa_id[0]}
            </p>
          )}
        </div>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="likelihood_label_snapshot">
            Likelihood Label Snapshot
          </Label>
          <Input
            id="likelihood_label_snapshot"
            value={formState.likelihood_label_snapshot}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                likelihood_label_snapshot: e.target.value,
              }))
            }
            placeholder="Medium"
            className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="impact_label_snapshot">Impact Label Snapshot</Label>
          <Input
            id="impact_label_snapshot"
            value={formState.impact_label_snapshot}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                impact_label_snapshot: e.target.value,
              }))
            }
            placeholder="High"
            className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="method_name_snapshot">Method Name Snapshot</Label>
          <Input
            id="method_name_snapshot"
            value={formState.method_name_snapshot}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                method_name_snapshot: e.target.value,
              }))
            }
            placeholder="Risk Matrix v1"
            className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
          />
        </div>
      </div>
    </div>
  );
};

