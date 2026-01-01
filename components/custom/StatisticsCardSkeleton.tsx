"use client";

import React from "react";
import { Card } from "@/components/ui/card";

export const StatisticsCardSkeleton: React.FC = () => {
  return (
    <Card className="rounded-xl border border-[#E4E7EC] bg-white p-4">
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mt-1" />
      </div>
    </Card>
  );
};

