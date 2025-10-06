"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  onRowClick
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
  const pathname = usePathname();

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
              className="pl-10 pr-4 py-5 w-full text-sm text-[#A3A3A3] rounded-[8px]"
            />
          </div>
        </div>
      )}
      <div className="overflow-x-auto w-full mt-4">
        <Table className={`w-full text-left ${className}`}>
          <TableHeader className={`${ variant === "projects"? "bg-white" : "bg-gray-50 transition"}`}>
            <TableRow className="">
              {showRowSelector && (
                <TableHead className={`py-3  transition ${ variant === "projects"? "bg-white" : "bg-gray-50 transition"}  text-[#0A0A0A] text-sm font-semibold ${className}`} style={{ textAlign: "left" }}>
                </TableHead>
              )}
              {table.getHeaderGroups()[0].headers.map(
                (header, index) => (
                  (
                    <TableHead
                      key={header.id}
                      className={`py-3  ${ variant === "projects"? "bg-white" : "bg-gray-50 transition"} transition text-[#0A0A0A] text-sm font-semibold  ${index === 0 ? "pl-4" : ""} ${className}`}
                      style={{ textAlign: "left" }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                )
              )}
            </TableRow>
          </TableHeader>
          <TableBody className="relative ">
            {loading ? (
              <TableRow className={` ${className}`}>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center "
                >
                  <div className="flex items-center justify-center gap-2 ">
                    <div className={`h-5 w-5 animate-spin rounded-full   ${className}`} />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  className={` ${index % 2 === 0   || variant === "projects" ?  "bg-white" : "bg-[#FAFAFA]"} ${onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}`}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {/* Checkbox cell at the start of each row */}
                  {showRowSelector && (
                    <TableCell className="py-4 pl-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row.id)}
                        className="text-[#FFFFFF]   rounded-[4px] h-[16px]"
                        onChange={() => handleRowCheckboxChange(row.id)}
                      />
                    </TableCell>
                  )}
                  {row.getVisibleCells().map((cell, cellIndex) => (
                    <TableCell
                      key={cell.id}
                      className={`py-4  text-sm ${cellIndex === 0 && !showRowSelector ? "pl-4" : ""
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
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pagination && (
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
