"use client"

import React from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Ellipsis } from 'lucide-react';
import DateEntry from './_components/dateEntry'
import CreateExpense from './_components/createExpense'
import { DataTableDemo } from './_components/reportTable'
import { useAppContext } from '@/app/context/appcontext'
import FilterByDateRangeHook from '@/hooks/filterhook'
import { toast } from '@/hooks/use-toast'
import { DateSchema } from '@/app/schemas/schema'


const page = () => {

  const {expenseData} = useAppContext()
  const {filteredData, handleFilter} = FilterByDateRangeHook(expenseData)

  function onSubmit(data: DateSchema) {

    if (!data.first_date_entry || !data.second_date_entry) {
        toast({
            variant: 'destructive',
            title: "Date must be provided",
            description: "kindly provide the necessary informations"
        })
        return
    } else {
        handleFilter(data.first_date_entry, data.second_date_entry)
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
    <div className='min-h-screen'>
      
      <div className='mb-3 py-6 px-6 md:px-14 flex'>
          <Link href={'/dashboard'}>Dashboard</Link> 
          <ChevronRight size={20}/>
          <h1 className='font-bold'>Expense</h1>
      </div>

      <div className="space-y-10 py-6 px-6 md:px-14">
        <div className="flex lg:grid grid-cols-3 w-full">
          <DateEntry classname='col-start-1 col-end-3' onSubmit={onSubmit}/>

          <div className='flex justify-end gap-3 flex-wrap col-start-3 col-end-4'>
            <CreateExpense/>
            <Button variant={'ghost'} className='border w-full md:w-auto'><Ellipsis/></Button>
          </div>
        </div>

        <div>
          <DataTableDemo data={filteredData}/>
        </div>
      </div>
      
    </div>
  )
}

export default page