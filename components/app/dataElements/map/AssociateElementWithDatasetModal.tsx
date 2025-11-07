"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetDatasetsQuery } from "@/app/lib/features/datasetsApi";
import { useCreateDatasetElementMapMutation } from "@/app/lib/features/datasetElementMapApi";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import DatasetModalForm from "@/components/app/datasets/create/DatasetModalForm";

interface Props {
  dataElementId: number;
  onClose: () => void;
  onSuccess?: () => void;
}

const AssociateElementWithDatasetModal: React.FC<Props> = ({ dataElementId, onClose, onSuccess }) => {
  const { data: datasetsResp, isLoading: isLoadingDatasets } = useGetDatasetsQuery({ limit: 100 });
  const datasets = datasetsResp ?? [];
  const datasetOptions = datasets.map((d: any) => ({ id: d.id, label: `#${d.id} • ${d.name || d.dataset_name || "Dataset"}`, value: String(d.id) }));
  const [createMap, { isLoading }] = useCreateDatasetElementMapMutation();

  const [form, setForm] = React.useState({
    dataset_id: "",
    column_name: "",
    nullable: "No",
    sensitivity_override: "",
    pii_override: "Inherit",
    transform_applied: "",
    quality_rules_applied: "",
    cde_in_dataset: "No",
    cde_category_in_dataset: "",
    lineage_source_column: "",
    deprecated: "No",
  });
  const [errors, setErrors] = React.useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate: if CDE in Dataset is "Yes", then CDE Category is required
    const validationErrors: Record<string, string[]> = {};
    if (!form.dataset_id) validationErrors.dataset_id = ["Dataset is required"];
    if (!form.column_name?.trim()) validationErrors.column_name = ["Column name is required"];
    if (!form.nullable) validationErrors.nullable = ["Nullable is required"];
    if (!form.cde_in_dataset) validationErrors.cde_in_dataset = ["CDE in Dataset is required"];

    // Conditional validation: if CDE in Dataset is "Yes", CDE Category is required
    if (form.cde_in_dataset === "Yes" && !form.cde_category_in_dataset) {
      validationErrors.cde_category_in_dataset = ["CDE Category is required when CDE in Dataset is Yes"];
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const payload: any = {
        dataset_id: Number(form.dataset_id),
        data_element_id: dataElementId,
        column_name: form.column_name,
        nullable: form.nullable as any,
        cde_in_dataset: form.cde_in_dataset as any,
      };
      if (form.sensitivity_override) payload.sensitivity_override = form.sensitivity_override as any;
      if (form.pii_override) payload.pii_override = form.pii_override as any;
      if (form.transform_applied) payload.transform_applied = form.transform_applied;
      if (form.quality_rules_applied) payload.quality_rules_applied = form.quality_rules_applied;
      if (form.cde_category_in_dataset) payload.cde_category_in_dataset = form.cde_category_in_dataset as any;
      if (form.lineage_source_column) payload.lineage_source_column = form.lineage_source_column;
      if (form.deprecated) payload.deprecated = form.deprecated as any;

      await createMap(payload).unwrap();
      onSuccess?.();
      onClose();
    } catch (err: any) {
      if (err?.data?.errors) setErrors(err.data.errors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {Object.keys(errors).length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-semibold mb-2">Please fix the following errors:</p>
            <ul className="list-disc list-inside space-y-1">
              {Object.entries(errors).map(([field, msgs]) => (
                <li key={field}>
                  <span className="font-medium capitalize">{field.replace(/_/g, " ")}:</span> {msgs[0]}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label>Dataset <span className="text-red-500">*</span></Label>
        <SelectWithInlineCreate
          value={form.dataset_id}
          onValueChange={(v) => setForm((p) => ({ ...p, dataset_id: v }))}
          placeholder={isLoadingDatasets ? "Loading datasets..." : "Select dataset"}
          options={datasetOptions}
          isLoading={isLoadingDatasets}
          isEmpty={!isLoadingDatasets && datasetOptions.length === 0}
          entityName="Dataset"
          modalForm={DatasetModalForm}
          canCreate={true}
          error={!!errors.dataset_id}
        />
        {errors.dataset_id && (
          <p className="text-sm text-destructive">{errors.dataset_id[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Column Name <span className="text-red-500">*</span></Label>
          <Input
            value={form.column_name}
            onChange={(e) => setForm((p) => ({ ...p, column_name: e.target.value }))}
            className={errors.column_name ? "border-destructive" : ""}
          />
          {errors.column_name && (
            <p className="text-sm text-destructive">{errors.column_name[0]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Nullable <span className="text-red-500">*</span></Label>
          <Select value={form.nullable} onValueChange={(v) => setForm((p) => ({ ...p, nullable: v }))}>
            <SelectTrigger className={`w-full ${errors.nullable ? "border-destructive" : ""}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
          {errors.nullable && (
            <p className="text-sm text-destructive">{errors.nullable[0]}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Sensitivity Override</Label>
          <Select value={form.sensitivity_override} onValueChange={(v) => setForm((p) => ({ ...p, sensitivity_override: v }))}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Public">Public</SelectItem>
              <SelectItem value="Internal">Internal</SelectItem>
              <SelectItem value="Confidential">Confidential</SelectItem>
              <SelectItem value="Restricted">Restricted</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>PII Override</Label>
          <Select value={form.pii_override} onValueChange={(v) => setForm((p) => ({ ...p, pii_override: v }))}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Inherit">Inherit</SelectItem>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Transform Applied</Label>
        <Input value={form.transform_applied} onChange={(e) => setForm((p) => ({ ...p, transform_applied: e.target.value }))} placeholder="tokenize/hash/k-anon/ε-DP/regex redact" />
      </div>

      <div className="space-y-2">
        <Label>Quality Rules Applied</Label>
        <Input value={form.quality_rules_applied} onChange={(e) => setForm((p) => ({ ...p, quality_rules_applied: e.target.value }))} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>CDE in Dataset <span className="text-red-500">*</span></Label>
          <Select value={form.cde_in_dataset} onValueChange={(v) => setForm((p) => ({ ...p, cde_in_dataset: v }))}>
            <SelectTrigger className={`w-full ${errors.cde_in_dataset ? "border-destructive" : ""}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
          {errors.cde_in_dataset && (
            <p className="text-sm text-destructive">{errors.cde_in_dataset[0]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>
            CDE Category in Dataset
            {form.cde_in_dataset === "Yes" && <span className="text-red-500">*</span>}
          </Label>
          <Select
            value={form.cde_category_in_dataset}
            onValueChange={(v) => setForm((p) => ({ ...p, cde_category_in_dataset: v }))}
          >
            <SelectTrigger className={`w-full ${errors.cde_category_in_dataset ? "border-destructive" : ""}`}>
              <SelectValue placeholder="Select if CDE is Yes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Strategic">Strategic</SelectItem>
              <SelectItem value="Compliance">Compliance</SelectItem>
              <SelectItem value="External Reporting">External Reporting</SelectItem>
              <SelectItem value="Operational">Operational</SelectItem>
              <SelectItem value="Financial">Financial</SelectItem>
              <SelectItem value="Risk">Risk</SelectItem>
              <SelectItem value="Customer Experience">Customer Experience</SelectItem>
            </SelectContent>
          </Select>
          {errors.cde_category_in_dataset && (
            <p className="text-sm text-destructive">{errors.cde_category_in_dataset[0]}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Lineage Source Column</Label>
          <Input value={form.lineage_source_column} onChange={(e) => setForm((p) => ({ ...p, lineage_source_column: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label>Deprecated</Label>
          <Select value={form.deprecated} onValueChange={(v) => setForm((p) => ({ ...p, deprecated: v }))}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="No">No</SelectItem>
              <SelectItem value="Yes">Yes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
        <Button type="submit" className="bg-[#4FD58F] hover:bg-[#3fc77f]" disabled={isLoading}>{isLoading ? "Saving..." : "Associate"}</Button>
      </div>
    </form>
  );
};

export default AssociateElementWithDatasetModal;


