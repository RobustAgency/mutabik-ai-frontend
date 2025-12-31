"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import type { DataSourceFormData } from "@/lib/schemas/dataSource.schema";
import {
  SystemType,
  OwnerTeam,
  DataDomain,
} from "@/app/lib/features/dataSourcesApi";

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

export const BasicInformationStep: React.FC = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<DataSourceFormData>();

  const name = watch("name");
  const description = watch("description");
  const systemType = watch("system_type");
  const ownerTeam = watch("owner_team");
  const dataDomains = watch("data_domains") || [];

  const hasError = (fieldName: keyof DataSourceFormData) =>
    errors[fieldName] && errors[fieldName]?.message;
  const getError = (fieldName: keyof DataSourceFormData) =>
    errors[fieldName]?.message as string;

  const handleToggleDomain = (domain: DataDomain) => {
    if (dataDomains.includes(domain)) {
      setValue(
        "data_domains",
        dataDomains.filter((d) => d !== domain),
        { shouldValidate: true }
      );
    } else {
      setValue("data_domains", [...dataDomains, domain], { shouldValidate: true });
    }
  };

  const getDomainLabel = (value: DataDomain): string => {
    const found = DATA_DOMAIN_OPTIONS.find((opt) => opt.value === value);
    return found ? found.label : value;
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Essential Information <span className="text-red-500">*</span>
        </h2>
        <hr className="border-gray-200" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Source Name */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Source Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            {...register("name")}
            className={hasError("name") ? "border-red-500" : ""}
            placeholder="e.g., Customer CRM, Analytics Data Lake"
          />
          {hasError("name") && (
            <p className="text-sm text-red-500">{getError("name")}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">
            Description <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            {...register("description")}
            className={hasError("description") ? "border-red-500" : ""}
            placeholder="Detailed description of this data source, its purpose, and contents..."
            rows={4}
          />
          {hasError("description") && (
            <p className="text-sm text-red-500">{getError("description")}</p>
          )}
        </div>

        {/* System Type */}
        <div className="space-y-2">
          <Label htmlFor="system_type">
            System Type <span className="text-red-500">*</span>
          </Label>
          <Select
            key={`system_type-${systemType || "none"}`}
            value={systemType || ""}
            onValueChange={(value) => setValue("system_type", value as SystemType, { shouldValidate: true })}
          >
            <SelectTrigger
              className={`w-full ${hasError("system_type") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            >
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {SYSTEM_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError("system_type") && (
            <p className="text-sm text-red-500">{getError("system_type")}</p>
          )}
        </div>

        {/* Owner Team */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="owner_team">
              Owner Team <span className="text-red-500">*</span>
            </Label>
            <Link
              href="/core-assets/stakeholders"
              className="text-sm text-[#4FD58F] hover:underline flex items-center gap-1"
            >
              Manage Teams
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
          <Select
            key={`owner_team-${ownerTeam || "none"}`}
            value={ownerTeam || ""}
            onValueChange={(value) => setValue("owner_team", value as OwnerTeam, { shouldValidate: true })}
          >
            <SelectTrigger
              className={`w-full ${hasError("owner_team") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            >
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {OWNER_TEAM_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError("owner_team") && (
            <p className="text-sm text-red-500">{getError("owner_team")}</p>
          )}
        </div>

        {/* Data Domains */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="data_domains">Data Domains</Label>
          <div className="flex flex-wrap gap-2 p-3 border border-[#E4E7EC] rounded-md bg-[#F9FAFB] min-h-[60px]">
            {DATA_DOMAIN_OPTIONS.map((option) => {
              const isSelected = dataDomains.includes(option.value);
              return (
                <Badge
                  key={option.value}
                  variant={isSelected ? "filled" : "light"}
                  className={`cursor-pointer px-3 py-1 ${
                    isSelected
                      ? "bg-[#ECFDF3] text-[#047857] border-[#047857] hover:bg-[#D1FADF]"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => handleToggleDomain(option.value)}
                >
                  {option.label}
                </Badge>
              );
            })}
          </div>
          <p className="text-xs text-gray-500">Business areas this source covers</p>
          {hasError("data_domains") && (
            <p className="text-sm text-red-500">{getError("data_domains")}</p>
          )}
        </div>
      </div>
    </div>
  );
};
