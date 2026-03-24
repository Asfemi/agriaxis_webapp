import { Button, DataTable } from "@/components";
import { AddRoleSheet } from "@/components/roles/AddRoleSheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { generateRoles } from "@/data/role.data";
import type { Role } from "@/models/role.model";
import { createRoute, type AnyRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreVertical } from "lucide-react";
import { Activity, useMemo, useState } from "react";

function Roles() {
  const roleColumns: ColumnDef<Role>[] = [
    {
      accessorKey: "title",
      header: "Role",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "user_count",
      header: "No. of users",
    },
    {
      accessorKey: "created_by",
      header: "Created by",
    },
    {
      accessorKey: "date_created",
      header: "Date created",
    },
    {
      id: "actions",
      header: "Actions",
      cell: () => (
        <div className="">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVertical size={15} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Action</DropdownMenuLabel>
              <DropdownMenuItem>Edit role</DropdownMenuItem>
              <DropdownMenuItem>
                <span className="text-[#E61504CC]">Delete role</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];
  const columns = useMemo(() => roleColumns, []);
  const [data] = useState(() => generateRoles(5));
  const [showAddRoleForm, setShowAddRoleForm] = useState(false);

  return (
    <>
      <section className="rounded-[1.25rem] bg-white p-6 pb-9">
        <div>
          <header className="mb-6 flex items-center justify-between">
            <h1 className="font-neue text-lg font-semibold text-[#434449]">
              Roles & Permission
            </h1>
            <div>
              <Button onClick={() => setShowAddRoleForm(true)} variant="primary">Add new role</Button>
            </div>
          </header>
          <DataTable columns={columns} data={data} hideHeader={true} />
        </div>
      </section>
      <Activity mode={showAddRoleForm ? "visible" : "hidden"}>
        <AddRoleSheet onClose={() => setShowAddRoleForm(false)} />
      </Activity>
    </>
  );
}

export default (parentRoute: AnyRoute) =>
  createRoute({
    path: "roles",
    component: Roles,
    getParentRoute: () => parentRoute,
    staticData: {
      title: "Roles & Permissions",
    },
    head: () => ({
      meta: [
        { title: "Roles & Permissions" },
      ]
    })
  });
