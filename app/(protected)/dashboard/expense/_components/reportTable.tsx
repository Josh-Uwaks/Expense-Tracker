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
import { Expense, ExpenseUpdateInput } from "@/app/types"
import {format} from 'date-fns'
import { deleteExpense, updateExpense } from "@/lib/ApiRequests/requests"
import { useAppContext } from "@/app/context/appcontext"
import { toast } from "@/hooks/use-toast"


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
      header: ({column}) => {
          return (
              <Button
              variant={'ghost'}
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                  Category
                  <ArrowUpDown className="ml-2 h-4 w-4"/>
              </Button>
          )
      },
      cell: ({row}) => (
        <div className="capitalize">{row.getValue("category")}</div>
      )
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({row}) => (
          <div>{row.getValue("description")}</div>
      )
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({row}) => (
          <div>{format(new Date(row.getValue("date")), 'dd MMMM yyyy')}</div>
      )
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"))
  
        // Format the amount as a dollar amount
        const formatted = new Intl.NumberFormat("en-US", {
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
        const {userId} = useAppContext()
        const expense = row.original

      
        const [expenseId, setexpenseId] = React.useState<string | null>(null);
        const [date, setDate] = React.useState<Date | undefined>(new Date(expense.date)) // Initializing with the existing date
        const [category, setCategory] = React.useState(expense.category)
        const [amount, setAmount] = React.useState(expense.amount)
        const [description, setDescription] = React.useState(expense.description)
        const [saving, setSaving] = React.useState<boolean>(false)
        const [deleting, setDeleting] = React.useState<boolean>(false)

        // Function to handle expense update
        const handleUpdate = async () => {
          setSaving(true)
          try {
            if(expenseId) {
              const updateData: ExpenseUpdateInput = {
                amount, // Assuming you have this from your input
                description, // Assuming you have this from your input
                userId, // Assuming you have this available
                categoryId: category, // Assuming `category` is coming from a form input
                date: date ? date.toISOString() : new Date().toISOString() // Fallback to the current date
              };
          
             await updateExpense(expenseId, updateData);

             setSaving(false)
              // Show success toast
              toast({
                variant: 'default',
                title: 'SUCCESS',
                description: `Expense updated successfully - ID: ${expenseId}` // Adjust this as needed
              });
            }
        
          } catch (error: any) {
            console.log(error)
            setSaving(false)
            toast({
              variant: 'destructive',
              title: 'ERROR',
              description: `Failed to update expense: ${error.message || 'Unknown error'}`
            });
            console.error('Error in handleUpdate:', error);
          }
        };

        // Function to handle expense deletion
      const handleDelete = async () => {
        setDeleting(true);
        try {
          if (expenseId) {
            await deleteExpense(expenseId); // Call your delete function here

            toast({
              variant: 'default',
              title: 'SUCCESS',
              description: `Expense deleted successfully - ID: ${expenseId}`,
            });

            // Optionally refresh the data after deletion
          }
        } catch (error: any) {
          console.log(error);
          toast({
            variant: 'destructive',
            title: 'ERROR',
            description: `Failed to delete expense: ${error.message || 'Unknown error'}`,
          });
        } finally {
          setDeleting(false);
        }
      };
  
        return (
          <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0"     
            onClick={() => setexpenseId(row.original.id)} >
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
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="mt-3">
                  <Label htmlFor="date">Date</Label> <br/>
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
                        selected={date || undefined} // Ensure date is never null
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
                <Button variant={'outline'}>Cancel</Button>
                <Button onClick={handleUpdate} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
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
export function DataTableDemo({data}: DataTableProp) {

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [pageSize, setPageSize] = React.useState(5)

  console.log({
    "report data": data
  })

  // Apply filtering logic to the data
  const filteredData = React.useMemo(() => {
    return data.filter((expense) => {
      return columnFilters.every((filter) => {
        const column = filter.id as keyof Expense // Ensure the filter id is a valid column key
        const filterValue = (filter.value as string).toLowerCase() // Assert filter value as string
        const cellValue = expense[column]?.toString().toLowerCase() // Convert cell value to lowercase string
        return cellValue?.includes(filterValue) // Filter rows based on column value
      })
    })
  }, [data, columnFilters])


  const table = useReactTable({
    data: filteredData, // Pass filtered data here
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: { pagination: { pageSize: pageSize } }
  })


  return (
    <div className="w-full">


        <div className="flex justify-end">
              <div className="flex items-center justify-between py-4">
                <div>
                  <span>Rows per page: </span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value))
                      table.setPageSize(Number(e.target.value))
                    }}
                  >
                    <option value={5}>5</option>
                    <option value={8}>8</option>
                    <option value={10}>10</option>
                  </select>
                </div>
            </div>
          </div>

      <div className="rounded-md border bg-white"> 
        <Table>
          <TableHeader className="bg-gray-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-white">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-gray-500">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
