import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@radix-ui/react-separator";
import { BookOpenText } from "lucide-react"; // Guidance ke liye ek relevant icon

const Guidance = () => {
  return (
    <Card className="shadow-none rounded-2xl py-0 gap-0">
      <CardHeader className="">
        {/* Title with icon */}
        <CardTitle className="text-lg py-4 flex items-center justify-start gap-4 pl-5">
          <BookOpenText className="w-[24px] h-[24px] text-[#000000]" />
          <span className="text-lg font-bold text-[#171717]">Guidance</span>
        </CardTitle>

        <hr />
      </CardHeader>

      {/* Content */}
      <CardContent className="px-6 pt-6 pb-6 text-sm text-[#171717] font-normal space-y-4 leading-relaxed">
        <p>
          Defining and documenting the high-level objectives of your AI project is pivotal in
          ensuring that your AI application, when developed, aligns with your business goals.
        </p>
        <p>
          These high-level objectives also serve to identify potential inherent risks associated
          with the objectives. They should possess the qualities of clarity, measurability, and
          achievability.
        </p>

        {/* Section heading */}
        <span className="block pt-2 pb-1 text-sm font-medium text-[#171717]">
          Identify and quantify your objectives
        </span>
        <ul className="list-disc pl-6 space-y-1">
          <li>Reduce credit defaults by a targeted 10%.</li>
          <li>Identify new fraud patterns to achieve 5% reduction in losses.</li>
          <li>Enhance supply chain forecasting to save costs.</li>
        </ul>

        {/* Another section heading */}
        <span className="block pt-4 pb-1 text-sm font-medium text-[#171717]">
          Stakeholder Involvement
        </span>
        <p>
          Engage relevant stakeholders, including those from the business, legal, risk,
          compliance, data science, and IT functions.
        </p>
      </CardContent>
    </Card>
  );
};

export default Guidance;
