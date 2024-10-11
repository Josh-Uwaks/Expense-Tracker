"use client"
import { sidebarMenu } from '@/components/data/data';
import Link from 'next/link';
import { DollarSign } from 'lucide-react';
import { usePathname } from 'next/navigation'; // for active link detection

export default function Sidebar(){
    const pathname = usePathname(); // Get current route

    return(
        <div className="text-gray-300"> 
            
            <div className='flex items-center px-6 my-8 text-white'>
                <DollarSign size={40} className='mr-3'/>
                <h1 className='tracking-widest font-bold text-3xl'>Trackify</h1>
            </div>

            <ul className="px-4">
                {sidebarMenu.map((item, index) => {
                    const isActive = pathname === item.link; // Active link check
                    return (
                        <li key={index} className={`p-3 my-2 rounded-md cursor-pointer flex items-center gap-2 transition-colors duration-300 
                            ${isActive ? "bg-blue-600 text-white" : "hover:bg-gray-800 hover:text-white"}`}>
                            <Link href={item.link} className='flex items-center gap-2 w-full'>
                                <item.icon size={20} className={isActive ? "text-white" : "text-gray-400"} />
                                {item.title}
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
