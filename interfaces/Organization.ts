export interface Organization {
    id: number;
    name: string;
    website?: string;
    phone?: string;
    country: string;
    is_active: boolean;
    user_id: number;
    created_at: string;
    updated_at: string;
    members?: OrganizationMember[];
}

export interface OrganizationMember {
    id: number;
    name: string;
    email: string;
    role: string;
    designation?: string;
    created_at: string;
    updated_at: string;
}

export interface CreateOrganizationRequest {
    name: string;
    website?: string | null;
    phone?: string | null;
    country?: string | null;
    is_active: boolean;
}

export interface UpdateOrganizationRequest {
    name?: string;
    website?: string | null;
    phone?: string | null;
    country?: string | null;
    is_active?: boolean;
}

export interface OrganizationFilters {
    page?: number;
    per_page?: number;
    search?: string;
    is_active?: boolean;
}

export interface OrganizationsApiResponse {
    error: boolean;
    message: string;
    data: {
        data: Organization[];
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
        from: number;
        to: number;
        first_page_url: string;
        last_page_url: string;
        next_page_url: string | null;
        prev_page_url: string | null;
        path: string;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
}

export interface OrganizationApiResponse {
    error: boolean;
    message: string;
    data: Organization;
}
