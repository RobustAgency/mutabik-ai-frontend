"use client"
export const createColumns = () => [
    {
        accessorKey: "date",
        header: "Project Date",
        cell: ({ }) => (
            <div className='pl-4 text-sm text-muted-foreground'>
                May 20, 2024
            </div>
        )
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
