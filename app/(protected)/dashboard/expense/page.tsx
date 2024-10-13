"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import DateEntry from './_components/dateEntry';
import CreateExpense from './_components/createxpense';
import { DataTableDemo } from './_components/reportTable';
import { useAppContext } from '@/app/context/appcontext';
import FilterByDateRangeHook from '@/hooks/filterhook';
import { toast } from '@/hooks/use-toast';
import { DateSchema } from '@/app/schemas/schema';
import { Download } from 'lucide-react';


const page = () => {
  const { expenseData } = useAppContext();
  const { filteredData, handleFilter } = FilterByDateRangeHook(expenseData);

  function onSubmit(data: DateSchema) {
    if (!data.first_date_entry || !data.second_date_entry) {
      toast({
        variant: 'destructive',
        title: 'Date must be provided',
        description: 'Kindly provide the necessary information.',
      });
      return;
    } else {
      handleFilter(data.first_date_entry, data.second_date_entry);
    }

    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mb-3 py-6 px-6 md:px-14 flex text-gray-700">
        <Link href={'/dashboard'} className="text-blue-600 hover:underline">
          Dashboard
        </Link>
        <ChevronRight size={20} className="text-gray-500" />
        <h1 className="font-bold text-gray-800">Expense</h1>
      </div>

      <div className="space-y-10 py-6 px-6 md:px-14">
        <div className="flex lg:grid grid-cols-3 w-full">
          <DateEntry classname="col-start-1 col-end-3" onSubmit={onSubmit} />

          <div className="flex items-center justify-end gap-3 flex-wrap col-start-3 col-end-4">
            <CreateExpense />
            <Download size={15} />
          </div>

        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <DataTableDemo data={filteredData} />
        </div>
      </div>
    </div>
  );
};

export default page;
