"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetAiModelQuery } from "@/app/lib/features/aiModelsApi";
import { useRouter } from "next/navigation";
import DetailsHeader from "./modelDetails/DetailsHeader";
import BasicInfoModelDetails from "./modelDetails/BasicInfoModelDetails";
import StatusModelDetails from "./modelDetails/StatusModelDetails";
import OwnershipModelDetails from "./modelDetails/OwnershipModelDetails";
import MetadataModelDetails from "./modelDetails/MetadataModelDetails";
import LinkedUseCases from "./linkedUseCases/LinkedUseCases";

interface AiModelDetailsProps {
    aiModelId: string;
}

export const formatValue = (value: string | null): string => {
    if (!value) return "Not provided";
    return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const AiModelDetails: React.FC<AiModelDetailsProps> = ({ aiModelId }) => {
    const router = useRouter();
    const { data: aiModel, isLoading, error } = useGetAiModelQuery(Number(aiModelId));

    if (isLoading) {
        return (
            <div className="w-full p-6">
                <Card className="rounded-2xl border border-[#E4E7EC]">
                    <CardContent className="p-6">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                            <div className="space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error || !aiModel) {
        return (
            <div className="w-full p-6">
                <Card className="rounded-2xl border border-[#E4E7EC]">
                    <CardContent className="p-6">
                        <div className="text-center">
                            <h2 className="font-sans font-semibold text-xl text-[#1D2939] mb-2">AI Model Not Found</h2>
                            <p className="font-sans text-sm text-[#667085] mb-4">
                                The AI model you're looking for doesn't exist or has been removed.
                            </p>
                            <Button
                                onClick={() => router.push("/core-assets/ai-models")}
                                className="bg-[#4FD58F] text-white hover:bg-[#45c180]"
                            >
                                Back to AI Models
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <Card className="w-full gap-10 rotate-0 opacity-100 rounded-2xl border border-[#E4E7EC] px-4 md:px-6">
            <Tabs className="w-full" defaultValue="model-details">
                {/* Tabs Navigation */}
                <div className="flex flex-wrap justify-between items-start md:items-center gap-3">
                    <TabsList
                        className="flex sm:flex-wrap lg:flex-nowrap gap-2 h-auto md:h-10 
                        opacity-100 rounded-lg p-0.5 bg-[#F2F4F7] cursor-pointer 
                        overflow-x-auto scrollbar-hide w-full md:w-auto"
                    >
                        <TabsTrigger
                            className="flex-shrink-0 opacity-100 gap-2.5 px-5 py-[10px] rounded-md 
                                min-w-[120px] md:w-[137px] h-9 font-medium text-sm leading-5 
                                text-[#667085] data-[state=active]:bg-white 
                                data-[state=active]:text-[#101828] cursor-pointer"
                            value="model-details"
                        >
                            Model Details
                        </TabsTrigger>
                        <TabsTrigger
                            className="flex-shrink-0 opacity-100 gap-2.5 px-5 py-[10px] rounded-md 
                                min-w-[120px] md:w-[137px] h-9 font-medium text-sm leading-5 
                                text-[#667085] data-[state=active]:bg-white 
                                data-[state=active]:text-[#101828] cursor-pointer"
                            value="linked-use-cases"
                        >
                            Linked Use Cases
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* Tab Contents */}
                <TabsContent value="model-details">
                    <div className="w-full mt-10">
                        <DetailsHeader aiModel={aiModel} />
                        {/* Basic Information */}
                        <BasicInfoModelDetails aiModel={aiModel} />
                        {/* Status & Classification */}
                        <StatusModelDetails aiModel={aiModel} />
                        {/* Ownership & Governance */}
                        <OwnershipModelDetails aiModel={aiModel} />
                        {/* Metadata */}
                        <MetadataModelDetails aiModel={aiModel} />
                    </div>
                </TabsContent>
                <TabsContent value="linked-use-cases">
                    <div className="w-full mt-10">
                        <LinkedUseCases aiModelId={Number(aiModelId)} />
                    </div>
                </TabsContent>
            </Tabs>
        </Card>
    );
};

export default AiModelDetails;