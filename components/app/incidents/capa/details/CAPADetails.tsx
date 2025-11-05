"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useGetCorrectivePreventiveActionQuery } from "@/app/lib/features/correctivePreventiveActionsApi";

interface CAPADetailsProps {
  capaId: string;
}

const CAPADetails: React.FC<CAPADetailsProps> = ({ capaId }) => {
  const router = useRouter();
  const idNum = Number(capaId);
  const { data: capa, isLoading } = useGetCorrectivePreventiveActionQuery(idNum, { skip: Number.isNaN(idNum) });

  if (Number.isNaN(idNum)) {
    return (
      <div className="max-w-5xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent>
            <p className="text-[#667085]">Invalid CAPA ID</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent>
            <p className="text-[#667085]">Loading CAPA...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!capa) {
    return (
      <div className="max-w-5xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="flex items-center justify-between">
            <p className="text-[#667085]">CAPA not found</p>
            <Button onClick={() => router.push("/governance/incidents/capa")}>Back to CAPA</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">
                {capa.title}
              </h1>
              <p className="font-sans text-sm text-[#667085]">CAPA #{capa.id}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push(`/governance/incidents/capa/${capa.id}/edit`)}>
                Edit
              </Button>
              <Button onClick={() => router.push("/governance/incidents/capa")}>Back</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-[#667085]">Source</div>
              <div className="text-sm">{capa.source_type} #{capa.source_id}</div>
            </div>
            <div>
              <div className="text-xs text-[#667085]">Type</div>
              <div className="text-sm">{capa.capa_type.replace(/\b\w/g, (l) => l.toUpperCase())}</div>
            </div>
            <div>
              <div className="text-xs text-[#667085]">Priority</div>
              <div className="text-sm">{capa.priority.replace(/\b\w/g, (l) => l.toUpperCase())}</div>
            </div>
            <div>
              <div className="text-xs text-[#667085]">Owner Team</div>
              <div className="text-sm">{capa.owner_team.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</div>
            </div>
            <div>
              <div className="text-xs text-[#667085]">Assignee</div>
              <div className="text-sm">{capa.assignee || "—"}</div>
            </div>
            <div>
              <div className="text-xs text-[#667085]">Status</div>
              <div className="text-sm">{capa.status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</div>
            </div>
          </div>

          {capa.root_cause && (
            <div>
              <h3 className="text-sm font-medium mb-2">Root Cause</h3>
              <p className="text-sm text-[#667085]">{capa.root_cause}</p>
            </div>
          )}

          {capa.actions && (
            <div>
              <h3 className="text-sm font-medium mb-2">Actions</h3>
              <p className="text-sm text-[#667085]">{capa.actions}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-[#667085]">Due Date</div>
              <div className="text-sm">{new Date(capa.due_date).toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-xs text-[#667085]">Verification Result</div>
              <div className="text-sm">{capa.verification_result.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</div>
            </div>
          </div>

          {capa.evidence_link && (
            <div>
              <div className="text-xs text-[#667085]">Evidence Link</div>
              <a href={capa.evidence_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                {capa.evidence_link}
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CAPADetails;

