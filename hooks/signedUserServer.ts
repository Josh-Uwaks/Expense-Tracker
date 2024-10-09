

import {auth, signOut} from "@/app/helpers/auth";
import { ExtendedUser } from "@/next-auth";


export async function signedUserServer() {
    const session = await auth()

    return session?.user as ExtendedUser | undefined; // Explicitly cast to ExtendedUser
}