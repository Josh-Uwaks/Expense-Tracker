import { LayoutPanelLeft } from 'lucide-react';
import { CircleDollarSign } from 'lucide-react';
import { NotebookPen } from 'lucide-react';
import { Settings } from 'lucide-react';

const sidebarMenu = [
    {
        id: 1,
        title: 'Dashboard',
        link: '',
        icon: LayoutPanelLeft
    }, 
    {
        id: 2,
        title: 'Expense',
        link: '',
        icon: CircleDollarSign
    },
    {
        id: 3,
        title: 'Report',
        link: '',
        icon: NotebookPen
    },
    {
        id: 4,
        title: 'Settings',
        link: '',
        icon: Settings
    }
]

export default function Sidebar(){
    return(
        <div className="">
            <div>
                Logo
            </div>


            <ul className="px-4 text-[#303030] mt-16">
                {sidebarMenu.map((item, index) => (
                    <li key={index} className="p-3 cursor-pointer hover:bg-[#4d4d4d] hover:text-white rounded-md flex items-center gap-2"><item.icon />{item.title}</li>
                ))}
            </ul>
        </div>
    )
}