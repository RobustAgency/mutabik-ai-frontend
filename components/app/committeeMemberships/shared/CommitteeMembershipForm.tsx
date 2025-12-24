"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { CreateCommitteeMembershipData } from "@/interfaces/CommitteeMembership";
import type { CommitteeMembership } from "@/interfaces/CommitteeMembership";
import {
  committeeMembershipSchema,
  type CommitteeMembershipFormData,
} from "@/lib/schemas/committeeMembership.schema";
import {
  CommitteeMembershipMemberRole,
  CommitteeMembershipEligibility,
} from "@/interfaces/CommitteeMembership";
import { useGetAiCommitteesQuery } from "@/app/lib/features/aiCommitteesApi";
import { useGetStakeholdersQuery } from "@/app/lib/features/stakeholdersApi";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import AiCommitteeModalForm from "@/components/app/aiCommittees/create/AiCommitteeModalForm";
import StakeholderModalForm from "@/components/app/stakeholders/create/StakeholderModalForm";

const initialFormData: Partial<CommitteeMembershipFormData> = {
  ai_committee_id: undefined,
  stakeholder_id: undefined,
  member_role: CommitteeMembershipMemberRole.VOTING_MEMBER,
  eligibility: CommitteeMembershipEligibility.ACTIVE,
  start_date: "",
  end_date: null,
  expertise_tags: [],
};

interface CommitteeMembershipFormProps {
  mode: "create" | "edit";
  initialData?: CommitteeMembership;
  isLoading?: boolean;
  onSubmit: (
    data: CreateCommitteeMembershipData | Partial<CreateCommitteeMembershipData>
  ) => Promise<void>;
  onSuccess?: () => void;
  title: string;
  description: string;
  hideHeader?: boolean;
}

export const CommitteeMembershipForm: React.FC<CommitteeMembershipFormProps> = ({
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
  const [expertiseTagsText, setExpertiseTagsText] = useState("");

  // Fetch data for dropdowns
  const { data: committeesData } = useGetAiCommitteesQuery({ per_page: 100 });
  const committees = committeesData?.data ?? [];
  const { data: stakeholders = [], isLoading: isLoadingStakeholders } = useGetStakeholdersQuery();

  const methods = useForm<CommitteeMembershipFormData>({
    resolver: zodResolver(committeeMembershipSchema) as any,
    defaultValues: initialFormData as CommitteeMembershipFormData,
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

  const watchedAiCommitteeId = watch("ai_committee_id");
  const watchedStakeholderId = watch("stakeholder_id");
  const watchedMemberRole = watch("member_role");
  const watchedEligibility = watch("eligibility");
  const watchedStartDate = watch("start_date");
  const watchedEndDate = watch("end_date");

  // Convert watched values to strings for SelectWithInlineCreate
  const aiCommitteeIdString = watchedAiCommitteeId !== undefined && watchedAiCommitteeId !== null 
    ? String(watchedAiCommitteeId) 
    : "";
  const stakeholderIdString = watchedStakeholderId !== undefined && watchedStakeholderId !== null 
    ? String(watchedStakeholderId) 
    : "";

  // Helper function to parse date strings to YYYY-MM-DD format for HTML date inputs
  const parseDateForInput = (dateString: string | null | undefined): string => {
    if (!dateString) return "";
    const datePart = dateString.split(/[T ]/)[0];
    return datePart || "";
  };

  useEffect(() => {
    if (mode === "edit" && initialData) {
      // Ensure all values are properly set
      const resetData = {
        ai_committee_id: initialData.ai_committee_id ?? undefined,
        stakeholder_id: initialData.stakeholder_id ?? undefined,
        member_role: initialData.member_role ?? CommitteeMembershipMemberRole.VOTING_MEMBER,
        eligibility: initialData.eligibility ?? CommitteeMembershipEligibility.ACTIVE,
        start_date: parseDateForInput(initialData.start_date) || "",
        end_date: parseDateForInput(initialData.end_date) || null,
        expertise_tags: initialData.expertise_tags || [],
      };
      reset(resetData);
      setExpertiseTagsText(
        initialData.expertise_tags && initialData.expertise_tags.length > 0
          ? initialData.expertise_tags.join(", ")
          : ""
      );
    }
  }, [mode, initialData, reset]);

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

  const handleExpertiseTagsChange = (text: string) => {
    setExpertiseTagsText(text);
    const parts = text
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    setValue("expertise_tags", parts, { shouldValidate: true });
  };

  const handleFormSubmit = handleSubmit(async (data: CommitteeMembershipFormData) => {
    setSubmitError(null);
    try {
      const payload: CreateCommitteeMembershipData = {
        ai_committee_id: data.ai_committee_id,
        stakeholder_id: data.stakeholder_id,
        member_role: data.member_role,
        eligibility: data.eligibility,
        start_date: data.start_date,
        end_date: data.end_date || null,
        expertise_tags: data.expertise_tags && data.expertise_tags.length > 0 ? data.expertise_tags : undefined,
      };
      await onSubmit(payload);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      const errorMessage =
        error?.error?.data?.message || "Failed to save committee membership";
      setSubmitError(errorMessage);
    }
  });

  const committeeOptions = useMemo(() => {
    return committees.map((committee) => ({
      value: committee.id.toString(),
      label: committee.name,
    }));
  }, [committees]);

  const stakeholderOptions = useMemo(() => {
    return stakeholders.map((stakeholder) => ({
      value: stakeholder.id.toString(),
      label: `${stakeholder.display_name}${stakeholder.email ? ` (${stakeholder.email})` : ""}`,
    }));
  }, [stakeholders]);

  const memberRoleOptions = [
    { value: CommitteeMembershipMemberRole.CHAIR, label: "Chair" },
    { value: CommitteeMembershipMemberRole.VOTING_MEMBER, label: "Voting Member" },
    { value: CommitteeMembershipMemberRole.ADVISOR, label: "Advisor" },
    { value: CommitteeMembershipMemberRole.SECRETARY, label: "Secretary" },
    { value: CommitteeMembershipMemberRole.OBSERVER, label: "Observer" },
  ];

  const eligibilityOptions = [
    { value: CommitteeMembershipEligibility.ACTIVE, label: "Active" },
    { value: CommitteeMembershipEligibility.SUSPENDED, label: "Suspended" },
    { value: CommitteeMembershipEligibility.TERM_ENDED, label: "Term Ended" },
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
              {/* Committee and Stakeholder in one row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ai_committee_id">
                    Committee <span className="text-red-500">*</span>
                  </Label>
                  <SelectWithInlineCreate
                  key={`ai_committee_id-select-${watchedAiCommitteeId}`} 
                    value={aiCommitteeIdString}
                    onValueChange={(value) => {
                      const numValue = value && value !== "" ? parseInt(value, 10) : undefined;
                      setValue("ai_committee_id", numValue as any, {
                        shouldValidate: true,
                      });
                    }}
                    placeholder="Select committee"
                    options={committeeOptions.map((opt) => ({
                      id: parseInt(opt.value, 10),
                      label: opt.label,
                      value: opt.value,
                    }))}
                    isLoading={!committeesData}
                    isEmpty={committees.length === 0}
                    entityName="AI Committee"
                    modalForm={AiCommitteeModalForm}
                    canCreate={true}
                    error={!!errors.ai_committee_id}
                    triggerClassName={errors.ai_committee_id ? "border-red-500" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stakeholder_id">
                    Stakeholder <span className="text-red-500">*</span>
                  </Label>
                  <SelectWithInlineCreate
                  key={`stakeholder_id-select-${watchedStakeholderId}`} 
                    value={stakeholderIdString}
                    onValueChange={(value) => {
                      const numValue = value && value !== "" ? parseInt(value, 10) : undefined;
                      setValue("stakeholder_id", numValue as any, {
                        shouldValidate: true,
                      });
                    }}
                    placeholder="Select stakeholder"
                    options={stakeholderOptions.map((opt) => ({
                      id: parseInt(opt.value, 10),
                      label: opt.label,
                      value: opt.value,
                    }))}
                    isLoading={isLoadingStakeholders}
                    isEmpty={!isLoadingStakeholders && stakeholders.length === 0}
                    entityName="Stakeholder"
                    modalForm={StakeholderModalForm}
                    canCreate={true}
                    error={!!errors.stakeholder_id}
                    triggerClassName={errors.stakeholder_id ? "border-red-500" : ""}
                  />
                </div>
              </div>

              {/* Member Role and Eligibility in one row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="member_role">
                    Member Role <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    key={`member_role-select-${watchedMemberRole}`}
                    value={watchedMemberRole || ""}
                    onValueChange={(value) =>
                      setValue("member_role", value as CommitteeMembershipMemberRole, {
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger
                      className={`w-full ${errors.member_role ? "border-red-500" : ""}`}
                    >
                      <SelectValue placeholder="Select member role" />
                    </SelectTrigger>
                    <SelectContent>
                      {memberRoleOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eligibility">
                    Eligibility <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    key={`eligibility-select-${watchedEligibility}`}
                    value={watchedEligibility || ""}
                    onValueChange={(value) =>
                      setValue("eligibility", value as CommitteeMembershipEligibility, {
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger
                      className={`w-full ${errors.eligibility ? "border-red-500" : ""}`}
                    >
                      <SelectValue placeholder="Select eligibility" />
                    </SelectTrigger>
                    <SelectContent>
                      {eligibilityOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Start Date and End Date in one row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">
                    Start Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="start_date"
                    type="date"
                    {...register("start_date")}
                    className={errors.start_date ? "border-red-500" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    {...register("end_date")}
                    className={errors.end_date ? "border-red-500" : ""}
                  />
                </div>
              </div>

              {/* Expertise Tags */}
              <div className="space-y-2">
                <Label htmlFor="expertise_tags">Expertise Tags</Label>
                <Input
                  id="expertise_tags"
                  value={expertiseTagsText}
                  onChange={(e) => handleExpertiseTagsChange(e.target.value)}
                  placeholder="Enter tags separated by commas (e.g., AI, ML, Ethics)"
                  className={errors.expertise_tags ? "border-red-500" : ""}
                />
                <p className="text-xs text-[#667085]">
                  Enter expertise tags separated by commas. Each tag must not exceed 50 characters.
                </p>
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
                  ? "Create Membership"
                  : "Update Membership"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </FormProvider>
  );
};

