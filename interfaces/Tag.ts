export interface Tag {
    id: number
    name: string
    group: string
    created_at?: string
    updated_at?: string
}

export interface CreateTagRequest {
    group: string
    names: string[]
}

export interface TagsListResponse {
    current_page: number
    data: Tag[]
    first_page_url: string
    from: number | null
    last_page: number
    last_page_url: string
    links: Array<{
        url: string | null
        label: string
        page: number | null
        active: boolean
    }>
    next_page_url: string | null
    path: string
    per_page: number
    prev_page_url: string | null
    to: number | null
    total: number
}
