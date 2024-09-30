

import {auth, signOut} from "@/app/helpers/auth";


export async function signedUserServer() {
    const session = await auth()

    return session?.user
}