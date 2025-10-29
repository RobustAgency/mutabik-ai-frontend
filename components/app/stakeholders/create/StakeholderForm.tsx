"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { CreateStakeholderData } from "@/app/lib/features/stakeholdersApi";

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

  const handleRoleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const input = e.target as HTMLInputElement;
      handleRoleTagAdd(input.value);
      input.value = "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleInputChange("type", value)}
            >
              <SelectTrigger className={errors.type ? "border-destructive" : ""}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="person">Person</SelectItem>
                <SelectItem value="vendor_org">Vendor Organization</SelectItem>
                <SelectItem value="internal_org">Internal Organization</SelectItem>
                <SelectItem value="external_org">External Organization</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="display_name">Display Name *</Label>
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
            <Label htmlFor="legal_name">Legal Name *</Label>
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
            <Label htmlFor="org_unit">Organization Unit *</Label>
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
        <h3 className="text-lg font-semibold">Contact Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
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
            <Label htmlFor="phone">Phone *</Label>
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
        <h3 className="text-lg font-semibold">Organization Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vendor_id">Vendor ID *</Label>
            <Input
              id="vendor_id"
              value={formData.vendor_id}
              onChange={(e) => handleInputChange("vendor_id", e.target.value)}
              className={errors.vendor_id ? "border-destructive" : ""}
              placeholder="Enter vendor ID"
            />
            {errors.vendor_id && (
              <p className="text-sm text-destructive">{errors.vendor_id[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="classification">Classification *</Label>
            <Select
              value={formData.classification}
              onValueChange={(value) => handleInputChange("classification", value)}
            >
              <SelectTrigger className={errors.classification ? "border-destructive" : ""}>
                <SelectValue placeholder="Select classification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="internal">Internal</SelectItem>
                <SelectItem value="external">External</SelectItem>
                <SelectItem value="vendor">Vendor</SelectItem>
                <SelectItem value="partner">Partner</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="supplier">Supplier</SelectItem>
              </SelectContent>
            </Select>
            {errors.classification && (
              <p className="text-sm text-destructive">{errors.classification[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country *</Label>
            <Select
              value={formData.country}
              onValueChange={(value) => handleInputChange("country", value)}
            >
              <SelectTrigger className={errors.country ? "border-destructive" : ""}>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="CA">Canada</SelectItem>
                <SelectItem value="UK">United Kingdom</SelectItem>
                <SelectItem value="DE">Germany</SelectItem>
                <SelectItem value="FR">France</SelectItem>
                <SelectItem value="AU">Australia</SelectItem>
                <SelectItem value="JP">Japan</SelectItem>
                <SelectItem value="IN">India</SelectItem>
                <SelectItem value="BR">Brazil</SelectItem>
                <SelectItem value="MX">Mexico</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.country && (
              <p className="text-sm text-destructive">{errors.country[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone *</Label>
            <Select
              value={formData.timezone}
              onValueChange={(value) => handleInputChange("timezone", value)}
            >
              <SelectTrigger className={errors.timezone ? "border-destructive" : ""}>
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
        <h3 className="text-lg font-semibold">Role Tags</h3>
        
        <div className="space-y-2">
          <Label htmlFor="role_tags">Add Role Tags</Label>
          <Input
            id="role_tags"
            placeholder="Type a role tag and press Enter"
            onKeyPress={handleRoleTagKeyPress}
          />
          <p className="text-sm text-muted-foreground">
            Press Enter to add a role tag
          </p>
        </div>

        {formData.role_tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.role_tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {tag}
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
        <h3 className="text-lg font-semibold">Additional Information</h3>
        
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

        <div className="flex items-center space-x-2">
          <Switch
            id="active"
            checked={formData.active}
            onCheckedChange={(checked) => handleInputChange("active", checked)}
          />
          <Label htmlFor="active">Active Stakeholder</Label>
        </div>
        <p className="text-sm text-muted-foreground">
          Inactive stakeholders will not appear in active lists but will be retained for historical purposes.
        </p>
      </div>
    </div>
  );
};

export default StakeholderForm;
