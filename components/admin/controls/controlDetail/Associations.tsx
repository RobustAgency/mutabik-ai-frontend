import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useControl } from "@/hooks/admin/useControls";

interface AssociationsProps {
  controlId: string;
}

const Associations: React.FC<AssociationsProps> = ({ controlId }) => {
  const { control, loading } = useControl(controlId);

  if (loading) {
    return (
      <Card className="shadow-none rounded-2xl py-0 gap-0 w-full">
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
      <Card className="shadow-none rounded-2xl py-0 gap-0 w-full">
        <CardContent className="p-6">
          <p className="text-red-600">Control not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-none rounded-2xl py-0 gap-0 w-full">
      <CardHeader>
        <CardTitle className="text-lg py-4 flex items-center justify-start gap-4 pl-5">
          <span className="text-lg font-bold text-[#171717]">Associations</span>
        </CardTitle>
        <hr />
      </CardHeader>

      <CardContent className="px-4 sm:px-6 pt-6 pb-6 text-sm text-[#171717] font-normal space-y-6 leading-relaxed w-full">
        {/* Linked Frameworks */}
        <div>
          <span className="block pt-0 pb-1 text-sm font-medium text-[#171717]">
            Linked Frameworks
          </span>
          <Card className="flex flex-row flex-wrap gap-2 py-3 px-3 rounded-[8px] w-full">
            {control.frameworks && control.frameworks.length > 0 ? (
              control.frameworks.map((framework) => (
                <Badge
                  key={framework.id}
                  className="rounded-[4px] text-[#171717] border-[#D9D9D9] p-1.5 text-sm bg-[#F5F5F5] flex-shrink-0"
                >
                  {framework.code}
                </Badge>
              ))
            ) : (
              <span className="text-gray-500 text-sm">No frameworks linked</span>
            )}
          </Card>
        </div>

        {/* Related Requirements */}
        <div>
          <span className="block pt-2 pb-1 text-sm font-medium text-[#171717]">
            Related Requirements
          </span>
          <Card className="flex flex-row flex-wrap gap-2 py-3 px-3 rounded-[8px] w-full">
            {control.requirements && control.requirements.length > 0 ? (
              control.requirements.map((requirement) => (
                <Badge
                  key={requirement.id}
                  className="rounded-[4px] p-1.5 text-sm text-[#171717] border border-[#D9D9D9] bg-[#F5F5F5] flex-shrink-0"
                >
                  {requirement.code}
                </Badge>
              ))
            ) : (
              <span className="text-gray-500 text-sm">No requirements linked</span>
            )}
          </Card>
        </div>

        {/* Tags */}
        <div>
          <span className="block pt-2 pb-1 text-sm font-medium text-[#171717]">
            Tags
          </span>
          <Card className="flex flex-row flex-wrap gap-2 py-3 px-3 rounded-[8px] w-full">
            {control.tags && control.tags.length > 0 ? (
              control.tags.map((tag) => (
                <Badge
                  key={tag.id}
                  className="rounded-[4px] p-1.5 text-sm text-[#171717] border border-[#D9D9D9] bg-[#F5F5F5] flex-shrink-0"
                >
                  {tag.name}
                </Badge>
              ))
            ) : (
              <span className="text-gray-500 text-sm">No tags assigned</span>
            )}
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default Associations;
