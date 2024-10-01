"use client"

import { DateSchema, ReportDateSchema } from '@/app/schemas/schema'
import { toast } from '@/hooks/use-toast'
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
import FilterByDateRangeHook from '@/hooks/filterhook'
import { useAppContext } from '@/app/context/appcontext'
// import {data} from '@/app/helpers/index'


export default function DateEntry({classname}: {classname?: string}) {

    const form = useForm<DateSchema>({
        resolver: zodResolver(ReportDateSchema),
      })

      const {expenseData} = useAppContext()
      console.log(expenseData)

    //   const {filteredData, handleFilter} = FilterByDateRangeHook(data)
    //   console.log(filteredData)
    
      function onSubmit(data: DateSchema) {

        if (!data.first_date_entry || !data.second_date_entry) {
            toast({
                variant: 'destructive',
                title: "Date must be provided",
                description: "kindly provide the necessary informations"
            })
            return
        } else {
            // handleFilter(data.first_date_entry, data.second_date_entry)
        }
    
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
        <div className={classname}>
        <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex gap-4 flex-wrap">

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
                              "md:w-[240px] pl-3 text-left font-normal",
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

              <div className='flex gap-4'>
                  <Button type="submit" className="bg-gray-800">Query</Button>
                  <Button variant={'outline'}>Show All</Button>
              </div>

              </div>


              </form>
          </Form>
        </div>
    )
}