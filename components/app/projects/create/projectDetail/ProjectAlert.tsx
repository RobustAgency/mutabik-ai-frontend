import React from 'react'
import { Card } from "@/components/ui/card";
import { CircleAlert } from 'lucide-react';
import Link from 'next/link';
const ProjectAlert = () => {
  return (
    <div>
      <Card className="w-full  rounded-xl border p-4 bg-[#FFFAEB] border-[#F79009]">
        <div className="flex flex-col sm:flex-row gap-3">
          <CircleAlert className="w-5 h-5 text-[#F79009]" />
          <div className="space-y-3">
            <div className="space-y-2">
              <p className="font-semibold text-sm leading-5 text-[#1D2939]">
                Setup Required
              </p>
              <p className="font-normal text-sm leading-5 text-[#667085]">
                This project does not have any AI Model, Model Version or Model
                Card added. Add the missing details in Project Settings to
                continue working on the project.
              </p>
            </div>
            <Link
              href=""
              className="font-medium text-sm leading-5 text-[#667085] underline underline-offset-4"
            >
              Project Settings
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default ProjectAlert
