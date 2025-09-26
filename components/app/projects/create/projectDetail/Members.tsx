import React from "react";
import Image from "next/image";
import { formatRole } from "@/utils/formatRole";

interface MembersProps {
  name: string;
  email: string;
  role: string;
}

const Members: React.FC<MembersProps> = ({ name, email, role }) => {
  return (
    <div className="flex justify-between items-center gap-4 rounded-2xl p-3.5 opacity-100 bg-[#FFFFFF]">
      <div className="flex items-center gap-3">
        <div>
          <Image
            src="/placeholders/user_placeholder.png"
            width={44}
            height={44}
            alt="Member avatar"
            className="rounded-full"
          />
        </div>
        <div>
          <p className="font-sans font-medium text-md leading-6 tracking-normal text-[#344054]">
            {name}
          </p>
          <p className="font-sans font-normal text-xs leading-4 tracking-normal text-[#757575]">
            {email}
          </p>
        </div>
      </div>
      <div className="px-2.5 py-0.5 rounded-full bg-[#F2F4F7] opacity-100 font-sans font-medium text-sm leading-5 tracking-normal text-center text-[#344054]">
        {formatRole(role)}
      </div>
    </div>
  );
};

export default Members;
