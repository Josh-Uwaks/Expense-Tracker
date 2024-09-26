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
        {/* <Table>
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
        </Table> */}

        <div className="flex flex-col gap-5 py-6">
          {receipt.map((item, index) => (
            <div key={index} className="flex justify-between">
              <div className="flex items-center gap-3">
                <div className="h-[50px] w-[50px] rounded-full bg-gray-700">
                </div>
                <div>
                  <h1 className="text-lg capitalize">{item.category}</h1>
                  <span className="text-[12px] text-[#727272]">{item.date}</span>
                </div>
              </div>

              <div>
                  <h1 className="text-lg">{item.amount}</h1>
                  <h1 className="text-green-500 text-[12px]">Completed</h1>
                </div>
            </div>
          ))}
        </div>

        </>
    )
}