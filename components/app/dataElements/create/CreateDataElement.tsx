"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useCreateDataElementMutation,
  CreateDataElementData,
} from "@/app/lib/features/dataElementsApi";
import {
  validateTextField,
  createValidationErrors,
} from "@/lib/utils/validation";
import DataElementForm from "./DataElementForm";

const CreateDataElement: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateDataElementData>({
    name: "",
    business_definition: "",
    data_type: "",
    format: "",
    sensitivity: "",
    pii_flag: "No",
    personal_data_category: "",
    special_category_flag: "No",
    cde_flag: "No",
    cde_category: "",
    owner_team: "",
    quality_rules_ref: "",
    catalog_column_id: "",
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  const [createDataElement, { isLoading }] = useCreateDataElementMutation();

  const validateForm = (): boolean => {
    const fieldErrors: Record<string, string[]> = {
      name: validateTextField(formData.name, {
        required: true,
        messages: { required: "Name is required" },
      }),
      business_definition: validateTextField(formData.business_definition, {
        required: true,
        messages: { required: "Business definition is required" },
      }),
      data_type: validateTextField(formData.data_type, {
        required: true,
        messages: { required: "Data type is required" },
      }),
      sensitivity: validateTextField(formData.sensitivity, {
        required: true,
        messages: { required: "Sensitivity is required" },
      }),
      pii_flag: validateTextField(formData.pii_flag, {
        required: true,
        messages: { required: "PII flag is required" },
      }),
      special_category_flag: validateTextField(formData.special_category_flag, {
        required: true,
        messages: { required: "Special category flag is required" },
      }),
      cde_flag: validateTextField(formData.cde_flag, {
        required: true,
        messages: { required: "CDE flag is required" },
      }),
      owner_team: validateTextField(formData.owner_team, {
        required: true,
        messages: { required: "Owner team is required" },
      }),
    };

    if (formData.pii_flag === "Yes") {
      const personalCategoryErrors = validateTextField(formData.personal_data_category, {
        required: true,
        messages: {
          required: "Personal data category is required when PII flag is Yes",
        },
      });
      if (personalCategoryErrors.length) {
        fieldErrors.personal_data_category = personalCategoryErrors;
      }
    }

    if (formData.cde_flag === "Yes") {
      const cdeCategoryErrors = validateTextField(formData.cde_category, {
        required: true,
        messages: {
          required: "CDE category is required when CDE flag is Yes",
        },
      });
      if (cdeCategoryErrors.length) {
        fieldErrors.cde_category = cdeCategoryErrors;
      }
    }

    const errors = createValidationErrors(fieldErrors);
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      await createDataElement(formData).unwrap();
      router.push("/core-assets/data/elements");
    } catch (err: any) {
      if (err?.data?.errors) {
        setValidationErrors(err.data.errors);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <form onSubmit={handleSubmit}>
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <div className="flex flex-col sm:flex-row items-start gap-3 justify-start sm:justify-between">
            <div>
              <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">Create Data Element</h1>
              <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">Add a new canonical data element to the dictionary</p>
            </div>
            <Button type="submit" className="flex gap-2 px-4 py-6 rounded-full border bg-[#4FD58F] opacity-100" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Data Element"}
            </Button>
          </div>

          <CardContent className="space-y-10 w-full">
            {Object.keys(validationErrors).length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <p className="font-semibold mb-2">Please fix the following errors:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {Object.entries(validationErrors).map(([field, errors]) => (
                      <li key={field}>
                        <span className="font-medium capitalize">{field.replace(/_/g, " ")}:</span> {errors[0]}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <DataElementForm formData={formData} setFormData={setFormData} errors={validationErrors} />
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default CreateDataElement;

