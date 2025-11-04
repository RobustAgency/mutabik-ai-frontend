"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useGetAiIncidentQuery, useDeleteAiIncidentMutation } from "@/app/lib/features/aiIncidentsApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AiIncidentDetailsProps {
  incidentId: string;
}

const AiIncidentDetails: React.FC<AiIncidentDetailsProps> = ({ incidentId }) => {
  const router = useRouter();
  const idNum = Number(incidentId);
  const { data: incident, isLoading } = useGetAiIncidentQuery(idNum, { skip: Number.isNaN(idNum) });
  const [deleteIncident, { isLoading: isDeleting }] = useDeleteAiIncidentMutation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    if (!incident) return;
    try {
      await deleteIncident(incident.id).unwrap();
      setDeleteDialogOpen(false);
      router.push("/governance/incidents");
    } catch (e) {
      console.error("Failed to delete incident:", e);
    }
  };

  if (Number.isNaN(idNum)) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent>
            <p className="text-[#667085]">Invalid incident ID</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent>
            <p className="text-[#667085]">Loading incident...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="flex items-center justify-between">
            <p className="text-[#667085]">Incident not found</p>
            <Button onClick={() => router.push("/governance/incidents")}>Back to Incidents</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const categoryLabels: Record<string, string> = {
    safety: "Safety",
    privacy: "Privacy",
    security: "Security",
    bias_fairness: "Bias/Fairness",
    reliability: "Reliability",
    availability: "Availability",
    legal_compliance: "Legal Compliance",
    vendor: "Vendor",
    other: "Other",
  };

  const severityLabels: Record<string, string> = {
    sev1_critical: "Sev1 Critical",
    sev2_high: "Sev2 High",
    sev3_medium: "Sev3 Medium",
    sev4_low: "Sev4 Low",
    near_miss: "Near Miss",
  };

  const statusLabels: Record<string, string> = {
    open: "Open",
    contained: "Contained",
    monitoring: "Monitoring",
    resolved: "Resolved",
    closed: "Closed",
  };

  const stageLabels: Record<string, string> = {
    ideation: "Ideation",
    conception: "Conception",
    dev: "Development",
    test: "Test",
    staging: "Staging",
    prod: "Production",
    retirement: "Retirement",
  };

  return (
    <div className="max-w-7xl mx-auto">
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">
                {incident.title}
              </h1>
              <p className="font-sans text-sm text-[#667085]">{categoryLabels[incident.category]}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push(`/governance/incidents/${incident.id}/edit`)}>
                Edit
              </Button>
              <Button variant="outline" className="text-destructive" onClick={() => setDeleteDialogOpen(true)}>
                Delete
              </Button>
              <Button onClick={() => router.push("/governance/incidents")}>Back</Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
              <TabsTrigger value="rca">RCA</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="capa">CAPA</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Summary</h3>
                <p className="text-sm text-[#667085]">{incident.summary}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-[#667085]">Severity</div>
                  <div className="text-sm">{severityLabels[incident.severity]}</div>
                </div>
                <div>
                  <div className="text-xs text-[#667085]">Status</div>
                  <div className="text-sm">{statusLabels[incident.status]}</div>
                </div>
                <div>
                  <div className="text-xs text-[#667085]">Stage</div>
                  <div className="text-sm">{stageLabels[incident.stage]}</div>
                </div>
                <div>
                  <div className="text-xs text-[#667085]">IC Owner</div>
                  <div className="text-sm">{incident.ic_owner}</div>
                </div>
                <div>
                  <div className="text-xs text-[#667085]">Model ID</div>
                  <div className="text-sm">{incident.model_id || "—"}</div>
                </div>
                <div>
                  <div className="text-xs text-[#667085]">Model Version ID</div>
                  <div className="text-sm">{incident.model_version_id || "—"}</div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Timeline</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-xs text-[#667085]">First Seen</div>
                    <div>{new Date(incident.first_seen_at).toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#667085]">Declared</div>
                    <div>{new Date(incident.declared_at).toLocaleString()}</div>
                  </div>
                  {incident.resolved_at && (
                    <div>
                      <div className="text-xs text-[#667085]">Resolved</div>
                      <div>{new Date(incident.resolved_at).toLocaleString()}</div>
                    </div>
                  )}
                  {incident.closed_at && (
                    <div>
                      <div className="text-xs text-[#667085]">Closed</div>
                      <div>{new Date(incident.closed_at).toLocaleString()}</div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Impact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#667085]">
                  <div>
                    <div className="text-xs">Impacted Users</div>
                    <div>{incident.impacted_users || "—"}</div>
                  </div>
                  <div>
                    <div className="text-xs">Impacted Data</div>
                    <div>{incident.impacted_data?.join(", ") || "—"}</div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-xs">Impacted Systems</div>
                    <div>{incident.impacted_systems || "—"}</div>
                  </div>
                </div>
              </div>

              {(incident.linked_release_id || incident.linked_risk_id || incident.linked_assessment_id || incident.linked_capa_id || incident.evidence_link) && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Links & References</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#667085]">
                    {incident.linked_release_id && (
                      <div>
                        <div className="text-xs">Release ID</div>
                        <div>{incident.linked_release_id}</div>
                      </div>
                    )}
                    {incident.linked_risk_id && (
                      <div>
                        <div className="text-xs">Risk ID</div>
                        <div>{incident.linked_risk_id}</div>
                      </div>
                    )}
                    {incident.linked_assessment_id && (
                      <div>
                        <div className="text-xs">Assessment ID</div>
                        <div>{incident.linked_assessment_id}</div>
                      </div>
                    )}
                    {incident.linked_capa_id && (
                      <div>
                        <div className="text-xs">CAPA ID</div>
                        <div>{incident.linked_capa_id}</div>
                      </div>
                    )}
                    {incident.evidence_link && (
                      <div className="md:col-span-2">
                        <div className="text-xs">Evidence Link</div>
                        <a href={incident.evidence_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {incident.evidence_link}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="alerts" className="mt-6">
              <div className="text-center py-12 text-[#667085]">
                <p>Alerts feature coming soon</p>
                <p className="text-sm mt-2">This will display incident alerts in a data table</p>
              </div>
            </TabsContent>

            <TabsContent value="actions" className="mt-6">
              <div className="text-center py-12 text-[#667085]">
                <p>Actions feature coming soon</p>
                <p className="text-sm mt-2">This will display incident actions in a data table</p>
              </div>
            </TabsContent>

            <TabsContent value="rca" className="mt-6">
              <div className="text-center py-12 text-[#667085]">
                <p>Root Cause Analysis feature coming soon</p>
                <p className="text-sm mt-2">This will display RCA if exists or allow creation</p>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
              <div className="text-center py-12 text-[#667085]">
                <p>Notifications feature coming soon</p>
                <p className="text-sm mt-2">This will display incident notifications in a data table</p>
              </div>
            </TabsContent>

            <TabsContent value="capa" className="mt-6">
              <div className="text-center py-12 text-[#667085]">
                <p>CAPA feature coming soon</p>
                <p className="text-sm mt-2">This will display related CAPA items in a data table</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete AI Incident"
        description={`Are you sure you want to delete "${incident.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </div>
  );
};

export default AiIncidentDetails;

