"use client"
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RouteItem } from "@/app/constants/sidebar-routes";

const Accordian = ({
  items,
  label,
  icon,
  pathname,
  href,
  onNavigate,
  collapsed = false,
  depth = 0
}: {
  items: RouteItem[],
  label: string,
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>,
  pathname?: string,
  href?: string,
  onNavigate?: () => void,
  collapsed?: boolean,
  depth?: number
}) => {
  const Icon = icon;
  const currentPathname = pathname || (typeof window !== 'undefined' ? window?.location?.pathname : '');

  // Check if any child is active
  const isChildActive = items.some(child => {
    if (child.href && (currentPathname === child.href || currentPathname.startsWith(child.href + '/'))) {
      return true;
    }
    // Check nested children recursively
    if (child.children) {
      return child.children.some(nestedChild =>
        currentPathname === nestedChild.href || currentPathname.startsWith(nestedChild.href + '/')
      );
    }
    return false;
  });

  // Recursive function to render child items (including nested accordions)
  const renderChild = (child: RouteItem, childDepth: number) => {
    const hasChildren = Array.isArray(child.children) && child.children.length > 0;
    const isActive = child.href && (currentPathname === child.href || currentPathname.startsWith(child.href + '/'));

    // If child has nested children, render as nested accordion
    if (hasChildren) {
      return (
        <div key={child.label + child.href} className="ml-4">
          <Accordian
            label={child.label}
            items={child.children ?? []}
            icon={child.icon ?? (() => null)}
            pathname={currentPathname}
            href={child.href}
            onNavigate={onNavigate}
            collapsed={collapsed}
            depth={childDepth + 1}
          />
        </div>
      );
    }

    // Regular child link
    return (
      <li
        key={child.href}
        className={`rounded-lg gap-[12px] cursor-pointer transition-colors ${isActive ? "bg-primary/5" : "hover:bg-[#F5F5F5]"
          }`}
      >
        <Link
          href={child.href}
          onClick={onNavigate}
          className={`font-outfit font-medium text-sm transition-colors ${isActive
            ? 'text-primary bg-primary/10 border-primary'
            : 'text-[#404040] hover:text-primary'
            }`}
        >
          <p className={`py-[8px] px-[12px] ${isActive ? "pl-[14px]" : ""}`}>
            {child.label}
          </p>
        </Link>
      </li>
    );
  };

  if (collapsed) {
    return null;
  }

  return (
    <div>
      <Accordion type="single" collapsible>
        <AccordionItem value={label}>
          <AccordionTrigger
            className={`flex items-center justify-between p-2 md:p-3 mt-0 gap-2 [&>svg]:ml-6 cursor-pointer no-underline hover:no-underline decoration-transparent transition-colors ${isChildActive
              ? "bg-primary/10 text-primary"
              : "hover:bg-accent hover:text-accent-foreground"
              }`}
          >
            <div className="flex gap-2">
              <span>
                <Icon
                  className="shrink-0 size-5"
                  color={isChildActive ? "currentColor" : "#737373"}
                />
              </span>
              <span className={`font-medium text-sm whitespace-nowrap ${isChildActive ? "text-primary" : "text-[#404040]"
                }`}>
                {label}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="flex flex-col gap-2 mt-1">
              {items.map((child) => renderChild(child, depth))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Accordian;