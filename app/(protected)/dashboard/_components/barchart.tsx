"use client"

import React, { useEffect } from 'react'
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, PieChart, Pie } from 'recharts'
import { ArrowLeftRight } from 'lucide-react';
import { useAppContext } from '@/app/context/appcontext';
import { format, startOfWeek, endOfWeek, isSameWeek, getMonth } from 'date-fns';

export default function Chart() {
  const [changeChart, setChangeChart] = React.useState(false);
  const [dimension, setDimension] = React.useState({ width: 800, height: 300 });
  const [classificationType, setClassificationType] = React.useState<'week' | 'month'>('month');
  const { expenseData } = useAppContext();

  const onChange = () => {
    setChangeChart(prev => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setDimension({ width: 340, height: 300 });
      } else if (window.innerWidth <= 1024) {
        setDimension({ width: 350, height: 250 });
      } else if (window.innerWidth <= 1200) {
        setDimension({ width: 450, height: 300 });
      } else if (window.innerWidth <= 1450) {
        setDimension({ width: 500, height: 300 });
      } else {
        setDimension({ width: 800, height: 300 });
      }
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to classify by weeks (Monday to Friday)
  const classifyByWeek = (data: typeof expenseData) => {
    return data.reduce((acc, expense) => {
      const date = new Date(expense.date);
      const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday
      const end = endOfWeek(start, { weekStartsOn: 5 }); // Friday
      const weekLabel = `${format(start, 'MMM d')} - ${format(end, 'MMM d')}`;
      
      const existingWeek = acc.find(item => item.name === weekLabel);
      if (existingWeek) {
        existingWeek.amount += expense.amount;
      } else {
        acc.push({ name: weekLabel, amount: expense.amount });
      }

      return acc;
    }, [] as { name: string, amount: number }[]);
  };

  // Function to classify by months (January to December)
  const classifyByMonth = (data: typeof expenseData) => {
    return data.reduce((acc, expense) => {
      const month = format(new Date(expense.date), 'MMMM'); // Full month name
      const existingMonth = acc.find(item => item.name === month);

      if (existingMonth) {
        existingMonth.amount += expense.amount;
      } else {
        acc.push({ name: month, amount: expense.amount });
      }

      return acc;
    }, [] as { name: string, amount: number }[]);
  };

  // Transform data based on classification type (week or month)
  const chartData = classificationType === 'week' ? classifyByWeek(expenseData) : classifyByMonth(expenseData);

  return (
    <>
      <div className='my-3'>
        <button onClick={onChange} className='flex gap-2 text-[12px] items-center'>
          <ArrowLeftRight size={15} /> Toggle Pie Chart
        </button>

        <div className='flex gap-4 mt-2'>
          <button onClick={() => setClassificationType('week')} className='text-[12px]'>
            Classify by Week (Mon - Fri)
          </button>
          <button onClick={() => setClassificationType('month')} className='text-[12px]'>
            Classify by Month (Jan - Dec)
          </button>
        </div>
      </div>

      {changeChart ? (
        <PieChart width={dimension.width} height={dimension.height}>
          <Pie data={chartData} dataKey="amount" nameKey="name" cx="50%" cy="50%" outerRadius={50} fill="#8884d8" />
          <Pie data={chartData} dataKey="amount" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#82ca9d" label />
        </PieChart>
      ) : (
        <BarChart width={dimension.width} height={dimension.height} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="amount" fill="#8884d8" />
        </BarChart>
      )}
    </>
  );
}
