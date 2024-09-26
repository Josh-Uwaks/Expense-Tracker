import { sidebarMenu } from '@/components/data/data';
import Link from 'next/link';
import { DollarSign } from 'lucide-react';


export default function Sidebar(){
    return(
        <div className="">
            <div className='flex items-center px-4 my-8 text-gray-800'>
                <DollarSign size={40} className='font-extrabold'/>
                <h1 className=' tracking-widest font-bold text-2xl'>Trackify</h1>
            </div>


            <ul className="px-4 text-[#303030]">
                {sidebarMenu.map((item, index) => (
                    <li key={index} className="p-3 cursor-pointer hover:bg-gray-800 hover:text-white rounded-md"><Link href={item.link} className='flex items-center gap-2'><item.icon />{item.title}</Link></li>
                ))}
            </ul>
        </div>
    )
}