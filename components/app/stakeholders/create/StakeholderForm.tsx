"use client";

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { stakeholderSchema, type StakeholderFormData } from "@/lib/schemas/stakeholder.schema";
import { BasicInformationStep } from "./steps/BasicInformationStep";
import { ContactInformationStep } from "./steps/ContactInformationStep";
import { OrganizationDetailsStep } from "./steps/OrganizationDetailsStep";
import { RoleTagsStep } from "./steps/RoleTagsStep";
import { AdditionalInformationStep } from "./steps/AdditionalInformationStep";

interface StakeholderFormProps {
  formData: StakeholderFormData;
  setFormData: React.Dispatch<React.SetStateAction<StakeholderFormData>>;
  errors: Record<string, string[]>;
}

const StakeholderForm: React.FC<StakeholderFormProps> = ({
  formData,
  setFormData,
  errors,
}) => {
  const methods = useForm<StakeholderFormData>({
    defaultValues: formData,
    resolver: zodResolver(stakeholderSchema) as any,
    mode: "onChange",
  });

  // Sync formData changes to react-hook-form when formData prop changes externally
  React.useEffect(() => {
    methods.reset(formData);
  }, [JSON.stringify(formData)]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync react-hook-form values back to parent formData
  React.useEffect(() => {
    const subscription = methods.watch((values) => {
      setFormData(values as StakeholderFormData);
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
        <ContactInformationStep />
        <OrganizationDetailsStep />
        <RoleTagsStep />
        <AdditionalInformationStep />
      </div>
    </FormProvider>
  );
};

export default StakeholderForm;
