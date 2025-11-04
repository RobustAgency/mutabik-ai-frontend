"use client";

import { use } from "react";
import VendorDetails from "@/components/app/vendors/details/VendorDetails";

interface VendorDetailsPageProps {
  params: Promise<{ id: string }>;
}

const VendorDetailsPage = ({ params }: VendorDetailsPageProps) => {
  const { id } = use(params);
  return <VendorDetails vendorId={id} />;
};

export default VendorDetailsPage;


