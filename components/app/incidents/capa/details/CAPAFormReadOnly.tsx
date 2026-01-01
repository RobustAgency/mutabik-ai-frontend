"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import {
  type CorrectivePreventiveAction,
  SourceType,
  CapaType,
  Priority,
  OwnerTeam,
  Status,
  VerificationResult,
} from "@/app/lib/features/correctivePreventiveActionsApi";
import { useGetAiModelQuery } from "@/app/lib/features/aiModelsApi";
import { useGetDatasetQuery } from "@/app/lib/features/datasetsApi";

interface CAPAFormReadOnlyProps {
  capa: CorrectivePreventiveAction;
}

const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  [SourceType.INCIDENT]: "Incident",
  [SourceType.RCA]: "RCA",
  [SourceType.AUDIT_FINDING]: "Audit Finding",
  [SourceType.RISK_ASSESSMENT]: "Risk Assessment",
  [SourceType.CUSTOMER_COMPLAINT]: "Customer Complaint",
  [SourceType.REGULATORY_REQUIREMENT]: "Regulatory Requirement",
};

const CAPA_TYPE_LABELS: Record<CapaType, string> = {
  [CapaType.CORRECTIVE]: "Corrective",
  [CapaType.PREVENTIVE]: "Preventive",
  [CapaType.BOTH]: "Both",
};

const PRIORITY_LABELS: Record<Priority, string> = {
  [Priority.LOW]: "Low",
  [Priority.MEDIUM]: "Medium",
  [Priority.HIGH]: "High",
  [Priority.CRITICAL]: "Critical",
};

const PRIORITY_COLORS: Record<Priority, string> = {
  [Priority.LOW]: "bg-blue-100 text-blue-800",
  [Priority.MEDIUM]: "bg-yellow-100 text-yellow-800",
  [Priority.HIGH]: "bg-orange-100 text-orange-800",
  [Priority.CRITICAL]: "bg-red-100 text-red-800",
};

const OWNER_TEAM_LABELS: Record<OwnerTeam, string> = {
  [OwnerTeam.AI_GOVERNANCE]: "AI Governance",
  [OwnerTeam.DATA_PRIVACY_OFFICE]: "Data Privacy Office",
  [OwnerTeam.DATA_GOVERNANCE]: "Data Governance",
  [OwnerTeam.ML_ENGINEERING]: "ML Engineering",
  [OwnerTeam.DATA_ENGINEERING]: "Data Engineering",
  [OwnerTeam.INFORMATION_SECURITY]: "Information Security",
  [OwnerTeam.LEGAL]: "Legal",
  [OwnerTeam.COMPLIANCE]: "Compliance",
  [OwnerTeam.EXECUTIVE_LEADERSHIP]: "Executive Leadership",
  [OwnerTeam.PRODUCT]: "Product",
  [OwnerTeam.CUSTOMER_SUCCESS]: "Customer Success",
};

const STATUS_LABELS: Record<Status, string> = {
  [Status.NEW]: "New",
  [Status.IN_PROGRESS]: "In Progress",
  [Status.BLOCKED]: "Blocked",
  [Status.PENDING_VERIFICATION]: "Pending Verification",
  [Status.CLOSED]: "Closed",
  [Status.OVERDUE]: "Overdue",
};

const STATUS_COLORS: Record<Status, string> = {
  [Status.NEW]: "bg-gray-100 text-gray-800",
  [Status.IN_PROGRESS]: "bg-blue-100 text-blue-800",
  [Status.BLOCKED]: "bg-red-100 text-red-800",
  [Status.PENDING_VERIFICATION]: "bg-yellow-100 text-yellow-800",
  [Status.CLOSED]: "bg-green-100 text-green-800",
  [Status.OVERDUE]: "bg-orange-100 text-orange-800",
};

const VERIFICATION_RESULT_LABELS: Record<VerificationResult, string> = {
  [VerificationResult.PENDING]: "Pending",
  [VerificationResult.VERIFIED_EFFECTIVE]: "Verified Effective",
  [VerificationResult.REQUIRES_REWORK]: "Requires Rework",
  [VerificationResult.VERIFIED_INEFFECTIVE]: "Verified Ineffective",
};

const VERIFICATION_RESULT_COLORS: Record<VerificationResult, string> = {
  [VerificationResult.PENDING]: "bg-gray-100 text-gray-800",
  [VerificationResult.VERIFIED_EFFECTIVE]: "bg-green-100 text-green-800",
  [VerificationResult.REQUIRES_REWORK]: "bg-yellow-100 text-yellow-800",
  [VerificationResult.VERIFIED_INEFFECTIVE]: "bg-red-100 text-red-800",
};

const CAPAFormReadOnly: React.FC<CAPAFormReadOnlyProps> = ({ capa }) => {
  const { data: aiModel } = useGetAiModelQuery(capa.ai_model_id || 0, {
    skip: !capa.ai_model_id,
  });
  const { data: dataset } = useGetDatasetQuery(capa.dataset_id || 0, {
    skip: !capa.dataset_id,
  });

  const formatDateTime = (dateString: string | null | undefined): string => {
    if (!dateString) return "Not specified";
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "Not specified";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Source Information */}
      <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-sm text-gray-700">Source Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-gray-500">Source Type</Label>
            <p className="font-medium text-sm mt-1">
              {SOURCE_TYPE_LABELS[capa.source_type]}
            </p>
          </div>
          <div>
            <Label className="text-xs text-gray-500">Source Reference</Label>
            <p className="font-medium text-sm mt-1">{capa.source_reference}</p>
          </div>
          {capa.ai_model_id && (
            <div>
              <Label className="text-xs text-gray-500">AI Model</Label>
              <p className="font-medium text-sm mt-1">
                {aiModel ? (
                  <Link
                    href={`/core-assets/models/${aiModel.id}/details`}
                    className="text-[#4FD58F] hover:underline"
                  >
                    {aiModel.name}
                  </Link>
                ) : (
                  `ID: ${capa.ai_model_id}`
                )}
              </p>
            </div>
          )}
          {capa.dataset_id && (
            <div>
              <Label className="text-xs text-gray-500">Dataset</Label>
              <p className="font-medium text-sm mt-1">
                {dataset ? (
                  <Link
                    href={`/core-assets/data/registry/${dataset.id}/details`}
                    className="text-[#4FD58F] hover:underline"
                  >
                    {dataset.name}
                  </Link>
                ) : (
                  `ID: ${capa.dataset_id}`
                )}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CAPA Details */}
      <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-sm text-gray-700">CAPA Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label className="text-xs text-gray-500">Title</Label>
            <p className="font-medium text-sm mt-1">{capa.title}</p>
          </div>
          <div>
            <Label className="text-xs text-gray-500">CAPA Type</Label>
            <p className="font-medium text-sm mt-1">
              {CAPA_TYPE_LABELS[capa.capa_type]}
            </p>
          </div>
          <div>
            <Label className="text-xs text-gray-500">Priority</Label>
            <div className="mt-1">
              <Badge className={PRIORITY_COLORS[capa.priority]}>
                {PRIORITY_LABELS[capa.priority]}
              </Badge>
            </div>
          </div>
          {capa.root_cause && (
            <div className="md:col-span-2">
              <Label className="text-xs text-gray-500">Root Cause</Label>
              <p className="font-medium text-sm mt-1 whitespace-pre-wrap">
                {capa.root_cause}
              </p>
            </div>
          )}
          <div className="md:col-span-2">
            <Label className="text-xs text-gray-500">Actions</Label>
            <p className="font-medium text-sm mt-1 whitespace-pre-wrap">
              {capa.actions}
            </p>
          </div>
        </div>
      </div>

      {/* Assignment & Timeline */}
      <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-sm text-gray-700">Assignment & Timeline</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-gray-500">Owner Team</Label>
            <p className="font-medium text-sm mt-1">
              {OWNER_TEAM_LABELS[capa.owner_team]}
            </p>
          </div>
          {capa.assignee && (
            <div>
              <Label className="text-xs text-gray-500">Assignee</Label>
              <p className="font-medium text-sm mt-1">{capa.assignee}</p>
            </div>
          )}
          <div>
            <Label className="text-xs text-gray-500">Due Date</Label>
            <p className="font-medium text-sm mt-1">{formatDate(capa.due_date)}</p>
          </div>
          <div>
            <Label className="text-xs text-gray-500">Status</Label>
            <div className="mt-1">
              <Badge className={STATUS_COLORS[capa.status]}>
                {STATUS_LABELS[capa.status]}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Verification & Success */}
      <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-sm text-gray-700">Verification & Success</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {capa.success_criteria && (
            <div className="md:col-span-2">
              <Label className="text-xs text-gray-500">Success Criteria</Label>
              <p className="font-medium text-sm mt-1 whitespace-pre-wrap">
                {capa.success_criteria}
              </p>
            </div>
          )}
          {capa.linked_training && (
            <div>
              <Label className="text-xs text-gray-500">Linked Training</Label>
              <p className="font-medium text-sm mt-1">{capa.linked_training}</p>
            </div>
          )}
          {capa.estimated_cost !== null && capa.estimated_cost !== undefined && (
            <div>
              <Label className="text-xs text-gray-500">Estimated Cost</Label>
              <p className="font-medium text-sm mt-1">
                ${capa.estimated_cost.toFixed(2)}
              </p>
            </div>
          )}
          {capa.verification_result && (
            <div>
              <Label className="text-xs text-gray-500">Verification Result</Label>
              <div className="mt-1">
                <Badge className={VERIFICATION_RESULT_COLORS[capa.verification_result]}>
                  {VERIFICATION_RESULT_LABELS[capa.verification_result]}
                </Badge>
              </div>
            </div>
          )}
          {capa.effectiveness_review_date && (
            <div>
              <Label className="text-xs text-gray-500">Effectiveness Review Date</Label>
              <p className="font-medium text-sm mt-1">
                {formatDate(capa.effectiveness_review_date)}
              </p>
            </div>
          )}
          {capa.evidence_link && (
            <div className="md:col-span-2">
              <Label className="text-xs text-gray-500">Evidence Link</Label>
              <div className="mt-1">
                <a
                  href={capa.evidence_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-sm text-[#4FD58F] hover:underline flex items-center gap-1"
                >
                  {capa.evidence_link}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-sm text-gray-700">Metadata</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-gray-500">CAPA ID</Label>
            <p className="font-medium text-sm mt-1">
              {capa.display_id || `#${capa.id}`}
            </p>
          </div>
          <div>
            <Label className="text-xs text-gray-500">Created At</Label>
            <p className="font-medium text-sm mt-1">
              {formatDateTime(capa.created_at)}
            </p>
          </div>
          {capa.updated_at && (
            <div>
              <Label className="text-xs text-gray-500">Updated At</Label>
              <p className="font-medium text-sm mt-1">
                {formatDateTime(capa.updated_at)}
              </p>
            </div>
          )}
          {capa.closed_at && (
            <div>
              <Label className="text-xs text-gray-500">Closed At</Label>
              <p className="font-medium text-sm mt-1">
                {formatDateTime(capa.closed_at)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CAPAFormReadOnly;

