import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function LearnMore() {
  return (
    <>
      <Dialog>
        <DialogTrigger>
          <Button 
            variant={'outline'} 
            className="shadow-md p-6"
          >
            Learn More
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-xl p-6 bg-gray-50 rounded-lg shadow-lg">
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-bold text-gray-800 mb-4">About this Project</DialogTitle>
          </DialogHeader>

          <DialogDescription className="space-y-6">
            <p className="text-gray-700 leading-relaxed text-base">
              This expense tracker application was built to help users gain insights into their spending habits by tracking daily and monthly expenses. 
              The motivation behind the project is to allow users to have a clearer understanding of where their money goes each day and month, enabling them to make informed financial decisions.
            </p>

            <div className="border-t border-gray-300 my-4"></div>

            <div>
              <h3 className="font-semibold text-lg text-purple-600 mb-2">Reason for Development</h3>
              <p className="text-gray-600 leading-relaxed">
                I built this application to track my daily expenses and gain insights into my spending habits on both a daily and monthly basis. 
                It is designed to be fully functional, and you can explore it to get detailed reports of your personal expenses.
              </p>
            </div>

            <div className="border-t border-gray-300 my-4"></div>

            <div>
              <h3 className="font-semibold text-lg text-purple-600 mb-2">Technology Stack</h3>
              <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-2">
                <li>Framework: <strong>Next.js (14.2.7)</strong></li>
                <li>Frontend: <strong>React (18)</strong>, <strong>Tailwind CSS (3.4.1)</strong>, Radix UI components</li>
                <li>Backend: <strong>Prisma</strong>, <strong>NextAuth</strong> for authentication, Axios for API calls</li>
                <li>Database: <strong>Prisma Client (5.19.1)</strong></li>
                <li>Utilities: <strong>React Hook Form</strong>, <strong>Zod</strong> for validation, <strong>Framer Motion</strong> for animations</li>
                <li>Charting: <strong>Recharts</strong> for visualizing data</li>
                <li>Other Libraries: <strong>Bcryptjs</strong> for encryption, <strong>ioredis</strong> for caching, <strong>UUID</strong> for unique keys</li>
              </ul>
            </div>

            <div className="border-t border-gray-300 my-4"></div>

            <div>
              <h3 className="font-semibold text-lg text-purple-600 mb-2">How it Works</h3>
              <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-2">
                <li>Track expenses on a daily and monthly basis</li>
                <li>Generate reports to view insights into your spending patterns</li>
                <li>Secure login with NextAuth and encryption for user data</li>
                <li>Interactive charts and data visualization to make financial tracking easier</li>
              </ul>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
}
