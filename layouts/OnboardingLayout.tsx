"use client";
import React from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Stepper, { Step } from "@/components/custom/Stepper";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const steps: Step[] = [
  { id: 1, label: "Organization setup" },
  { id: 2, label: "Invite team" },
  { id: 3, label: "Choose a plan" },
];



const OnboardingLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  let activeStep = 1;
  if (pathname === "/onboarding" && searchParams.get("mode") === "invite-team") {
    activeStep = 2;
  } else if (pathname === "/onboarding" && searchParams.get("mode") === "plans") {
    activeStep = 3;
  } else {
    activeStep = 1;
  }
  return (
    <div className="flex w-full min-h-screen overflow-hidden">
      {/* Aside: hidden on mobile, visible on md+ */}
      <aside
        className="hidden md:fixed md:flex flex-col justify-between w-[300px] min-h-screen bg-[#0B2232] px-8 py-10 left-0 top-0 z-30"
        style={{ minWidth: 260 }}
      >
        <div>
          {/* Logo */}
          <div className="flex items-center mb-16">
            <Image
              src="/auth/logo.svg"
              width={100}
              height={50}
              alt="mutabiq.ai logo"
              className="mr-3"
            />
          </div>
          {/* Stepper (vertical, only on md+) */}
          <h2 className="text-white text-2xl font-bold mb-6">
            Setup your account
          </h2>
          <Stepper
            steps={steps}
            activeStep={activeStep}
            orientation="vertical"

          />
        </div>
        {/* Support link at the bottom */}
        <div className="text-[#B6C2CB] text-xs text-center mt-12">
          Need help?{" "}
          <a
            href="#"
            className="underline text-[#B6C2CB] hover:text-primary transition-colors"
          >
            Connect with support
          </a>
        </div>
      </aside>
      <div className="flex-1 w-full md:ml-[260px] flex flex-col min-h-screen">
        <header className="w-full fixed top-0 left-0  z-20 bg-white flex flex-col md:flex-row md:justify-end items-center h-auto md:h-[100px] px-4 py-4 gap-4">
          {/* Horizontal stepper for mobile only */}
          <div className="flex w-full justify-center md:hidden mb-2">
            <Stepper
              steps={steps}
              activeStep={activeStep}
              orientation="horizontal"

              className="w-full max-w-md"
            />
          </div>
          <Button
            onClick={() => {
              router.push("/logout")
            }}
            variant="outline"
            className="flex items-center py-6 px-6 border border-[#D0D5DD] gap-2 text-[#0B2232] hover:bg-[#F1F5F9] transition-colors shadow-none rounded-lg text-base font-medium"
          >
            <LogOut className=" text-[#0B2232]" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </header>
        {/* Main content area */}
        <main className="flex-1 w-full bg-white pt-[150px] px-2 md:px-20 lg:px-36 pb-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default OnboardingLayout;
