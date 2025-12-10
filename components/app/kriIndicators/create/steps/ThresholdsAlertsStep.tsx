"use client";

import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import { FormState } from "../types";
import {
  ActionOnBreach,
  AlertRouting,
  CollectionMethod,
  Frequency,
} from "@/interfaces/KriIndicator";
import { formatCategory } from "@/lib/helpers/ui";
import DataSourceModalForm from "@/components/app/dataSources/create/DataSourceModalForm";

interface ThresholdsAlertsStepProps {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  validationErrors: Record<string, string[]>;
  dataSources: any[];
  isDataSourcesLoading: boolean;
}

export const ThresholdsAlertsStep: React.FC<ThresholdsAlertsStepProps> = ({
  formState,
  setFormState,
  validationErrors,
  dataSources,
  isDataSourcesLoading,
}) => {
  // Sync data_source name when data_source_id changes or data sources are loaded
  useEffect(() => {
    if (formState.data_source_id && dataSources.length > 0) {
      const selectedSource = dataSources.find(
        (s: any) => String(s.id) === formState.data_source_id
      );
      if (selectedSource && selectedSource.name !== formState.data_source) {
        setFormState((prev) => ({
          ...prev,
          data_source: selectedSource.name,
        }));
      }
    }
  }, [formState.data_source_id, dataSources, formState.data_source, setFormState]);
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
          Thresholds & Alerts
        </h3>
        <hr className="border-gray-200" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="threshold_warning">
            Threshold Warning <span className="text-red-500">*</span>
          </Label>
          <Input
            id="threshold_warning"
            type="number"
            value={formState.threshold_warning}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                threshold_warning: e.target.value,
              }))
            }
            placeholder="5"
            className={`h-[44px] w-full px-4 rounded-lg border ${
              validationErrors.threshold_warning
                ? "border-red-500"
                : "border-[#D0D5DD]"
            } focus:border-[#D0D5DD] focus:-ring-0`}
          />
          {validationErrors.threshold_warning && (
            <p className="text-sm text-red-500">
              {validationErrors.threshold_warning[0]}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="threshold_critical">
            Threshold Critical <span className="text-red-500">*</span>
          </Label>
          <Input
            id="threshold_critical"
            type="number"
            value={formState.threshold_critical}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                threshold_critical: e.target.value,
              }))
            }
            placeholder="10"
            className={`h-[44px] w-full px-4 rounded-lg border ${
              validationErrors.threshold_critical
                ? "border-red-500"
                : "border-[#D0D5DD]"
            } focus:border-[#D0D5DD] focus:-ring-0`}
          />
          {validationErrors.threshold_critical && (
            <p className="text-sm text-red-500">
              {validationErrors.threshold_critical[0]}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="data_source">
            Data Source <span className="text-red-500">*</span>
          </Label>
          <SelectWithInlineCreate
            key={`data_source-${formState.data_source_id ?? "none"}`}
            value={formState.data_source_id || undefined}
            onValueChange={(value) => {
              const selectedSource = dataSources.find(
                (s: any) => String(s.id) === value
              );
              setFormState((prev) => ({
                ...prev,
                data_source_id: value || "",
                data_source: selectedSource?.name || "",
              }));
            }}
            options={dataSources.map((source: any) => ({
              id: source.id,
              label: source.name || `Data Source ${source.id}`,
              value: String(source.id),
            }))}
            isLoading={isDataSourcesLoading}
            isEmpty={!isDataSourcesLoading && dataSources.length === 0}
            entityName="Data Source"
            modalForm={DataSourceModalForm}
            placeholder="Select Data Source"
            error={!!validationErrors.data_source}
          />
          {validationErrors.data_source && (
            <p className="text-sm text-red-500">
              {validationErrors.data_source[0]}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="collection_method">
            Collection Method <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formState.collection_method}
            onValueChange={(value) =>
              setFormState((prev) => ({
                ...prev,
                collection_method: value as CollectionMethod,
              }))
            }
          >
            <SelectTrigger className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0">
              <SelectValue placeholder="Select collection method" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(CollectionMethod).map((item) => (
                <SelectItem key={item} value={item}>
                  {formatCategory(item)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="frequency">
            Frequency <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formState.frequency}
            onValueChange={(value) =>
              setFormState((prev) => ({
                ...prev,
                frequency: value as Frequency,
              }))
            }
          >
            <SelectTrigger className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(Frequency).map((item) => (
                <SelectItem key={item} value={item}>
                  {formatCategory(item)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="alert_routing">
            Alert Routing <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formState.alert_routing}
            onValueChange={(value) =>
              setFormState((prev) => ({
                ...prev,
                alert_routing: value as AlertRouting,
              }))
            }
          >
            <SelectTrigger className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0">
              <SelectValue placeholder="Select alert routing" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(AlertRouting).map((item) => (
                <SelectItem key={item} value={item}>
                  {formatCategory(item)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="action_on_breach">
            Action on Breach <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formState.action_on_breach}
            onValueChange={(value) =>
              setFormState((prev) => ({
                ...prev,
                action_on_breach: value as ActionOnBreach,
              }))
            }
          >
            <SelectTrigger className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0">
              <SelectValue placeholder="Select action on breach" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ActionOnBreach).map((item) => (
                <SelectItem key={item} value={item}>
                  {formatCategory(item)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formState.notes}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, notes: e.target.value }))
            }
            rows={3}
            placeholder="Additional context for alert handling"
            className="min-h-24 resize-none"
          />
        </div>
      </div>
    </div>
  );
};

