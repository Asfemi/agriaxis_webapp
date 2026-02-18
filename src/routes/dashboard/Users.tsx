import { useGetUsers } from "@/api/users";
import { Button, DataTable } from "@/components";
import StatusBadge from "@/components/StatusBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddNewUserSheet } from "@/components/users/AddNewUserSheet";
import type { UserSummary } from "@/models/user.model";
import { createRoute, type AnyRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreVertical } from "lucide-react";
import { Activity, useMemo, useState } from "react";

function Users() {
  const { data: users } = useGetUsers();
  const userColumns: ColumnDef<UserSummary>[] = [
    {
      accessorKey: "id",
      header: "User ID",
    },
    {
      id: "name",
      header: "User name",
      cell: ({ row }) => <div className="capitalize">{row.original.username}</div>
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      id: "role",
      header: "Role",
      cell: ({ row }) => <div className="capitalize">{row.original.role}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge
          status={row.original.status}
          variant={row.original.status === "healthy" ? "success" : "warning"}
        />
      ),
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
              <DropdownMenuItem>Edit user</DropdownMenuItem>
              <DropdownMenuItem>
                <span className="text-[#E61504CC]">Delete user</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];
  const columns = useMemo(() => userColumns, []);
  const [showAddUserForm, setShowAddUserForm] = useState(false);

  return (
    <>
      <section className="rounded-[1.25rem] bg-white p-6 pb-9">
        <div>
          <header className="mb-6 flex items-center justify-between">
            <h1 className="font-neue text-lg font-semibold text-[#434449]">
              Overview
            </h1>
            <div>
              <Button
                variant="primary"
                onClick={() => setShowAddUserForm(true)}
              >
                Add new user
              </Button>
            </div>
          </header>
          <DataTable columns={columns} data={users} hideHeader={true} />
        </div>
      </section>
      <Activity mode={showAddUserForm ? "visible" : "hidden"}>
        <AddNewUserSheet onClose={() => setShowAddUserForm(false)} />
      </Activity>
    </>
  );
}

export default (parentRoute: AnyRoute) =>
  createRoute({
    path: "users",
    component: Users,
    getParentRoute: () => parentRoute,
    staticData: {
      title: "User Management",
    },
  });
