import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

export default function Navbar(){
    return(
        <>
        <div className=" shadow-sm border-b flex justify-between items-center py-4 px-5">   
            <div className='flex items-center gap-2 font-bold'>
             
            </div>

            <Menu>
                <MenuButton className="rounded-full py-3 px-5 bg-gray-800 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-700 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
                J
                </MenuButton>

                <MenuItems
                transition
                anchor="bottom end"
                className="bg-white w-52 origin-top-right rounded-xl border  p-1 text-sm/6 transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95"
                >
                <MenuItem>
                    <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">

                    Edit
                    <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">⌘E</kbd>
                    </button>
                </MenuItem>
                <MenuItem>
                    <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">

                    Duplicate
                    <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">⌘D</kbd>
                    </button>
                </MenuItem>
                <div className="my-1 h-px bg-white/5" />
                
                </MenuItems>
            </Menu>
        </div>
        </>
    )
}