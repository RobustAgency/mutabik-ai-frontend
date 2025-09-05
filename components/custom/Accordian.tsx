"use client"
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useRouter } from "next/navigation";

// --- RouteItem Type ---
type RouteItem = {
  href: string;
  label: string;
};

const Accordian = ({ items, label, icon, collapsed }: { items: RouteItem[], label: string, icon: any, collapsed: Boolean }) => {
  const Icon = icon
  const pathname = window?.location?.pathname;
  return (
    <div>
      <Accordion type="single" collapsible>
        <AccordionItem value={label}>
          <AccordionTrigger
            className="flex items-center justify-between p-2 md:p-3 mt-0 gap-2 [&>svg]:ml-6 cursor-pointer no-underline hover:no-underline decoration-transparent"
          >
            <div className="flex gap-2">
              <span>
                <Icon className="shrink-0 size-6" color="#737373" />
              </span>
              <span className="text-[#404040] font-medium text-[14px]">
                {label}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="flex flex-col gap-2">
              {items.map((child) => {
                const isActive = pathname.includes(child.href);
                return (
                  <li
                    key={child.href}
                    className="rounded-lg gap-[12px] hover:bg-[#F5F5F5] cursor-pointer">
                    <Link
                      href={child.href}
                      className={`text-[#404040] font-outfit font-medium text-sm hover:text-primary ${isActive ? 'text-primary' : ''}`}>
                      <p className="py-[8px] px-[10px]">
                        {child.label}
                      </p>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Accordian;
