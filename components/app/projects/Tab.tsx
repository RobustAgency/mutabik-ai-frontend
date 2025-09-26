import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface TabData {
  value: string;
  label: string;
}

interface ProjectTabsProps {
  tabsData: TabData[];
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const ProjectTabs: React.FC<ProjectTabsProps> = ({
  tabsData,
  activeTab,
  setActiveTab,
}) => {
  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full lg:w-auto"
    >
      <div className="w-full overflow-x-auto">
        <TabsList className="flex w-max sm:w-full px-[2px] py-[2px] sm:flex-wrap lg:flex-nowrap rounded-md bg-[#F2F4F7]">
          {tabsData.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="min-w-[120px] cursor-pointer h-[33px] text-sm font-medium 
                data-[state=active]:bg-white  
                data-[state=active]:rounded-md 
                data-[state=active]:text-[#101828] 
                data-[state=inactive]:text-gray-600"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </Tabs>
  );
};

export default ProjectTabs;
