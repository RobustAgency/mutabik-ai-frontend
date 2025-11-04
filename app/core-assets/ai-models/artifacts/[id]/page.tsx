"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  useGetAiModelArtifactQuery,
  useDeleteAiModelArtifactMutation,
} from "@/app/lib/features/aiModelArtifactsApi";
import { ArrowLeft, Trash2, ExternalLink } from "lucide-react";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { useState } from "react";

const Page = () => {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: artifact, isLoading } = useGetAiModelArtifactQuery(id, {
    skip: !id,
  });

  const [deleteArtifact, { isLoading: isDeleting }] =
    useDeleteAiModelArtifactMutation();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const formatBytes = (bytes: number | null | undefined) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const getArtifactTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      model_binary: "Model Binary",
      tokenizer: "Tokenizer",
      prompt_pack: "Prompt Pack",
      index: "Index",
      feature_store_export: "Feature Store Export",
      config: "Config",
      docker_image: "Docker Image",
      sbom: "SBOM",
    };
    return typeMap[type] || type;
  };

  const handleDelete = async () => {
    if (artifact) {
      try {
        await deleteArtifact(artifact.id).unwrap();
        router.push("/core-assets/ai-models/artifacts");
      } catch (error) {
        console.log(error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!artifact) {
    return (
      <div className="max-w-7xl mx-auto text-sm text-muted-foreground">
        Artifact not found
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white mx-auto px-4 sm:px-6 py-4">
          <CardContent className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/core-assets/ai-models/artifacts")}
                  className="h-10"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <div>
                  <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">
                    {artifact.artifact_id || `Artifact #${artifact.id}`}
                  </h1>
                  <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">
                    AI Model Artifact Details
                  </p>
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                className="h-10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Artifact Type */}
              <div className="space-y-2">
                <label className="text-xs text-[#667085] font-medium">Artifact Type</label>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-[#EFF8FF] text-[#175CD3] text-sm font-medium">
                    {getArtifactTypeLabel(artifact.artifact_type)}
                  </span>
                  <span className="text-sm text-[#667085]">
                    ({artifact.artifact_type})
                  </span>
                </div>
              </div>

              {/* Model Version */}
              {artifact.ai_model_version && (
                <div className="space-y-2">
                  <label className="text-xs text-[#667085] font-medium">Model Version</label>
                  <p className="text-sm text-[#101828]">
                    {artifact.ai_model_version.ai_model?.name || "N/A"} • v
                    {artifact.ai_model_version.version ||
                      artifact.ai_model_version.id}
                  </p>
                </div>
              )}

              {/* URI */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs text-[#667085] font-medium">URI</label>
                <div className="flex items-center gap-2 p-3 bg-[#F9FAFB] rounded-lg">
                  <p className="text-sm text-[#475467] flex-1 break-all">
                    {artifact.uri}
                  </p>
                  {artifact.uri && (
                    <a
                      href={artifact.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#175CD3] hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open
                    </a>
                  )}
                </div>
              </div>

              {/* Checksum */}
              {artifact.checksum && (
                <div className="space-y-2">
                  <label className="text-xs text-[#667085] font-medium">Checksum</label>
                  <p className="text-sm text-[#475467] font-mono break-all">
                    {artifact.checksum}
                  </p>
                </div>
              )}

              {/* Size */}
              <div className="space-y-2">
                <label className="text-xs text-[#667085] font-medium">Size</label>
                <p className="text-sm text-[#101828] font-medium">
                  {formatBytes(artifact.size_bytes)}
                </p>
              </div>

              {/* Created At */}
              <div className="space-y-2">
                <label className="text-xs text-[#667085] font-medium">Created At</label>
                <p className="text-sm text-[#101828] font-medium">
                  {formatDate(artifact.created_at)}
                </p>
              </div>

              {/* Created By */}
              {artifact.created_by && (
                <div className="space-y-2">
                  <label className="text-xs text-[#667085] font-medium">Created By</label>
                  <p className="text-sm text-[#101828] font-medium">
                    {artifact.created_by}
                  </p>
                </div>
              )}

              {/* Notes */}
              {artifact.notes && (
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs text-[#667085] font-medium">Notes</label>
                  <p className="text-sm text-[#475467] leading-5 whitespace-pre-wrap">
                    {artifact.notes}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Artifact"
        description={`Are you sure you want to delete this artifact? This action cannot be undone and will remove the artifact from the system permanently.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default Page;
