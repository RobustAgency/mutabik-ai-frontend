"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import GeneralDetail from "./GeneralDetail";
import ManageTeam from "./ManageTeam";
import AiModal from "./AiModal";
import ModalVersion from "./ModalVersion";
import ModalCard from "./ModalCard";

const ProjectSetting = () => {
  return (
    <div className="w-full">
      <Card className="w-full gap-10 rotate-0 opacity-100 rounded-2xl border border-[#E4E7EC] px-4 md:px-6">
        <Tabs className="w-full" defaultValue="general-detail">
          {/* Tabs Navigation */}
          <div className="flex flex-wrap justify-between items-start md:items-center gap-3">
            {/* Tabs List */}
            <TabsList
              className="flex sm:flex-wrap lg:flex-nowrap gap-2 h-auto md:h-10 
  opacity-100 rounded-lg p-0.5 bg-[#F2F4F7] cursor-pointer 
  overflow-x-auto scrollbar-hide w-full md:w-auto"
            >
              <TabsTrigger
                className="flex-shrink-0 opacity-100 gap-2.5 px-5 py-[10px] rounded-md 
                            min-w-[120px] md:w-[137px] h-9 font-medium text-sm leading-5 
                            text-[#667085] data-[state=active]:bg-white 
                            data-[state=active]:text-[#101828] cursor-pointer"
                value="general-detail"
              >
                General Detail
              </TabsTrigger>
              <TabsTrigger
                className="flex-shrink-0 opacity-100 gap-2.5 px-5 py-[10px] rounded-md 
    min-w-[120px] md:w-[137px] h-9 font-medium text-sm leading-5 
    text-[#667085] data-[state=active]:bg-white 
    data-[state=active]:text-[#101828] cursor-pointer"
                value="menage-team"
              >
                Manage Team
              </TabsTrigger>
              <TabsTrigger
                className="flex-shrink-0 opacity-100 gap-2.5 px-5 py-[10px] rounded-md 
    min-w-[120px] md:w-[137px] h-9 font-medium text-sm leading-5 
    text-[#667085] data-[state=active]:bg-white 
    data-[state=active]:text-[#101828] cursor-pointer"
                value="ai-modal"
              >
                AI Modal
              </TabsTrigger>
              <TabsTrigger
                className="flex-shrink-0 opacity-100 gap-2.5 px-5 py-[10px] rounded-md 
    min-w-[120px] md:w-[137px] h-9 font-medium text-sm leading-5 
    text-[#667085] data-[state=active]:bg-white 
    data-[state=active]:text-[#101828] cursor-pointer"
                value="modal-version"
              >
                Modal Version
              </TabsTrigger>
              <TabsTrigger
                className="flex-shrink-0 opacity-100 gap-2.5 px-5 py-[10px] rounded-md 
    min-w-[120px] md:w-[137px] h-9 font-medium text-sm leading-5 
    text-[#667085] data-[state=active]:bg-white 
    data-[state=active]:text-[#101828] cursor-pointer"
                value="modal-card"
              >
                Modal Card
              </TabsTrigger>
            </TabsList>

            {/* Button */}
            <Button
              className="w-full md:w-[113px] h-11 gap-2 opacity-100 
              pt-3 pr-4 pb-3 pl-4 rounded-lg border border-[#4FD58F] 
              bg-[#4FD58F] cursor-pointer"
            >
              Save Settings
            </Button>
          </div>

          {/* Tab Contents */}
          <TabsContent value="general-detail">
            <GeneralDetail />
          </TabsContent>
          <TabsContent value="menage-team">
            <ManageTeam />
          </TabsContent>
          <TabsContent value="ai-modal">
            <AiModal />
          </TabsContent>
          <TabsContent value="modal-version">
            <ModalVersion />
          </TabsContent>
          <TabsContent value="modal-card">
            <ModalCard />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default ProjectSetting;
