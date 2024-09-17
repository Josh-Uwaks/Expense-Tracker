"use client"

import { Payment } from "@/app/types";
import React, { useState } from "react";
import { toast } from "./use-toast";


export default function FilterByDateRangeHook(data: Payment[]) {

    const [filteredData, setFilteredData] = useState<Payment[]>([])

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

          // Debugging step: Log the start and end date and each item's date
          console.log("Filtering data between:", startDate, endDate);
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
            
            return itemDate >= startDate && itemDate <= endDate
        })

        setFilteredData(result)

        console.log(result)
    }


    return {
        filteredData,
        handleFilter
    }


}