"use client"

import { Expense } from "@/app/types";
import React, { useState } from "react";
import { toast } from "./use-toast";


export default function FilterByDateRangeHook(data: Expense[]) {

    const [filteredData, setFilteredData] = useState<Expense[]>([])

    // Normalize the date to remove time part for accurate comparison
    const normalizeDate = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

    const handleFilter = (startDate: Date, endDate:Date) => {

        console.log("start date", startDate)
        console.log("end date", endDate)

        if (startDate > endDate) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Start Date Cannot be greater than End Date"
            })
            return
        }

        const normalizedStartDate = normalizeDate(startDate)
        const normalizedEndDate = normalizeDate(endDate)
          // Debugging step: Log the start and end date and each item's date
          console.log("Filtering data between:", normalizedStartDate, normalizedEndDate);
          data.forEach(item => {
              const itemDate = new Date(item.date);
              console.log(`Item ID: ${item.id}, Original Date: ${item.date}, Parsed Date: ${itemDate}`);
          });
  

        const result = data.filter((item) => {
            const itemDate = new Date(item.date)
             // If itemDate is invalid, skip it
             if (isNaN(itemDate.getTime())) {
                console.warn(`Invalid date for item ID ${item.id}: ${item.date}`);
                return false;
            }
             // Normalize the item date for comparison
             const normalizedItemDate = normalizeDate(itemDate);
             // Filter dates that fall within the range
            return normalizedItemDate >= normalizedStartDate && normalizedItemDate <= normalizedEndDate;
            
            // return itemDate >= startDate && itemDate <= endDate
        })

        setFilteredData(result)

        console.log({
            "result and filtered data is": result
        })
    }


    return {
        filteredData,
        handleFilter
    }


}