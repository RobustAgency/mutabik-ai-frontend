import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePicker } from "./DatePicker";
import Chart from "./Chart";
import Tab from "@/components/app/projects/Tab"

interface TabData {
  value: string;
  label: string;
}

const ProjectChart = () => {
  const tabsData: TabData[] = [
    { value: "overview", label: "Overview" },
    { value: "sale", label: "Sales" },
    { value: "revenue", label: "Revenue" },
  ];

  const [activeTab, setActiveTab] = React.useState<string>("overview");

  return (
    <div className="w-full px-2 sm:px-4 lg:px-0">
      <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white p-4 sm:p-6">
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-center lg:text-left">
            <CardTitle className="font-sans font-semibold text-lg sm:text-xl leading-7 tracking-normal text-[#1D2939]">
              Statistics
            </CardTitle>
            <p className="font-sans font-normal text-sm sm:text-base leading-5 tracking-normal text-[#667085]">
              Target you’ve set for each month
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full sm:w-auto"
            >
              <div className="w-full overflow-x-auto">
                <Tab tabsData={tabsData} activeTab={activeTab} setActiveTab={setActiveTab} />
              </div>
            </Tabs>
            <div className="w-full sm:w-auto">
              <DatePicker />
            </div>
          </div>
        </CardHeader>
        <CardContent className="mt-4 sm:mt-6">
          <div className="w-full overflow-x-auto">
            <Chart />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectChart;
