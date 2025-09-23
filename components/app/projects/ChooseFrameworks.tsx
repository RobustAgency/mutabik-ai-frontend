"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
// Tabs data
const tabsData = [
  { label: "All frameworks", value: "all" },
  { label: "Data Governance", value: "data-governance" },
  { label: "AI Governance", value: "ai-governance" },
  { label: "Privacy/PDPL", value: "privacy" },
];

// Dummy frameworks data
const frameworksData = [
  {
    id: 1,
    title: "NIST AI RMF",
    subtitle: "EU . 2041.1 Law/Act",
    description:
      "Non-mandatory guidelines for achieving the ethical design and deployment of AI systems in both the public and private sectors.",
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
];

const ChooseFrameworks = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedFrameworks, setSelectedFrameworks] = useState<number[]>([]);
  const [openDetails, setOpenDetails] = useState<Record<number, boolean>>({});
  const router = useRouter();

  // Toggle selection
  const toggleFramework = (id: number) => {
    setSelectedFrameworks((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  // Toggle details expand
  const toggleDetails = (id: number) => {
    setOpenDetails((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter frameworks based on activeTab
  const filteredFrameworks =
    activeTab === "all"
      ? frameworksData
      : frameworksData.filter((fw) => fw.category === activeTab);

  return (
    <div className="px-4 sm:px-0 lg:px-0 py-6">
      <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white">
        {/* Tabs Header */}
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#E4E7EC] px-4 py-4 sm:py-5">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full md:w-auto"
          >
            <div className="w-full overflow-x-auto">
              <TabsList className="flex w-max md:w-full flex-wrap md:flex-nowrap rounded-md p-0.5 bg-[#F2F4F7] gap-1">
                {tabsData.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="min-w-[120px] cursor-pointer h-[36px] text-sm font-medium
                      data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-[#E4E7EC]
                      data-[state=active]:rounded-md data-[state=active]:text-[#101828]
                      data-[state=inactive]:text-gray-600"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </Tabs>

          {/* Filter Button */}
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              className="flex items-center gap-2 h-[44px] border border-[#D0D5DD] bg-[#F9FAFB] text-sm"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filter
            </Button>
          </div>
        </CardHeader>

        {/* Frameworks Cards */}
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFrameworks.map((framework) => {
              const isSelected = selectedFrameworks.includes(framework.id);
              const isOpen = openDetails[framework.id] || false;

              return (
                <Card
                  key={framework.id}
                  className={`relative flex flex-col h-full gap-0 rounded-2xl transition-all duration-200 ${
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

                  <CardHeader className="w-full h-auto gap-2 p-4 border-b rounded-t-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <Image
                        src={framework.logo}
                        alt={`${framework.title} logo`}
                        width={50}
                        height={50}
                        className="flex-shrink-0"
                      />
                      <div className="flex flex-col">
                        <CardTitle className="font-sans font-bold text-lg leading-6 text-[#1D2939]">
                          {framework.title}
                        </CardTitle>
                        <span className="font-sans font-medium text-sm leading-5 text-[#98A2B3]">
                          {framework.subtitle}
                        </span>
                      </div>
                    </div>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleFramework(framework.id)}
                      className="w-5 h-5 rounded-[6px] border-[1.25px] border-[#D0D5DD]"
                    />
                  </CardHeader>

                  <CardContent className="flex flex-col flex-1 p-4 sm:p-6">
                    <p className="font-sans font-medium text-sm text-[#344054] mb-4 sm:mb-6 flex-1">
                      {framework.description}
                    </p>

                    {/* Show Additional Details Toggle */}
                    <button
                      onClick={() => toggleDetails(framework.id)}
                      className="flex items-center justify-between w-full text-xs font-medium uppercase text-gray-400 cursor-pointer"
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
                          <Image
                            src={stat.icon}
                            alt={stat.title}
                            width={37}
                            height={37}
                          />
                          <div className="flex flex-col">
                            <p className="font-sans font-medium text-lg text-[#667085]">
                              {stat.value}
                            </p>
                            <p className="font-sans text-xs text-[#667085]">
                              {stat.title}
                            </p>
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
            router.push("/projects/project-detail")
        }}
         className="h-[44px] border border-[#4FD58F] bg-[#4FD58F] text-white">
          Create Project
        </Button>
      </div>
    </div>
  );
};

export default ChooseFrameworks;
