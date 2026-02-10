"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCreateStakeholderMutation, CreateStakeholderData } from "@/app/lib/features/stakeholdersApi";
import { stakeholderSchema, type StakeholderFormData } from "@/lib/schemas/stakeholder.schema";
import StakeholderForm from "./StakeholderForm";
                                                                                                                  
const initialFormData: StakeholderFormData = {
  type: "person",
  display_name: "",
  first_name: "",
  last_name: "",
  org_unit: "",
  email: "",
  phone: "",
  role_tags: [],
  timezone: "",
  classification: "internal",
  country: "",
  status: "active",
  secondary_email: null,
  mobile: null,
  external_ref: null,
  employee_id: null,
  cost_center: null,
  manager: null,
  delegate: null,
  notes: null,
  start_date: null,
  end_date: null,
};

const CreateStakeholder: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] =
    useState<StakeholderFormData>(initialFormData);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});
  const [createStakeholder, { isLoading }] = useCreateStakeholderMutation();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    // Validate using Zod schema
    const result = stakeholderSchema.safeParse(formData);
    if (!result.success) {
      const errors: Record<string, string[]> = {};
      result.error.issues.forEach((err) => {
        const path = err.path.join(".");
        errors[path] = [err.message];
      });
      setValidationErrors(errors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Convert StakeholderFormData to CreateStakeholderData
    const createData: CreateStakeholderData = {
      type: result.data.type,
      display_name: result.data.display_name,
      first_name: result.data.first_name,
      last_name: result.data.last_name,
      org_unit: result.data.org_unit,
      email: result.data.email,
      secondary_email: result.data.secondary_email || null,
      phone: result.data.phone,
      mobile: result.data.mobile || null,
      role_tags: result.data.role_tags,
      timezone: result.data.timezone,
      classification: result.data.classification,
      country: result.data.country,
      external_ref: result.data.external_ref || null,
      employee_id: result.data.employee_id || null,
      cost_center: result.data.cost_center || null,
      manager: result.data.manager || null,
      delegate: result.data.delegate || null,
      status: result.data.status,
      notes: result.data.notes || null,
      start_date: result.data.start_date || null,
      end_date: result.data.end_date || null,
    };

    try {
      await createStakeholder(createData).unwrap();
      router.push("/core-assets/stakeholders");
    } catch (err: any) {
      // Handle backend validation errors
      if (err?.data?.errors) {
        setValidationErrors(err.data.errors);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <form onSubmit={handleSave}>
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <div className="flex flex-col sm:flex-row items-start gap-3 justify-start sm:justify-between">
            <div>
              <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">
                New stakeholder
              </h1>
              <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">
                Create stakeholder registry which can be referenced across the platform
              </p>
            </div>
            <Button
              type="submit"
              className="flex gap-2 px-4 py-6 rounded-full border bg-[#4FD58F] opacity-100"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save new stakeholder"}
            </Button>
          </div>

          <CardContent className="space-y-10 w-full">
            {/* Show validation errors */}
            {Object.keys(validationErrors).length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <p className="font-semibold mb-2">
                    Please fix the following errors:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    {Object.entries(validationErrors).map(([field, errors]) => (
                      <li key={field}>
                        <span className="font-medium capitalize">
                          {field.replace(/_/g, " ")}:
                        </span>{" "}
                        {errors[0]}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <StakeholderForm
              formData={formData}
              setFormData={setFormData}
              errors={validationErrors}
            />
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default CreateStakeholder;
