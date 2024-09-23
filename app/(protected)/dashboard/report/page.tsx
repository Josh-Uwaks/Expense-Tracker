"use client"
import React from 'react'
import { DataTableDemo } from './_components/reportTable'
import {data} from '@/app/helpers/index'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import FilterByDateRangeHook from '@/hooks/filterhook'

import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { DateSchema, ReportDateSchema } from "@/app/schemas/schema"
import {Download} from 'lucide-react'
import { Payment } from "@/app/types"





interface CalenderFormProp {
  data: Payment[]
}


const page = ({data}: CalenderFormProp) => {


  console.log('data from ts file', data)

  const {handleFilter, filteredData} = FilterByDateRangeHook(data)

  console.log({
      "filtered data is": filteredData
  })
  

  const form = useForm<DateSchema>({
      resolver: zodResolver(ReportDateSchema),
  })

  function onSubmit(data: DateSchema) {

      if (!data.first_date_entry || !data.second_date_entry) {
          toast({
              variant: 'destructive',
              title: "Date must be provided",
              description: "kindly provide the necessary informations"
          })
          return
      }

      handleFilter(data.first_date_entry, data.second_date_entry)

      toast({
      title: "You submitted the following values:",
      description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
      ),
      })
  }

 
  return (
    <>
      <div className='min-h-screen'>
        <div className='mb-3 py-6 px-14 flex'>
            <Link href={'/dashboard'}>Dashboard</Link> 
            <ChevronRight size={20}/>
            <h1 className='font-bold'>Report</h1>
        </div>


        <div className="space-y-10 py-6 px-14 bg-[#FAFAFA]">
        <div className="flex justify-between items-center w-full">

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex gap-4">
            <FormField
            control={form.control}
            name="first_date_entry"
            render={({ field }) => (
                <FormItem className="flex flex-col">

                <Popover>
                    <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                        )}
                        >
                        {field.value ? (
                            format(field.value, "PPP")
                        ) : (
                            <span>Start Date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>

                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="second_date_entry"
            render={({ field }) => (
                <FormItem className="flex flex-col">

                <Popover>
                    <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                        )}
                        >
                        {field.value ? (
                            format(field.value, "PPP")
                        ) : (
                            <span>End Date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>

                <FormMessage />
                </FormItem>
            )}
            />

            <Button type="submit" className="bg-gray-800">Query</Button>
            <Button variant={'outline'}>Show All</Button>

            </div>


            </form>
        </Form>

        <Download/>
        </div>
          <DataTableDemo/>
        </div>
      </div>
    </>
  )
}

export default page