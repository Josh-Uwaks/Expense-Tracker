import { LayoutPanelLeft } from 'lucide-react';
import { CircleDollarSign } from 'lucide-react';
import { NotebookPen } from 'lucide-react';
import { Settings } from 'lucide-react';
import Link from 'next/link';
import { DollarSign } from 'lucide-react';


const sidebarMenu = [
    {
        id: 1,
        title: 'Dashboard',
        link: '/dashboard',
        icon: LayoutPanelLeft
    }, 
    {
        id: 2,
        title: 'Expense',
        link: '/dashboard/expense',
        icon: CircleDollarSign
    },
    {
        id: 3,
        title: 'Report',
        link: '/dashboard/report',
        icon: NotebookPen
    },
    {
        id: 4,
        title: 'Settings',
        link: '/dashboard/settings',
        icon: Settings
    }
]

export default function Sidebar(){
    return(
        <div className="">
            <div className='flex flex-col items-center justify-center my-6 text-blue-600'>
                {/* <DollarSign size={60} className='font-bold'/>
                <h1 className=' tracking-widest font-bold'>Trackify</h1> */}
            </div>


            <ul className="px-4 text-[#303030]">
                {sidebarMenu.map((item, index) => (
                    <li key={index} className="p-3 cursor-pointer hover:bg-gray-800 hover:text-white rounded-md"><Link href={item.link} className='flex items-center gap-2'><item.icon />{item.title}</Link></li>
                ))}
            </ul>
        </div>
    )
}