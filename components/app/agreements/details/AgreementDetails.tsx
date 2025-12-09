"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetAgreementQuery, useDeleteAgreementMutation } from "@/app/lib/features/agreementsApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";

const AgreementDetails: React.FC = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { data: agreement, isLoading } = useGetAgreementQuery(id);
  const [deleteAgreement, { isLoading: isDeleting }] = useDeleteAgreementMutation();
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const onDelete = async () => {
    await deleteAgreement(id).unwrap();
    setConfirmOpen(false);
    router.push("/core-assets/agreements");
  };

  if (isLoading) return (
    <div className="max-w-7xl mx-auto">
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <CardContent>
          <p className="text-[#667085]">Loading agreement...</p>
        </CardContent>
      </Card>
    </div>
  );
  if (!agreement) return (
    <div className="max-w-7xl mx-auto">
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <CardContent className="flex items-center justify-between">
          <p className="text-[#667085]">Agreement not found</p>
          <Button onClick={() => router.push("/core-assets/agreements")}>Back to Agreements</Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">Agreement #{agreement.id}</h1>
              <p className="font-sans text-sm text-[#667085]">{agreement.agreement_type.toUpperCase()} • {agreement.status}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push(`/core-assets/agreements/${agreement.id}/edit`)}>Edit</Button>
              <Button variant="outline" className="text-destructive" onClick={() => setConfirmOpen(true)}>Delete</Button>
              <Button onClick={() => router.push("/core-assets/agreements")}>Back</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-[#667085]">Agreement Type</div>
              <div className="text-sm">{agreement.agreement_type.toUpperCase()}</div>
            </div>
            <div>
              <div className="text-xs text-[#667085]">Status</div>
              <div className="text-sm capitalize">{agreement.status}</div>
            </div>
            <div>
              <div className="text-xs text-[#667085]">Vendor ID</div>
              <div className="text-sm">{agreement.vendor_id}</div>
            </div>
            <div>
              <div className="text-xs text-[#667085]">Effective From</div>
              <div className="text-sm">{new Date(agreement.effective_from).toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-xs text-[#667085]">Effective To</div>
              <div className="text-sm">{new Date(agreement.effective_to).toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-xs text-[#667085]">Training Opt Out</div>
              <div className="text-sm">{agreement.training_opt_out || "—"}</div>
            </div>
            <div>
              <div className="text-xs text-[#667085]">Audit Rights</div>
              <div className="text-sm">{agreement.audit_rights || "—"}</div>
            </div>
            <div>
              <div className="text-xs text-[#667085]">Transfer Mechanism</div>
              <div className="text-sm">{agreement.transfer_mechanism || "—"}</div>
            </div>
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Document</div>
            <a className="text-sm text-blue-600 hover:underline break-all" href={agreement.doc_ref} target="_blank" rel="noreferrer">
              {agreement.doc_ref}
            </a>
          </div>

          {agreement.sla_terms && (
            <div>
              <div className="text-sm font-medium mb-2">SLA Terms</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#667085]">
                <div>
                  <div className="text-xs">Availability Target %</div>
                  <div>{agreement.sla_terms.availability_target_pct ?? "—"}</div>
                </div>
                <div>
                  <div className="text-xs">Latency p95 (ms)</div>
                  <div>{agreement.sla_terms.latency_p95_ms ?? "—"}</div>
                </div>
                <div>
                  <div className="text-xs">Support Tier</div>
                  <div>{agreement.sla_terms.support_tier ?? "—"}</div>
                </div>
                <div>
                  <div className="text-xs">Breach Definition</div>
                  <div>{agreement.sla_terms.breach_definition ?? "—"}</div>
                </div>
                <div>
                  <div className="text-xs">Credit Schedule Ref</div>
                  <div>{agreement.sla_terms.credit_schedule_ref ?? "—"}</div>
                </div>
                <div>
                  <div className="text-xs">Monitoring Ref</div>
                  <div>{agreement.sla_terms.monitoring_ref ?? "—"}</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={onDelete}
        title="Delete Agreement"
        description="Are you sure you want to delete this agreement? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </div>
  );
};

export default AgreementDetails;


