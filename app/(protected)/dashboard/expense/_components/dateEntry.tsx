"use client"

import { DateSchema, ReportDateSchema } from '@/app/schemas/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
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
import { format } from "date-fns"
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"


type DateEntryProp = {
    classname?: string,
    onSubmit: (data: DateSchema) => void
}


export default function DateEntry({classname, onSubmit}: DateEntryProp) {

    const form = useForm<DateSchema>({
        resolver: zodResolver(ReportDateSchema),
      })


    return (
        <div className={classname}>
        <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="md:flex gap-4">

            <div className='grid grid-cols-2 md:flex gap-2'>

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
                              "md:w-[240px] pl-3 text-left font-normal",
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
                              "md:w-[240px] text-left font-normal",
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

              </div>

              <div className='grid grid-cols-2 md:flex gap-4 mt-3 md:mt-0'>
                  <Button type="submit" className="bg-gray-800">Query</Button>
                  <Button variant={'outline'}>Show All</Button>
              </div>

              </div>


              </form>
          </Form>
        </div>
    )
}