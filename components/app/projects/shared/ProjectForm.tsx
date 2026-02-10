"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { MultiStepWizard } from "@/components/app/useCases/create/MultiStepWizard";
import {
  projectSchema,
  type ProjectFormData,
} from "@/lib/schemas/project.schema";
import { useGetAiModelsQuery } from "@/app/lib/features/aiModelsApi";
import { useProjects } from "@/hooks/app/useProjects";
import type { Project, CreateProjectData } from "@/service/app/projects";
import { BasicInformationStep } from "@/components/app/projects/create/steps/BasicInformationStep";
import { FrameworksStep } from "@/components/app/projects/create/steps/FrameworksStep";
import { MembersStep } from "@/components/app/projects/create/steps/MembersStep";
import { GovernancePillar } from "@/utils/governancePillar";

interface ProjectFormProps {
  mode: "create" | "edit";
  initialData?: Project;
  title: string;
  description: string;
  onFinished?: (projectId: number) => void;
  initialStep?: number;
  initialProjectId?: number | null;
}

const WIZARD_STEPS = [
  {
    id: 1,
    title: "Basic Information",
    description: "AI model, name, description and governance pillar",
  },
  {
    id: 2,
    title: "Choose Frameworks",
    description: "Select a framework for this project",
  },
  {
    id: 3,
    title: "Add Members",
    description: "Assign teammates to the project",
  },
];

const initialFormData: ProjectFormData = {
  ai_model_id: undefined as any,
  name: "",
  description: "",
  governance_pillar: undefined as any,
};

export const ProjectForm: React.FC<ProjectFormProps> = ({
  mode,
  initialData,
  title,
  description,
  onFinished,
  initialStep = 1,
  initialProjectId = null,
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [projectId, setProjectId] = useState<number | null>(
    initialData?.id ?? initialProjectId,
  );
  const [selectedFrameworkId, setSelectedFrameworkId] = useState<number | null>(
    null,
  );
  const router = useRouter();

  const methods = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema) as any,
    defaultValues: initialFormData,
    mode: "onChange",
  });

  const {
    trigger,
    formState: { errors },
    reset,
    watch,
  } = methods;

  const { data: aiModels = [] } = useGetAiModelsQuery({ per_page: 100 });
  const {
    createProject,
    addFrameworks,
    loading: projectsLoading,
  } = useProjects();

  useEffect(() => {
    if (initialData) {
      reset({
        ai_model_id: initialData.ai_model_id!,
        name: initialData.name,
        description: initialData.description ?? "",
        governance_pillar: initialData.governance_pillar as GovernancePillar,
      });
      setProjectId(initialData.id);
    }
  }, [initialData, reset]);

  const validateStep1 = async () => {
    const isValid = await trigger([
      "ai_model_id",
      "name",
      "description",
      "governance_pillar",
    ]);
    return isValid;
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      const isValid = await validateStep1();
      if (!isValid) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const values = watch();
      const descriptionValue = (values.description || "").trim();

      const payload: CreateProjectData = {
        ai_model_id: Number(values.ai_model_id),
        name: values.name.trim(),
        description: descriptionValue.length > 0 ? descriptionValue : null,
        governance_pillar: values.governance_pillar,
      };

      const created = await createProject(payload);
      if (created) {
        setProjectId(created.id);
        setCurrentStep(2);
        router.replace(
          `/projects/create?step=2&project_id=${created.id}`,
          { scroll: false },
        );
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    if (currentStep === 2) {
      if (!projectId || !selectedFrameworkId) {
        console.error("Project ID and selected framework are required");
        return;
      }

      const success = await addFrameworks(projectId, {
        framework_id: selectedFrameworkId.toString(),
      });

      if (success) {
        setCurrentStep(3);
        router.replace(
          `/projects/create?step=3&project_id=${projectId}`,
          { scroll: false },
        );
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => {
      const next = Math.max(prev - 1, 1);
      if (projectId) {
        router.replace(
          `/projects/create?step=${next}&project_id=${projectId}`,
          { scroll: false },
        );
      } else {
        router.replace(`/projects/create?step=${next}`, { scroll: false });
      }
      return next;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFinalSubmit = () => {
    if (projectId && onFinished) {
      onFinished(projectId);
    }
  };

  const renderStepContent = () => {
    if (currentStep === 1) {
      return <BasicInformationStep aiModels={aiModels} />;
    }
    if (currentStep === 2) {
      return (
        <FrameworksStep
          selectedFrameworkId={selectedFrameworkId}
          onSelectFramework={setSelectedFrameworkId}
        />
      );
    }
    return <MembersStep projectId={projectId} />;
  };

  const anyErrors = Object.keys(errors).length > 0;

  return (
    <FormProvider {...methods}>
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="space-y-6 p-0">
            <div>
              <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">
                {title}
              </h1>
              <p className="font-sans text-sm text-[#667085] mt-1">
                {description}
              </p>
            </div>

            {anyErrors && currentStep === 1 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please fix the errors in the form before continuing.
                </AlertDescription>
              </Alert>
            )}

            <MultiStepWizard
              steps={WIZARD_STEPS}
              currentStep={currentStep}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSubmit={handleFinalSubmit}
              isLoading={projectsLoading}
              submitLabel={mode === "create" ? "Finish" : "Save changes"}
            >
              {renderStepContent()}
            </MultiStepWizard>
          </CardContent>
        </Card>
      </div>
    </FormProvider>
  );
};

