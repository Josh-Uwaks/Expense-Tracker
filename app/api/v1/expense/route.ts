import { NextResponse} from 'next/server'
import prisma from '@/prisma'
import { auth } from '@/app/helpers/auth';


type ExpenseInput = {
    amount: number;       // Assuming the amount is a number
    description?: string; // Optional field (if it can be missing)
    userId: string;       // Assuming userId is a string
    categoryId: string;   // Assuming categoryId is a string
    date: string
  }

export async function POST(request: Request) {
    try {
      const { amount, description, userId, categoryId, date }: ExpenseInput = await request.json();

      // const session = await auth()

      // if(!session || session.user?.id) {
      //     return NextResponse.json({ message: "Unauthorized: You must be logged in." }, { status: 401 });
      // }
  
      // Validate required fields
      if (!amount || !userId || !categoryId || !date) {
        return NextResponse.json({ message: "All fields are required." }, { status: 400 });
      }

    // Check if the user exists in the database
      const userExist = await prisma.user.findFirst({
        where: {
            id: userId
        }
    })

    if(!userExist) {
        return NextResponse.json({message: "This User does not exist."}, {status: 400})
    }

    // Check if categoryId exists in the database
       const categoryExists = await prisma.category.findUnique({
        where: { id: categoryId }
    });
    
    if (!categoryExists) {
        return NextResponse.json({ message: "Invalid category ID." }, { status: 400 });
    }
   
      // Create a new expense
      const newExpense = await prisma.expense.create({
        data: {
          amount,
          description,
          userId,
          categoryId,
          date
        }
      });
  
      return NextResponse.json({ message: "Expense created successfully", newExpense }, { status: 201 });

    } catch (error) {
        console.error("Error processing request:", error);
      if (error instanceof SyntaxError) {
        return NextResponse.json({ message: "Invalid JSON format." }, { status: 400 });
    }
    return NextResponse.json({ message: "An error occurred while processing the request." }, { status: 500 });

    } finally {
      await prisma.$disconnect();
    }

  }