import {NextRequest, NextResponse} from 'next/server'
import prisma from '@/prisma'


type CategoryInput = {
    name: string,
    userId: string
}

export async function POST(request: NextRequest) {
    try {
      const { name, userId }: CategoryInput = await request.json();
  
      // Validate required fields
      if (!name || !userId) {
        return NextResponse.json({ message: "Invalid Fields, kindly ensure field is not empty" }, { status: 400 });
      }

      const userExist = await prisma.user.findUnique({
        where: {
            id: userId
        }
      })

      if(!userExist) {
        return NextResponse.json({message: 'Invalid User ID'}, {status: 400})
      }
  
      // Create a new expense
      const newCategory = await prisma.category.create({
        data: {
          name,
          userId
        }
      });
  
      return NextResponse.json({ message: "Category created successfully", newCategory }, { status: 201 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: "An error occurred while creating the category." }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }

  }