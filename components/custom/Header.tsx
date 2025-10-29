"use client";

import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import ProfileInfo from "./ProfileInfo";
import { useRouter, useSearchParams } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const step = searchParams.get("step");

  const headerGridClass = cn(
    "grid w-full sticky top-1.5 z-30 bg-[#FAFAFA] backdrop-blur-md py-2",
    // default design same (2 columns)
    // "grid-cols-[minmax(0,2fr)_auto] md:grid-cols-[300px_minmax(0,1fr)]",
    // mobile devices: convert to column layout
    "max-sm:flex max-sm:flex-col max-sm:gap-2 min-h-[76px]"
  );

  return (
    <header className={headerGridClass}>
      {/* <div className="flex items-center justify-between w-full px-3 sm:px-4 md:px-6">
        <div className="flex items-center justify-between md:justify-start w-full gap-2 sm:gap-3">
          <DrawerTrigger className="md:hidden" asChild>
            <Button
              variant="outline"
              size="icon"
              className="size-8 sm:size-9"
              aria-label="Open sidebar"
            >
              <ChevronLeft className="size-4 rotate-180" />
            </Button>
          </DrawerTrigger>
        </div>
      </div> */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 md:px-6 w-full">
        {!step ? (
          <p className="font-semibold text-base sm:text-lg md:text-xl text-[#1E1E1E]">
            Projects
          </p>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <div
              onClick={() => router.push("/projects")}
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 cursor-pointer flex justify-center items-center p-1 border border-[#E4E7EC] rounded-lg"
            >
              <ArrowLeft
                color="#757575"
                className="w-4 h-4 sm:w-[11px] sm:h-[11px]"
              />
            </div>
            <p
              onClick={() => router.push("/projects")}
              className="font-normal text-sm sm:text-base text-[#757575] cursor-pointer whitespace-nowrap"
            >
              Back to Projects
            </p>
          </div>
        )}
        <ProfileInfo />
      </div>
    </header>
  );
};

export default Header;
