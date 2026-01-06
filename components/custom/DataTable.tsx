"use client";
import * as React from "react";
import Link from "next/link";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import Pagniation from "./Pagniation";
import { Search } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
  onSearch?: (searchTerm: string) => void;
  loading?: boolean;
  showRowSelector?: boolean;
  serverSide?: boolean;
  variant?: "default" | "projects" | "compact" | "striped";
  className?: string;
  onRowClick?: (data: TData) => void;
  // New props for customizing empty and loading states
  emptyState?: {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
  };
  loadingState?: {
    text?: string;
    spinner?: React.ReactNode;
  };
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
  pagination,
  onPageChange,
  onSearch,
  showRowSelector = false,
  loading = false,
  serverSide = false,
  variant,
  className,
  onRowClick,
  emptyState,
  loadingState,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [searchValue, setSearchValue] = React.useState("");

  // debounce timer ref
  const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

  // State to manage selected rows
  const [selectedRows, setSelectedRows] = React.useState<string[]>([]);
  // Toggle row selection
  const handleRowCheckboxChange = (rowId: string) => {
    setSelectedRows((prev) =>
      prev.includes(rowId)
        ? prev.filter((id) => id !== rowId)
        : [...prev, rowId]
    );
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: serverSide ? undefined : getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: serverSide ? undefined : getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    manualPagination: serverSide,
    manualFiltering: serverSide,
    pageCount: serverSide ? pagination?.totalPages || 0 : undefined,
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);

    if (!serverSide && searchKey) {
      table.getColumn(searchKey)?.setFilterValue(value);
    }

    if (serverSide && onSearch) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onSearch(value);
      }, 300);
    }
  };

  const handlePageChange = (page: number) => {
    if (serverSide && onPageChange) {
      onPageChange(page);
    } else {
      table.setPageIndex(page - 1);
    }
  };

  const currentPage = serverSide
    ? pagination?.page || 1
    : table.getState().pagination.pageIndex + 1;
  const totalPages = serverSide
    ? pagination?.totalPages || 0
    : table.getPageCount();

  // Render loading state
  const renderLoadingState = () => (
    <TableRow className={`${className}`}>
      <TableCell
        colSpan={columns.length + (showRowSelector ? 1 : 0)}
        className="h-64 text-center"
      >
        <div className="flex flex-col items-center justify-center gap-3">
          {loadingState?.spinner || (
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
          )}
          <p className="text-sm text-gray-500">
            {loadingState?.text || "Loading..."}
          </p>
        </div>
      </TableCell>
    </TableRow>
  );

  // Render empty state
  const renderEmptyState = () => (
    <TableRow>
      <TableCell
        colSpan={columns.length + (showRowSelector ? 1 : 0)}
        className="h-64 text-center"
      >
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          {emptyState?.icon || (
            <div className="rounded-full bg-gray-100 p-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
          )}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {emptyState?.title || "No results found"}
            </h3>
            <p className="text-sm text-gray-500">
              {emptyState?.description ||
                "Try adjusting your search or filter to find what you're looking for."}
            </p>
          </div>
          {emptyState?.action && (
            <div className="mt-4">{emptyState.action}</div>
          )}
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="">
      {searchKey && (
        <div className="flex items-center justify-end w-full">
          <div className="flex gap-4 items-center w-full max-w-80 mr-4 relative">
            <span className="absolute left-3 text-[#A3A3A3]">
              <Search size={20} color="#A3A3A3" />
            </span>
              <Input
              placeholder={searchPlaceholder}
              value={
                serverSide
                  ? searchValue
                  : (table.getColumn(searchKey)?.getFilterValue() as string) ??
                  ""
              }
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-5 w-full text-sm text-[#A3A3A3] rounded-xl"
              disabled={loading}
            />
          </div>
        </div>
      )}
      <div className="overflow-x-auto w-full mt-4">
        <Table className={`w-full text-left ${className}`}>
          <TableHeader
            className={`${variant === "projects" ? "bg-white" : "bg-gray-50 transition"
              }`}
          >
            <TableRow className="">
              {showRowSelector && (
                <TableHead
                  className={`py-3 transition ${variant === "projects" ? "bg-white" : "bg-gray-50 transition"
                    } text-[#0A0A0A] text-sm font-semibold ${className}`}
                  style={{ textAlign: "left" }}
                ></TableHead>
              )}
              {table.getHeaderGroups()[0].headers.map((header, index) => (
                <TableHead
                  key={header.id}
                  className={`py-3 ${variant === "projects" ? "bg-white" : "bg-gray-50 transition"
                    } transition text-[#0A0A0A] text-sm font-semibold ${index === 0 ? "pl-4" : ""
                    } ${className}`}
                  style={{ textAlign: "left" }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="relative">
            {loading
              ? renderLoadingState()
              : table.getRowModel().rows?.length
                ? table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    className={`${index % 2 === 0 || variant === "projects"
                      ? "bg-white"
                      : "bg-[#FAFAFA]"
                      } ${onRowClick ? "cursor-pointer hover:bg-gray-50" : ""
                      }`}
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {showRowSelector && (
                      <TableCell className="py-4 pl-4">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(row.id)}
                          className="text-[#FFFFFF] rounded-lg h-4"
                          onChange={() => handleRowCheckboxChange(row.id)}
                        />
                      </TableCell>
                    )}
                    {row.getVisibleCells().map((cell, cellIndex) => (
                      <TableCell
                        key={cell.id}
                        className={`py-4 text-sm ${cellIndex === 0 && !showRowSelector ? "pl-4" : ""
                          } ${cell.column.id === "actions"
                            ? "text-[#252DAE] font-semibold cursor-pointer"
                            : "text-[#171717]"
                          }`}
                        style={{ border: "none", background: "transparent" }}
                      >
                        {cell.column.id === "action" ? (
                          <Link
                            href={cell.getValue() as string}
                            className="text-blue-600 font-medium"
                          >
                            Open
                          </Link>
                        ) : (
                          flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
                : renderEmptyState()}
          </TableBody>
        </Table>
      </div>
      {pagination && !loading && table.getRowModel().rows?.length > 0 && (
        <Pagniation
          pagination={pagination}
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
          loading={loading}
        />
      )}
    </div>
  );
}