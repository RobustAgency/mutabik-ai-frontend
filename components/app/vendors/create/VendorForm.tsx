"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { CreateVendorData } from "@/app/lib/features/vendorsApi";
import { useGetStakeholdersQuery } from "@/app/lib/features/stakeholdersApi";
import { CountryDropdown } from "react-country-region-selector";

interface VendorFormProps {
  formData: CreateVendorData;
  setFormData: React.Dispatch<React.SetStateAction<CreateVendorData>>;
  errors: Record<string, string[]>;
}

const VendorForm: React.FC<VendorFormProps> = ({
  formData,
  setFormData,
  errors,
}) => {
  const { data: stakeholders = [], isLoading: isStakeholdersLoading } = useGetStakeholdersQuery();

  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    primary: false,
  });

  // Local text inputs for metadata arrays to avoid reformatting while typing
  const [residencyOptionsText, setResidencyOptionsText] = useState<string>(() => {
    const existing = (formData.metadata as any)?.residency_options;
    return Array.isArray(existing) ? (existing as string[]).join(", ") : (existing || "");
  });
  const [websitesText, setWebsitesText] = useState<string>(() => {
    const existing = (formData.metadata as any)?.websites;
    return Array.isArray(existing) ? (existing as string[]).join(", ") : (existing || "");
  });

  // Sync local text states when formData.metadata changes (e.g., in Edit flow)
  useEffect(() => {
    const meta = (formData.metadata as any) || {};
    const residency = Array.isArray(meta.residency_options)
      ? (meta.residency_options as string[]).join(", ")
      : (meta.residency_options || "");
    const sites = Array.isArray(meta.websites)
      ? (meta.websites as string[]).join(", ")
      : (meta.websites || "");
    setResidencyOptionsText(residency);
    setWebsitesText(sites);
  }, [formData.metadata]);

  const handleInputChange = (field: keyof CreateVendorData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddContact = () => {
    if (newContact.name.trim() && newContact.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newContact.email)) {
        return; // Validation handled by parent
      }
      setFormData((prev) => ({
        ...prev,
        primary_contacts: [
          ...prev.primary_contacts,
          {
            name: newContact.name.trim(),
            email: newContact.email.trim(),
            phone: newContact.phone.trim() || undefined,
            role: newContact.role.trim() || undefined,
            primary: newContact.primary,
          },
        ],
      }));
      setNewContact({ name: "", email: "", phone: "", role: "", primary: false });
    }
  };

  const handleRemoveContact = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      primary_contacts: prev.primary_contacts.filter((_, i) => i !== index),
    }));
  };

  const getError = (fieldName: string) => {
    // Handle nested field errors like primary_contacts.0.name
    if (fieldName.includes(".")) {
      const parts = fieldName.split(".");
      return errors[fieldName]?.[0] || errors[parts[0]]?.[0];
    }
    return errors[fieldName]?.[0];
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
          Basic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vendor_name">Vendor Name <span className="text-red-500">*</span></Label>
            <Input
              id="vendor_name"
              value={formData.vendor_name}
              onChange={(e) => handleInputChange("vendor_name", e.target.value)}
              className={errors.vendor_name ? "border-destructive" : ""}
              placeholder="Enter vendor name"
            />
            {getError("vendor_name") && (
              <p className="text-sm text-destructive">{getError("vendor_name")}</p>
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
            {getError("legal_name") && (
              <p className="text-sm text-destructive">{getError("legal_name")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="hq_country">HQ Country <span className="text-red-500">*</span></Label>
            <div className={errors.hq_country ? "border-destructive rounded-md" : ""}>
              <CountryDropdown
                id="hq_country"
                valueType="short"
                value={formData.hq_country}
                onChange={(val) => handleInputChange("hq_country", (val || "").toString().toUpperCase().slice(0, 2))
                }
                aria-label="Select HQ country"
                className="w-full h-[36px] text-gray-500 rounded-md border border-input bg-background px-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            {getError("hq_country") && (
              <p className="text-sm text-destructive">{getError("hq_country")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="risk_tier">Risk Tier <span className="text-red-500">*</span></Label>
            <Select
              key={`risk_tier-${formData.risk_tier || 'empty'}`}
              value={formData.risk_tier}
              onValueChange={(value) => handleInputChange("risk_tier", value as CreateVendorData["risk_tier"])}
            >
              <SelectTrigger className={errors.risk_tier ? "border-destructive w-full" : "w-full"}>
                <SelectValue placeholder="Select risk tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tier_1">Tier 1</SelectItem>
                <SelectItem value="tier_2">Tier 2</SelectItem>
                <SelectItem value="tier_3">Tier 3</SelectItem>
                <SelectItem value="tier_4">Tier 4</SelectItem>
              </SelectContent>
            </Select>
            {getError("risk_tier") && (
              <p className="text-sm text-destructive">{getError("risk_tier")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
            <Select
              key={`status-${formData.status || 'empty'}`}
              value={formData.status}
              onValueChange={(value) => handleInputChange("status", value as CreateVendorData["status"])}
            >
              <SelectTrigger className={errors.status ? "border-destructive w-full" : "w-full"}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="evaluating">Evaluating</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="conditionally_approved">Conditionally Approved</SelectItem>
                <SelectItem value="restricted">Restricted</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
            {getError("status") && (
              <p className="text-sm text-destructive">{getError("status")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="stakeholder_id">Stakeholder <span className="text-red-500">*</span></Label>
            <Select
              key={`stakeholder_id-${formData.stakeholder_id ?? 'none'}`}
              value={formData.stakeholder_id ? String(formData.stakeholder_id) : undefined}
              onValueChange={(value) => handleInputChange("stakeholder_id", Number(value))}
              disabled={isStakeholdersLoading}
            >
              <SelectTrigger className={errors.stakeholder_id ? "border-destructive w-full" : "w-full"}>
                <SelectValue placeholder={isStakeholdersLoading ? "Loading stakeholders..." : "Select stakeholder"} />
              </SelectTrigger>
              <SelectContent>
                {stakeholders.map((stakeholder) => (
                  <SelectItem key={stakeholder.id} value={String(stakeholder.id)}>
                    {stakeholder.display_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getError("stakeholder_id") && (
              <p className="text-sm text-destructive">{getError("stakeholder_id")}</p>
            )}
          </div>
        </div>
      </div>

      {/* Primary Contacts */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
          Primary Contacts
        </h3>

        {/* Add new contact form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-[#E4E7EC] rounded-lg">
          <div className="space-y-2">
            <Label htmlFor="contact_name">Contact Name</Label>
            <Input
              id="contact_name"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              placeholder="Enter contact name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_email">Contact Email</Label>
            <Input
              id="contact_email"
              type="email"
              value={newContact.email}
              onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
              placeholder="Enter contact email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_phone">Contact Phone</Label>
            <Input
              id="contact_phone"
              value={newContact.phone}
              onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
              placeholder="Enter contact phone"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_role">Contact Role</Label>
            <Input
              id="contact_role"
              value={newContact.role}
              onChange={(e) => setNewContact({ ...newContact, role: e.target.value })}
              placeholder="Enter contact role"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="contact_primary"
              type="checkbox"
              checked={newContact.primary}
              onChange={(e) => setNewContact({ ...newContact, primary: e.target.checked })}
            />
            <Label htmlFor="contact_primary">Primary</Label>
          </div>
          <div className="md:col-span-2">
            <Button
              type="button"
              onClick={handleAddContact}
              variant="outline"
              className="w-full"
              disabled={!newContact.name.trim() || !newContact.email.trim()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </div>

        {/* Display existing contacts */}
        {formData.primary_contacts.length > 0 && (
          <div className="space-y-2">
            <Label>Added Contacts</Label>
            <div className="space-y-2">
              {formData.primary_contacts.map((contact, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-[#E4E7EC] rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium">{contact.name}</div>
                    <div className="text-sm text-[#667085]">{contact.email}</div>
                    {contact.phone && (
                      <div className="text-sm text-[#667085]">{contact.phone}</div>
                    )}
                    {contact.role && (
                      <Badge variant="outlined" className="mt-1">
                        {contact.role}
                      </Badge>
                    )}
                    {contact.primary && (
                      <Badge variant="light" className="mt-1 ml-2">Primary</Badge>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveContact(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
          Metadata
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="meta_sub_processors_url">Sub-processors URL</Label>
            <Input
              id="meta_sub_processors_url"
              value={(formData.metadata as any)?.sub_processors_url || ""}
              onChange={(e) =>
                handleInputChange("metadata", {
                  ...(formData.metadata || {}),
                  sub_processors_url: e.target.value,
                })
              }
              placeholder="https://example.com/sub-processors"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="meta_residency_options">Residency options (comma separated)</Label>
            <Input
              id="meta_residency_options"
              value={residencyOptionsText}
              onChange={(e) => setResidencyOptionsText(e.target.value)}
              onBlur={() => {
                const arr = residencyOptionsText
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean);
                handleInputChange("metadata", {
                  ...(formData.metadata || {}),
                  residency_options: arr,
                });
              }}
              placeholder="EU, US-East, APAC"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="meta_websites">Websites (comma separated)</Label>
            <Input
              id="meta_websites"
              value={websitesText}
              onChange={(e) => setWebsitesText(e.target.value)}
              onBlur={() => {
                const arr = websitesText
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean);
                handleInputChange("metadata", {
                  ...(formData.metadata || {}),
                  websites: arr,
                });
              }}
              placeholder="vendor.com, status.vendor.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="meta_notes">Metadata notes</Label>
            <Textarea
              id="meta_notes"
              value={(formData.metadata as any)?.notes || ""}
              onChange={(e) =>
                handleInputChange("metadata", {
                  ...(formData.metadata || {}),
                  notes: e.target.value,
                })
              }
              placeholder="Any metadata notes"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
          Additional Information
        </h3>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes || ""}
            onChange={(e) => handleInputChange("notes", e.target.value || null)}
            placeholder="Enter any additional notes about this vendor"
            rows={4}
          />
        </div>
      </div>
    </div>
  );
};

export default VendorForm;

