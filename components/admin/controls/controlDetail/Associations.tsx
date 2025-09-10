import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-separator";
import { Badge } from "@/components/ui/badge";

const Associations: React.FC = () => {
  const linkedFrameworks: string[] = ["M-FR-3", "M-FR-7"];
  const relatedRequirements: string[] = [
    "M-CR-182",
    "M-CR-162",
    "M-CR-183",
    "M-CR-182",
    "M-CR-182",
    "M-CR-182",
    "M-CR-182",
    "M-CR-182",
  ];
  const tags: string[] = ["Lifecycle Design & Development", "Scope: Project"];

  return (
    <Card className="shadow-sm rounded-2xl py-0 gap-0 w-full">
      <CardHeader>
        <CardTitle className="text-lg py-4 flex items-center justify-start gap-4 pl-5">
          <span className="text-lg font-bold text-[#171717]">Associations</span>
        </CardTitle>
        <Separator className="h-[0.5px] border shadow-sm" />
      </CardHeader>

      <CardContent className="px-4 sm:px-6 pt-6 pb-6 text-sm text-[#171717] font-normal space-y-6 leading-relaxed w-full">
        {/* Linked Frameworks */}
        <div>
          <span className="block pt-0 pb-1 text-sm font-medium text-[#171717]">
            Linked Frameworks
          </span>
          <Card className="flex flex-row flex-wrap gap-2 py-3 px-3 rounded-[8px] w-full">
            {linkedFrameworks.map((framework: string) => (
              <Badge
                key={framework}

                className="rounded-[4px] text-[#171717] border-[#D9D9D9]  p-1.5 text-sm bg-[#F5F5F5] flex-shrink-0"
              >
                {framework}
              </Badge>
            ))}
          </Card>
        </div>

        {/* Related Requirements */}
        <div>
          <span className="block pt-2 pb-1 text-sm font-medium text-[#171717]">
            Related Requirements
          </span>
          <Card className="flex flex-row flex-wrap gap-2 py-3 px-3 rounded-[8px] w-full">
            {relatedRequirements.map((requirement: string, idx: number) => (
              <Badge
                key={idx}
                className="rounded-[4px] p-1.5 text-sm text-[#171717] border border-[#D9D9D9] bg-[#F5F5F5] flex-shrink-0"
              >
                {requirement}
              </Badge>
            ))}
          </Card>
        </div>

        {/* Tags */}
        <div>
          <span className="block pt-2 pb-1 text-sm font-medium text-[#171717]">
            Tags
          </span>
          <Card className="flex flex-row flex-wrap gap-2 py-3 px-3 rounded-[8px] w-full">
            {tags.map((tag: string, idx: number) => (
              <Badge
                key={idx}

                className="rounded-[4px] text-[#171717] border-[#D9D9D9]  p-1.5 text-sm bg-[#F5F5F5] flex-shrink-0"
              >
                {tag}
              </Badge>
            ))}
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default Associations;
