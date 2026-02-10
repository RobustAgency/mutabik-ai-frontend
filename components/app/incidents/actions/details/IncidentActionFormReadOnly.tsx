"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import {
  type IncidentAction,
  ActionType,
  ExecutionStatus,
  ApprovalRequired,
  ValidationResult,
} from "@/app/lib/features/incidentActionsApi";
import { useGetAiIncidentQuery } from "@/app/lib/features/aiIncidentsApi";
import { useGetStakeholderQuery } from "@/app/lib/features/stakeholdersApi";

interface IncidentActionFormReadOnlyProps {
  action: IncidentAction;
}

const ACTION_TYPE_LABELS: Record<ActionType, string> = {
  [ActionType.KILL_SWITCH]: "Kill Switch",
  [ActionType.MODEL_ROLLBACK]: "Model Rollback",
  [ActionType.DATA_ISOLATION]: "Data Isolation",
  [ActionType.ACCESS_REVOCATION]: "Access Revocation",
  [ActionType.SYSTEM_PATCH]: "System Patch",
  [ActionType.CONFIGURATION_CHANGE]: "Configuration Change",
  [ActionType.COMMUNICATION_NOTIFICATION]: "Communication/Notification",
  [ActionType.INVESTIGATION]: "Investigation",
  [ActionType.CONTAINMENT]: "Containment",
  [ActionType.ERADICATION]: "Eradication",
  [ActionType.RECOVERY]: "Recovery",
  [ActionType.DOCUMENTATION]: "Documentation",
  [ActionType.OTHER]: "Other",
};

const EXECUTION_STATUS_LABELS: Record<ExecutionStatus, string> = {
  [ExecutionStatus.PLANNED]: "Planned",
  [ExecutionStatus.IN_PROGRESS]: "In Progress",
  [ExecutionStatus.COMPLETED]: "Completed",
  [ExecutionStatus.FAILED]: "Failed",
  [ExecutionStatus.ROLLED_BACK]: "Rolled Back",
};

const EXECUTION_STATUS_COLORS: Record<ExecutionStatus, string> = {
  [ExecutionStatus.PLANNED]: "bg-gray-100 text-gray-800",
  [ExecutionStatus.IN_PROGRESS]: "bg-blue-100 text-blue-800",
  [ExecutionStatus.COMPLETED]: "bg-green-100 text-green-800",
  [ExecutionStatus.FAILED]: "bg-red-100 text-red-800",
  [ExecutionStatus.ROLLED_BACK]: "bg-orange-100 text-orange-800",
};

const VALIDATION_RESULT_LABELS: Record<ValidationResult, string> = {
  [ValidationResult.PENDING]: "Pending",
  [ValidationResult.PARTIALLY_EFFECTIVE]: "Partially Effective",
  [ValidationResult.EFFECTIVE]: "Effective",
  [ValidationResult.INEFFECTIVE]: "Ineffective",
};

const VALIDATION_RESULT_COLORS: Record<ValidationResult, string> = {
  [ValidationResult.PENDING]: "bg-gray-100 text-gray-800",
  [ValidationResult.PARTIALLY_EFFECTIVE]: "bg-yellow-100 text-yellow-800",
  [ValidationResult.EFFECTIVE]: "bg-green-100 text-green-800",
  [ValidationResult.INEFFECTIVE]: "bg-red-100 text-red-800",
};

const APPROVAL_REQUIRED_LABELS: Record<ApprovalRequired, string> = {
  [ApprovalRequired.NO_APPROVAL_NEEDED]: "No Approval Needed",
  [ApprovalRequired.MANAGER_APPROVAL]: "Manager Approval",
  [ApprovalRequired.EXECUTIVE_APPROVAL]: "Executive Approval",
  [ApprovalRequired.LEGAL_APPROVAL]: "Legal Approval",
};

const IncidentActionFormReadOnly: React.FC<IncidentActionFormReadOnlyProps> = ({
  action,
}) => {
  const { data: incident } = useGetAiIncidentQuery(action.ai_incident_id, {
    skip: !action.ai_incident_id,
  });
  const { data: stakeholder } = useGetStakeholderQuery(action.performed_by, {
    skip: !action.performed_by,
  });

  const formatDateTime = (dateString: string | null | undefined): string => {
    if (!dateString) return "Not specified";
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-sm text-gray-700">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-gray-500">Incident</Label>
            <p className="font-medium text-sm mt-1">
              {incident ? (
                <Link
                  href={`/governance/incidents/${incident.id}/details`}
                  className="text-[#4FD58F] hover:underline"
                >
                  #{incident.id} - {incident.title}
                </Link>
              ) : (
                `#${action.ai_incident_id}`
              )}
            </p>
          </div>
          <div>
            <Label className="text-xs text-gray-500">Action Type</Label>
            <p className="font-medium text-sm mt-1">
              {ACTION_TYPE_LABELS[action.action_type] || action.action_type}
            </p>
          </div>
          <div className="md:col-span-2">
            <Label className="text-xs text-gray-500">Description</Label>
            <p className="font-medium text-sm mt-1 whitespace-pre-wrap">
              {action.description}
            </p>
          </div>
        </div>
      </div>

      {/* Execution Details */}
      <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-sm text-gray-700">Execution Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-gray-500">Execution Status</Label>
            <div className="mt-1">
              <Badge className={EXECUTION_STATUS_COLORS[action.execution_status]}>
                {EXECUTION_STATUS_LABELS[action.execution_status]}
              </Badge>
            </div>
          </div>
          <div>
            <Label className="text-xs text-gray-500">Performed By</Label>
            <p className="font-medium text-sm mt-1">
              {stakeholder
                ? stakeholder.display_name
                : action.individual_name || `ID: ${action.performed_by}`}
            </p>
          </div>
          {action.individual_name && (
            <div>
              <Label className="text-xs text-gray-500">Individual Name</Label>
              <p className="font-medium text-sm mt-1">{action.individual_name}</p>
            </div>
          )}
          <div>
            <Label className="text-xs text-gray-500">Started At</Label>
            <p className="font-medium text-sm mt-1">
              {formatDateTime(action.started_at)}
            </p>
          </div>
          {action.completed_at && (
            <div>
              <Label className="text-xs text-gray-500">Completed At</Label>
              <p className="font-medium text-sm mt-1">
                {formatDateTime(action.completed_at)}
              </p>
            </div>
          )}
          {action.estimated_duration && (
            <div>
              <Label className="text-xs text-gray-500">Estimated Duration</Label>
              <p className="font-medium text-sm mt-1">{action.estimated_duration}</p>
            </div>
          )}
          {action.actual_duration && (
            <div>
              <Label className="text-xs text-gray-500">Actual Duration</Label>
              <p className="font-medium text-sm mt-1">{action.actual_duration}</p>
            </div>
          )}
        </div>
      </div>

      {/* Validation & Approval */}
      <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-sm text-gray-700">Validation & Approval</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-gray-500">Validation Result</Label>
            <div className="mt-1">
              <Badge className={VALIDATION_RESULT_COLORS[action.validation_result]}>
                {VALIDATION_RESULT_LABELS[action.validation_result]}
              </Badge>
            </div>
          </div>
          {action.approval_required && (
            <div>
              <Label className="text-xs text-gray-500">Approval Required</Label>
              <p className="font-medium text-sm mt-1">
                {APPROVAL_REQUIRED_LABELS[action.approval_required]}
              </p>
            </div>
          )}
          {action.validation_notes && (
            <div className="md:col-span-2">
              <Label className="text-xs text-gray-500">Validation Notes</Label>
              <p className="font-medium text-sm mt-1 whitespace-pre-wrap">
                {action.validation_notes}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-sm text-gray-700">Additional Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {action.depends_on && (
            <div>
              <Label className="text-xs text-gray-500">Depends On</Label>
              <p className="font-medium text-sm mt-1">{action.depends_on}</p>
            </div>
          )}
          {action.linked_release_id && (
            <div>
              <Label className="text-xs text-gray-500">Linked Release ID</Label>
              <p className="font-medium text-sm mt-1">{action.linked_release_id}</p>
            </div>
          )}
          {action.evidence_link && (
            <div className="md:col-span-2">
              <Label className="text-xs text-gray-500">Evidence Link</Label>
              <div className="mt-1">
                <a
                  href={action.evidence_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-sm text-[#4FD58F] hover:underline flex items-center gap-1"
                >
                  {action.evidence_link}
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
            <Label className="text-xs text-gray-500">Action ID</Label>
            <p className="font-medium text-sm mt-1">
              {action.display_id || `#${action.id}`}
            </p>
          </div>
          <div>
            <Label className="text-xs text-gray-500">Created At</Label>
            <p className="font-medium text-sm mt-1">
              {formatDateTime(action.created_at)}
            </p>
          </div>
          {action.updated_at && (
            <div>
              <Label className="text-xs text-gray-500">Updated At</Label>
              <p className="font-medium text-sm mt-1">
                {formatDateTime(action.updated_at)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncidentActionFormReadOnly;

