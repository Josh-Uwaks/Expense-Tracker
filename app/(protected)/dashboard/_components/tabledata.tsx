"use client"
import { useAppContext } from "@/app/context/appcontext"
import { formatCurrency } from "@/lib/utils"
import { PiBowlFoodLight } from "react-icons/pi";
import { Bus } from 'lucide-react';
import { CircleHelp } from 'lucide-react';
import { format } from 'date-fns'


export default function RecentTransaction() {
  const { expenseData } = useAppContext();

  console.log({
    "transaction history expense data": expenseData
  });

  return (
    <>
      <div className="flex flex-col gap-5 py-6">
        {expenseData.slice(0, 5).map((item, index) => (
          <div key={index} className="flex justify-between shadow-lg p-4 rounded-lg transition duration-200 hover:shadow-xl">

            <div className="flex items-center gap-3">
              <div className="h-[50px] w-[50px] rounded-full bg-gray-700 flex items-center justify-center text-blue-600">
                {item.category === "food" ? <PiBowlFoodLight size={20} /> : item.category === 'transport fare' ? <Bus size={20} /> : <CircleHelp size={20} />}
              </div>

              <div>
                <h1 className="text-lg capitalize">{item.category}</h1>
                <span className="text-[12px] text-neutral-medium-gray">{format(new Date(item.date), 'yyyy-MM-dd')}</span>
              </div>
            </div>

            <div className="lg:w-[100px]">
              <h1 className="text-lg">{formatCurrency(item.amount)}</h1>
              <h1 className="text-success-green text-[12px]">Completed</h1>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
