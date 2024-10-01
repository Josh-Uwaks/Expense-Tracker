import { UserRoles } from "@prisma/client";
import NextAuth, {type DefaultSession} from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
    role: UserRoles
}

declare module "next-auth" {
    interface Session {
        user: ExtendedUser
    }
} 