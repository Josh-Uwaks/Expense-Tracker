"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

import { Calendar } from "@/components/ui/calendar"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

import { Calendar as CalendarIcon } from "lucide-react" 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import React from "react"
  

const CreateExpense = () => {
    return (
        <>
        <Dialog>
            <DialogTrigger asChild>
                <div className="bg-slate-100 p-10 flex flex-col items-center rounded-md border-2 border-dashed">
                    <h1 className="text-2xl">+</h1>
                    <p className="">Create New Expense</p>
                </div>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Expense</DialogTitle>
                <DialogDescription>

                  This provide the necessary informations to create add to the expense data.


                  <div className="mt-3">
                    <div>
                        <Label htmlFor="amount">Amount</Label>
                        <Input type="number" id="amount" placeholder="e.g 5000" className="mt-1"/>
                    </div>

                    <div className="my-4">
                        <Label>Pick a date</Label><br/>
                        <DatePicker/>
                    </div>

                    <div className="">
                        <Label>Select Category</Label>
                        <SelectCategory/>
                    </div>

                    <div className="my-4">
                        <Label htmlFor="description">Description</Label>
                        <Textarea placeholder="Description here..." className="mt-1"/>
                    </div>


                    <div className="">
                        <Button className="w-full mb-2">Submit</Button>
                        <Button className="w-full" variant={'ghost'}>Clear</Button>
                    </div>

                
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
        </Dialog>
           
        </>
    )
}

export default CreateExpense




const DatePicker = () => {
     const [date, setDate] = React.useState<Date>()

     return (
        <Popover>
        <PopoverTrigger asChild>
            <Button
            variant={"outline"}
            className={cn(
                "w-full justify-start text-left font-normal mt-1",
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
            selected={date}
            onSelect={setDate}
            initialFocus
            />
        </PopoverContent>
        </Popover>
     )
}

const SelectCategory = () => {
    return (
        <Select>
            <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
            </SelectContent>
        </Select>
    )
}