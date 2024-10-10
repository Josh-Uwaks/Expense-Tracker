import { ExtendedUser } from "@/next-auth";
import { useSession } from "next-auth/react";

export default function SignedUserClient() {
    const { data: session, update } = useSession();

    const user = session?.user as ExtendedUser | undefined;

    return { user, update };
}