"use client"

import { ReactNode } from 'react'
import CountUp from 'react-countup'


type CardProp = {
    title: string,
    paragraph: string,
    amount: number | string,
    icon: ReactNode
}

export const Card = ( {title,paragraph, amount, icon}: CardProp ) => (
    <div className="p-6 border rounded-[8px] flex justify-between items-center bg-white">
        <div>
            <div>
                <h2>{title}</h2>
                <p>{paragraph}</p>
            </div>
            <p className="text-2xl font-bold mt-4">
            {
            typeof amount === "number" ? (
                <CountUp end={amount} duration={5} />
                ) : (
                amount // Display formatted currency string if amount is a string
                )
            }
            </p>
        </div>

        <div className='p-3 rounded-full bg-gray-800 text-white'>
            {icon}
        </div>
    </div>
)