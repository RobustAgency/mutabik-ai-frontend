import { useState, useEffect, useCallback } from 'react'
import { usersService } from '@/service/admin/users'
import { UserFilters, User } from '@/interfaces/User'
import { toast } from 'react-toastify'

export type TableUser = {
    id: string
    full_name: string
    email: string
    status: "approved" | "rejected" | "pending"
}

interface PaginationState {
    page: number
    limit: number
    total: number
    totalPages: number
}

interface UseUsersReturn {
    users: TableUser[]
    loading: boolean
    error: string | null
    pagination: PaginationState
    filters: UserFilters
    fetchUsers: () => Promise<void>
    handleSearch: (searchTerm: string) => void
    handlePageChange: (page: number) => void
    handleRefresh: () => void
    setFilters: (filters: UserFilters) => void
}

export const useUsers = (): UseUsersReturn => {
    const [users, setUsers] = useState<TableUser[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [filters, setFilters] = useState<UserFilters>({
        page: 1,
        status: undefined,
        search: undefined
    })
    const [pagination, setPagination] = useState<PaginationState>({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    })

    const transformUserToTableUser = (user: User): TableUser => ({
        id: user.id.toString(),
        full_name: user.name || 'N/A',
        email: user.email,
        status: user.is_approved ? 'approved' : 'pending'
    })

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await usersService.getUsers(filters)
            if (response.error) {
                toast.error(response.message)
                setError(response.message)
                return
            }

            const transformedUsers: TableUser[] = response.data.data.map(transformUserToTableUser)

            setUsers(transformedUsers)

            setPagination({
                page: response.data.current_page,
                limit: response.data.per_page,
                total: response.data.total,
                totalPages: response.data.last_page
            })
        } catch (err) {
            const errorMessage = 'Error fetching users'
            toast.error(errorMessage)
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }, [filters])

    const handleSearch = useCallback((searchTerm: string) => {
        setFilters(prev => ({
            ...prev,
            search: searchTerm || undefined,
            page: 1
        }))
    }, [])

    const handlePageChange = useCallback((page: number) => {
        setFilters(prev => ({
            ...prev,
            page
        }))
    }, [])

    const handleRefresh = useCallback(() => {
        fetchUsers()
    }, [fetchUsers])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    return {
        users,
        loading,
        error,
        pagination,
        filters,
        fetchUsers,
        handleSearch,
        handlePageChange,
        handleRefresh,
        setFilters
    }
}
