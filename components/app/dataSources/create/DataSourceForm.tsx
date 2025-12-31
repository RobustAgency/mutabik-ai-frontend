"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { CreateDataSourceData, SystemType, OwnerTeam, DataDomain, DataResidency, CriticalityLevel, HostingModel, DataSourceStatus } from "@/app/lib/features/dataSourcesApi";

interface DataSourceFormProps {
  formData: CreateDataSourceData;
  setFormData: React.Dispatch<React.SetStateAction<CreateDataSourceData>>;
  errors: Record<string, string[]>;
}

const SYSTEM_TYPE_OPTIONS = [
  { value: SystemType.APPLICATION_DB, label: "Application DB" },
  { value: SystemType.DATA_LAKE, label: "Data Lake" },
  { value: SystemType.DATA_WAREHOUSE, label: "Data Warehouse" },
  { value: SystemType.OPERATIONAL_API, label: "Operational API" },
  { value: SystemType.FILES_BUCKETS, label: "Files/Buckets" },
  { value: SystemType.THIRD_PARTY_SAAS, label: "3rd-Party SaaS" },
  { value: SystemType.STREAMING_KAFKA, label: "Streaming/Kafka" },
];

const OWNER_TEAM_OPTIONS = [
  { value: OwnerTeam.DATA_ENGINEERING_TEAM, label: "Data Engineering Team" },
  { value: OwnerTeam.ML_PLATFORM_TEAM, label: "ML Platform Team" },
  { value: OwnerTeam.PRIVACY_OFFICE, label: "Privacy Office" },
  { value: OwnerTeam.AI_GOVERNANCE_BOARD, label: "AI Governance Board" },
];

const DATA_DOMAIN_OPTIONS = [
  { value: DataDomain.CUSTOMER, label: "Customer" },
  { value: DataDomain.FINANCE, label: "Finance" },
  { value: DataDomain.OPERATIONS, label: "Operations" },
  { value: DataDomain.HUMAN_RESOURCES, label: "Human Resources" },
  { value: DataDomain.MARKETING, label: "Marketing" },
  { value: DataDomain.PRODUCT, label: "Product" },
  { value: DataDomain.SALES, label: "Sales" },
  { value: DataDomain.LEGAL, label: "Legal" },
  { value: DataDomain.IT_TECHNOLOGY, label: "IT/Technology" },
  { value: DataDomain.SUPPLY_CHAIN, label: "Supply Chain" },
];

const DATA_RESIDENCY_OPTIONS = [
  { value: DataResidency.AE, label: "United Arab Emirates (AE)" },
  { value: DataResidency.EU, label: "European Union (EU)" },
  { value: DataResidency.KSA, label: "Kingdom of Saudi Arabia (KSA)" },
  { value: DataResidency.US, label: "United States (US)" },
  { value: DataResidency.UK, label: "United Kingdom (UK)" },
  { value: DataResidency.QA, label: "Qatar (QA)" },
  { value: DataResidency.JO, label: "Jordan (JO)" },
  { value: DataResidency.MA, label: "Morocco (MA)" },
  { value: DataResidency.BH, label: "Bahrain (BH)" },
  { value: DataResidency.OTHER, label: "Other" },
];

const CRITICALITY_LEVEL_OPTIONS = [
  { value: CriticalityLevel.LOW, label: "Low" },
  { value: CriticalityLevel.MEDIUM, label: "Medium" },
  { value: CriticalityLevel.HIGH, label: "High" },
  { value: CriticalityLevel.CRITICAL, label: "Critical" },
];

const HOSTING_MODEL_OPTIONS = [
  { value: HostingModel.ON_PREM, label: "On-Premises" },
  { value: HostingModel.CLOUD, label: "Cloud" },
  { value: HostingModel.HYBRID, label: "Hybrid" },
];

const STATUS_OPTIONS = [
  { value: DataSourceStatus.DRAFT, label: "Draft" },
  { value: DataSourceStatus.ACTIVE, label: "Active" },
  { value: DataSourceStatus.UNDER_REVIEW, label: "Under Review" },
  { value: DataSourceStatus.DEPRECATED, label: "Deprecated" },
  { value: DataSourceStatus.ARCHIVED, label: "Archived" },
];

const DataSourceForm: React.FC<DataSourceFormProps> = ({
  formData,
  setFormData,
  errors,
}) => {
  const handleInputChange = (field: keyof CreateDataSourceData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDataDomainToggle = (domain: DataDomain) => {
    const currentDomains = formData.data_domains || [];
    if (currentDomains.includes(domain)) {
      setFormData((prev) => ({
        ...prev,
        data_domains: currentDomains.filter((d) => d !== domain),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        data_domains: [...currentDomains, domain],
      }));
    }
  };

  const getDataDomainLabel = (value: DataDomain): string => {
    const found = DATA_DOMAIN_OPTIONS.find((opt) => opt.value === value);
    return found ? found.label : value;
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Basic Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={errors.name ? "border-destructive" : ""}
              placeholder="Enter data source name"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name[0]}</p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={errors.description ? "border-destructive" : ""}
              placeholder="Enter data source description"
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="system_type">System Type <span className="text-red-500">*</span></Label>
            <Select
              value={formData.system_type}
              onValueChange={(value) => handleInputChange("system_type", value as SystemType)}
            >
              <SelectTrigger className={errors.system_type ? "border-destructive" : ""}>
                <SelectValue placeholder="Select system type" />
              </SelectTrigger>
              <SelectContent>
                {SYSTEM_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.system_type && (
              <p className="text-sm text-destructive">{errors.system_type[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="owner_team">Owner Team <span className="text-red-500">*</span></Label>
            <Select
              value={formData.owner_team}
              onValueChange={(value) => handleInputChange("owner_team", value as OwnerTeam)}
            >
              <SelectTrigger className={errors.owner_team ? "border-destructive" : ""}>
                <SelectValue placeholder="Select owner team" />
              </SelectTrigger>
              <SelectContent>
                {OWNER_TEAM_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.owner_team && (
              <p className="text-sm text-destructive">{errors.owner_team[0]}</p>
            )}
          </div>
        </div>
      </div>

      {/* Data Domains */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Data Domains</h3>
        <div className="flex flex-wrap gap-2 p-3 border border-[#E4E7EC] rounded-md bg-[#F9FAFB] min-h-[60px]">
          {DATA_DOMAIN_OPTIONS.map((option) => {
            const isSelected = formData.data_domains?.includes(option.value) || false;
            return (
              <Badge
                key={option.value}
                variant={isSelected ? "filled" : "light"}
                className={`cursor-pointer px-3 py-1 ${
                  isSelected
                    ? "bg-[#ECFDF3] text-[#047857] border-[#047857] hover:bg-[#D1FADF]"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => handleDataDomainToggle(option.value)}
              >
                {option.label}
              </Badge>
            );
          })}
        </div>
        {errors.data_domains && (
          <p className="text-sm text-destructive">{errors.data_domains[0]}</p>
        )}
      </div>

      {/* Location & Classification */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Location & Classification</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="residency">Data Residency <span className="text-red-500">*</span></Label>
            <Select
              value={formData.residency}
              onValueChange={(value) => handleInputChange("residency", value as DataResidency)}
            >
              <SelectTrigger className={errors.residency ? "border-destructive" : ""}>
                <SelectValue placeholder="Select data residency" />
              </SelectTrigger>
              <SelectContent>
                {DATA_RESIDENCY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.residency && (
              <p className="text-sm text-destructive">{errors.residency[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="criticality_level">Criticality Level</Label>
            <Select
              value={formData.criticality_level || "null"}
              onValueChange={(value) => {
                if (value === "null") {
                  handleInputChange("criticality_level", null);
                } else {
                  handleInputChange("criticality_level", value as CriticalityLevel);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select criticality level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="null">None</SelectItem>
                {CRITICALITY_LEVEL_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.criticality_level && (
              <p className="text-sm text-destructive">{errors.criticality_level[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="hosting_model">Hosting Model <span className="text-red-500">*</span></Label>
            <Select
              value={formData.hosting_model}
              onValueChange={(value) => handleInputChange("hosting_model", value as HostingModel)}
            >
              <SelectTrigger className={errors.hosting_model ? "border-destructive" : ""}>
                <SelectValue placeholder="Select hosting model" />
              </SelectTrigger>
              <SelectContent>
                {HOSTING_MODEL_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.hosting_model && (
              <p className="text-sm text-destructive">{errors.hosting_model[0]}</p>
            )}
          </div>
        </div>
      </div>

      {/* Ownership */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Ownership</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="technical_owner">Technical Owner <span className="text-red-500">*</span></Label>
            <Select
              value={formData.technical_owner}
              onValueChange={(value) => handleInputChange("technical_owner", value as OwnerTeam)}
            >
              <SelectTrigger className={errors.technical_owner ? "border-destructive" : ""}>
                <SelectValue placeholder="Select technical owner" />
              </SelectTrigger>
              <SelectContent>
                {OWNER_TEAM_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.technical_owner && (
              <p className="text-sm text-destructive">{errors.technical_owner[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="business_owner">Business Owner <span className="text-red-500">*</span></Label>
            <Select
              value={formData.business_owner}
              onValueChange={(value) => handleInputChange("business_owner", value as OwnerTeam)}
            >
              <SelectTrigger className={errors.business_owner ? "border-destructive" : ""}>
                <SelectValue placeholder="Select business owner" />
              </SelectTrigger>
              <SelectContent>
                {OWNER_TEAM_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.business_owner && (
              <p className="text-sm text-destructive">{errors.business_owner[0]}</p>
            )}
          </div>
        </div>
      </div>

      {/* Review Schedule */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Review Schedule</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="last_review_date">Last Review Date</Label>
            <Input
              id="last_review_date"
              type="date"
              value={formData.last_review_date || ""}
              onChange={(e) => handleInputChange("last_review_date", e.target.value || null)}
              className={errors.last_review_date ? "border-destructive" : ""}
            />
            {errors.last_review_date && (
              <p className="text-sm text-destructive">{errors.last_review_date[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="next_review_date">Next Review Due</Label>
            <Input
              id="next_review_date"
              type="date"
              value={formData.next_review_date || ""}
              onChange={(e) => handleInputChange("next_review_date", e.target.value || null)}
              className={errors.next_review_date ? "border-destructive" : ""}
            />
            {errors.next_review_date && (
              <p className="text-sm text-destructive">{errors.next_review_date[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange("status", value as DataSourceStatus)}
            >
              <SelectTrigger className={errors.status ? "border-destructive" : ""}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-destructive">{errors.status[0]}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSourceForm;
