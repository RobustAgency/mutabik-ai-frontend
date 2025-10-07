import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ChevronLeft, Divide } from "lucide-react";
import { DrawerTrigger } from "../ui/drawer";
import ProfileInfo from "./ProfileInfo";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const Header = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const step = searchParams.get("step");
  console.log("params", step);
  const headerGridClass = cn(
    "grid w-full min-h-14 sticky top-1.5 z-30 bg-background/80 backdrop-blur py-1  bg-[#FAFAFA]",
    // Mobile: content + profile columns
    "grid-cols-[minmax(0,1fr)_auto]",
    // Desktop: first column reserved for sidebar width
    "md:grid-cols-[300px_minmax(0,1fr)]"
  );

  return (
    <header className={headerGridClass}>
      <div className="h-full w-full flex items-center justify-between px-0 xs:px-4">
        <div className="w-full flex items-center justify-start md:justify-between gap-0 md:gap-2">
          <div aria-details="logo" className="pl-2">
            <Link href="/" className="hidden md:block">
              <Image
                src="/auth/dashboard-logo.svg"
                alt="logo"
                width={120}
                height={56}
              />
            </Link>
          </div>
          <DrawerTrigger className="md:hidden" asChild>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              aria-label="Open sidebar"
            >
              <ChevronLeft className="size-4 rotate-180" />
            </Button>
          </DrawerTrigger>
        </div>
      </div>
      <div className="flex items-center justify-between  gap-0.5">
        {!step && (
          <p
            className="font-semibold text-[20px]  text-[#1E1E1E]"
          >
            Projects
          </p>
        )}
        {step && (
          <div className="flex justify-center items-center gap-4 ">
            <div onClick={() => {
              router.push("/projects");
            }} className="w-11 h-11 cursor-pointer flex justify-center items-center gap-[10px] opacity-100 p-1 border border-[#E4E7EC] rounded-lg">
              <ArrowLeft color="#757575" className="w-4 h-4 opacity-100" />
            </div>
            <p onClick={() => {
              router.push("/projects");
            }} className="font-normal text-base text-[#757575] cursor-pointer">Back to Projects</p>
          </div>
        )}

        {/* <SearchBar /> */}
        <ProfileInfo />
      </div>
    </header>
  );
};

export default Header;
