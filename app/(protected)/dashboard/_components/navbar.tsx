
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

            <div />

           

            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar>
                        <AvatarImage src={user?.image || ""} alt='' />
                        <AvatarFallback className='uppercase'>{user?.email.charAt(0)}</AvatarFallback>
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
        </div>
        </>
    )
}