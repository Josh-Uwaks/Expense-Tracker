"use client"

import React from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
  import { Button } from "@/components/ui/button"
  import { Calendar } from "@/components/ui/calendar"
  import { Calendar as CalendarIcon } from "lucide-react" 
  import { format } from "date-fns"
import { cn } from "@/lib/utils"


type DatePickerProps = {
    classname?: string;
    selectedDate?: Date;
    onDateChange?: (date: Date | undefined) => void;
  }


const DatePicker = ({classname, selectedDate, onDateChange}: DatePickerProps) => {
    const [date, setDate] = React.useState<Date | undefined>(selectedDate)

    const handleDateSelect = (newDate: Date | undefined) => {
        setDate(newDate);
        onDateChange?.(newDate); // Trigger onDateChange if passed from the parent
    }

    return (
        <Popover>
        <PopoverTrigger asChild>
            <Button
            variant={"outline"}
            className={cn(
                `${classname} justify-start text-left font-normal mt-1`,
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
            onSelect={handleDateSelect}
            disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
            initialFocus
            />
        </PopoverContent>
        </Popover>
    )
}

export default DatePicker