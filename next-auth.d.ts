import { UserRoles } from "@prisma/client";
import NextAuth, {type DefaultSession} from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
    id: string;
    username: string;
    name: string;
    lastname: string;
    email: string;
    mobilenumber: string;
    image: string;
    role: UserRoles;
    isOAuth: boolean;
    isTwofactorEnabled: boolean;
    emailVerified: Date | null;
}

declare module "next-auth" {
    interface Session {
        user: ExtendedUser
    }
} 