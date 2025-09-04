import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Landmark } from 'lucide-react';


const Accordian = ({
  children
}) => {
  return (
    <div>
      <div>
        <Accordion type="single" collapsible>
          <AccordionItem value="compliance">
            <AccordionTrigger
              className="flex items-center justify-start p-2 md:p-3 mt-0 gap-2 [&>svg]:ml-6 cursor-pointer no-underline hover:no-underline decoration-transparent"
            >
              <span className=""><Landmark className="shrink-0 size-6" color="#737373" /></span>
              <span className="text-[#737373] font-medium text-[14px]">Compliance Library</span>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="flex flex-col gap-2">

                {children.map((child) => (
                  <li key={child.href} className="py-[8px] px-[10px] rounded-lg gap-[12px] hover:bg-[#F5F5F5] cursor-pointer">
                    <Link href={child.href} className="text-[#404040] font-outfit font-medium text-sm hover:text-blue-600">
                      {child.label}
                    </Link>
                  </li>
                ))}

              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default Accordian;
