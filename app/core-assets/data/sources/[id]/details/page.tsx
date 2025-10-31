"use client";

export const runtime = 'edge';

import { use } from "react";
import DataSourceDetails from "@/components/app/dataSources/details/DataSourceDetails";

interface DataSourceDetailsPageProps {
    params: Promise<{ id: string }>;
}

const DataSourceDetailsPage = ({ params }: DataSourceDetailsPageProps) => {
    const { id } = use(params);
    return <DataSourceDetails dataSourceId={id} />;
};

export default DataSourceDetailsPage;

