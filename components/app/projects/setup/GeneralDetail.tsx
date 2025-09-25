'use client'
import React, { useRef } from 'react'
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SelectField from "@/components/custom/SelectField";

const GeneralDetail = () => {
      const projectNameRef = useRef<HTMLInputElement>(null);
      const descriptionRef = useRef<HTMLTextAreaElement>(null);
    
      const selectData: string[] = [
        "AI Governance",
        "Data Governance",
        "Privacy/PDPL",
      ];
  return (
   <>
         <Card className="border-0 p-0 ">
              <CardHeader className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-3 rotate-0 opacity-100"></CardHeader>

              <CardContent className="w-full flex flex-col gap-6">
                {/* Row 1: Project Name + Description */}
                <div className="w-full flex flex-col md:flex-row justify-center items-start gap-6 rotate-0 opacity-100">
                  <div className="w-full md:w-1/2 flex flex-col gap-3">
                    <Label
                      htmlFor="project-name"
                      className="font-sans font-medium text-sm leading-5 tracking-normal text-[#344054]"
                      onClick={() => projectNameRef.current?.focus()}
                    >
                      Project Name
                    </Label>
                    <Input
                      id="project-name"
                      name="project-name"
                      ref={projectNameRef}
                      className="gap-2 pt-[10px] focus:outline-none focus:ring-0 focus:border-gray-[#D0D5DD] pr-4 pb-[10px] pl-4 rounded-lg border border-[#D0D5DD] bg-white placeholder:text-sm placeholder:font-normal placeholder:leading-[20px] placeholder:tracking-normal placeholder:text-[#98A2B3]"
                      placeholder="AI Credit List Scoring"
                    />
                  </div>

                  <div className="w-full md:w-1/2 flex flex-col gap-3">
                    <Label
                      htmlFor="description"
                      className="font-sans font-medium text-sm leading-5 tracking-normal text-[#344054]"
                      onClick={() => descriptionRef.current?.focus()}
                    >
                      Description
                    </Label>
                    <SelectField selectData={selectData} className="w-full" />
                  </div>
                </div>

                {/* Row 2: Governance Pillar + Metadata */}
                <div className="w-full flex flex-col md:flex-row items-start gap-6">
                  <div className="w-full md:w-1/2 flex flex-col gap-3">
                    <Label className="font-sans font-medium text-sm leading-5 tracking-normal text-[#344054]">
                      Choose governance pillar
                    </Label>

                    <Textarea
                      id="description"
                      ref={descriptionRef}
                      placeholder="Enter a description..."
                      className="h-[194px] gap-2 pt-[10px] pr-4 pb-[10px] pl-4 rounded-lg border border-[#D0D5DD] bg-white placeholder:text-sm placeholder:font-normal placeholder:leading-[20px] placeholder:tracking-normal placeholder:text-[#98A2B3] focus:outline-none focus:ring-0 focus-visible:ring-0 focus:border-[#D0D5DD] resize-none"
                    />
                  </div>

                  <div className="w-full md:w-1/2 flex flex-col gap-4 mt-6 md:mt-8">
                    <div className="flex flex-col gap-2">
                      <p className="font-sans font-medium text-sm leading-5 tracking-normal text-[#98A2B3]">
                        Created By
                      </p>
                      <div className="flex gap-2 items-center">
                        <Image
                          src="/projects/Avatar.jpg"
                          alt="Image not found"
                          width={30}
                          height={30}
                        />
                        <p className="font-sans font-medium text-base leading-6 tracking-normal text-[#344054]">
                          Ahmad Raza
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <p className="font-sans font-medium text-sm leading-5 tracking-normal text-[#98A2B3]">
                        Created at
                      </p>
                      <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#344054]">
                        24 Feb, 2025 13:55
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <p className="font-sans font-medium text-sm leading-5 tracking-normal text-[#98A2B3]">
                        Last updated
                      </p>
                      <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#344054]">
                        29 March, 2025 18:34
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
   </>
  )
}

export default GeneralDetail
