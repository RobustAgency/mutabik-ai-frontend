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

interface BasicInfoProps {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ formData, setFormData }) => {
  // ✅ Local states for smooth typing
  const [titleInput, setTitleInput] = useState(formData.title);
  const [descriptionInput, setDescriptionInput] = useState(formData.description || "");
  const [businessObjectiveInput, setBusinessObjectiveInput] = useState(formData.business_objective || "");
  const [regScopeInput, setRegScopeInput] = useState(formData.regulatory_scope.join(", "));

  // Sync local state when formData resets
  useEffect(() => {
    setTitleInput(formData.title);
    setDescriptionInput(formData.description || "");
    setBusinessObjectiveInput(formData.business_objective || "");
    setRegScopeInput(formData.regulatory_scope.join(", "));
  }, [formData]);

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
            <Label>Title</Label>
            <Input
              required
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)} // smooth typing
              onBlur={() => setFormData((prev) => ({ ...prev, title: titleInput }))}
              placeholder="Retail Credit Risk Scoring"
              className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD]"
            />
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
              <SelectTrigger className="gap-2 px-4 py-[22px] rounded-lg border border-[#D0D5DD] bg-[#FFFFFF] cursor-pointer">
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
              required
              value={descriptionInput}
              onChange={(e) => setDescriptionInput(e.target.value)}
              onBlur={() => setFormData((prev) => ({ ...prev, description: descriptionInput }))}
              placeholder="Enter a description..."
              className="h-[74px] resize-none"
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
            <Label>Business Domain</Label>
            <Select
              value={formData.business_domain}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, business_domain: value }))}
            >
              <SelectTrigger className="w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border border-[#D0D5DD] bg-[#FFFFFF]">
                <SelectValue placeholder="Customer Service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Customer Service">Customer Service</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Label>Business Owner Email</Label>
            <Input
              required
              value={formData.business_owner_email}
              onChange={(e) => setFormData((prev) => ({ ...prev, business_owner_email: e.target.value }))}
              placeholder="a.owner@business.com"
              className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD]"
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Label>Technical Owner Email</Label>
            <Input
              required
              value={formData.technical_owner_email}
              onChange={(e) => setFormData((prev) => ({ ...prev, technical_owner_email: e.target.value }))}
              placeholder="a.tech@example.com"
              className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD]"
            />
          </div>
        </div>

        {/* Regulatory Scope + Sensitivity + Go Live Date */}
        <div className="flex flex-col md:flex-row w-full gap-6">
          <div className="flex flex-col gap-2 w-full">
            <Label>Regulatory Scope</Label>
            <Input
              required
              value={regScopeInput}
              onChange={(e) => setRegScopeInput(e.target.value)}
              onBlur={() =>
                setFormData((prev) => ({
                  ...prev,
                  regulatory_scope: regScopeInput
                    .split(",")
                    .map((x) => x.trim())
                    .filter((x) => x !== ""),
                }))
              }
              placeholder="GDPR, CCPA"
              className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD]"
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Label>Data Sensitivity</Label>
            <Select
              value={formData.data_sensitivity}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, data_sensitivity: value as FormDataType["data_sensitivity"] }))
              }
            >
              <SelectTrigger className="w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border border-[#D0D5DD] bg-[#FFFFFF]">
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
              className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;
