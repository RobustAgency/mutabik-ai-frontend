"use client"
import * as React from "react"
import Link from "next/link"
import { ColumnDef, flexRender, getCoreRowModel, useReactTable, getPaginationRowModel, getSortedRowModel, SortingState, getFilteredRowModel, ColumnFiltersState } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import Pagniation from "./Pagniation"
import { ChevronUp, ChevronDown } from 'lucide-react';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    searchKey?: string
    searchPlaceholder?: string
    pagination?: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
    onPageChange?: (page: number) => void
    onSearch?: (searchTerm: string) => void
    loading?: boolean
    serverSide?: boolean
}

export function DataTable<TData, TValue>({
    columns,
    data,
    searchKey,
    searchPlaceholder = "Search...",
    pagination,
    onPageChange,
    onSearch,
    loading = false,
    serverSide = false,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [searchValue, setSearchValue] = React.useState("")

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
    })

    React.useEffect(() => {
        if (serverSide && onSearch) {
            const timeoutId = setTimeout(() => {
                onSearch(searchValue)
            }, 300)

            return () => clearTimeout(timeoutId)
        }
    }, [searchValue, onSearch, serverSide])

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        setSearchValue(value)

        if (!serverSide && searchKey) {
            table.getColumn(searchKey)?.setFilterValue(value)
        }
    }

    const handlePageChange = (page: number) => {
        if (serverSide && onPageChange) {
            onPageChange(page)
        } else {
            table.setPageIndex(page - 1)
        }
    }

    const currentPage = serverSide ? (pagination?.page || 1) : table.getState().pagination.pageIndex + 1
    const totalPages = serverSide ? (pagination?.totalPages || 0) : table.getPageCount()

    return (
        <div>
            {searchKey && (
                <div className="flex items-center mt-4">
                    <Input
                        placeholder={searchPlaceholder}
                        value={serverSide ? searchValue : (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                        onChange={handleSearchChange}
                        className="max-w-sm"
                        disabled={loading}
                    />
                </div>
            )}
            <div className="overflow-x-auto w-full mt-4">
                <Table className="w-full text-left border-collapse">
                    <TableHeader className="bg-gray-50 transition">
                        <TableRow className="">
                            {table.getHeaderGroups()[0].headers.map((header, index) => (
                                console.log('header', header),
                                <TableHead
                                    key={header.id}
                                    className="py-3 bg-[#FAFAFA] transition  px-4 text-[#0A0A0A] text-sm font-semibold border-b border-gray-200"
                                    style={{ textAlign: 'left' }}
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                     {/* {index % 2 === 1 && header.column.id !== "actions" ? (
                                                        <ChevronUp className="inline-block ml-2" />
                                                    ): (
                                                        <ChevronDown className="inline-block ml-2" />
                                                    )} */}
                                                    {
                                                        index % 2 === 1 && header.column.id !== "actions" && (
                                                            <ChevronUp className="inline-block ml-2" color="#A3A3A3" width={15} />
                                                        )
                                                    }
                                                    {
                                                        index % 2 === 0 && header.column.id !== "actions" && (
                                                            <ChevronDown className="inline-block ml-2" color="#A3A3A3" width={15} />
                                                        )
                                                    }
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow className="border-b">
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    <div className="flex items-center justify-center">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-primary mr-2" />
                                        Loading...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className=""
                                    // style={{ borderBottom: 'none' }}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        // console.log('cell', cell),
                                          <TableCell
                                            key={cell.id}
                                            className={`py-4 px-4  text-sm ${cell.column.id === 'actions' ? 'text-[#252DAE] font-semibold cursor-pointer' : 'text-[#171717]'}`}
                                            style={{ border: 'none', background: 'transparent' }}
                                        >
                                           
                                            {cell.column.id === 'action' ? (
                                                <Link href={cell.getValue() as string} className="text-blue-600 font-medium">Open</Link>
                                            ) : (
                                                flexRender(cell.column.columnDef.cell, cell.getContext())
                                            )}
                                             
                                        </TableCell>
                                      
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {pagination && (
                <Pagniation pagination={pagination} currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} loading={loading} />
            )}
        </div>
    )
}
