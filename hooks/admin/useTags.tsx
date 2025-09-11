import { useState, useEffect, useRef, useCallback } from 'react'
import { tagsService, type GetTagsParams } from '@/service/admin/tags'
import type { Tag, CreateTagRequest } from '@/interfaces/Tag'
import { toast } from 'react-toastify'

export const useTags = (initialParams: GetTagsParams = {}) => {
    const [tags, setTags] = useState<Tag[]>([])
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    })
    const [loading, setLoading] = useState(false)
    const [isCreating, setIsCreating] = useState(false)

    const currentParamsRef = useRef<GetTagsParams>(initialParams)
    const loadingRef = useRef(false) // ✅ use ref to track loading

    const fetchTags = useCallback(async (fetchParams?: GetTagsParams) => {
        if (loadingRef.current) return // ✅ prevents overlaps without breaking deps

        setLoading(true)
        loadingRef.current = true
        try {
            const params = fetchParams || currentParamsRef.current
            const response = await tagsService.getTags({
                page: params.page || 1,
                per_page: params.per_page || 10,
                search: params.search
            })
            console.log("response", response)

            setTags(response.data)
            setPagination({
                page: response.current_page,
                limit: response.per_page,
                total: response.total,
                totalPages: response.last_page
            })

            currentParamsRef.current = params
        } catch (error: any) {
            console.error('Failed to fetch tags:', error)
            toast.error('Failed to fetch tags')
        } finally {
            setLoading(false)
            loadingRef.current = false
        }
    }, []) // ✅ no [loading] here

    // Fetch once on mount
    useEffect(() => {
        fetchTags()
    }, [fetchTags])

    const createTags = async (data: CreateTagRequest) => {
        setIsCreating(true)
        try {
            await tagsService.createTags(data)
            toast.success('Tags created successfully')
            fetchTags() // refresh list
        } catch (error: any) {
            console.error('Failed to create tags:', error)
            toast.error(error?.response?.data?.message || 'Failed to create tags')
            throw error
        } finally {
            setIsCreating(false)
        }
    }

    const handlePageChange = (page: number) => {
        const newParams = { ...currentParamsRef.current, page }
        fetchTags(newParams)
    }

    const handleSearch = (search: string) => {
        const newParams = { ...currentParamsRef.current, search, page: 1 }
        fetchTags(newParams)
    }

    return {
        tags,
        fetchTags,
        pagination,
        loading,
        createTags,
        isCreating,
        handlePageChange,
        handleSearch,
        refetch: () => fetchTags(currentParamsRef.current)
    }
}