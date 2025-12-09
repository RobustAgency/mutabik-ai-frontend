"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
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

  // Check if current item is active
  const isActive = href && (currentPathname === href || currentPathname.startsWith(href + '/'));

  // Check if any child is active (recursively)
  const isChildActive = items.some(child => {
    if (child.href && (currentPathname === child.href || currentPathname.startsWith(child.href + '/'))) {
      return true;
    }
    if (child.children) {
      return child.children.some(nestedChild =>
        nestedChild.href && (currentPathname === nestedChild.href || currentPathname.startsWith(nestedChild.href + '/'))
      );
    }
    return false;
  });

  // Auto-expand if child is active
  const [isOpen, setIsOpen] = useState(isActive || isChildActive);

  // Update isOpen when pathname changes
  useEffect(() => {
    if (isActive || isChildActive) {
      setIsOpen(true);
    }
  }, [isActive, isChildActive, currentPathname]);

  // Recursive function to render child items
  const renderChild = (child: RouteItem, childDepth: number) => {
    const hasChildren = Array.isArray(child.children) && child.children.length > 0;
    const isChildItemActive = child.href && (currentPathname === child.href || currentPathname.startsWith(child.href + '/'));

    // If child has nested children, render as nested accordion
    if (hasChildren) {
      return (
        <Accordian
          key={child.label + child.href}
          label={child.label}
          items={child.children ?? []}
          icon={child.icon ?? (() => null)}
          pathname={currentPathname}
          href={child.href}
          onNavigate={onNavigate}
          collapsed={collapsed}
          depth={childDepth + 1}
        />
      );
    }

    // Regular child link
    return (
      <Link
        key={child.href}
        href={child.href}
        onClick={onNavigate}
        className={`group flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${isChildItemActive
          ? 'bg-primary/10 text-primary'
          : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
          }`}
      >
        {child.icon && (
          <child.icon
            className="shrink-0 size-4"
            color={isChildItemActive ? "currentColor" : "#737373"}
          />
        )}
        <span>{child.label}</span>
      </Link>
    );
  };

  if (collapsed) {
    return null;
  }

  return (
    // <div className={depth > 0 ? "ml-2" : ""}>
    <div >
      <div className={`flex items-center gap-1 rounded-lg transition-all duration-200 ${(isActive || isChildActive) ? "bg-primary/10" : ""
        }`}>
        {/* Clickable parent link (if href exists) */}
        {href ? (
          <Link
            href={href}
            onClick={onNavigate}
            className={`flex-1 flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 ${isActive
              ? "text-primary"
              : "text-gray-700 hover:text-primary"
              }`}
          >
            <Icon
              className="shrink-0 size-4"
              color={(isActive || isChildActive) ? "currentColor" : "#737373"}
            />
            <span className="flex-1 whitespace-nowrap">{label}</span>
          </Link>
        ) : (
          // Non-clickable parent (just label)
          <div className={`flex-1 flex items-center gap-3 px-4 py-2.5 text-sm font-medium ${isChildActive ? "text-primary" : "text-gray-700"
            }`}>
            <Icon
              className="shrink-0 size-4"
              color={isChildActive ? "currentColor" : "#737373"}
            />
            <span className="flex-1 whitespace-nowrap">{label}</span>
          </div>
        )}

        {/* Expand/collapse button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="p-2 hover:bg-primary/5 rounded-lg transition-colors mr-2"
          aria-label={isOpen ? "Collapse" : "Expand"}
        >
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
              } ${(isActive || isChildActive) ? 'text-primary' : 'text-gray-500'}`}
          />
        </button>
      </div>

      {/* Render children with smooth animation */}
      <div
        className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-[2000px] opacity-100 mt-1' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="flex flex-col gap-0.5 pl-2 border-l-2 border-gray-200 ml-4">
          {items.map((child) => renderChild(child, depth))}
        </div>
      </div>
    </div>
  );
};

export default Accordian;