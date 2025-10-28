"use client";

import { useAuth } from "@/providers/AuthProvider";
import Image from "next/image";
import React, { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

const ProfileInfo = () => {
  const { profile, fetchProfile } = useAuth();
  const avatarUrl = profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.full_name || "User"}&background=random&size=128`;
  const router = useRouter();

  useEffect(() => {
    if (!profile) {
      fetchProfile();
    }
  }, [profile, fetchProfile]);

  return (
    <div className="flex items-center gap-2 sm:gap-3 justify-end sm:px-3 md:px-4">
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Avatar */}
        <Image
          src={avatarUrl}
          alt="Profile"
          width={40}
          height={40}
          className="w-9 h-9 sm:w-[44px] sm:h-[44px] rounded-full object-cover cursor-pointer"
        />

        {/* Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer" asChild>
            <div className="flex items-center gap-1 sm:gap-2">
              <p className="font-medium text-sm sm:text-base text-[#344054] truncate max-w-[120px] sm:max-w-[160px]">
                {profile?.full_name || "User"}
              </p>
              <ChevronDown color="#667085" className="w-4 h-4" />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.push("/settings")}
            >
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.push("/logout")}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ProfileInfo;
