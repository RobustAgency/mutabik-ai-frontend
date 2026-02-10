"use client";

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vendorSchema, type VendorFormData } from "@/lib/schemas/vendor.schema";
import { BasicInformationStep } from "./steps/BasicInformationStep";
import { ClassificationStatusStep } from "./steps/ClassificationStatusStep";
import { PrimaryContactsStep } from "./steps/PrimaryContactsStep";
import { ServiceDetailsStep } from "./steps/ServiceDetailsStep";
import { MetadataStep } from "./steps/MetadataStep";

interface VendorFormProps {
  formData: VendorFormData;
  setFormData: React.Dispatch<React.SetStateAction<VendorFormData>>;
  errors: Record<string, string[]>;
}

const VendorForm: React.FC<VendorFormProps> = ({
  formData,
  setFormData,
  errors,
}) => {
  const methods = useForm<VendorFormData>({
    defaultValues: formData,
    resolver: zodResolver(vendorSchema) as any,
    mode: "onChange",
  });

  // Sync formData changes to react-hook-form when formData prop changes externally
  React.useEffect(() => {
    methods.reset(formData);
  }, [JSON.stringify(formData)]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync react-hook-form values back to parent formData
  React.useEffect(() => {
    const subscription = methods.watch((values) => {
      setFormData(values as VendorFormData);
    });
    return () => subscription.unsubscribe();
  }, [methods, setFormData]);

  // Sync external errors into react-hook-form
  React.useEffect(() => {
    Object.entries(errors).forEach(([field, fieldErrors]) => {
      if (fieldErrors && fieldErrors[0]) {
        methods.setError(field as any, {
          type: "manual",
          message: fieldErrors[0],
        });
      }
    });
  }, [errors, methods]);

  return (
    <FormProvider {...methods}>
      <div className="space-y-6">
        <BasicInformationStep />
        <ClassificationStatusStep />
        <PrimaryContactsStep />
        <MetadataStep />
        <ServiceDetailsStep />
      </div>
    </FormProvider>
  );
};

export default VendorForm;
