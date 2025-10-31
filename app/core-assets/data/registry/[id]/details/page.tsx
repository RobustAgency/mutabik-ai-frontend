"use client";

export const runtime = 'edge';

import { use } from "react";
import DatasetDetails from "@/components/app/datasets/details/DatasetDetails";

interface DatasetDetailsPageProps {
    params: Promise<{ id: string }>;
}

const DatasetDetailsPage = ({ params }: DatasetDetailsPageProps) => {
    const { id } = use(params);
    return <DatasetDetails datasetId={id} />;
};

export default DatasetDetailsPage;

