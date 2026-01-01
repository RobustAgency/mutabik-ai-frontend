"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetDataElementQuery, useUpdateDataElementMutation, CreateDataElementData, PiiFlag, CdeFlag } from "@/app/lib/features/dataElementsApi";
import DataElementForm from "../create/DataElementForm";
import {
  validateTextField,
  createValidationErrors,
} from "@/lib/utils/validation";

interface EditDataElementProps {
  elementId: string;
}

const EditDataElement: React.FC<EditDataElementProps> = ({ elementId }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateDataElementData>({
    name: "",
    business_definition: null,
    data_type: "" as any,
    format: null,
    sensitivity: "" as any,
    pii_flag: PiiFlag.NO,
    personal_data_category: null,
    special_category_flag: "" as any,
    cde_flag: CdeFlag.NO,
    cde_category: null,
    owner_team: null,
    quality_rules_ref: null,
    catalog_column_id: null,
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  const { data: element, isLoading: isLoadingElement } = useGetDataElementQuery(elementId);
  const [updateDataElement, { isLoading: isUpdating }] = useUpdateDataElementMutation();

  useEffect(() => {
    if (element) {
      setFormData({
        name: element.name ?? "",
        business_definition: element.business_definition ?? null,
        data_type: element.data_type,
        format: element.format ?? null,
        sensitivity: element.sensitivity,
        pii_flag: element.pii_flag,
        personal_data_category: element.personal_data_category ?? null,
        special_category_flag: element.special_category_flag,
        cde_flag: element.cde_flag,
        cde_category: element.cde_category ?? null,
        owner_team: element.owner_team ?? null,
        quality_rules_ref: element.quality_rules_ref ?? null,
        catalog_column_id: element.catalog_column_id ?? null,
      });
    }
  }, [element]);

  const validateForm = (): boolean => {
    const fieldErrors: Record<string, string[]> = {
      name: validateTextField(formData.name, {
        required: true,
        messages: { required: "Name is required" },
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
    };

    // Business definition and owner_team are optional (nullable in backend)
    // Personal data category is optional even when PII flag is Yes (backend allows nullable)
    
    // CDE category is required only when CDE flag is Yes
    if (formData.cde_flag === CdeFlag.YES) {
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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      await updateDataElement({ id: elementId, data: formData }).unwrap();
      router.push("/core-assets/data/elements");
    } catch (err: any) {
      if (err?.data?.errors) {
        setValidationErrors(err.data.errors);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  if (isLoadingElement) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <p className="text-center text-muted-foreground">Loading data element...</p>
        </Card>
      </div>
    );
  }

  if (!element) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <p className="text-center text-destructive">Data element not found</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <form onSubmit={handleUpdate}>
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <div className="flex flex-col sm:flex-row items-start gap-3 justify-start sm:justify-between">
            <div>
              <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">Edit Data Element</h1>
              <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">Update data element information</p>
            </div>
            <Button type="submit" className="flex gap-2 px-4 py-6 rounded-full border bg-[#4FD58F] opacity-100" disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Data Element"}
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

export default EditDataElement;

