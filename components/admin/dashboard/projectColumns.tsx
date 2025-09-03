"use client"
export const createColumns = () => [
    {
        accessorKey: "date",
        header: "Project Date",
    },
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "status",
        header: "Status",

    },
    {
        accessorKey: "actions",
        header: ""
    },
]

export const columns = createColumns()
