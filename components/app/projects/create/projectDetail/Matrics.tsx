import React from 'react'
import { Card } from "@/components/ui/card";

interface ProjectMatricesProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}
const Matrics: React.FC<ProjectMatricesProps> = ({
    icon,
    label,
    value
}) => {
  return (
    <Card className="w-full flex-1 opacity-100 rounded-2xl border border-[#E4E7EC] p-6">
      <div className="flex gap-5 items-center">
        <div className="w-12 h-12 flex items-center justify-center rounded-[12px] bg-[#F2F4F7]">
          {icon}
        </div>
        <div>
          <p className="font-sans font-normal text-sm text-[#667085]">{label}</p>
          <p className="font-sans font-bold text-[#1D2939]">{value}</p>
        </div>
      </div>
    </Card>
  )
}

export default Matrics
