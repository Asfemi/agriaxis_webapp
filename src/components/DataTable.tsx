import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

interface DataTableProps<T> {
  title?: string;
  data: Array<T>;
  columns: Array<ColumnDef<T>>;
  hideHeader?: boolean;
}

//TODO: Define proper filter fn
export function DataTable<T>({
  title = "Table",
  data,
  columns,
  hideHeader,
}: DataTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    filterFns: {
      fuzzy: (row, columnId, value) => {
        const cellValue: any = row.getValue(columnId);
        return cellValue.toLowerCase().includes(value.toLowerCase());
      },
    },
  });

  return (
    <section>
      {!hideHeader && (
        <header className="mb-4 flex items-center justify-between">
          <h1 className="font-neue text-lg font-semibold text-[#939397] sm:text-xl">
            {title}
          </h1>
          {/** 
             <div className="flex items-center gap-2 rounded-lg border border-[#E8E8E8] bg-[#F3F6F8] px-3 py-2.5">
             <ListFilter size={16} />
             <span className="text-[#130B30]">Filter</span>
             </div>
            */}
        </header>
      )}
      <Table>
        <TableHeader className="bg-[#F3F6F8]">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="py-5">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="text-[#0F172A]">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="py-5">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
