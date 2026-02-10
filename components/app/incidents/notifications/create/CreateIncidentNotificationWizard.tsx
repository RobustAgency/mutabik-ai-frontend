"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { MultiStepWizard } from "@/components/app/useCases/create/MultiStepWizard";
import {
  incidentNotificationSchema,
  type IncidentNotificationFormData,
} from "@/lib/schemas/incidentNotification.schema";
import {
  useCreateIncidentNotificationMutation,
  CreateIncidentNotificationData,
  AudienceType,
  Channel,
  DeliveryStatus,
} from "@/app/lib/features/incidentNotificationsApi";
import { BasicInformationStep } from "./steps/BasicInformationStep";
import { NotificationDetailsStep } from "./steps/NotificationDetailsStep";
import { DeliveryStatusStep } from "./steps/DeliveryStatusStep";
import { FollowUpStep } from "./steps/FollowUpStep";
import { INCIDENT_NOTIFICATION_WIZARD_STEPS } from "../constants";

const initialFormData: IncidentNotificationFormData = {
  ai_incident_id: 0,
  template: null,
  language: null,
  regulatory_basis: null,
  notification_deadline: null,
  audience_type: AudienceType.INTERNAL_EXECUTIVE,
  channel: Channel.EMAIL,
  notice_summary: "",
  notice_link: null,
  sent_at: "",
  sent_by: null,
  delivery_status: DeliveryStatus.DRAFT,
  response_summary: null,
  follow_up_required: false,
  follow_up_date: null,
  follow_up_notes: null,
};

const CreateIncidentNotificationWizard: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [createNotification, { isLoading }] =
    useCreateIncidentNotificationMutation();

  const methods = useForm<IncidentNotificationFormData>({
    resolver: zodResolver(incidentNotificationSchema) as any,
    defaultValues: initialFormData,
    mode: "onChange",
  });

  const {
    handleSubmit,
    trigger,
    formState: { errors },
  } = methods;

  const validateStep = async (step: number): Promise<boolean> => {
    switch (step) {
      case 1:
        return await trigger(["ai_incident_id"]);
      case 2:
        return await trigger(["audience_type", "channel", "notice_summary"]);
      case 3:
        return await trigger(["sent_at", "delivery_status"]);
      case 4:
        return true; // Follow up step doesn't need validation
      default:
        return true;
    }
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      setCurrentStep((prev) =>
        Math.min(prev + 1, INCIDENT_NOTIFICATION_WIZARD_STEPS.length)
      );
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFormSubmit = handleSubmit(
    async (data: IncidentNotificationFormData) => {
      try {
        // Convert IncidentNotificationFormData to CreateIncidentNotificationData
        const createData: CreateIncidentNotificationData = {
          ai_incident_id: data.ai_incident_id,
          template: data.template || null,
          language: data.language || null,
          regulatory_basis: data.regulatory_basis || null,
          notification_deadline: data.notification_deadline || null,
          audience_type: data.audience_type,
          channel: data.channel,
          notice_summary: data.notice_summary,
          notice_link: data.notice_link || null,
          sent_at: data.sent_at,
          sent_by: data.sent_by || null,
          delivery_status: data.delivery_status,
          response_summary: data.response_summary || null,
          follow_up_required: data.follow_up_required ?? false,
          follow_up_date: data.follow_up_date || null,
          follow_up_notes: data.follow_up_notes || null,
        };
        await createNotification(createData).unwrap();
        router.push("/governance/incidents/notifications");
      } catch (error: any) {
        console.error("Failed to create incident notification:", error);
      }
    }
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInformationStep />;
      case 2:
        return <NotificationDetailsStep />;
      case 3:
        return <DeliveryStatusStep />;
      case 4:
        return <FollowUpStep />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <div className="mb-6">
          <h1 className="font-sans font-semibold text-2xl tracking-normal text-[#1D2939]">
            Create New Incident Notification
          </h1>
          <p className="font-sans font-normal text-sm tracking-normal text-[#667085] mt-1">
            Complete all steps to create your incident notification
          </p>
        </div>

        <CardContent className="space-y-8 w-full p-0">
          {/* Show validation errors */}
          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <p className="font-semibold mb-2">
                  Please fix the following errors:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  {Object.entries(errors).map(([field, error]) => {
                    const errorMessage = error?.message as string;
                    if (!errorMessage) return null;
                    return (
                      <li key={field}>
                        <span className="font-medium capitalize">
                          {field.replace(/_/g, " ")}:
                        </span>{" "}
                        {errorMessage}
                      </li>
                    );
                  })}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <FormProvider {...methods}>
            <MultiStepWizard
              currentStep={currentStep}
              steps={INCIDENT_NOTIFICATION_WIZARD_STEPS}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
              canProceed={true}
              submitLabel="Create Notification"
            >
              {renderStepContent()}
            </MultiStepWizard>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateIncidentNotificationWizard;

