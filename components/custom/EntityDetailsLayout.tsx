"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

/**
 * Entity Details Layout Component
 * 
 * Standardized layout for detail pages to reduce repetition.
 * Provides consistent structure for title, description, action buttons, and content.
 */

export interface EntityDetailsLayoutProps {
  /** Page title */
  title: string;
  /** Page description */
  description: string;
  /** Loading state */
  loading?: boolean;
  /** Error message */
  error?: string | null;
  /** Edit button handler (optional) */
  onEdit?: () => void;
  /** Delete button handler (optional) */
  onDelete?: () => void;
  /** Custom action buttons (optional) */
  customActions?: React.ReactNode;
  /** Show edit button (default: true if onEdit provided) */
  showEdit?: boolean;
  /** Show delete button (default: true if onDelete provided) */
  showDelete?: boolean;
  /** Edit button text (default: "Edit") */
  editText?: string;
  /** Delete button text (default: "Delete") */
  deleteText?: string;
  /** Main content */
  children: React.ReactNode;
  /** Custom loading component */
  loadingComponent?: React.ReactNode;
  /** Custom error component */
  errorComponent?: React.ReactNode;
  /** Additional CSS classes for the outer container */
  className?: string;
  /** Additional CSS classes for the Card */
  cardClassName?: string;
}

/**
 * EntityDetailsLayout component
 * 
 * @example
 * ```tsx
 * <EntityDetailsLayout
 *   title="Data Source Details"
 *   description="View and manage data source information"
 *   loading={isLoading}
 *   error={error}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 * >
 *   <DataSourceFormReadOnly dataSource={dataSource} />
 * </EntityDetailsLayout>
 * ```
 */
export const EntityDetailsLayout: React.FC<EntityDetailsLayoutProps> = ({
  title,
  description,
  loading = false,
  error = null,
  onEdit,
  onDelete,
  customActions,
  showEdit = true,
  showDelete = true,
  editText = "Edit",
  deleteText = "Delete",
  children,
  loadingComponent,
  errorComponent,
  className = "",
  cardClassName = "",
}) => {
  // Default loading component
  const defaultLoadingComponent = (
    <div className="max-w-7xl mx-auto">
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#4FD58F]" />
        </div>
      </Card>
    </div>
  );

  // Default error component
  const defaultErrorComponent = (
    <div className="max-w-7xl mx-auto">
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <p className="text-red-500 text-center">{error}</p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="border-[#E4E7EC] text-[#667085]"
          >
            Retry
          </Button>
        </div>
      </Card>
    </div>
  );

  // Show loading state
  if (loading) {
    return loadingComponent || defaultLoadingComponent;
  }

  // Show error state
  if (error) {
    return errorComponent || defaultErrorComponent;
  }

  // Main content
  return (
    <div className={`max-w-7xl mx-auto ${className}`}>
      <Card className={`p-6 border-[#E4E7EC] shadow-none ${cardClassName}`}>
        {/* Header with title, description, and action buttons */}
        <div className="flex flex-col sm:flex-row items-start gap-3 justify-start sm:justify-between mb-6">
          <div>
            <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">
              {title}
            </h1>
            <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">
              {description}
            </p>
          </div>

          {/* Action buttons */}
          {(customActions || onEdit || onDelete) && (
            <div className="flex gap-3">
              {customActions}
              
              {onEdit && showEdit && (
                <Button
                  variant="outline"
                  onClick={onEdit}
                  className="border-[#E4E7EC] text-[#667085]"
                >
                  {editText}
                </Button>
              )}
              
              {onDelete && showDelete && (
                <Button
                  variant="outline"
                  onClick={onDelete}
                  className="border-[#E4E7EC] text-[#667085]"
                >
                  {deleteText}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Main content */}
        <CardContent className="space-y-6">
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

export default EntityDetailsLayout;

