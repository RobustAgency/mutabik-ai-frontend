"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { CreateStakeholderData } from "@/app/lib/features/stakeholdersApi";
import { useGetVendorsQuery } from "@/app/lib/features/vendorsApi";
import { CountryDropdown } from "react-country-region-selector";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import VendorModalForm from "@/components/app/vendors/create/VendorModalForm";

interface StakeholderFormProps {
  formData: CreateStakeholderData;
  setFormData: React.Dispatch<React.SetStateAction<CreateStakeholderData>>;
  errors: Record<string, string[]>;
}

const StakeholderForm: React.FC<StakeholderFormProps> = ({
  formData,
  setFormData,
  errors,
}) => {
  const { data: vendorsResponse, isLoading: isVendorsLoading } = useGetVendorsQuery();
  const vendors = vendorsResponse?.data || [];
  const noVendorsAvailable = !isVendorsLoading && vendors.length === 0;
  const handleInputChange = (field: keyof CreateStakeholderData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRoleTagAdd = (tag: string) => {
    if (tag.trim() && !formData.role_tags.includes(tag.trim())) {
      setFormData((prev) => ({
        ...prev,
        role_tags: [...prev.role_tags, tag.trim()],
      }));
    }
  };

  const handleRoleTagRemove = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      role_tags: prev.role_tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Removed unused key press handler

  const ROLE_TAG_OPTIONS = [
    { value: "model_owner", label: "Model Owner" },
    { value: "risk_analyst", label: "Risk Analyst" },
    { value: "IC", label: "Individual Contributor" },
    { value: "DS", label: "Data Scientist" },
    { value: "security_IR", label: "Security IR" },
  ];

  const getRoleTagLabel = (value: string): string => {
    const found = ROLE_TAG_OPTIONS.find((opt) => opt.value === value);
    return found ? found.label : value;
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Basic Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 w-full">
            <Label htmlFor="type">Type <span className="text-red-500">*</span></Label>
            <Select
              key={`type-${formData.type || 'empty'}`}
              value={formData.type || ""}
              onValueChange={(value) => handleInputChange("type", value)}
            >
              <SelectTrigger className={errors.type ? "border-destructive w-full" : "w-full"}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="person">Person</SelectItem>
                <SelectItem value="team">Team</SelectItem>
                <SelectItem value="vendor_org">Vendor</SelectItem>
                <SelectItem value="regulator">Regulator</SelectItem>
                <SelectItem value="customer_group">Customer Group</SelectItem>
                <SelectItem value="committee_secretariat">Committee Secretariat</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="display_name">Display Name <span className="text-red-500">*</span></Label>
            <Input
              id="display_name"
              value={formData.display_name}
              onChange={(e) => handleInputChange("display_name", e.target.value)}
              className={errors.display_name ? "border-destructive" : ""}
              placeholder="Enter display name"
            />
            {errors.display_name && (
              <p className="text-sm text-destructive">{errors.display_name[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="legal_name">Legal Name <span className="text-red-500">*</span></Label>
            <Input
              id="legal_name"
              value={formData.legal_name}
              onChange={(e) => handleInputChange("legal_name", e.target.value)}
              className={errors.legal_name ? "border-destructive" : ""}
              placeholder="Enter legal name"
            />
            {errors.legal_name && (
              <p className="text-sm text-destructive">{errors.legal_name[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="org_unit">Organization Unit <span className="text-red-500">*</span></Label>
            <Input
              id="org_unit"
              value={formData.org_unit}
              onChange={(e) => handleInputChange("org_unit", e.target.value)}
              className={errors.org_unit ? "border-destructive" : ""}
              placeholder="Enter organization unit"
            />
            {errors.org_unit && (
              <p className="text-sm text-destructive">{errors.org_unit[0]}</p>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Contact Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={errors.email ? "border-destructive" : ""}
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone <span className="text-red-500">*</span></Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className={errors.phone ? "border-destructive" : ""}
              placeholder="Enter phone number"
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone[0]}</p>
            )}
          </div>
        </div>
      </div>

      {/* Organization Details */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Organization Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vendor_id">Link Vendor</Label>
            <SelectWithInlineCreate
              key={`vendor_id-${formData.vendor_id || 'empty'}`}
              value={formData.vendor_id || ""}
              onValueChange={(value) => handleInputChange("vendor_id", value)}
              options={vendors.map((v: any) => ({
                id: v.id,
                label: v.vendor_name,
                value: String(v.id),
              }))}
              isLoading={isVendorsLoading}
              isEmpty={noVendorsAvailable}
              entityName="Vendor"
              modalForm={VendorModalForm}
              placeholder="Select vendor"
              error={!!errors.vendor_id}
            />
            {errors.vendor_id && (
              <p className="text-sm text-destructive">{errors.vendor_id[0]}</p>
            )}
          </div>

          <div className="space-y-2">
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
                <SelectItem value="internal">Internal</SelectItem>
                <SelectItem value="external">External</SelectItem>
              </SelectContent>
            </Select>
            {errors.classification && (
              <p className="text-sm text-destructive">{errors.classification[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country <span className="text-red-500">*</span></Label>
            <div className={errors.country ? "border-destructive rounded-md" : ""}>
              <CountryDropdown
                id="country"
                valueType="short"
                value={formData.country}
                onChange={(val) => handleInputChange("country", val)}
                aria-label="Select country"
                className="w-full h-[36px] text-gray-500 rounded-md border border-input bg-background px-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            {errors.country && (
              <p className="text-sm text-destructive">{errors.country[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone <span className="text-red-500">*</span></Label>
            <Select
              key={`timezone-${formData.timezone || 'empty'}`}
              value={formData.timezone || ""}
              onValueChange={(value) => handleInputChange("timezone", value)}
            >
              <SelectTrigger className={errors.timezone ? "border-destructive w-full" : "w-full"}>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                <SelectItem value="America/Chicago">America/Chicago (CST)</SelectItem>
                <SelectItem value="America/Denver">America/Denver (MST)</SelectItem>
                <SelectItem value="America/Los_Angeles">America/Los_Angeles (PST)</SelectItem>
                <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                <SelectItem value="Europe/Paris">Europe/Paris (CET)</SelectItem>
                <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                <SelectItem value="Asia/Shanghai">Asia/Shanghai (CST)</SelectItem>
                <SelectItem value="Australia/Sydney">Australia/Sydney (AEST)</SelectItem>
              </SelectContent>
            </Select>
            {errors.timezone && (
              <p className="text-sm text-destructive">{errors.timezone[0]}</p>
            )}
          </div>
        </div>
      </div>

      {/* Role Tags */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Role Tags</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="role_tags_picker">Select role tag <span className="text-red-500">*</span></Label>
            <Select key={`role_tags_picker-${formData.role_tags.join(",") || "none"}`} onValueChange={(value) => handleRoleTagAdd(value)}>
              <SelectTrigger
                id="role_tags_picker"
                className={`w-full ${errors.role_tags ? "border-destructive" : ""}`}
              >
                <SelectValue placeholder="Choose a role tag" />
              </SelectTrigger>
              <SelectContent>
                {ROLE_TAG_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role_tags && (
              <p className="text-sm text-destructive">{errors.role_tags[0]}</p>
            )}
            <p className="text-sm text-muted-foreground">Selected tags appear below. Click x to remove.</p>
          </div>
        </div>

        {formData.role_tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.role_tags.map((tag, index) => (
              <Badge key={index} variant="light" className="flex items-center gap-1">
                {getRoleTagLabel(tag)}
                <button
                  type="button"
                  onClick={() => handleRoleTagRemove(tag)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Additional Information */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Additional Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="external_ref">External Reference</Label>
            <Input
              id="external_ref"
              value={formData.external_ref}
              onChange={(e) => handleInputChange("external_ref", e.target.value)}
              placeholder="Enter external reference"
            />
            <p className="text-sm text-muted-foreground">
              Optional external reference or ID
            </p>
          </div>

          <div className="space-y-2 w-full">
            <Label htmlFor="active">Active Status <span className="text-red-500">*</span></Label>
            <Select
              key={`active-${formData.active || 'empty'}`}
              value={formData.active !== undefined && formData.active !== null ? (formData.active ? "true" : "false") : ""}
              onValueChange={(value) => handleInputChange("active", value === "true")}
            >
              <SelectTrigger className={`w-full ${errors.active ? "border-destructive" : ""}`}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
            {errors.active && (
              <p className="text-sm text-destructive">{errors.active[0]}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakeholderForm;
