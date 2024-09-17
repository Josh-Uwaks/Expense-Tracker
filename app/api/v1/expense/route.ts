// import {NextRequest, NextResponse} from 'next/server'
// import prisma from '@/prisma'



// export async function POST(request: NextRequest) {
//     try {
//       const { amount, description, userId, categoryId } = await request.json();
  
//       // Validate required fields
//       if (!amount || !userId || !categoryId) {
//         return NextResponse.json({ message: "All fields are required." }, { status: 400 });
//       }
  
//       // Create a new expense
//       const newExpense = await prisma.expense.create({
//         data: {
//           amount,
//           description,
//           userId,
//           categoryId
//         }
//       });
  
//       return NextResponse.json({ message: "Expense created successfully", newExpense }, { status: 201 });
//     } catch (error) {
//       console.error(error);
//       return NextResponse.json({ message: "An error occurred while creating the expense." }, { status: 500 });
//     } finally {
//       await prisma.$disconnect();
//     }

//   }