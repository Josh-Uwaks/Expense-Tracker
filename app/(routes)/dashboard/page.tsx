import React from "react"
import { HandCoins } from 'lucide-react';
import { ReceiptText } from 'lucide-react';
import { Card } from "./_components/card";

function Dashboard(){
    return (
        <>
            <div className="p-6">
                <h1 className="text-2xl font-bold">Welcome!! Joshua Uwakwe 👋</h1>
                <p className="text-gray-500">All informations regarding your expense are highlighted in the various section in the dashboard</p>

                <div className="grid lg:grid-cols-3 gap-4 mt-5">
                    <Card title={'Expenses'} paragraph="45% more since this week" amount={12} icon={<HandCoins/>} />
                    <Card title={'Total Entries'} paragraph="45% more since this week" amount={12} icon={<ReceiptText/>} />
                    <div className="row-start-2 row-span-3">start here</div>
                </div>
            </div>
        </>
    )
}


export default Dashboard;