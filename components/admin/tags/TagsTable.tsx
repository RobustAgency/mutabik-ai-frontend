"use client";
import React, { useMemo } from "react";
import { DataTable } from "../../custom/DataTable";
import TableCard from "../../custom/TableCard";
import { ColumnDef } from "@tanstack/react-table";
import { useTags } from "@/hooks/admin/useTags";
import { Tag } from "@/service/admin/tags";

interface TableTag {
  group: string;
  name: string;
}

const columns: ColumnDef<TableTag>[] = [
  {
    accessorKey: "group",
    header: "Group",
    cell: ({ row }) => <span className="pl-4">{row.getValue("group")}</span>,
  },
  {
    accessorKey: "name",
    header: "Name(s)",
    cell: ({ row }) => <span>{row.getValue("name")}</span>,
  },
];

const TagsTable: React.FC = () => {
  const { tags, loading, error, setSearch } = useTags();

  const tableData: TableTag[] = useMemo(() => {
    if (!tags || !Array.isArray(tags)) return [];
    return tags.map((tag: Tag) => ({
      group: tag.group ?? "-",
      name: Array.isArray(tag.name) ? tag.name.join(", ") : tag.name ?? "-",
    }));
  }, [tags]);

//   if (loading) {
//     return (
//       <TableCard title="">
//         <div className="flex items-center justify-center p-8 text-[#737373]">
//           Loading tags...
//         </div>
//       </TableCard>
//     );
//   }

  if (error) {
    return (
      <TableCard title="Tags List">
        <div className="text-red-500">Error: {error}</div>
      </TableCard>
    );
  }

  return (
    <TableCard title="">
      <DataTable
        columns={columns}
        data={tableData}
        searchKey="name"
        searchPlaceholder="Search tags"
        serverSide={true}        // 👈 enable server-side search
        onSearch={setSearch}     // 👈 pass hook function
        loading={loading}
      />
    </TableCard>
  );
};

export default TagsTable;
