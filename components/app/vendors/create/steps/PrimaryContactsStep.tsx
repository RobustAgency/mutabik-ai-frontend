"use client";

import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import type { VendorFormData } from "@/lib/schemas/vendor.schema";

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  role: string;
  primary: boolean;
}

export const PrimaryContactsStep: React.FC = () => {
  const {
    setValue,
    watch,
  } = useFormContext<VendorFormData>();

  const contacts = watch("primary_contacts") || [];
  const [newContact, setNewContact] = useState<ContactForm>({
    name: "",
    email: "",
    phone: "",
    role: "",
    primary: false,
  });

  const handleAddContact = () => {
    if (!newContact.name.trim() || !newContact.email.trim()) {
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newContact.email)) {
      return;
    }

    const updatedContacts = [
      ...contacts,
      {
        name: newContact.name.trim(),
        email: newContact.email.trim(),
        phone: newContact.phone.trim() || null,
        role: newContact.role.trim() || null,
        primary: newContact.primary,
      },
    ];

    setValue("primary_contacts", updatedContacts, { shouldValidate: true });
    setNewContact({ name: "", email: "", phone: "", role: "", primary: false });
  };

  const handleRemoveContact = (index: number) => {
    const updatedContacts = contacts.filter((_, i) => i !== index);
    setValue("primary_contacts", updatedContacts, { shouldValidate: true });
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Step 3: Primary Contacts
        </h2>
        <hr className="border-gray-200" />
      </div>

      <div className="space-y-4">
        {/* Existing Contacts */}
        {contacts.length > 0 && (
          <div className="space-y-2">
            <Label>Existing Contacts ({contacts.length})</Label>
            <div className="space-y-2">
              {contacts.map((contact, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm text-[#1D2939]">
                      {contact.name}
                      {contact.primary && (
                        <Badge variant="light" color="success" className="ml-2">
                          Primary
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-[#667085]">{contact.email}</div>
                    {contact.phone && (
                      <div className="text-sm text-[#667085]">{contact.phone}</div>
                    )}
                    {contact.role && (
                      <div className="text-sm text-[#667085]">{contact.role}</div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveContact(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New Contact Form */}
        <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-white">
          <Label>Add New Contact</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact-name">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="contact-name"
                value={newContact.name}
                onChange={(e) =>
                  setNewContact({ ...newContact, name: e.target.value })
                }
                placeholder="Enter name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="contact-email"
                type="email"
                value={newContact.email}
                onChange={(e) =>
                  setNewContact({ ...newContact, email: e.target.value })
                }
                placeholder="Enter email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-phone">Phone</Label>
              <Input
                id="contact-phone"
                value={newContact.phone}
                onChange={(e) =>
                  setNewContact({ ...newContact, phone: e.target.value })
                }
                placeholder="Enter phone"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-role">Role</Label>
              <Input
                id="contact-role"
                value={newContact.role}
                onChange={(e) =>
                  setNewContact({ ...newContact, role: e.target.value })
                }
                placeholder="Enter role"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="contact-primary"
              checked={newContact.primary}
              onChange={(e) =>
                setNewContact({ ...newContact, primary: e.target.checked })
              }
              className="w-4 h-4 rounded border-gray-300"
            />
            <Label htmlFor="contact-primary" className="cursor-pointer">
              Mark as primary contact
            </Label>
          </div>

          <Button
            type="button"
            onClick={handleAddContact}
            className="bg-[#4FD58F] text-white hover:bg-[#3BC77A]"
            disabled={!newContact.name.trim() || !newContact.email.trim()}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>
    </div>
  );
};

