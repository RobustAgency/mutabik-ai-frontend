"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Description from "@/components/admin/dashboard/Description";
import AdditionalInformation from "@/components/admin/dashboard/AdditionalInformation";
import Status from "@/components/admin/dashboard/Status";
import Associations from "@/components/admin/dashboard/Associations.fixed";

// --- Local helper types ---
type AdditionalInfo = Record<string, string>;
type StatusField = "releaseDate" | "published";
type AssociationsField = "requirements" | "controls";

export default function CreateFrameworkPage() {
  // States
  const [description, setDescription] = useState<string>("");
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfo>({});
  const [status, setStatus] = useState<{ releaseDate: string; published: boolean }>({
    releaseDate: "2021-03-10",
    published: true,
  });
  const [associations, setAssociations] = useState<{ requirements: string[]; controls: string[] }>(
    {
      requirements: [],
      controls: [],
    }
  );

  const [preview, setPreview] = useState<string | null>(null);

  // File Upload Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file)); // preview image
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-2 py-8 flex flex-col items-start">
      {/* Breadcrumb */}
      <div className="flex items-center mb-6 gap-2">
        <span className="text-[#737373] text-sm font-medium">Frameworks</span>
        <span className="text-[#A3A3A3]">›</span>
        <span className="text-[#737373] text-sm font-medium">Create</span>
      </div>

      {/* Heading */}
      <h1 className="text-3xl text-[#171717] font-bold mb-6">Create Framework</h1>

      <div className="flex flex-col md:flex-row gap-6 w-full">
        {/* Main Form Card */}
        <Card className="flex-1 p-6 bg-white border-0 rounded-xl">
          <form className="space-y-6 w-full" onSubmit={(e) => e.preventDefault()}>
            {/* Logo Upload */}
            <div>
              <Label className="block mb-2 text-[#171717] text-sm font-medium">Logo</Label>
              <div className="border border-dashed border-gray-300 w-60 rounded-lg p-4 flex items-center justify-start text-gray-500 text-sm relative">
                {preview ? (
                  <img src={preview} alt="Logo Preview" className="w-24 h-24 object-contain mb-2" />
                ) : (
                  <div className="flex">
                    <span className="text-[#737373] text-sm font-normal">
                      Drag &amp; Drop your file or{" "}
                      <label
                        htmlFor="logoUpload"
                        className="text-[#3CB576] text-sm cursor-pointer hover:underline"
                      >
                        Browse
                      </label>
                    </span>
                  </div>
                )}
                <input
                  id="logoUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {/* Title & Code */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label className="text-[#171717] text-sm font-medium" htmlFor="title">
                  Title
                </Label>
                <Input
                  id="title"
                  placeholder="EU AI Act"
                  className="mt-1 text-[#171717] text-sm border border-[#E5E5E5] py-4 w-full"
                />
              </div>
              <div className="w-[120px]">
                <Label className="text-[#171717] text-sm font-medium" htmlFor="code">
                  Code
                </Label>
                <Input
                  id="code"
                  placeholder="MFF-3"
                  className="mt-1 text-[#171717] text-sm border border-[#E5E5E5] py-4 w-full"
                />
              </div>
            </div>

            {/* Geography & Version */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-[#171717] text-sm font-medium" htmlFor="geography">
                  Geography
                </Label>
                <Input
                  id="geography"
                  placeholder="EU"
                  className="mt-1 text-[#171717] text-sm border border-[#E5E5E5] py-4 w-full"
                />
              </div>
              <div>
                <Label className="text-[#171717] text-sm font-medium" htmlFor="version">
                  Version
                </Label>
                <Input
                  id="version"
                  placeholder="2024.1"
                  className="mt-1 text-[#171717] text-sm border border-[#E5E5E5] py-4 w-full"
                />
              </div>
            </div>

            {/* Type & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-[#171717] text-sm font-medium" htmlFor="type">
                  Type
                </Label>
                <select
                  id="type"
                  className="mt-1 w-full border rounded-md px-3 py-2 shadow-[0px_0px_0px_1px_var(--Grey200),_0px_1px_3px_0px_#0000000F]"
                >
                  <option value="law" className="text-[#101828]">
                    Law/Act
                  </option>
                  <option value="guideline" className="text-[#101828]">
                    Guideline
                  </option>
                </select>
              </div>
              <div>
                <Label className="text-[#171717] text-sm font-medium" htmlFor="category">
                  Category
                </Label>
                <select id="category" className="mt-1 w-full border rounded-md px-3 py-2">
                  <option value="mandatory">Mandatory</option>
                  <option value="optional">Optional</option>
                </select>
              </div>
            </div>

            {/* Description (TipTap HTML string) */}
            <Description value={description} onChange={(html: string) => setDescription(html)} />

            <Separator />

            {/* Additional Information */}
            <AdditionalInformation
              values={additionalInfo}
              onChange={(field: string, val: string) =>
                setAdditionalInfo((prev) => ({ ...prev, [field]: val }))
              }
            />

            {/* Buttons */}
            <div className="flex gap-4 mt-8">
              <Button type="submit" className="bg-[#4FD58F] hover:bg-green-600 text-white rounded-[12px]">
                Create
              </Button>
              <Button variant="outline" className="rounded-[12px]">
                Cancel
              </Button>
            </div>
          </form>
        </Card>

        {/* Sidebar */}
        <div className="w-full md:w-[400px] flex flex-col gap-6">
          {/* Status Card */}
          <Status
            releaseDate={status.releaseDate}
            published={status.published}
            onChange={(field: StatusField, val: string | boolean) =>
              setStatus((prev) => ({ ...prev, [field]: val } as typeof prev))
            }
          />

          {/* Associations Card */}
          <Associations
            requirements={associations.requirements}
            controls={associations.controls}
            onChange={(field: AssociationsField, val: string[]) =>
              setAssociations((prev) => ({ ...prev, [field]: val }))
            }
          />
        </div>
      </div>
    </div>
  );
}
