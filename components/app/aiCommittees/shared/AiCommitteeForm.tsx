"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { CreateAiCommitteeData } from "@/interfaces/AiCommittee";
import type { AiCommittee } from "@/interfaces/AiCommittee";
import {
  aiCommitteeSchema,
  type AiCommitteeFormData,
} from "@/lib/schemas/aiCommittee.schema";
import {
  AiCommitteeType,
  AiCommitteeCadence,
} from "@/interfaces/AiCommittee";

const initialFormData: AiCommitteeFormData = {
  name: "",
  type: AiCommitteeType.GOVERNANCE,
  charter: "",
  cadence: AiCommitteeCadence.MONTHLY,
  owner_team: "",
  active: true,
};

interface AiCommitteeFormProps {
  mode: "create" | "edit";
  initialData?: AiCommittee;
  isLoading?: boolean;
  onSubmit: (data: CreateAiCommitteeData | Partial<CreateAiCommitteeData>) => Promise<void>;
  onSuccess?: () => void;
  title: string;
  description: string;
  hideHeader?: boolean;
}

export const AiCommitteeForm: React.FC<AiCommitteeFormProps> = ({
  mode,
  initialData,
  isLoading = false,
  onSubmit,
  onSuccess,
  title,
  description,
  hideHeader = false,
}) => {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const methods = useForm<AiCommitteeFormData>({
    resolver: zodResolver(aiCommitteeSchema) as any,
    defaultValues: initialFormData,
    mode: "onChange",
  });

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = methods;

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        name: initialData.name,
        type: initialData.type,
        charter: initialData.charter,
        cadence: initialData.cadence,
        owner_team: initialData.owner_team,
        active: initialData.active,
      });
    }
  }, [mode, initialData, reset]);

  const watchedType = watch("type");
  const watchedCadence = watch("cadence");
  const watchedActive = watch("active");

  // Collect all validation errors
  const validationErrors = useMemo(() => {
    const errorObj: Record<string, string[]> = {};
    Object.entries(errors).forEach(([key, error]) => {
      if (error?.message) {
        errorObj[key] = [error.message as string];
      }
    });
    return errorObj;
  }, [errors]);

  const handleFormSubmit = handleSubmit(async (data: AiCommitteeFormData) => {
    setSubmitError(null);
    try {
      await onSubmit(data);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      const errorMessage =
        error?.error?.data?.message || "Failed to save AI Committee";
      setSubmitError(errorMessage);
    }
  });

  const typeOptions = [
    { value: AiCommitteeType.GOVERNANCE, label: "Governance" },
    { value: AiCommitteeType.ETHICS, label: "Ethics" },
    { value: AiCommitteeType.RISK, label: "Risk" },
    { value: AiCommitteeType.SECURITY, label: "Security" },
    { value: AiCommitteeType.PRIVACY, label: "Privacy" },
    { value: AiCommitteeType.PRODUCT_OPS, label: "Product Ops" },
    { value: AiCommitteeType.OTHER, label: "Other" },
  ];

  const cadenceOptions = [
    { value: AiCommitteeCadence.WEEKLY, label: "Weekly" },
    { value: AiCommitteeCadence.BIWEEKLY, label: "Biweekly" },
    { value: AiCommitteeCadence.MONTHLY, label: "Monthly" },
    { value: AiCommitteeCadence.QUARTERLY, label: "Quarterly" },
    { value: AiCommitteeCadence.AD_HOC, label: "Ad Hoc" },
  ];

  return (
    <FormProvider {...methods}>
      <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white flex flex-col gap-4 mx-auto px-4 sm:px-6 py-4">
        {!hideHeader && (
          <CardContent className="flex flex-col gap-2 pb-4">
            <h2 className="font-sans font-medium text-lg leading-6 tracking-normal text-[#000000]">
              {title}
            </h2>
            <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
              {description}
            </p>
          </CardContent>
        )}

        <CardContent>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Show validation errors in alert */}
            {Object.keys(validationErrors).length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <p className="font-semibold mb-2">Please fix the following errors:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {Object.entries(validationErrors).map(([field, fieldErrors]) => (
                      <li key={field}>
                        <span className="font-medium capitalize">
                          {field.replace(/_/g, " ")}:
                        </span>{" "}
                        {fieldErrors[0]}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Show submit error if any */}
            {submitError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              {/* Name and Type in one row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="Enter committee name"
                    className={errors.name ? "border-red-500" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">
                    Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                  key={`type-select-${watchedType}`}
                    value={watchedType}
                    onValueChange={(value) =>
                      setValue("type", value as AiCommitteeType, {
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger
                      className={`w-full ${errors.type ? "border-red-500" : ""}`}
                    >
                      <SelectValue placeholder="Select committee type" />
                    </SelectTrigger>
                    <SelectContent>
                      {typeOptions.map((option, index) => (
                        <SelectItem key={`type-${option.value}-${index}`} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Charter full width */}
              <div className="space-y-2">
                <Label htmlFor="charter">
                  Charter <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="charter"
                  {...register("charter")}
                  placeholder="Enter committee charter"
                  rows={8}
                  className={`min-h-32 resize-none ${errors.charter ? "border-red-500" : ""}`}
                />
              </div>

              {/* Cadence and Owner Team in one row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cadence">
                    Cadence <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    key={`cadence-select-${watchedCadence}`}
                    value={watchedCadence}
                    onValueChange={(value) =>
                      setValue("cadence", value as AiCommitteeCadence, {
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger
                      className={`w-full ${errors.cadence ? "border-red-500" : ""}`}
                    >
                      <SelectValue placeholder="Select meeting cadence" />
                    </SelectTrigger>
                    <SelectContent>
                      {cadenceOptions.map((option, index) => (
                        <SelectItem key={`cadence-${option.value}-${index}`} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="owner_team">
                    Owner Team <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="owner_team"
                    {...register("owner_team")}
                    placeholder="Enter owner team"
                    className={errors.owner_team ? "border-red-500" : ""}
                  />
                </div>
              </div>

              {/* Active switch */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={watchedActive}
                  onCheckedChange={(checked) =>
                    setValue("active", checked, { shouldValidate: true })
                  }
                />
                <Label htmlFor="active" className="cursor-pointer">
                  Active
                </Label>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? mode === "create"
                    ? "Creating..."
                    : "Updating..."
                  : mode === "create"
                  ? "Create Committee"
                  : "Update Committee"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </FormProvider>
  );
};

