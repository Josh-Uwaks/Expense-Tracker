"use client"
import React from "react"
import { HandCoins } from 'lucide-react';
import { ReceiptText } from 'lucide-react';
import {} from 'react-icons'
import { Card } from "./_components/card";
import Chart from "./_components/barchart";
import Link from "next/link";
import RecentTransaction from "./_components/tabledata";
import {Separator} from '@/components/ui/separator'
import { useAppContext } from "@/app/context/appcontext";
import { formatCurrency } from "@/lib/utils";
import SignedUserClient from "@/hooks/signedUserClient";

function Dashboard(){

    const {getTotalExpense, expenseData} = useAppContext()
    const user = SignedUserClient()
 
    return (
        <>
            <div className="py-6 px-6 md:px-14 bg-[#FAFAFA] min-h-screen">
                <h1 className="text-2xl font-bold">Welcome!! <span className="">{user?.email}</span> 👋</h1>
                <p className="text-gray-500">All informations regarding your expense are highlighted in the various section in the dashboard</p>

           
                <div className="lg:grid-cols-2 lg:grid 2xl:grid-cols-3 gap-4 flex flex-col mt-5">
                    <Card title={'Expenses'} paragraph="45% more since this week" amount={formatCurrency(getTotalExpense())} icon={<HandCoins/>} />
                    <Card title={'Total Entries'} paragraph="45% more since this week" amount={expenseData.length} icon={<ReceiptText/>} />


                    <div className="row-start-2 col-span-2 border rounded-[8px] p-4 bg-white">
                        <Chart/>
                    </div>

                    <div className="2xl:col-start-3 2xl:col-end-4 2xl:row-span-2 row-start-3 col-span-2 rounded-[8px] border p-4 bg-white">
                        <div className="flex items-center justify-between text-gray-500 mb-3">
                            <h1>Transaction History</h1>
                            <Link href={'/dashboard/report'} className="text-gray-800">View All</Link>
                        </div>

                        <Separator className="mt-4"/>

                        <RecentTransaction/>


                    </div>

                </div>
            </div>
        </>
    )
}


export default Dashboard;