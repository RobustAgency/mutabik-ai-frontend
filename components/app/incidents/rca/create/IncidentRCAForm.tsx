"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateIncidentRootCauseAnalysisData } from "@/app/lib/features/incidentRootCauseAnalysesApi";
import { useGetAiIncidentsQuery } from "@/app/lib/features/aiIncidentsApi";

interface IncidentRCAFormProps {
  formData: CreateIncidentRootCauseAnalysisData;
  setFormData: React.Dispatch<React.SetStateAction<CreateIncidentRootCauseAnalysisData>>;
  errors: Record<string, string[]>;
}

const IncidentRCAForm: React.FC<IncidentRCAFormProps> = ({ formData, setFormData, errors }) => {
  const { data: incidentsData, isLoading: isIncidentsLoading } = useGetAiIncidentsQuery({ per_page: 100 });
  const incidents = incidentsData?.data || [];
  
  const handleInputChange = (field: keyof CreateIncidentRootCauseAnalysisData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Incident <span className="text-red-500">*</span></Label>
        <Select
          value={formData.ai_incident_id ? String(formData.ai_incident_id) : undefined}
          onValueChange={(value) => handleInputChange("ai_incident_id", Number(value))}
        >
          <SelectTrigger className={`w-full ${errors.ai_incident_id ? "border-destructive" : ""}`}>
            <SelectValue placeholder={isIncidentsLoading ? "Loading incidents..." : "Select incident"} />
          </SelectTrigger>
          <SelectContent>
            {incidents.map((incident: any) => (
              <SelectItem key={incident.id} value={String(incident.id)}>
                #{incident.id} - {incident.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.ai_incident_id && (
          <p className="text-sm text-destructive">{errors.ai_incident_id[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>RCA Method <span className="text-red-500">*</span></Label>
        <Select value={formData.rca_method} onValueChange={(value) => handleInputChange("rca_method", value)}>
          <SelectTrigger className={`w-full ${errors.rca_method ? "border-destructive" : ""}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5_whys">5 Whys</SelectItem>
            <SelectItem value="fishbone">Fishbone</SelectItem>
            <SelectItem value="timeline_analysis">Timeline Analysis</SelectItem>
            <SelectItem value="fault_tree">Fault Tree</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Immediate Cause <span className="text-red-500">*</span></Label>
        <Textarea value={formData.immediate_cause} onChange={(e) => handleInputChange("immediate_cause", e.target.value)} rows={3} />
      </div>

      <div className="space-y-2">
        <Label>Latent Causes <span className="text-red-500">*</span></Label>
        <Textarea value={formData.latent_causes} onChange={(e) => handleInputChange("latent_causes", e.target.value)} rows={4} />
      </div>

      <div className="space-y-2">
        <Label>Contributing Factors</Label>
        <Textarea value={formData.contributing_factors || ""} onChange={(e) => handleInputChange("contributing_factors", e.target.value || null)} rows={3} />
      </div>

      <div className="space-y-2">
        <Label>Impact Assessment</Label>
        <Textarea value={formData.impact_assessment || ""} onChange={(e) => handleInputChange("impact_assessment", e.target.value || null)} rows={3} />
      </div>

      <div className="space-y-2">
        <Label>Fixes Implemented</Label>
        <Textarea value={formData.fixes_implemented || ""} onChange={(e) => handleInputChange("fixes_implemented", e.target.value || null)} rows={3} />
      </div>

      <div className="space-y-2">
        <Label>Lessons Learned <span className="text-red-500">*</span></Label>
        <Textarea value={formData.lessons_learned} onChange={(e) => handleInputChange("lessons_learned", e.target.value)} rows={4} />
      </div>

      <div className="space-y-2">
        <Label>Recommendations <span className="text-red-500">*</span></Label>
        <Textarea value={formData.recommendations} onChange={(e) => handleInputChange("recommendations", e.target.value)} rows={4} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Approved By <span className="text-red-500">*</span></Label>
          <Input value={formData.approved_by} onChange={(e) => handleInputChange("approved_by", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Approved At <span className="text-red-500">*</span></Label>
          <Input type="datetime-local" value={formData.approved_at} onChange={(e) => handleInputChange("approved_at", e.target.value)} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Report Link</Label>
        <Input type="url" value={formData.report_link || ""} onChange={(e) => handleInputChange("report_link", e.target.value || null)} />
      </div>
    </div>
  );
};

export default IncidentRCAForm;

