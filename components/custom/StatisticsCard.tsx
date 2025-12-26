"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatisticsCardProps {
  label: string;
  value: number | string;
  icon?: LucideIcon;
  iconColor?: string;
  valueColor?: string;
  className?: string;
}

export const StatisticsCard: React.FC<StatisticsCardProps> = ({
  label,
  value,
  icon: Icon,
  iconColor = "text-[#667085]",
  valueColor = "text-[#1D2939]",
  className = "",
}) => {
  return (
    <Card className={`rounded-xl border border-[#E4E7EC] bg-white p-4 ${className}`}>
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          {Icon && <Icon className={`w-4 h-4 ${iconColor}`} />}
          <p className="text-sm font-medium text-[#667085]">{label}</p>
        </div>
        <p className={`text-2xl font-semibold ${valueColor}`}>
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
      </div>
    </Card>
  );
};

