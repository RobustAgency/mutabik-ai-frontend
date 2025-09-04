import React from "react";
import { Input } from "../ui/input";
import { Search } from "lucide-react";

const SearchBar: React.FC = () => {
  return (
    <div className="w-full max-w-56">
      <div className="relative flex items-center">
        <span className="absolute left-3 text-gray-400">
          <Search size={20} color="#A3A3A3" />
        </span>
        <Input
          type="text"
          placeholder="Search..."
          className="pl-10 pr-4 py-5 w-full text-sm text-[#A3A3A3] rounded-[8px] focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
    </div>
  );
};

export default SearchBar;
