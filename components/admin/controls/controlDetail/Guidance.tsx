import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { BookOpenText } from "lucide-react";
import { useControl } from "@/hooks/admin/useControls";

interface GuidanceProps {
  controlId: string;
}

const Guidance = ({ controlId }: GuidanceProps) => {
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

  // Only show Guidance card if there's description content
  if (!control?.description) {
    return null;
  }

  return (
    <Card className="shadow-none rounded-2xl py-0 gap-0">
      <CardHeader className="">
        <CardTitle className="text-lg py-4 flex items-center justify-start gap-4 pl-5">
          <BookOpenText className="w-[24px] h-[24px] text-[#000000]" />
          <span className="text-lg font-bold text-[#171717]">Guidance</span>
        </CardTitle>
        <hr />
      </CardHeader>

      <CardContent className="px-6 pt-6 pb-6 text-sm text-[#171717] font-normal space-y-4 leading-relaxed">
        <div dangerouslySetInnerHTML={{ __html: control.description }} />
      </CardContent>
    </Card>
  );
};

export default Guidance;
