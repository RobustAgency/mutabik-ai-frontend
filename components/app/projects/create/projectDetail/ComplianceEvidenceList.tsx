"use client";

import React from "react";
import { useGetComplianceEvidencesQuery } from "@/app/lib/features/complianceEvidenceApi";
import type { ComplianceEvidence } from "@/interfaces/ComplianceEvidence";
import { FileText } from "lucide-react";

interface ComplianceEvidenceListProps {
  projectId: number;
}

export const ComplianceEvidenceList: React.FC<ComplianceEvidenceListProps> = ({
  projectId,
}) => {
  const { data, isLoading } = useGetComplianceEvidencesQuery({
    project_id: projectId,
    per_page: 10,
  });

  const evidences = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="text-sm text-[#667085] py-4">Loading evidences...</div>
    );
  }

  if (evidences.length === 0) {
    return (
      <div className="text-sm text-[#667085] py-4">
        No compliance evidences found for this project.
      </div>
    );
  }

  const formatArtifactType = (type: string) => {
    return type.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-3">
      {evidences.map((evidence: ComplianceEvidence) => (
        <div
          key={evidence.id}
          className="flex items-center justify-between p-3 rounded-lg border border-[#E4E7EC] bg-white hover:bg-[#F9FAFB] transition-colors"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <FileText className="w-5 h-5 text-[#667085] flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-[#1D2939]">
                {evidence.control?.reference || `Control #${evidence.control_id}`}
                {evidence.requirement_id && (
                  <span className="text-[#667085] ml-2">
                    {evidence.requirement?.reference || `Req #${evidence.requirement_id}`}
                  </span>
                )}
              </div>
              <div className="text-xs text-[#667085] mt-1">
                {formatArtifactType(evidence.artifact_type)} • {formatDate(evidence.created_at)}
                {evidence.review_outcome && (
                  <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
                    evidence.review_outcome === 'pass' ? 'bg-green-100 text-green-800' :
                    evidence.review_outcome === 'fail' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {formatArtifactType(evidence.review_outcome)}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="text-xs text-[#667085] ml-3 truncate max-w-[200px]" title={evidence.artifact_uri}>
            {evidence.artifact_uri}
          </div>
        </div>
      ))}
    </div>
  );
};

