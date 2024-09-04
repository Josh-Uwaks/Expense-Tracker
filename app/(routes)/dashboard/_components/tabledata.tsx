import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"



const receipt = [
    {
      category: "food",
      amount: "$250.00",
      date: "2024 June 25",
    },
    {
        category: "food",
        amount: "$250.00",
        date: "2024 June 25",
      },
      {
        category: "food",
        amount: "$250.00",
        date: "2024 June 25",
      },
      {
        category: "food",
        amount: "$250.00",
        date: "2024 June 25",
      },

  ]

export default function RecentTransaction() {
    return(
        <>
        <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader> 
                <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody className="">
                {receipt.map((item) => (
                <TableRow key={item.category} className="">
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.amount}</TableCell>
                    <TableCell>{item.date}</TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table>
        </>
    )
}