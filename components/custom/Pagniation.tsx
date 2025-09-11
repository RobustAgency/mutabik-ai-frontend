import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Pagniation = ({ pagination, currentPage, totalPages, handlePageChange, loading }: { pagination: { page: number, limit: number, total: number, totalPages: number }, currentPage: number, totalPages: number, handlePageChange: (page: number) => void, loading: boolean }) => {
    // Safe fallback values to prevent NaN display
    const safePagination = pagination ? {
        page: typeof pagination.page === 'number' && !isNaN(pagination.page) && pagination.page > 0 ? pagination.page : 1,
        limit: typeof pagination.limit === 'number' && !isNaN(pagination.limit) && pagination.limit > 0 ? pagination.limit : 10,
        total: typeof pagination.total === 'number' && !isNaN(pagination.total) && pagination.total >= 0 ? pagination.total : 0,
        totalPages: typeof pagination.totalPages === 'number' && !isNaN(pagination.totalPages) && pagination.totalPages > 0 ? pagination.totalPages : 1
    } : {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1
    };

    const safeCurrentPage = typeof currentPage === 'number' && !isNaN(currentPage) && currentPage > 0 ? currentPage : 1;
    const safeTotalPages = typeof totalPages === 'number' && !isNaN(totalPages) && totalPages > 0 ? totalPages : 1;

    // Calculate safe display values
    const startItem = safePagination.total > 0 ? ((safePagination.page - 1) * safePagination.limit) + 1 : 0;
    const endItem = safePagination.total > 0 ? Math.min(safePagination.page * safePagination.limit, safePagination.total) : 0;

    return (
        <div className="flex items-center justify-between space-x-2 py-4 px-5">
            <div className="flex-1 text-sm text-muted-foreground">
                {safePagination.total > 0 ? (
                    <>
                        Showing {startItem} to {endItem} of {safePagination.total} results
                    </>
                ) : (
                    <>
                        No results found
                    </>
                )}
            </div>
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(1)}
                    disabled={safeCurrentPage <= 1 || loading || safePagination.total === 0}
                >
                    <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(safeCurrentPage - 1)}
                    disabled={safeCurrentPage <= 1 || loading || safePagination.total === 0}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(safeCurrentPage + 1)}
                    disabled={safeCurrentPage >= safeTotalPages || loading || safePagination.total === 0}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(safeTotalPages)}
                    disabled={safeCurrentPage >= safeTotalPages || loading || safePagination.total === 0}
                >
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

export default Pagniation