"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import {
  type IncidentRootCauseAnalysis,
  RcaMethod,
} from "@/app/lib/features/incidentRootCauseAnalysesApi";
import { useGetAiIncidentQuery } from "@/app/lib/features/aiIncidentsApi";

interface IncidentRCAFormReadOnlyProps {
  rca: IncidentRootCauseAnalysis;
}

const RCA_METHOD_LABELS: Record<RcaMethod, string> = {
  [RcaMethod.FIVE_WHYS]: "5 Whys",
  [RcaMethod.FISHBONE]: "Fishbone",
  [RcaMethod.FAULT_TREE]: "Fault Tree",
  [RcaMethod.EVENT_CAUSAL]: "Event Causal",
  [RcaMethod.CHANGE]: "Change",
  [RcaMethod.TIMELINE]: "Timeline",
  [RcaMethod.BARRIER]: "Barrier",
  [RcaMethod.COMBINED]: "Combined",
};

const IncidentRCAFormReadOnly: React.FC<IncidentRCAFormReadOnlyProps> = ({
  rca,
}) => {
  const { data: incident } = useGetAiIncidentQuery(rca.ai_incident_id, {
    skip: !rca.ai_incident_id,
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
                `#${rca.ai_incident_id}`
              )}
            </p>
          </div>
          <div>
            <Label className="text-xs text-gray-500">RCA Method</Label>
            <p className="font-medium text-sm mt-1">
              {RCA_METHOD_LABELS[rca.rca_method] || rca.rca_method}
            </p>
          </div>
          {rca.analysis_date && (
            <div>
              <Label className="text-xs text-gray-500">Analysis Date</Label>
              <p className="font-medium text-sm mt-1">
                {formatDate(rca.analysis_date)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Analysis & Findings */}
      <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-sm text-gray-700">Analysis & Findings</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label className="text-xs text-gray-500">Immediate Cause</Label>
            <p className="font-medium text-sm mt-1 whitespace-pre-wrap">
              {rca.immediate_cause}
            </p>
          </div>
          <div>
            <Label className="text-xs text-gray-500">Root Causes</Label>
            <p className="font-medium text-sm mt-1 whitespace-pre-wrap">
              {rca.root_causes}
            </p>
          </div>
          {rca.contributing_factors && (
            <div>
              <Label className="text-xs text-gray-500">Contributing Factors</Label>
              <p className="font-medium text-sm mt-1 whitespace-pre-wrap">
                {rca.contributing_factors}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Control Failures & Recommendations */}
      <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-sm text-gray-700">
          Control Failures & Recommendations
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {rca.control_failures && (
            <div>
              <Label className="text-xs text-gray-500">Control Failures</Label>
              <p className="font-medium text-sm mt-1 whitespace-pre-wrap">
                {rca.control_failures}
              </p>
            </div>
          )}
          <div>
            <Label className="text-xs text-gray-500">Recommendations</Label>
            <p className="font-medium text-sm mt-1 whitespace-pre-wrap">
              {rca.recommendations}
            </p>
          </div>
        </div>
      </div>

      {/* Approval & Documentation */}
      <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-sm text-gray-700">
          Approval & Documentation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-gray-500">Lead Analyst</Label>
            <p className="font-medium text-sm mt-1">{rca.lead_analyst}</p>
          </div>
          {rca.review_committee && (
            <div>
              <Label className="text-xs text-gray-500">Review Committee</Label>
              <p className="font-medium text-sm mt-1">{rca.review_committee}</p>
            </div>
          )}
          {rca.approved_at && (
            <div>
              <Label className="text-xs text-gray-500">Approved At</Label>
              <p className="font-medium text-sm mt-1">
                {formatDateTime(rca.approved_at)}
              </p>
            </div>
          )}
          {rca.report_link && (
            <div className="md:col-span-2">
              <Label className="text-xs text-gray-500">Report Link</Label>
              <div className="mt-1">
                <a
                  href={rca.report_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-sm text-[#4FD58F] hover:underline flex items-center gap-1"
                >
                  {rca.report_link}
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
            <Label className="text-xs text-gray-500">RCA ID</Label>
            <p className="font-medium text-sm mt-1">
              {rca.display_id || `#${rca.id}`}
            </p>
          </div>
          <div>
            <Label className="text-xs text-gray-500">Created At</Label>
            <p className="font-medium text-sm mt-1">
              {formatDateTime(rca.created_at)}
            </p>
          </div>
          {rca.updated_at && (
            <div>
              <Label className="text-xs text-gray-500">Updated At</Label>
              <p className="font-medium text-sm mt-1">
                {formatDateTime(rca.updated_at)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncidentRCAFormReadOnly;

