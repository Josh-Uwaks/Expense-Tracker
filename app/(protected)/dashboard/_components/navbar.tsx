
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { signOut } from '@/app/helpers/auth'
import { Button } from '@/components/ui/button'
import { signedUserServer } from '@/hooks/signedUserServer'
import ToggleNav from './Toggle'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"

import {DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem} from '@/components/ui/dropdown-menu'
   

export default async function Navbar(){

    const user = await signedUserServer()

    return(
        <>
        <div className=" shadow-sm border-b flex justify-between items-center py-4 px-5"> 

            <ToggleNav/>


            {/* {JSON.stringify(user)} */}

        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage src={user?.image || ""} alt='' />
                    {/* <AvatarFallback className='uppercase'>{user?.email.charAt(0)}</AvatarFallback> */}
                </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
                <form action={async () => {
                    "use server"
                    await signOut()
                }}>
                    <Button className='w-full' variant={'ghost'}>
                    <DropdownMenuItem>Sign Out</DropdownMenuItem>
                </Button>
                </form>
                
            </DropdownMenuContent>

        </DropdownMenu>
            
            {/* <Menu>
                <MenuButton className="rounded-full h-[50px] w-[50px] bg-gray-800 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-700 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
                {session?.user.email.charAt(0)}
                </MenuButton>

                <MenuItems
                transition
                anchor="bottom end"
                className="bg-white w-52 origin-top-right rounded-xl border  p-1 text-sm/6 transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95"
                >

                
                <form action={async () => {
                    "use server"
                    await signOut()
                }}>
                    <Button className='w-full'>sign Out</Button>
                </form>
                
                </MenuItems>
            </Menu> */}
        </div>
        </>
    )
}