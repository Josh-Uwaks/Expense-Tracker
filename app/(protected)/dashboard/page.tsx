"use client";
import React from "react";
import { HandCoins, ReceiptText } from 'lucide-react'; // Combine imports for clarity
import { Card } from "./_components/card"; // Ensure your Card component supports custom colors
import Chart from "./_components/barchart";
import Link from "next/link";
import RecentTransaction from "./_components/tabledata";
import { Separator } from '@/components/ui/separator';
import { useAppContext } from "@/app/context/appcontext";
import { formatCurrency } from "@/lib/utils";
import SignedUserClient from "@/hooks/signedUserClient";

function Dashboard() {
    const { getTotalExpense, expenseData } = useAppContext();
    const { user } = SignedUserClient();

    return (
        <>
            <div className="py-6 px-6 md:px-14 bg-gray-100 min-h-screen"> 
                <h1 className="text-3xl font-bold text-gray-800">
                    Welcome, <span className="text-blue-600">{user?.email}</span> 👋
                </h1>
                <p className="text-gray-600 mt-2">
                    All information regarding your expenses is highlighted in various sections on the dashboard.
                </p>

                <div className="lg:grid lg:grid-cols-2 2xl:grid-cols-3 gap-6 mt-6"> 
                    {/* Card for Total Expenses */}
                    <Card 
                        title="Expenses" 
                        paragraph="45% more since this week" 
                        amount={formatCurrency(getTotalExpense())} 
                        icon={<HandCoins className="text-blue-500"/>} 
                        className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200"
                    />
                    {/* Card for Total Entries */}
                    <Card 
                        title="Total Entries" 
                        paragraph="45% more since this week" 
                        amount={expenseData.length} 
                        icon={<ReceiptText className="text-blue-500"/>} 
                        className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200"
                    />

                    {/* Chart Section */}
                    <div className="row-start-2 col-span-2 border rounded-lg p-6 bg-white shadow-lg">
                        <Chart />
                    </div>

                    {/* Recent Transactions Section */}
                    <div className="2xl:col-start-3 2xl:col-end-4 2xl:row-span-2 row-start-3 col-span-2 rounded-lg border p-6 bg-white shadow-lg">
                        <div className="flex items-center justify-between text-gray-600 mb-4">
                            <h1 className="text-lg font-semibold">Transaction History</h1>
                            <Link href={'/dashboard/expense'} className="text-blue-600 hover:underline">
                                View All
                            </Link>
                        </div>

                        <Separator className="mt-4" />

                        <RecentTransaction />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
