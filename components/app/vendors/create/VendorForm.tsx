"use client";

import React, { useState } from "react";
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
  });

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
          },
        ],
      }));
      setNewContact({ name: "", email: "", phone: "", role: "" });
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
            <Label htmlFor="vendor_name">Vendor Name *</Label>
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
            <Label htmlFor="legal_name">Legal Name *</Label>
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
            <Label htmlFor="hq_country">HQ Country *</Label>
            <div className={errors.hq_country ? "border-destructive rounded-md" : ""}>
              <CountryDropdown
                id="hq_country"
                valueType="short"
                value={formData.hq_country}
                onChange={(val) => handleInputChange("hq_country", val)}
                aria-label="Select HQ country"
                className="w-full h-[36px] text-gray-500 rounded-md border border-input bg-background px-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            {getError("hq_country") && (
              <p className="text-sm text-destructive">{getError("hq_country")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="risk_tier">Risk Tier *</Label>
            <Select
              key={`risk_tier-${formData.risk_tier || 'empty'}`}
              value={formData.risk_tier}
              onValueChange={(value) => handleInputChange("risk_tier", value as CreateVendorData["risk_tier"])}
            >
              <SelectTrigger className={errors.risk_tier ? "border-destructive w-full" : "w-full"}>
                <SelectValue placeholder="Select risk tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tier 1">Tier 1</SelectItem>
                <SelectItem value="Tier 2">Tier 2</SelectItem>
                <SelectItem value="Tier 3">Tier 3</SelectItem>
                <SelectItem value="Tier 4">Tier 4</SelectItem>
              </SelectContent>
            </Select>
            {getError("risk_tier") && (
              <p className="text-sm text-destructive">{getError("risk_tier")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              key={`status-${formData.status || 'empty'}`}
              value={formData.status}
              onValueChange={(value) => handleInputChange("status", value as CreateVendorData["status"])}
            >
              <SelectTrigger className={errors.status ? "border-destructive w-full" : "w-full"}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            {getError("status") && (
              <p className="text-sm text-destructive">{getError("status")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="stakeholder_id">Link Stakeholder</Label>
            <Select
              key={`stakeholder_id-${formData.stakeholder_id || 'empty'}`}
              value={formData.stakeholder_id ? String(formData.stakeholder_id) : ""}
              onValueChange={(value) => handleInputChange("stakeholder_id", value ? Number(value) : null)}
              disabled={isStakeholdersLoading}
            >
              <SelectTrigger className={errors.stakeholder_id ? "border-destructive w-full" : "w-full"}>
                <SelectValue placeholder={isStakeholdersLoading ? "Loading stakeholders..." : "Select stakeholder"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
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
                      <Badge variant="outline" className="mt-1">
                        {contact.role}
                      </Badge>
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
          <p className="text-sm text-muted-foreground">
            Optional notes about the vendor
          </p>
        </div>
      </div>
    </div>
  );
};

export default VendorForm;

