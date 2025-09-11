import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { SquareChartGantt } from "lucide-react";
import { useControl } from "@/hooks/admin/useControls";

interface OverviewProps {
  controlId: string;
}

const Overview = ({ controlId }: OverviewProps) => {
  const { control, loading } = useControl(controlId);

  if (loading) {
    return (
      <Card className="shadow-none rounded-2xl py-0 gap-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!control) {
    return (
      <Card className="shadow-none rounded-2xl py-0 gap-0">
        <CardContent className="p-6">
          <p className="text-red-600">Control not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-none rounded-2xl py-0 gap-0">
      <CardHeader className="">
        <CardTitle className="text-lg py-4  flex items-center justify-start gap-4 pl-5">
          <SquareChartGantt className="w-[24px] h-[24px] text-[#000000]" />
          <span className="text-lg font-bold text-[#171717]">Overview</span>
        </CardTitle>

        <hr />
        {control.question && (
          <>
            <span className="px-6 pt-6 pb-2 text-sm font-medium text-[#171717]">Question</span>
            <CardContent className="pb-6 px-6 text-sm text-[#171717] font-normal">
              <div dangerouslySetInnerHTML={{ __html: control.question }} />
            </CardContent>
          </>
        )}
      </CardHeader>
      {control.summary && (
        <>
          <span className="px-6 pb-2 text-sm font-medium text-[#171717]">Summary</span>
          <CardContent className="pb-6 px-6 text-sm text-[#171717] font-normal">
            <div dangerouslySetInnerHTML={{ __html: control.summary }} />
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default Overview;
