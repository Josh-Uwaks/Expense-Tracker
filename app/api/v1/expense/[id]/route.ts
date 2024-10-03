import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/index";
import { auth } from "@/app/helpers/auth";
import { checkRateLimit } from "@/lib/rateLimiter/rateLimiter";

// Define a type for the request parameters
type Params = {
  id: string;
};

type ExpenseInput = {
    amount?: number;       // Assuming the amount is a number
    description?: string; // Optional field (if it can be missing)
    userId?: string;       // Assuming userId is a string
    categoryId?: string;   // Assuming categoryId is a string
  }


export async function GET(req: NextRequest, { params }: { params: { id: string } }) {

  const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
  // Apply rate limiting
  const isAllowed = await checkRateLimit(ip);
  if (!isAllowed) {
    return NextResponse.json(
      { message: 'Rate limit exceeded. Please try again later.' },
      { status: 429 }
    );
  }
  const { id } = params; // User ID to filter expenses

  try {
    // Fetch all expenses created by the specified user ID
    const expenses = await prisma.expense.findMany({
      where: {
        userId: id,
      },
      include: {
        category: {
          select: {
            name: true
          }
        }
      }
    });

    // Transform the expense data to include category name instead of categoryId
    const transformedExpenses = expenses.map(expense => ({
      id: expense.id,
      amount: expense.amount,
      description: expense.description,
      date: expense.date,
      createdAt: expense.createdAt,
      updatedAt: expense.updatedAt,
      categoryId: expense.category.name,  // Use category name
    }));

    // Return the fetched expenses with a success message
    return NextResponse.json(
      { message: `User Expense Data Has Been Fetched Successfully`, expenses:transformedExpenses },
      { status: 200 }
    );
  } catch (error) {
    // Handle errors gracefully
    const err = error as Error;
    console.error("Error fetching user expenses:", err.message); // Log the error message

    // Return the error message with a 500 status code
    return NextResponse.json(
      { message: 'An error occurred while fetching user expenses', error: err.message },
      { status: 500 }
    );
  } finally {
    // Ensure the Prisma client disconnects properly
    await prisma.$disconnect();
  }
}


  // PATCH function
  export async function PATCH(request: Request, { params }: { params: Params }) {
    const { id } = params;
  
    try {
      // Parse the request body to get the updated expense data
      const body = await request.json();
      const { amount, description, userId, categoryId }: ExpenseInput = body;
  
      // Create an object to hold the fields to update
      const updateData: any = {};
  
      // Check if the user exists in the database
      if (userId) {
        const userExist = await prisma.user.findUnique({ where: { id: userId } });
        if (!userExist) {
          return NextResponse.json({ message: "This User does not exist." }, { status: 400 });
        }
        updateData.userId = userId; // Include userId if it exists
      }
  
      // Check if categoryId exists in the database
      if (categoryId) {
        const categoryExists = await prisma.category.findUnique({ where: { id: categoryId } });
        if (!categoryExists) {
          return NextResponse.json({ message: "Invalid category ID." }, { status: 400 });
        }
        updateData.categoryId = categoryId; // Include categoryId if it exists
      }
  
      // Only include the fields that are provided in the request body
      if (amount !== undefined) updateData.amount = amount;
      if (description !== undefined) updateData.description = description;
  
      // Update the expense in the database
      const updatedExpense = await prisma.expense.update({
        where: { id: id },
        data: updateData,
      });
  
      // Return a success response with the updated expense
      return NextResponse.json(
        { message: "Expense updated successfully", updatedExpense },
        { status: 200 }
      );
    } catch (error) {
      const err = error as Error;
      console.error(err);
  
      // Return an error response
      return NextResponse.json(
        { message: "Something went wrong", err: { name: err.name, message: err.message } },
        { status: 500 }
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  

  export async function DELETE(request: Request, { params }: { params: Params }) {
    const { id } = params;
  
    try {
        const session = await auth()

        if(!session || session.user?.id) {
            return NextResponse.json({ message: "Unauthorized: You must be logged in." }, { status: 401 });
        }

      // Fetch the expense to verify the owner
      const expense = await prisma.expense.findUnique({
        where: { id: id },
        // select: { userId: true } // Only fetch the userId of the expense
      });
  
      if (!expense) {
        return NextResponse.json({ message: "Expense not found." }, { status: 404 });
      }

      if (expense.userId !== session?.user.id) {
        return NextResponse.json({ message: "Unauthorized: You can only delete your own expenses." }, { status: 403 });
      }
  
      // Delete the expense from the database
      const deletedExpense = await prisma.expense.delete({
        where: { id: id },
      });
  
      // Return a success response
      return NextResponse.json({ message: "Expense deleted successfully", deletedExpense }, { status: 200 });
    } catch (error) {
      const err = error as Error;
      console.error(err);
  
      // Return an error response
      return NextResponse.json(
        { message: "Something went wrong", err: { name: err.name, message: err.message } },
        { status: 500 }
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  