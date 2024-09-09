import prisma from "@/prisma/index";

export const connectDB = async () => {
    try {
        await prisma.$connect();
    } catch (error) {
        console.log("Database connection error:", error);
        throw new Error("Unable to connect to the database");
    }
}