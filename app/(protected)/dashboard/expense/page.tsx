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
import * as XLSX from 'xlsx'


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
  }

   // Function to download the filtered data as an Excel file
   const downloadExcel = () => {
    if (filteredData.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No Data Available',
        description: 'There is no data to download. Please filter the data first.',
      });
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Filtered Data');

    // Generate and download the Excel file
    XLSX.writeFile(workbook, 'ExpenseData.xlsx');
  };

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
        <div className="flex flex-col gap-3 lg:grid grid-cols-3 w-full">
          <DateEntry classname="col-start-1 col-end-3" onSubmit={onSubmit} />

          <div className="flex-wrap col-start-3 col-end-4">
            <div className='flex justify-between items-center gap-3  md:justify-end'>
            <CreateExpense />
            <Download size={20} onClick={downloadExcel} className=' cursor-pointer'/>
            </div>
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
