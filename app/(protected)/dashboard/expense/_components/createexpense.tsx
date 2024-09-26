
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
import React, { useState } from "react"
import { Plus } from 'lucide-react';
import {Separator} from '@/components/ui/separator'
import { useAppContext } from "@/app/context/appcontext"



const CreateExpense = async () => {


    return (
        <>
        <Dialog>
            <DialogTrigger asChild>
                <Button className="flex items-center">
                    <Plus size={20}/>
                    <span className='hidden md:block'>New Expense</span>
              </Button>
            </DialogTrigger>

            <DialogContent className="min-w-[70%]">
              <DialogHeader>
                <DialogTitle>Create New Expense</DialogTitle>
                <DialogDescription>
                  This provide the necessary informations to create add to the expense data.

                  <Separator className="mt-4 mb-8"/>

                  <div className="mt-3 lg:grid grid-cols-2 gap-5">

                    <div>
                        <div className="flex flex-col md:flex-row md:items-center">
                            <Label htmlFor="amount" className="lg:w-[100px] text-left">Amount*</Label>
                            <Input type="text" id="amount" placeholder="e.g 5000" className="mt-1 md:mt-0 lg:w-[500px]"/>
                        </div>
                        <div className="my-4 flex flex-col md:flex-row md:items-center">
                            <Label className="lg:w-[100px] text-left">Date*</Label>
                            <DatePicker classname="w-full lg:w-[500px] mt-1 md:mt-0"/>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center">
                            <Label className="lg:w-[100px] text-left">Category*</Label>
                            <SelectCategory classname='w-full lg:w-[500px] mt-1 md:mt-0'/>
                        </div>
                        <div className="my-4 flex flex-col md:flex-row md:items-center">
                            <Label htmlFor="description" className="lg:w-[100px] text-left">Description*</Label>
                            <Textarea placeholder="Description here..." className="mt-1 md:mt-0 resize-none w-full lg:w-[500px] h-[200px]"/>
                        </div>
                    </div>
                    

                    <div>
                        {/* <div className="flex flex-col gap-2 md:flex-row md:items-center">
                            <Label className="lg:w-[100px]">Categories</Label>
                            <Input className="mt-1 md:mt-0 lg:w-[500px]" value={addCat} onChange={(e) => setAddCat(e.target.value)} name="addCat"/>
                            <Button onClick={AddCategory}>Add</Button>
                        </div> */}
                    </div>
                  </div>

                  <div className="mt-3">
                   

                    

                    

                    


                    <div className="flex gap-4 justify-end">
                        <Button className="mb-2">Save</Button>
                        <Button className="" variant={'ghost'}>Clear</Button>
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




const DatePicker = ({classname}: {classname?: string}) => {
     const [date, setDate] = React.useState<Date>()

     return (
        <Popover>
        <PopoverTrigger asChild>
            <Button
            variant={"outline"}
            className={cn(
                ` ${classname} justify-start text-left font-normal mt-1",
                !date && "text-muted-foreground`
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

const SelectCategory = ({classname}: {classname: string}) => {
    return (
        <Select>
            <SelectTrigger className={`${classname} mt-1`}>
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