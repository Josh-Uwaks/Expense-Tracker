"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, CalendarIcon, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Expense } from "@/app/types"
import { format } from 'date-fns'
import { useAppContext } from "@/app/context/appcontext"

const columns: ColumnDef<Expense>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <Button
        variant={'ghost'}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-gray-200 rounded-md"
      >
        Category
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("category")}</div>
    )
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div>{row.getValue("description")}</div>
    )
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <div>{format(new Date(row.getValue("date")), 'dd MMMM yyyy')}</div>
    )
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right font-semibold">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const { userId, handleUpdate, handleDelete, setExpenseId, expenseId, deleting, saving } = useAppContext()
      const expense = row.original

      const [date, setDate] = React.useState<Date | undefined>(new Date(expense.date))
      const [category, setCategory] = React.useState(expense.category)
      const [amount, setAmount] = React.useState(expense.amount)
      const [description, setDescription] = React.useState(expense.description)
      const [dialogOpen, setDialogOpen] = React.useState(false)

      const Update = () => {
        if(expenseId) {
          handleUpdate(amount, description || '', userId || '', category, date ? date.toString() : '')
          setDialogOpen(false)
        }
      }

      return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0"
              onClick={() => 
              {
                setExpenseId(row.original.id)
                setDialogOpen(true)
              }
              }>
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Actions</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <div className="mt-3">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    type="text"
                    id="category"
                    disabled
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="mt-3">
                  <Label htmlFor="date">Date</Label> <br />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full mt-1 justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date || undefined}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="my-3">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 resize-none"
                  />
                </div>
              </div>
            </DialogDescription>
            <Separator className="my-4" />
            <div className="flex justify-between text-[14px]">
              <Button
                variant={'ghost'}
                className="bg-[#FBF5F5] text-red-700 flex gap-1 hover:bg-[#fbf5f5] hover:text-red-900"
                onClick={handleDelete}
              >
                <Trash2 />{deleting ? 'Deleting...' : 'Delete Expense'}
              </Button>
              <div className="flex gap-3">
                <Button variant={'outline'} onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={Update} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )
    },
  },
]

interface DataTableProp {
  data: Expense[]
}
export function DataTableDemo({ data }: DataTableProp) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="overflow-auto">
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-32 text-gray-500">
          <p>No expenses available.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={cn("flex items-center h-full text-left", {
                          "opacity-60": header.isPlaceholder,
                        })}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
  
}
