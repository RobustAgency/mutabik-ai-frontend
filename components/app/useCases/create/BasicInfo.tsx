"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormDataType } from "./CreateUseCases";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";

interface BasicInfoProps {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
  errors?: Record<string, string[]>;
}

const regulatoryOptions = [
  "GDPR",
  "CCPA",
  "HIPAA",
  "SOX",
  "AI_ACT",
  "FINRA",
  "FDA",
  "PCI_DSS",
];

const BasicInfo: React.FC<BasicInfoProps> = ({ formData, setFormData, errors = {} }) => {
  const [titleInput, setTitleInput] = useState(formData.title);
  const [descriptionInput, setDescriptionInput] = useState(formData.description || "");
  const [businessObjectiveInput, setBusinessObjectiveInput] = useState(formData.business_objective || "");
  const [selectedScopes, setSelectedScopes] = useState<string[]>(formData.regulatory_scope || []);
  const [openRegScope, setOpenRegScope] = useState(false);

  useEffect(() => {
    setTitleInput(formData.title);
    setDescriptionInput(formData.description || "");
    setBusinessObjectiveInput(formData.business_objective || "");
    setSelectedScopes(formData.regulatory_scope || []);
  }, [formData]);

  const toggleScope = (scope: string) => {
    setSelectedScopes((prev) => {
      const newScopes = prev.includes(scope)
        ? prev.filter((s) => s !== scope)
        : [...prev, scope];
      setFormData((f) => ({ ...f, regulatory_scope: newScopes }));
      return newScopes;
    });
  };

  // Helper to check if field has error
  const hasError = (fieldName: string) => errors[fieldName] && errors[fieldName].length > 0;
  const getError = (fieldName: string) => errors[fieldName]?.[0];

  return (
    <div className="space-y-6 w-full">
      {/* Section Title */}
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Basic Info
        </h2>
        <hr className="border-gray-200" />
      </div>

      <div className="gap-6 w-full flex flex-col">
        {/* Title + Status */}
        <div className="flex flex-col md:flex-row w-full gap-6">
          <div className="flex flex-col gap-2 w-full">
            <Label>
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              required
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={() => setFormData((prev) => ({ ...prev, title: titleInput }))}
              placeholder="Retail Credit Risk Scoring"
              className={`h-[44px] w-full px-4 rounded-lg border ${hasError("title") ? "border-red-500" : "border-[#D0D5DD]"
                } focus:border-[#D0D5DD] focus:-ring-0`}
            />
            {hasError("title") && (
              <p className="text-sm text-red-500">{getError("title")}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Status</Label>
            <Select
              required
              value={formData.status}
              onValueChange={(val) =>
                setFormData((prev) => ({ ...prev, status: val as FormDataType["status"] }))
              }
            >
              <SelectTrigger className="gap-2 w-full px-4 py-[22px] rounded-lg border border-[#D0D5DD] bg-[#FFFFFF] cursor-pointer focus:border-[#D0D5DD] focus:-ring-0">
                <SelectValue placeholder="Draft" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="in_development">In Development</SelectItem>
                <SelectItem value="testing">Testing</SelectItem>
                <SelectItem value="staging">Staging</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="deprecated">Deprecated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Description + Business Objective */}
        <div className="flex flex-col md:flex-row w-full gap-6">
          <div className="flex flex-col gap-2 w-full">
            <Label>Description</Label>
            <Textarea
              value={descriptionInput}
              onChange={(e) => setDescriptionInput(e.target.value)}
              onBlur={() => setFormData((prev) => ({ ...prev, description: descriptionInput }))}
              placeholder="Enter a description..."
              className="placeholder:text-muted-foreground border dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md bg-transparent px-3 py-2 text-base shadow-xs outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-[74px] resize-none focus:outline-none focus:ring-0 focus:border-transparent"
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Label>Business Objective</Label>
            <Textarea
              value={businessObjectiveInput}
              onChange={(e) => setBusinessObjectiveInput(e.target.value)}
              onBlur={() => setFormData((prev) => ({ ...prev, business_objective: businessObjectiveInput }))}
              placeholder="Enter the business objective..."
              className="h-[74px] resize-none"
            />
          </div>
        </div>

        {/* Domain + Emails */}
        <div className="flex flex-col md:flex-row w-full gap-6">
          <div className="flex flex-col gap-2 w-full">
            <Label>
              Business Domain <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.business_domain}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, business_domain: value }))}
            >
              <SelectTrigger className={`w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border ${hasError("business_domain") ? "border-red-500" : "border-[#D0D5DD]"
                } bg-[#FFFFFF] focus:border-[#D0D5DD] focus:-ring-0`}>
                <SelectValue placeholder="Customer Service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Customer Service">Customer Service</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
              </SelectContent>
            </Select>
            {hasError("business_domain") && (
              <p className="text-sm text-red-500">{getError("business_domain")}</p>
            )}
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Label>
              Business Owner Email <span className="text-red-500">*</span>
            </Label>
            <Input
              required
              type="email"
              value={formData.business_owner_email}
              onChange={(e) => setFormData((prev) => ({ ...prev, business_owner_email: e.target.value }))}
              placeholder="a.owner@business.com"
              className={`h-[44px] w-full px-4 rounded-lg border ${hasError("business_owner_email") ? "border-red-500" : "border-[#D0D5DD]"
                } focus:border-[#D0D5DD] focus:-ring-0`}
            />
            {hasError("business_owner_email") && (
              <p className="text-sm text-red-500">{getError("business_owner_email")}</p>
            )}
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Label>
              Technical Owner Email <span className="text-red-500">*</span>
            </Label>
            <Input
              required
              type="email"
              value={formData.technical_owner_email}
              onChange={(e) => setFormData((prev) => ({ ...prev, technical_owner_email: e.target.value }))}
              placeholder="a.tech@example.com"
              className={`h-[44px] w-full px-4 rounded-lg border ${hasError("technical_owner_email") ? "border-red-500" : "border-[#D0D5DD]"
                } focus:border-[#D0D5DD] focus:-ring-0`}
            />
            {hasError("technical_owner_email") && (
              <p className="text-sm text-red-500">{getError("technical_owner_email")}</p>
            )}
          </div>
        </div>

        {/* Regulatory Scope + Sensitivity + Go Live Date */}
        <div className="flex flex-col md:flex-row w-full gap-6">
          <div className="flex flex-col gap-2 w-full">
            <Label>
              Regulatory Scope <span className="text-red-500">*</span>
            </Label>
            <Popover open={openRegScope} onOpenChange={setOpenRegScope}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`justify-between w-full h-[44px] border ${hasError("regulatory_scope") ? "border-red-500" : "border-[#D0D5DD]"
                    } text-left font-normal`}
                >
                  {selectedScopes.length > 0
                    ? selectedScopes.join(", ")
                    : "Select Regulatory Scopes"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[370px] max-h-[250px] overflow-y-auto">
                {regulatoryOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2 py-1">
                    <Checkbox
                      className="cursor-pointer"
                      id={option}
                      checked={selectedScopes.includes(option)}
                      onCheckedChange={() => toggleScope(option)}
                    />
                    <label
                      htmlFor={option}
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </PopoverContent>
            </Popover>
            {hasError("regulatory_scope") && (
              <p className="text-sm text-red-500">{getError("regulatory_scope")}</p>
            )}
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Label>Data Sensitivity</Label>
            <Select
              value={formData.data_sensitivity}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, data_sensitivity: value as FormDataType["data_sensitivity"] }))
              }
            >
              <SelectTrigger className="w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border border-[#D0D5DD] bg-[#FFFFFF] focus:border-[#D0D5DD] focus:-ring-0">
                <SelectValue placeholder="Public" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="internal">Internal</SelectItem>
                <SelectItem value="confidential">Confidential</SelectItem>
                <SelectItem value="restricted">Restricted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Label>Go Live Date</Label>
            <Input
              type="date"
              value={formData.go_live_date || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, go_live_date: e.target.value }))}
              className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;