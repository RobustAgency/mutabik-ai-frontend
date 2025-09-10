import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@radix-ui/react-separator";
import { SquareChartGantt } from "lucide-react";

const Overview = () => {
  return (
    <Card className="shadow-sm rounded-2xl py-0 gap-0">
      <CardHeader className="">
        <CardTitle className="text-lg py-4  flex items-center justify-start gap-4 pl-5">
          <SquareChartGantt className="w-[24px] h-[24px] text-[#000000]" />
          <span className="text-lg font-bold text-[#171717]">Overview</span>
        </CardTitle>

        <Separator className="h-[0.5px] border shadow-sm" />
        <span className="px-6 pt-6 pb-2 text-sm font-medium text-[#171717]">Question</span>
        <CardDescription className="pb-6 px-6 teaxt-sm text-[#171717] font-normal">
          Have the objectives for the project been specified and documented?
        </CardDescription>
      </CardHeader>
      <span className="px-6 pb-2 text-sm font-medium text-[#171717]">Description</span>
      <CardContent className="pb-6 px-6 text-sm text-[#171717] font-normal">
        <p>
          Define and document project objectives, considering the
          organisation-wide objectives. Indicate the source of project
          objectives and associated stakeholders.
        </p>
      </CardContent>
    </Card>
  );
};

export default Overview;
