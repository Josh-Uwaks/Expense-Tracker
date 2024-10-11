import { signOut } from '@/app/helpers/auth'
import { Button } from '@/components/ui/button'
import { signedUserServer } from '@/hooks/signedUserServer'
import ToggleNav from './Toggle'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from '@/components/ui/dropdown-menu'

export default async function Navbar() {
    const user = await signedUserServer()

    return (
        <div className="bg-white shadow-md border-b border-gray-200 flex justify-between items-center py-4 px-5 transition-all duration-300 ease-in-out">
            <ToggleNav />

            <div className="flex items-center space-x-4">
                {/* Additional functional buttons or elements can go here if needed */}
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar>
                        <AvatarImage src={user?.image || ""} alt='' />
                        <AvatarFallback className='uppercase'>{user?.email.charAt(0)}</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-48 bg-white border border-gray-300 rounded-md shadow-lg">
                    <form action={async () => {
                        "use server"
                        await signOut()
                    }}>
                        <Button className='w-full text-left' variant='ghost'>
                            <DropdownMenuItem className="hover:bg-gray-100 transition-colors duration-200">Sign Out</DropdownMenuItem>
                        </Button>
                    </form>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
