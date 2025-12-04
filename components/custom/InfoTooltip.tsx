"use client";

import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface InfoTooltipProps {
  content: string;
  className?: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ content, className = "" }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle 
            className={`h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help inline-block ml-1 ${className}`}
          />
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="max-w-xs bg-gray-900 text-white p-3 rounded-md text-sm"
        >
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Predefined tooltip definitions for governance terms
export const TOOLTIP_DEFINITIONS = {
  DATA_SENSITIVITY: "Degree of confidentiality or regulation applied to the data (PII, financial, health).",
  PRELIMINARY_RISK_LEVEL: "Initial estimate of risk before AI model assessment.",
  ROI_CLASSIFICATION: "Categorizes expected business value (High, Medium, Low).",
  HUMAN_OVERSIGHT_MODE: "Defines human involvement: Human-in-the-Loop, Human-on-the-Loop, Human-in-Command.",
  DATA_READINESS: "Degree to which data is complete, usable, and structured.",
  REGULATORY_IMPACT: "Does the use case trigger compliance requirements such as PDPL, GDPR, or sector rules?",
};

