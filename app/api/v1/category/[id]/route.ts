import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/index";
import { checkRateLimit } from "@/lib/rateLimiter/rateLimiter";

// Define a type for the request parameters
type Params = {
  id: string;
};

// type ExpenseInput = {
//     amount: number;       // Assuming the amount is a number
//     description?: string; // Optional field (if it can be missing)
//     userId: string;       // Assuming userId is a string
//     categoryId: string;   // Assuming categoryId is a string
//   }


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
    const category = await prisma.category.findMany({
      where: {
        userId: id,
      }
    });

    // Return the fetched expenses with a success message
    return NextResponse.json(
      { message: 'User Category Data Has Been Fetched Successfully', category },
      { status: 200 }
    );
  } catch (error) {
    // Handle errors gracefully
    const err = error as Error;
    console.error("Error fetching user category:", err.message); // Log the error message

    // Return the error message with a 500 status code
    return NextResponse.json(
      { message: 'An error occurred while fetching user category', error: err.message },
      { status: 500 }
    );
  } finally {
    // Ensure the Prisma client disconnects properly
    await prisma.$disconnect();
  }
}

//   export async function PATCH(request: Request, { params }: { params: Params }) {
//     const { id } = params;
  
//     try {
//       // Parse the request body to get the updated expense data
//       const body = await request.json();
//       const { amount, description, userId, categoryId }: ExpenseInput = body;
  
//       // Update the expense in the database
//       const updatedExpense = await prisma..update({
//         where: { id: id },
//         data: {
//           amount,
//           description,
//           userId,
//           categoryId,
//         },
//       });
  
//       // Return a success response with the updated expense
//       return NextResponse.json(
//         { message: "Expense updated successfully", updatedExpense },
//         { status: 200 }
//       );
//     } catch (error) {
//       const err = error as Error;
//       console.log(err);
  
//       // Return an error response
//       return NextResponse.json(
//         { message: "Something went wrong", err: { name: err.name, message: err.message } },
//         { status: 500 }
//       );
//     } finally {
//       await prisma.$disconnect();
//     }
//   }

//   export async function DELETE(request: Request, { params }: { params: Params }) {
//     const { id } = params;
//     console.log(id)
  
//     try {
//       // Delete the expense from the database
//       const deletedExpense = await prisma.expense.delete({
//         where: { id: id },
//       });
  
//       // Return a success response
//       return NextResponse.json({ message: "Expense deleted successfully", deletedExpense }, { status: 200 });
//     } catch (error) {
//       const err = error as Error;
//       console.log(err);
  
//       // Return an error response
//       return NextResponse.json({ message: "Something went wrong", err: { name: err.name, message: err.message } }, { status: 500 });
//     } finally {
//       await prisma.$disconnect();
//     }
//   }
