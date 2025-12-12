"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { CreateDataSourceData } from "@/app/lib/features/dataSourcesApi";

interface DataSourceFormProps {
  formData: CreateDataSourceData;
  setFormData: React.Dispatch<React.SetStateAction<CreateDataSourceData>>;
  errors: Record<string, string[]>;
}

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

  const handleDataDomainAdd = (domain: string) => {
    if (domain.trim() && !formData.data_domains.includes(domain.trim())) {
      setFormData((prev) => ({
        ...prev,
        data_domains: [...prev.data_domains, domain.trim()],
      }));
    }
  };

  const handleDataDomainRemove = (domainToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      data_domains: prev.data_domains.filter((domain) => domain !== domainToRemove),
    }));
  };

  const DATA_DOMAIN_OPTIONS = [
    { value: "customer_data", label: "Customer Data" },
    { value: "product_data", label: "Product Data" },
    { value: "financial_data", label: "Financial Data" },
    { value: "operational_data", label: "Operational Data" },
    { value: "hr_data", label: "HR Data" },
    { value: "analytics_data", label: "Analytics Data" },
  ];

  const getDataDomainLabel = (value: string): string => {
    const found = DATA_DOMAIN_OPTIONS.find((opt) => opt.value === value);
    return found ? found.label : value;
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Basic Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
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

          <div className="space-y-2 w-full">
            <Label htmlFor="system_type">System Type <span className="text-red-500">*</span></Label>
            <Select
              key={`system_type-${formData.system_type || 'empty'}`}
              value={formData.system_type || ""}
              onValueChange={(value) => handleInputChange("system_type", value)}
            >
              <SelectTrigger className={errors.system_type ? "border-destructive w-full" : "w-full"}>
                <SelectValue placeholder="Select system type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Application DB">Application DB</SelectItem>
                <SelectItem value="Data Lake">Data Lake</SelectItem>
                <SelectItem value="Data Warehouse">Data Warehouse</SelectItem>
                <SelectItem value="Operational API">Operational API</SelectItem>
                <SelectItem value="Files/Buckets">Files/Buckets</SelectItem>
                <SelectItem value="3rd-Party SaaS">3rd-Party SaaS</SelectItem>
                <SelectItem value="Streaming/Kafka">Streaming/Kafka</SelectItem>
              </SelectContent>
            </Select>
            {errors.system_type && (
              <p className="text-sm text-destructive">{errors.system_type[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="owner_team">Owner Team <span className="text-red-500">*</span></Label>
            <Input
              id="owner_team"
              value={formData.owner_team}
              onChange={(e) => handleInputChange("owner_team", e.target.value)}
              className={errors.owner_team ? "border-destructive" : ""}
              placeholder="Enter owner team"
            />
            {errors.owner_team && (
              <p className="text-sm text-destructive">{errors.owner_team[0]}</p>
            )}
          </div>

          <div className="space-y-2 w-full">
            <Label htmlFor="access_method">Access Method <span className="text-red-500">*</span></Label>
            <Select
              key={`access_method-${formData.access_method || 'empty'}`}
              value={formData.access_method || ""}
              onValueChange={(value) => handleInputChange("access_method", value)}
            >
              <SelectTrigger className={errors.access_method ? "border-destructive w-full" : "w-full"}>
                <SelectValue placeholder="Select access method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="JDBC">JDBC</SelectItem>
                <SelectItem value="ODBC">ODBC</SelectItem>
                <SelectItem value="S3">S3</SelectItem>
                <SelectItem value="GCS">GCS</SelectItem>
                <SelectItem value="API">API</SelectItem>
                <SelectItem value="FTP/SFTP">FTP/SFTP</SelectItem>
                <SelectItem value="Kafka">Kafka</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.access_method && (
              <p className="text-sm text-destructive">{errors.access_method[0]}</p>
            )}
          </div>
        </div>
      </div>

      {/* Data Domains */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Data Domains</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="data_domains_picker">Select data domain <span className="text-red-500">*</span></Label>
            <Select  key={`data_domains_picker-${formData.data_domains.join(",") || "none"}`} onValueChange={(value) => handleDataDomainAdd(value)}>
              <SelectTrigger
                id="data_domains_picker"
                className={`w-full ${errors.data_domains ? "border-destructive" : ""}`}
              >
                <SelectValue placeholder="Choose a data domain" />
              </SelectTrigger>
              <SelectContent>
                {DATA_DOMAIN_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.data_domains && (
              <p className="text-sm text-destructive">{errors.data_domains[0]}</p>
            )}
            <p className="text-sm text-muted-foreground">Selected domains appear below. Click x to remove.</p>
          </div>
        </div>

        {formData.data_domains.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.data_domains.map((domain, index) => (
              <Badge key={index} variant="light" className="flex items-center gap-1">
                {getDataDomainLabel(domain)}
                <button
                  type="button"
                  onClick={() => handleDataDomainRemove(domain)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Residency & Classification */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Residency & Classification</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 w-full">
            <Label htmlFor="residency">Residency <span className="text-red-500">*</span></Label>
            <Select
              key={`residency-${formData.residency || 'empty'}`}
              value={formData.residency || ""}
              onValueChange={(value) => handleInputChange("residency", value)}
            >
              <SelectTrigger className={errors.residency ? "border-destructive w-full" : "w-full"}>
                <SelectValue placeholder="Select residency zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AE">AE (United Arab Emirates)</SelectItem>
                <SelectItem value="EU">EU (European Union)</SelectItem>
                <SelectItem value="KSA">KSA (Saudi Arabia)</SelectItem>
                <SelectItem value="US">US (United States)</SelectItem>
                <SelectItem value="UK">UK (United Kingdom)</SelectItem>
                <SelectItem value="QA">QA (Qatar)</SelectItem>
                <SelectItem value="JO">JO (Jordan)</SelectItem>
                <SelectItem value="MA">MA (Morocco)</SelectItem>
                <SelectItem value="BH">BH (Bahrain)</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.residency && (
              <p className="text-sm text-destructive">{errors.residency[0]}</p>
            )}
          </div>

          <div className="space-y-2 w-full">
            <Label htmlFor="classification">Classification <span className="text-red-500">*</span></Label>
            <Select
              key={`classification-${formData.classification || 'empty'}`}
              value={formData.classification || ""}
              onValueChange={(value) => handleInputChange("classification", value)}
            >
              <SelectTrigger className={errors.classification ? "border-destructive w-full" : "w-full"}>
                <SelectValue placeholder="Select classification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Public">Public</SelectItem>
                <SelectItem value="Internal">Internal</SelectItem>
                <SelectItem value="Confidential">Confidential</SelectItem>
                <SelectItem value="Restricted">Restricted</SelectItem>
              </SelectContent>
            </Select>
            {errors.classification && (
              <p className="text-sm text-destructive">{errors.classification[0]}</p>
            )}
          </div>
        </div>
      </div>

      {/* Hosting Details */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Hosting Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 w-full">
            <Label htmlFor="hosting_model">Hosting Model <span className="text-red-500">*</span></Label>
            <Select
              key={`hosting_model-${formData.hosting_model || 'empty'}`}
              value={formData.hosting_model || ""}
              onValueChange={(value) => handleInputChange("hosting_model", value)}
            >
              <SelectTrigger className={errors.hosting_model ? "border-destructive w-full" : "w-full"}>
                <SelectValue placeholder="Select hosting model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="on_prem">On-Premises</SelectItem>
                <SelectItem value="cloud">Cloud</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
            {errors.hosting_model && (
              <p className="text-sm text-destructive">{errors.hosting_model[0]}</p>
            )}
          </div>

          <div className="space-y-2 w-full">
            <Label htmlFor="service_model">Service Model <span className="text-red-500">*</span></Label>
            <Select
              key={`service_model-${formData.service_model || 'empty'}`}
              value={formData.service_model || ""}
              onValueChange={(value) => handleInputChange("service_model", value)}
            >
              <SelectTrigger className={errors.service_model ? "border-destructive w-full" : "w-full"}>
                <SelectValue placeholder="Select service model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="saas">SaaS</SelectItem>
                <SelectItem value="paas">PaaS</SelectItem>
                <SelectItem value="iaas">IaaS</SelectItem>
                <SelectItem value="on_prem">On-Premises</SelectItem>
              </SelectContent>
            </Select>
            {errors.service_model && (
              <p className="text-sm text-destructive">{errors.service_model[0]}</p>
            )}
          </div>

          <div className="space-y-2 w-full">
            <Label htmlFor="cloud_provider">Cloud Provider <span className="text-red-500">*</span></Label>
            <Select
              key={`cloud_provider-${formData.cloud_provider || 'empty'}`}
              value={formData.cloud_provider || ""}
              onValueChange={(value) => handleInputChange("cloud_provider", value)}
            >
              <SelectTrigger className={errors.cloud_provider ? "border-destructive w-full" : "w-full"}>
                <SelectValue placeholder="Select cloud provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aws">AWS</SelectItem>
                <SelectItem value="azure">Azure</SelectItem>
                <SelectItem value="gcp">Google Cloud Platform</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="none">None (On-Premises)</SelectItem>
              </SelectContent>
            </Select>
            {errors.cloud_provider && (
              <p className="text-sm text-destructive">{errors.cloud_provider[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="primary_region">Primary Region</Label>
            <Input
              id="primary_region"
              value={formData.primary_region || ""}
              onChange={(e) => handleInputChange("primary_region", e.target.value)}
              placeholder="Enter primary region (optional)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondary_region">Secondary Region</Label>
            <Input
              id="secondary_region"
              value={formData.secondary_region || ""}
              onChange={(e) => handleInputChange("secondary_region", e.target.value)}
              placeholder="Enter secondary region (optional)"
            />
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Additional Information</h3>

        <div className="space-y-2">
          <Label htmlFor="network_ref">Network Reference</Label>
          <Input
            id="network_ref"
            value={formData.network_ref || ""}
            onChange={(e) => handleInputChange("network_ref", e.target.value)}
            placeholder="Enter network reference (optional)"
          />
          <p className="text-sm text-muted-foreground">
            Optional network identifier or configuration reference
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="retention_policy_ref">Retention Policy Reference</Label>
          <Input
            id="retention_policy_ref"
            value={formData.retention_policy_ref || ""}
            onChange={(e) => handleInputChange("retention_policy_ref", e.target.value)}
            placeholder="Enter retention policy reference (optional)"
          />
          <p className="text-sm text-muted-foreground">
            Optional link to retention policy documentation
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="catalog_uri">Catalog URI</Label>
          <Input
            id="catalog_uri"
            value={formData.catalog_uri || ""}
            onChange={(e) => handleInputChange("catalog_uri", e.target.value)}
            placeholder="Enter catalog URI (optional)"
          />
          <p className="text-sm text-muted-foreground">
            Optional link to data catalog or discovery tool
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataSourceForm;

