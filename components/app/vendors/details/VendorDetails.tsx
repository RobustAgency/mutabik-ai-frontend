"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useGetVendorQuery } from "@/app/lib/features/vendorsApi";

interface VendorDetailsProps {
  vendorId: string;
}

const VendorDetails: React.FC<VendorDetailsProps> = ({ vendorId }) => {
  const router = useRouter();
  const idNum = Number(vendorId);
  const { data: vendor, isLoading } = useGetVendorQuery(idNum, { skip: Number.isNaN(idNum) });

  if (Number.isNaN(idNum)) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent>
            <p className="text-[#667085]">Invalid vendor ID</p>
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
            <p className="text-[#667085]">Loading vendor...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="flex items-center justify-between">
            <p className="text-[#667085]">Vendor not found</p>
            <Button onClick={() => router.push("/core-assets/vendors")}>Back to Vendors</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const labelMap: Record<string, string> = {
    evaluating: "Evaluating",
    approved: "Approved",
    conditionally_approved: "Conditionally Approved",
    restricted: "Restricted",
    suspended: "Suspended",
    terminated: "Terminated",
  };
  const riskLabelMap: Record<string, string> = {
    tier_1: "Tier 1",
    tier_2: "Tier 2",
    tier_3: "Tier 3",
    tier_4: "Tier 4",
  };

  return (
    <div className="max-w-7xl mx-auto">
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">
                {vendor.vendor_name}
              </h1>
              <p className="font-sans text-sm text-[#667085]">{vendor.legal_name}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push(`/core-assets/vendors/${vendor.id}/edit`)}>Edit</Button>
              <Button onClick={() => router.push("/core-assets/vendors")}>Back</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-[#667085]">HQ Country</div>
              <div className="text-sm">{vendor.hq_country}</div>
            </div>
            <div>
              <div className="text-xs text-[#667085]">Risk Tier</div>
              <div className="text-sm">{riskLabelMap[vendor.risk_tier] || vendor.risk_tier}</div>
            </div>
            <div>
              <div className="text-xs text-[#667085]">Status</div>
              <div className="text-sm">{labelMap[vendor.status] || vendor.status}</div>
            </div>
            <div>
              <div className="text-xs text-[#667085]">Stakeholder</div>
              <div className="text-sm">{vendor.stakeholder?.display_name || "—"}</div>
            </div>
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Primary Contacts</div>
            <div className="space-y-2">
              {(vendor.primary_contacts || []).map((c, i) => (
                <div key={i} className="text-sm text-[#667085]">
                  {c.name} • {c.email} {c.phone ? `• ${c.phone}` : ""} {c.primary ? "• Primary" : ""}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Metadata</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#667085]">
              <div>
                <div className="text-xs">Sub-processors URL</div>
                <div>{(vendor.metadata as any)?.sub_processors_url || "—"}</div>
              </div>
              <div>
                <div className="text-xs">Residency options</div>
                <div>{Array.isArray((vendor.metadata as any)?.residency_options) ? ((vendor.metadata as any).residency_options as string[]).join(", ") : ((vendor.metadata as any)?.residency_options || "—")}</div>
              </div>
              <div>
                <div className="text-xs">Websites</div>
                <div>{Array.isArray((vendor.metadata as any)?.websites) ? ((vendor.metadata as any).websites as string[]).join(", ") : ((vendor.metadata as any)?.websites || "—")}</div>
              </div>
              <div>
                <div className="text-xs">Metadata notes</div>
                <div>{(vendor.metadata as any)?.notes || "—"}</div>
              </div>
            </div>
          </div>

          {vendor.notes && (
            <div>
              <div className="text-sm font-medium mb-2">Notes</div>
              <div className="text-sm text-[#667085]">{vendor.notes}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorDetails;


