import React from "react"
import { HandCoins } from 'lucide-react';
import { ReceiptText } from 'lucide-react';
import {} from 'react-icons'
import { Card } from "./_components/card";
import Chart from "./_components/barchart";
import Link from "next/link";
import RecentTransaction from "./_components/tabledata";

function Dashboard(){
    return (
        <>
            <div className="p-6 bg-[#FAFAFA] min-h-screen">
                <h1 className="text-2xl font-bold">Welcome!! Joshua Uwakwe 👋</h1>
                <p className="text-gray-500">All informations regarding your expense are highlighted in the various section in the dashboard</p>

                <div className="grid lg:grid-cols-3 gap-4 mt-5">
                    <Card title={'Expenses'} paragraph="45% more since this week" amount={12} icon={<HandCoins/>} />
                    <Card title={'Total Entries'} paragraph="45% more since this week" amount={12} icon={<ReceiptText/>} />


                    <div className="row-start-2 col-span-2 border rounded-[8px] p-4 bg-white">
                        <Chart/>
                    </div>

                    <div className=" col-start-3 col-end-4 row-span-2 rounded-[8px] border p-4 bg-white">
                        <div className="flex items-center justify-between text-gray-500 mb-3">
                            <h1>Recent transaction</h1>
                            <Link href={'/dashboard/report'}>View All</Link>
                        </div>

                        <RecentTransaction/>
                    </div>

                </div>
            </div>
        </>
    )
}


export default Dashboard;