import { LayoutPanelLeft } from 'lucide-react';
import { CircleDollarSign } from 'lucide-react';
import { NotebookPen } from 'lucide-react';
import { Settings } from 'lucide-react';

export const sidebarMenu = [
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
    // {
    //     id: 3,
    //     title: 'Report',
    //     link: '/dashboard/report',
    //     icon: NotebookPen
    // },
    {
        id: 3,
        title: 'Settings',
        link: '/dashboard/settings',
        icon: Settings
    }
]
