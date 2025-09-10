"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import Breadcrumbs from "@/components/custom/Breadcrumbs";
import Description from "@/components/admin/frameworks/createFramework/Description";
import { CustomMultiSelect } from "@/components/admin/frameworks/CustomMultiSelect";
import { useRequirement, useRequirementMutations } from "@/hooks/admin/useRequirements";
import { useFrameworks } from "@/hooks/admin/useFrameworks";
import { Framework } from "@/interfaces/Framework";
import { toast } from "react-toastify";

interface RequirementFormProps {
    requirementId?: string;
    mode: "create" | "edit";
}

export default function RequirementForm({ requirementId, mode }: RequirementFormProps) {
    const router = useRouter();
    const { createRequirement, updateRequirement } = useRequirementMutations();
    const { requirement, loading: loadingRequirement } = useRequirement(requirementId || '');
    const { frameworks } = useFrameworks({ page: 1, per_page: 100 });
    console.log("frameworks", frameworks)

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        description: "",
        frameworks: [] as string[],
    });

    const breadcrumbItems = [
        { label: 'Requirements', href: '/admin/compliance-library/requirements' },
        { label: mode === 'create' ? 'Create Requirement' : 'Edit Requirement' },
    ];

    // Framework options for MultiSelect - showing code instead of name
    const frameworkOptions = frameworks?.map((framework: Framework) => ({
        value: framework.id.toString(),
        label: framework.code,
    })) || [];

    // Load requirement data in edit mode
    useEffect(() => {
        if (mode === "edit" && requirement) {
            setFormData({
                name: requirement.name || "",
                code: requirement.code || "",
                description: requirement.description || "",
                frameworks: requirement.frameworks?.map((f: any) => f.id.toString()) || [],
            });
        }
    }, [mode, requirement]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleDescriptionChange = (content: string) => {
        setFormData(prev => ({
            ...prev,
            description: content,
        }));
    };

    const handleFrameworksChange = (selectedFrameworks: string[]) => {
        setFormData(prev => ({
            ...prev,
            frameworks: selectedFrameworks,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.name.trim()) {
            toast.error("Requirement name is required");
            return;
        }

        if (!formData.code.trim()) {
            toast.error("Requirement code is required");
            return;
        }

        setLoading(true);
        try {
            const submitData = {
                name: formData.name.trim(),
                code: formData.code.trim(),
                description: formData.description,
                framework_ids: formData.frameworks.map(id => parseInt(id)),
            };

            console.log("Requirements payload:", submitData);

            if (mode === "create") {
                await createRequirement(submitData);
            } else if (requirementId) {
                await updateRequirement(requirementId, submitData);
            }
        } catch (error) {
            console.error("Error saving requirement:", error);
            // Error handling is done in the hooks
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        router.push("/admin/compliance-library/requirements");
    };

    if (mode === "edit" && loadingRequirement) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] px-2 flex flex-col items-center justify-center">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] px-6 py-6">
            {/* Breadcrumb */}
            <Breadcrumbs items={breadcrumbItems} />

            {/* Header */}
            <div className="mt-6 mb-8">
                <h1 className="text-3xl text-[#171717] font-bold">
                    {mode === "create" ? "Create Requirement" : "Edit Requirement"}
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Card className="bg-white shadow-none p-6">
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                                <div className="space-y-2 md:col-span-4">
                                    <Label htmlFor="name" className="text-sm font-medium text-gray-900">
                                        Title
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        placeholder="Enter requirement title"
                                        className="w-full h-12 rounded-lg border border-gray-300 px-4"
                                        disabled={loading}
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-1">
                                    <Label htmlFor="code" className="text-sm font-medium text-gray-900">
                                        Code
                                    </Label>
                                    <Input
                                        id="code"
                                        type="text"
                                        value={formData.code}
                                        onChange={(e) => handleInputChange("code", e.target.value)}
                                        placeholder="MRF-191"
                                        className="w-full h-12 rounded-lg border border-gray-300 px-4"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            <Description
                                value={formData.description}
                                onChange={handleDescriptionChange}
                            />
                        </Card>


                        <div className="flex items-center gap-3 pt-6">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="bg-primary text-white px-6 h-10 rounded-lg font-medium"
                            >
                                {loading ? (
                                    <>
                                        <Spinner />
                                        <span className="ml-2">
                                            {mode === "create" ? "Creating..." : "Updating..."}
                                        </span>
                                    </>
                                ) : (
                                    mode === "create" ? "Create" : "Update"
                                )}
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                disabled={loading}
                                className="px-6 h-10 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Right Column - Associations */}
                <div className="space-y-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Associations</h2>

                        <div className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-gray-900 mb-2 block">
                                    Linked Frameworks <span className="text-red-500">*</span>
                                </Label>
                                <CustomMultiSelect
                                    options={frameworkOptions}
                                    value={formData.frameworks}
                                    onChange={handleFrameworksChange}
                                    placeholder="Select option"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
