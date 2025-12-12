"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateAiIncidentData } from "@/app/lib/features/aiIncidentsApi";
import { useGetAiModelsQuery } from "@/app/lib/features/aiModelsApi";
import { useGetAiModelVersionsQuery } from "@/app/lib/features/aiModelVersionsApi";
import { useGetUseCasesQuery } from "@/app/lib/features/useCasesApi";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import AiModelModalForm from "@/components/app/aiModel/create/AiModelModalForm";
import AiModelVersionModalForm from "@/components/app/aiModel/versions/AiModelVersionModalForm";
import UseCaseModalForm from "@/components/app/useCases/create/UseCaseModalForm";
import { Checkbox } from "@/components/ui/checkbox";

interface AiIncidentFormProps {
  formData: CreateAiIncidentData;
  setFormData: React.Dispatch<React.SetStateAction<CreateAiIncidentData>>;
  errors: Record<string, string[]>;
}

const AiIncidentForm: React.FC<AiIncidentFormProps> = ({
  formData,
  setFormData,
  errors,
}) => {
  const { data: aiModels = [], isLoading: isModelsLoading } = useGetAiModelsQuery();
  const { data: modelVersionsData, isLoading: isVersionsLoading } = useGetAiModelVersionsQuery();
  const { data: useCases = [], isLoading: isUseCasesLoading } = useGetUseCasesQuery();

  const modelVersions = React.useMemo(() => modelVersionsData || [], [modelVersionsData]);

  // Filter versions based on selected model
  const filteredVersions = React.useMemo(() => {
    if (!formData.model_id) return modelVersions;
    return modelVersions.filter((version: any) => String(version.ai_model_id) === String(formData.model_id));
  }, [modelVersions, formData.model_id]);

  const handleInputChange = (field: keyof CreateAiIncidentData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImpactedDataChange = (value: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      impacted_data: checked
        ? [...prev.impacted_data, value]
        : prev.impacted_data.filter((item) => item !== value),
    }));
  };

  const getError = (fieldName: string) => {
    return errors[fieldName]?.[0];
  };

  // Auto-populate declared_at with current time for new incidents
  React.useEffect(() => {
    if (!formData.declared_at) {
      const now = new Date().toISOString().slice(0, 16);
      setFormData((prev) => ({ ...prev, declared_at: now }));
    }
  }, [formData.declared_at, setFormData]);

  return (
    <div className="space-y-6">
      {/* Section 1: Basic Information */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
          Basic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={errors.title ? "border-destructive" : ""}
              placeholder="Short, descriptive name"
            />
            {getError("title") && (
              <p className="text-sm text-destructive">{getError("title")}</p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="summary">Summary <span className="text-red-500">*</span></Label>
            <Textarea
              id="summary"
              value={formData.summary}
              onChange={(e) => handleInputChange("summary", e.target.value)}
              className={`min-h-32 resize-none ${errors.summary ? "border-destructive" : ""}`}
              placeholder="Short narrative of what happened"
            />
            {getError("summary") && (
              <p className="text-sm text-destructive">{getError("summary")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
            <Select
              key={`category-${formData.category || "none"}`}
              value={formData.category}
              onValueChange={(value) => handleInputChange("category", value as CreateAiIncidentData["category"])}
            >
              <SelectTrigger className={errors.category ? "border-destructive w-full" : "w-full"}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="safety">Safety</SelectItem>
                <SelectItem value="privacy">Privacy</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="bias_fairness">Bias/Fairness</SelectItem>
                <SelectItem value="reliability">Reliability</SelectItem>
                <SelectItem value="availability">Availability</SelectItem>
                <SelectItem value="legal_compliance">Legal Compliance</SelectItem>
                <SelectItem value="vendor">Vendor</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {getError("category") && (
              <p className="text-sm text-destructive">{getError("category")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="severity">Severity <span className="text-red-500">*</span></Label>
            <Select
              key={`severity-${formData.severity || "none"}`}
              value={formData.severity}
              onValueChange={(value) => handleInputChange("severity", value as CreateAiIncidentData["severity"])}
            >
              <SelectTrigger className={errors.severity ? "border-destructive w-full" : "w-full"}>
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sev1_critical">Sev1 Critical</SelectItem>
                <SelectItem value="sev2_high">Sev2 High</SelectItem>
                <SelectItem value="sev3_medium">Sev3 Medium</SelectItem>
                <SelectItem value="sev4_low">Sev4 Low</SelectItem>
                <SelectItem value="near_miss">Near Miss</SelectItem>
              </SelectContent>
            </Select>
            {getError("severity") && (
              <p className="text-sm text-destructive">{getError("severity")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
            <Select
              key={`status-${formData.status || "none"}`}
              value={formData.status}
              onValueChange={(value) => handleInputChange("status", value as CreateAiIncidentData["status"])}
            >
              <SelectTrigger className={errors.status ? "border-destructive w-full" : "w-full"}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="contained">Contained</SelectItem>
                <SelectItem value="monitoring">Monitoring</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            {getError("status") && (
              <p className="text-sm text-destructive">{getError("status")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="stage">Stage <span className="text-red-500">*</span></Label>
            <Select
              key={`stage-${formData.stage || "none"}`}
              value={formData.stage}
              onValueChange={(value) => handleInputChange("stage", value as CreateAiIncidentData["stage"])}
            >
              <SelectTrigger className={errors.stage ? "border-destructive w-full" : "w-full"}>
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ideation">Ideation</SelectItem>
                <SelectItem value="conception">Conception</SelectItem>
                <SelectItem value="dev">Development</SelectItem>
                <SelectItem value="test">Test</SelectItem>
                <SelectItem value="staging">Staging</SelectItem>
                <SelectItem value="prod">Production</SelectItem>
                <SelectItem value="retirement">Retirement</SelectItem>
              </SelectContent>
            </Select>
            {getError("stage") && (
              <p className="text-sm text-destructive">{getError("stage")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ic_owner">Incident Commander (IC) <span className="text-red-500">*</span></Label>
            <Input
              id="ic_owner"
              value={formData.ic_owner}
              onChange={(e) => handleInputChange("ic_owner", e.target.value)}
              className={errors.ic_owner ? "border-destructive" : ""}
              placeholder="Name of IC"
            />
            {getError("ic_owner") && (
              <p className="text-sm text-destructive">{getError("ic_owner")}</p>
            )}
          </div>
        </div>
      </div>

      {/* Section 2: Model & Timeline */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
          Model & Timeline
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="model_id">Model</Label>
            <SelectWithInlineCreate
              key={`model_id-${formData.model_id ?? 'none'}`}
              value={formData.model_id ? String(formData.model_id) : undefined}
              onValueChange={(value) => {
                handleInputChange("model_id", value || null);
                // Reset version when model changes
                if (value !== formData.model_id) {
                  handleInputChange("model_version_id", null);
                }
              }}
              options={aiModels.map((model: any) => ({
                id: model.id,
                label: model.name,
                value: String(model.id),
              }))}
              isLoading={isModelsLoading}
              isEmpty={!isModelsLoading && aiModels.length === 0}
              entityName="AI Model"
              modalForm={AiModelModalForm}
              placeholder="Select model"
              error={!!errors.model_id}
            />
            {getError("model_id") && (
              <p className="text-sm text-destructive">{getError("model_id")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="model_version_id">Model Version</Label>
            <SelectWithInlineCreate
              key={`model_version_id-${formData.model_version_id ?? 'none'}`}
              value={formData.model_version_id ? String(formData.model_version_id) : undefined}
              onValueChange={(value) => handleInputChange("model_version_id", value || null)}
              options={filteredVersions.map((version: any) => ({
                id: version.id,
                label: version.version_number || `Version ${version.id}`,
                value: String(version.id),
              }))}
              isLoading={isVersionsLoading}
              isEmpty={!isVersionsLoading && filteredVersions.length === 0}
              entityName="Model Version"
              modalForm={AiModelVersionModalForm}
              placeholder={!formData.model_id ? "Select model first" : "Select version"}
              error={!!errors.model_version_id}
              disabled={!formData.model_id}
            />
            {getError("model_version_id") && (
              <p className="text-sm text-destructive">{getError("model_version_id")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="use_case_id">Use Case</Label>
            <SelectWithInlineCreate
              key={`use_case_id-${formData.use_case_id ?? 'none'}`}
              value={formData.use_case_id ? String(formData.use_case_id) : undefined}
              onValueChange={(value) => handleInputChange("use_case_id", value || null)}
              options={useCases.map((useCase: any) => ({
                id: useCase.id,
                label: useCase.name || useCase.use_case_title || useCase.title,
                value: String(useCase.id),
              }))}
              isLoading={isUseCasesLoading}
              isEmpty={!isUseCasesLoading && useCases.length === 0}
              entityName="Use Case"
              modalForm={UseCaseModalForm}
              placeholder="Select use case"
              error={!!errors.use_case_id}
            />
            {getError("use_case_id") && (
              <p className="text-sm text-destructive">{getError("use_case_id")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="first_seen_at">First Seen At <span className="text-red-500">*</span></Label>
            <Input
              id="first_seen_at"
              type="datetime-local"
              value={formData.first_seen_at}
              onChange={(e) => handleInputChange("first_seen_at", e.target.value)}
              className={errors.first_seen_at ? "border-destructive" : ""}
            />
            {getError("first_seen_at") && (
              <p className="text-sm text-destructive">{getError("first_seen_at")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="declared_at">Declared At <span className="text-red-500">*</span></Label>
            <Input
              id="declared_at"
              type="datetime-local"
              value={formData.declared_at}
              onChange={(e) => handleInputChange("declared_at", e.target.value)}
              className={errors.declared_at ? "border-destructive" : ""}
            />
            {getError("declared_at") && (
              <p className="text-sm text-destructive">{getError("declared_at")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="resolved_at">Resolved At</Label>
            <Input
              id="resolved_at"
              type="datetime-local"
              value={formData.resolved_at || ""}
              onChange={(e) => {
                const newResolvedAt = e.target.value || null;
                setFormData((prev) => {
                  const next = { ...prev, resolved_at: newResolvedAt };
                  if (
                    next.closed_at &&
                    newResolvedAt &&
                    // Ensure closed_at is not before resolved_at
                    String(next.closed_at) < String(newResolvedAt)
                  ) {
                    next.closed_at = newResolvedAt;
                  }
                  return next;
                });
              }}
            />
            <p className="text-xs text-[#667085]">Service restored/impact stopped</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="closed_at">Closed At</Label>
            <Input
              id="closed_at"
              type="datetime-local"
              value={formData.closed_at || ""}
              min={formData.resolved_at || undefined}
              disabled={!formData.resolved_at}
              onChange={(e) => handleInputChange("closed_at", e.target.value || null)}
            />
            <p className="text-xs text-[#667085]">After RCA/CAPA complete</p>
          </div>
        </div>
      </div>

      {/* Section 3: Impact Assessment */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
          Impact Assessment
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="impacted_users">Impacted Users</Label>
            <Input
              id="impacted_users"
              value={formData.impacted_users || ""}
              onChange={(e) => handleInputChange("impacted_users", e.target.value || null)}
              placeholder="Estimate/count or 'internal only'"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Impacted Data <span className="text-red-500">*</span></Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { value: "pii", label: "PII" },
                { value: "sensitive_personal", label: "Sensitive Personal" },
                { value: "financial", label: "Financial" },
                { value: "health", label: "Health" },
                { value: "ip_copyright", label: "IP/Copyright" },
                { value: "none", label: "None" },
                { value: "unknown", label: "Unknown" },
              ].map((item) => (
                <div key={item.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`impacted_data_${item.value}`}
                    checked={formData.impacted_data.includes(item.value)}
                    onCheckedChange={(checked) =>
                      handleImpactedDataChange(item.value, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`impacted_data_${item.value}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
            {getError("impacted_data") && (
              <p className="text-sm text-destructive">{getError("impacted_data")}</p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="impacted_systems">Impacted Systems</Label>
            <Textarea
              id="impacted_systems"
              value={formData.impacted_systems || ""}
              onChange={(e) => handleInputChange("impacted_systems", e.target.value || null)}
              placeholder="Free text/list of systems/vendors"
              className="min-h-32 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Section 4: Links & References */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
          Links & References
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="linked_release_id">Linked Release ID</Label>
            <Input
              id="linked_release_id"
              value={formData.linked_release_id || ""}
              onChange={(e) => handleInputChange("linked_release_id", e.target.value || null)}
              placeholder="If caused by/rolled back via a release"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linked_risk_id">Linked Risk ID</Label>
            <Input
              id="linked_risk_id"
              value={formData.linked_risk_id || ""}
              onChange={(e) => handleInputChange("linked_risk_id", e.target.value || null)}
              placeholder="Related risk from register"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linked_assessment_id">Linked Assessment ID</Label>
            <Input
              id="linked_assessment_id"
              value={formData.linked_assessment_id || ""}
              onChange={(e) => handleInputChange("linked_assessment_id", e.target.value || null)}
              placeholder="If a rapid assessment was triggered"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linked_capa_id">Linked CAPA ID</Label>
            <Input
              id="linked_capa_id"
              value={formData.linked_capa_id || ""}
              onChange={(e) => handleInputChange("linked_capa_id", e.target.value || null)}
              placeholder="Master CAPA if one umbrella action ticket"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="evidence_link">Evidence Link</Label>
            <Input
              id="evidence_link"
              type="url"
              value={formData.evidence_link || ""}
              onChange={(e) => handleInputChange("evidence_link", e.target.value || null)}
              placeholder="https://example.com/evidence"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiIncidentForm;

