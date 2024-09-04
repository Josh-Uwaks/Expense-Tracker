
import React from 'react'
import CreateExpense from './_components/createexpense'

const page = () => {
  return (
    <div className='p-6'>Expense Page

      <div className='grid grid-cols-3 mt-5'>
            <CreateExpense/>
      </div>
      
    </div>
  )
}

export default page