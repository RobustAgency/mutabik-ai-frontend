"use client"
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// --- RouteItem Type ---
type RouteItem = {
  href: string;
  label: string;
};

const Accordian = ({
  items,
  label,
  icon,
  isParentActive = false,
  pathname
}: {
  items: RouteItem[],
  label: string,
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>,
  isParentActive?: boolean,
  pathname?: string
}) => {
  const Icon = icon
  const currentPathname = pathname || (typeof window !== 'undefined' ? window?.location?.pathname : '');

  return (
    <div>
      <Accordion type="single" collapsible defaultValue={isParentActive ? label : undefined}>
        <AccordionItem value={label}>
          <AccordionTrigger
            className={`flex items-center justify-between p-2 md:p-3 mt-0 gap-2 [&>svg]:ml-6 cursor-pointer no-underline hover:no-underline decoration-transparent transition-colors ${isParentActive
              ? "bg-primary/10 text-primary border-primary"
              : "hover:bg-accent hover:text-accent-foreground"
              }`}
          >
            <div className="flex gap-2">
              <span>
                <Icon
                  className="shrink-0 size-6"
                  color={isParentActive ? "currentColor" : "#737373"}
                />
              </span>
              <span className={`font-medium text-[14px] ${isParentActive ? "text-primary" : "text-[#404040]"
                }`}>
                {label}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="flex flex-col gap-2">
              {items.map((child) => {
                const isActive = currentPathname === child.href || currentPathname.startsWith(child.href + '/');
                return (
                  <li
                    key={child.href}
                    className={`rounded-lg gap-[12px] cursor-pointer transition-colors ${isActive
                      ? "bg-primary/5"
                      : "hover:bg-[#F5F5F5]"
                      }`}>
                    <Link
                      href={child.href}
                      className={`font-outfit font-medium text-sm transition-colors ${isActive
                        ? 'text-primary bg-primary/10 border-primary'
                        : 'text-[#404040] hover:text-primary'
                        }`}>
                      <p className={`py-[8px] px-[10px] ${isActive ? "pl-[14px]" : ""
                        }`}>
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
