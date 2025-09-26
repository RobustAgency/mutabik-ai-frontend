"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Dummy frameworks data
const frameworksData = [
  {
    id: 1,
    title: "NIST AI RMF",
    subtitle: "EU . 2041.1 Law/Act",
    description:
      "Non-mandatory guidelines for achieving the ethical design and deployment of AI systems in both the public and private sectors. loNon-mandatory guidelines for achieving the ethical design and deployment of AI systems in both the public and private sectors. lo",
    category: "ai-governance",
    logo: "/projects/fraemwork-logo.png",
    stats: [
      { id: 1, title: "Requirements", value: 24, icon: "/projects/Frame-1.png" },
      { id: 2, title: "Controls", value: 24, icon: "/projects/Frame-2.png" },
    ],
    details: {
      "Authority / Publisher": "ISO/IEC JTC 1/SC 42",
      "Binding Level": "Legally Binding",
      "Sector Applicability": "Cross-sector",
      "Risk Class Coverage": "Prohibited use cases",
      "Assessment Mode": "Self-Assessment",
      "Certification / Attestation": "Notified Body Conformity Assessment",
    },
  },
  {
    id: 2,
    title: "ISO AI RMF",
    subtitle: "US . 2025.3 Regulation",
    description:
      "Mandatory framework for AI compliance in regulated industries.",
    category: "data-governance",
    logo: "/projects/fraemwork-logo.png",
    stats: [
      { id: 1, title: "Requirements", value: 30, icon: "/projects/Frame-1.png" },
      { id: 2, title: "Controls", value: 18, icon: "/projects/Frame-2.png" },
    ],
    details: {
      "Authority / Publisher": "ISO",
      "Binding Level": "Mandatory",
      "Sector Applicability": "Healthcare, Finance",
      "Risk Class Coverage": "High risk",
      "Assessment Mode": "Third-Party",
      "Certification / Attestation": "Required Certification",
    },
  },
  {
    id: 3,
    title: "ISO AI RMF",
    subtitle: "US . 2025.3 Regulation",
    description:
      "Mandatory framework for AI compliance in regulated industries.",
    category: "data-governance",
    logo: "/projects/fraemwork-logo.png",
    stats: [
      { id: 1, title: "Requirements", value: 30, icon: "/projects/Frame-1.png" },
      { id: 2, title: "Controls", value: 18, icon: "/projects/Frame-2.png" },
    ],
    details: {
      "Authority / Publisher": "ISO",
      "Binding Level": "Mandatory",
      "Sector Applicability": "Healthcare, Finance",
      "Risk Class Coverage": "High risk",
      "Assessment Mode": "Third-Party",
      "Certification / Attestation": "Required Certification",
    },
  },
  {
    id: 4,
    title: "ISO AI RMF",
    subtitle: "US . 2025.3 Regulation",
    description:
      "Mandatory framework for AI compliance in regulated industries.",
    category: "data-governance",
    logo: "/projects/fraemwork-logo.png",
    stats: [
      { id: 1, title: "Requirements", value: 30, icon: "/projects/Frame-1.png" },
      { id: 2, title: "Controls", value: 18, icon: "/projects/Frame-2.png" },
    ],
    details: {
      "Authority / Publisher": "ISO",
      "Binding Level": "Mandatory",
      "Sector Applicability": "Healthcare, Finance",
      "Risk Class Coverage": "High risk",
      "Assessment Mode": "Third-Party",
      "Certification / Attestation": "Required Certification",
    },
  },
  {
    id: 5,
    title: "ISO AI RMF",
    subtitle: "US . 2025.3 Regulation",
    description:
      "Mandatory framework for AI compliance in regulated industries.",
    category: "data-governance",
    logo: "/projects/fraemwork-logo.png",
    stats: [
      { id: 1, title: "Requirements", value: 30, icon: "/projects/Frame-1.png" },
      { id: 2, title: "Controls", value: 18, icon: "/projects/Frame-2.png" },
    ],
    details: {
      "Authority / Publisher": "ISO",
      "Binding Level": "Mandatory",
      "Sector Applicability": "Healthcare, Finance",
      "Risk Class Coverage": "High risk",
      "Assessment Mode": "Third-Party",
      "Certification / Attestation": "Required Certification",
    },
  },
  
];

const ChooseFrameworks = () => {
  const [selectedFrameworks, setSelectedFrameworks] = useState<number[]>([]);
  const [openCardId, setOpenCardId] = useState<number | null>(null);
  const router = useRouter();

  // Toggle selection
  const toggleFramework = (id: number) => {
    setSelectedFrameworks((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  // Toggle details expand (only one open at a time)
  const toggleDetails = (id: number) => {
    setOpenCardId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="px-4 sm:px-0 lg:px-0 py-6">
      <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white">
        <CardHeader className="flex justify-end border-b border-[#E4E7EC] px-4 py-4 sm:py-5">
          <Button
            variant="outline"
            className="flex items-center gap-2 h-[44px] border border-[#D0D5DD] bg-[#F9FAFB] text-sm"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter
          </Button>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          {/* 🔑 FIX: items-start added */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {frameworksData.map((framework) => {
              const isSelected = selectedFrameworks.includes(framework.id);
              const isOpen = openCardId === framework.id;

              return (
                <Card
                  key={framework.id}
                  className={`relative min-h-[365px] flex flex-col rounded-2xl transition-all duration-200 ${
                    isSelected
                      ? "border-[3px] border-[#4FD58F] shadow-md"
                      : "border border-[#E4E7EC]"
                  }`}
                >
                  {/* Selected Badge */}
                  {isSelected && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 border border-[#4FD58F] bg-[#4FD58F] px-3 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                      <span className="font-sans font-medium text-sm text-white">
                        Selected
                      </span>
                    </div>
                  )}

                  <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 border-b">
                    <div className="flex items-center gap-3">
                      <Image
                        src={framework.logo}
                        alt={`${framework.title} logo`}
                        width={50}
                        height={50}
                      />
                      <div>
                        <CardTitle className="font-bold text-lg text-[#1D2939]">
                          {framework.title}
                        </CardTitle>
                        <span className="text-sm text-[#98A2B3]">
                          {framework.subtitle}
                        </span>
                      </div>
                    </div>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleFramework(framework.id)}
                      className="w-5 h-5 rounded-[6px] border border-[#D0D5DD]"
                    />
                  </CardHeader>

                  <CardContent className="p-4 sm:p-6">
                    <p className="text-sm text-[#344054] mb-4 line-clamp-3">
                      {framework.description}
                    </p>

                    {/* Show Additional Details Toggle */}
                    <button
                      onClick={() => toggleDetails(framework.id)}
                      className="flex items-center justify-between w-full text-xs font-medium uppercase text-gray-400"
                    >
                      {isOpen ? "Hide Additional Details" : "Show Additional Details"}
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    {/* Expanded Details */}
                    {isOpen && (
                      <div className="mt-4 space-y-2 text-sm">
                        {Object.entries(framework.details).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between border-b border-gray-100 pb-1"
                          >
                            <span className="font-medium text-[#344054]">{key}:</span>
                            <span className="text-[#667085]">{value}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
                      {framework.stats.map((stat) => (
                        <div key={stat.id} className="flex items-center gap-2">
                          <Image src={stat.icon} alt={stat.title} width={37} height={37} />
                          <div>
                            <p className="text-lg font-medium text-[#667085]">{stat.value}</p>
                            <p className="text-xs text-[#667085]">{stat.title}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Footer Button */}
      <div className="flex justify-end w-full mt-6">
        <Button
          onClick={() => {
            router.push("/projects/details");
          }}
          className="h-[44px] border border-[#4FD58F] bg-[#4FD58F] text-white cursor-pointer"
        >
          Create Project
        </Button>
      </div>
    </div>
  );
};

export default ChooseFrameworks;
