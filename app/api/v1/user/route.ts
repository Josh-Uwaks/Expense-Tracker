import { connectDB } from "@/app/helpers/servers-helpers";
import { NextResponse } from "next/server";
import prisma from "@/prisma";
import bcrypt from 'bcryptjs'


export async function POST(req: Request) {
    try {
        if (req.method !== 'POST') {
            return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
        }

        const {email, password} = await req.json()

        if (!email || !password) {
            return NextResponse.json({ message: "Invalid input kindly provide the necessary informations" }, { status: 422 });
        }

        const findUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (findUser) {
            return NextResponse.json({message: "user already exists"}, {status: 400})
        }

        await connectDB();

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword
            }
        })

        return NextResponse.json({message: "User Created Successfully", user}, {status: 201})

    } catch (error) {
         // Cast the error to Error type to access its properties
         const err = error as Error;
         console.error("Error creating user:", err);
         return NextResponse.json({ message: "Server error", error: { name: err.name, message: err.message } }, { status: 500 });
     } finally {
         await prisma.$disconnect();
     }
}