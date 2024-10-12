import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/index";
import { auth } from "@/app/helpers/auth";
import { checkRateLimit } from "@/lib/rateLimiter/rateLimiter";

// Define a type for the request parameters
type Params = {
  id: string;
};


type ExpenseInput = {
  amount?: number;
  description?: string;
  userId?: string;
  categoryName?: string;
  date?: string;  // Add 'date' field to the input type
};

// GET function to handle both user expenses and a single expense by ID
export async function GET(req: NextRequest, { params }: { params: Params }) {
  const { id } = params; // This can be either userId or expenseId
  // const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';

  // // Apply rate limiting
  // const isAllowed = await checkRateLimit(ip);
  // if (!isAllowed) {
  //   return NextResponse.json(
  //     { message: 'Rate limit exceeded. Please try again later.' },
  //     { status: 429 }
  //   );
  // }

  try {

    
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized: You must be logged in." }, { status: 401 });
    }


    if (id.startsWith("user_")) {
      // Fetch a single expense for a user by expenseId
      const expenseId = id.replace("user_", ""); // Extract expenseId from the param
      const singleExpense = await prisma.expense.findUnique({
        where: { id: expenseId },
        include: {
          category: { select: { name: true } },
        },
      });

      if (!singleExpense) {
        return NextResponse.json({ message: "Expense not found." }, { status: 404 });
      }

      const transformedExpense = {
        id: singleExpense.id,
        amount: singleExpense.amount,
        description: singleExpense.description,
        date: singleExpense.date,
        createdAt: singleExpense.createdAt,
        updatedAt: singleExpense.updatedAt,
        category: singleExpense.category.name, // Use category name
      };

      return NextResponse.json(
        { message: "Single expense fetched successfully", expense: transformedExpense },
        { status: 200 }
      );
      
    } else {
      // Fetch all expenses by userId
      const userId = id; // Treat `id` as `userId`
      const expenses = await prisma.expense.findMany({
        where: { userId },
        include: {
          category: { select: { name: true } },
        },
      });

      if (!expenses || expenses.length === 0) {
        return NextResponse.json({ message: "No expenses found for the user." }, { status: 404 });
      }

      // Transform the expense data to include category name instead of categoryId
      const transformedExpenses = expenses.map(expense => ({
        id: expense.id,
        amount: expense.amount,
        description: expense.description,
        date: expense.date,
        createdAt: expense.createdAt,
        updatedAt: expense.updatedAt,
        category: expense.category.name, // Use category name
      }));

      return NextResponse.json(
        { message: "User expenses fetched successfully", expenses: transformedExpenses },
        { status: 200 }
      );
    }
  } catch (error) {
    const err = error as Error;
    console.error("Error fetching expenses:", err.message);

    return NextResponse.json(
      { message: 'An error occurred while fetching data', error: err.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

  // PATCH function
  export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    // const ip = request.headers.get('x-forwarded-for') || request.ip || 'unknown';

    // // Apply rate limiting
    // const isAllowed = await checkRateLimit(ip);
    // if (!isAllowed) {
    //   return NextResponse.json(
    //     { message: 'Rate limit exceeded. Please try again later.' },
    //     { status: 429 }
    //   );
    // }
  
  
    try {
      const body = await request.json();
      const { amount, description, userId, categoryName, date }: ExpenseInput = body;

      const session = await auth();
      if (!session || !session.user?.id) {
        return NextResponse.json({ message: "Unauthorized: You must be logged in." }, { status: 401 });
      }

      if (userId !== session.user.id) {
        return NextResponse.json({ message: "Unauthorized: You can only update your record." }, { status: 403 });
      }
  
      const updateData: any = {};
  
      // Check if the user exists
      if (userId) {
        const userExist = await prisma.user.findUnique({ where: { id: userId } });
        if (!userExist) {
          return NextResponse.json({ message: "This User does not exist." }, { status: 400 });
        }
        updateData.userId = userId;
      }
  
      // Check if category exists by categoryName instead of categoryId
      if (categoryName) {
        // Assuming you have access to userId, replace 'userId' with the actual variable
        const userIdValue = userId ?? ''; // Provide a default value if userId is undefined
        const category = await prisma.category.findUnique({ where: { name_userId: { name: categoryName, userId: userIdValue } } });
        if (!category) {
          return NextResponse.json({ message: "Invalid category name." }, { status: 400 });
        }
        updateData.categoryId = category.id; // Use the category ID found by the name
      }
  
      // Update amount and description if provided
      if (amount !== undefined) updateData.amount = amount;
      if (description !== undefined) updateData.description = description;
  
      // Add date handling: check if the date is provided and if it's valid
      if (date) {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
          return NextResponse.json({ message: "Invalid date format." }, { status: 400 });
        }
        updateData.date = parsedDate;
      }
  
      // Update the expense
      const updatedExpense = await prisma.expense.update({
        where: { id },
        data: updateData,
      });
  
      return NextResponse.json(
        { message: "Expense updated successfully", updatedExpense },
        { status: 200 }
      );
    } catch (error) {
      const err = error as Error;
      console.error(err);
  
      return NextResponse.json(
        { message: "Something went wrong", error: { name: err.name, message: err.message } },
        { status: 500 }
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  export async function DELETE(request: NextRequest, { params }: { params: Params }) {
    const { id } = params;
  
    // const ip = request.headers.get('x-forwarded-for') || request.ip || 'unknown';

    // // Apply rate limiting
    // const isAllowed = await checkRateLimit(ip);
    // if (!isAllowed) {
    //   return NextResponse.json(
    //     { message: 'Rate limit exceeded. Please try again later.' },
    //     { status: 429 }
    //   );
    // }

    
    try {
      const session = await auth();
      if (!session || !session.user?.id) {
        return NextResponse.json({ message: "Unauthorized: You must be logged in." }, { status: 401 });
      }
  
      const expense = await prisma.expense.findUnique({ where: { id } });
  
      if (!expense) {
        return NextResponse.json({ message: "Expense not found." }, { status: 404 });
      }
  
      if (expense.userId !== session.user.id) {
        return NextResponse.json({ message: "Unauthorized: You can only delete your own expenses." }, { status: 403 });
      }
  
      const deletedExpense = await prisma.expense.delete({
        where: { id },
      });
  
      return NextResponse.json({ message: "Expense deleted successfully", deletedExpense }, { status: 200 });
    } catch (error) {
      const err = error as Error;
      console.error(err);
  
      return NextResponse.json(
        { message: "Something went wrong", error: { name: err.name, message: err.message } },
        { status: 500 }
      );
    } finally {
      await prisma.$disconnect();
    }
  }