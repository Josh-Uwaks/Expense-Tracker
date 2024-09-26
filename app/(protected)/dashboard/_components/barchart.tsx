"use client"

import React, { useEffect } from 'react'
import {BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, PieChart, Pie} from 'recharts'
import { ArrowLeftRight } from 'lucide-react';

const data = [
    {
      "name": "Page A",
      "uv": 4000,
      "pv": 2400
    },
    {
      "name": "Page B",
      "uv": 3000,
      "pv": 1398
    },
    {
      "name": "Page C",
      "uv": 2000,
      "pv": 9800
    },
    {
      "name": "Page D",
      "uv": 2780,
      "pv": 3908
    },
    {
      "name": "Page E",
      "uv": 1890,
      "pv": 4800
    },
    {
      "name": "Page F",
      "uv": 2390,
      "pv": 3800
    },
    {
      "name": "Page G",
      "uv": 3490,
      "pv": 4300
    }
  ]
  

  const data01 = [
    {
      "name": "Group A",
      "value": 400
    },
    {
      "name": "Group B",
      "value": 300
    },
    {
      "name": "Group C",
      "value": 300
    },
    {
      "name": "Group D",
      "value": 200
    },
    {
      "name": "Group E",
      "value": 278
    },
    {
      "name": "Group F",
      "value": 189
    }
  ];
  const data02 = [
    {
      "name": "Group A",
      "value": 2400
    },
    {
      "name": "Group B",
      "value": 4567
    },
    {
      "name": "Group C",
      "value": 1398
    },
    {
      "name": "Group D",
      "value": 9800
    },
    {
      "name": "Group E",
      "value": 3908
    },
    {
      "name": "Group F",
      "value": 4800
    }
  ];


export default function Chart(){

    const [changeChart, setChangeChart] = React.useState(false)
    const [dimension, setDimension] = React.useState({ width: 800, height: 300 });

    const onChange = () => {
        setChangeChart(prev => !prev)
    }

    console.log({
      changeChart,
      dimension
    })

    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth <= 768) {
          setDimension({ width: 340, height: 300 });
        } else if (window.innerWidth <= 1024) {
          setDimension({ width: 350, height: 250 });
        } else if (window.innerWidth <= 1200) {
          setDimension({ width: 450, height: 300 });
        } else if (window.innerWidth <= 1450) {
          setDimension({width: 500, height: 300})
        } else {
          setDimension({width: 800, height: 300})
        }
      }

      window.addEventListener('resize', handleResize)

      handleResize()

      return () => window.removeEventListener('resize', handleResize)
    }, [])

    return(
        <>
        <div className='my-3'>
            <button onClick={onChange} className='flex gap-2 text-[12px] items-center'> <ArrowLeftRight size={15}/>Pie Chart</button>
        </div>

        {
        changeChart ?   
        
        <PieChart width={dimension.width} height={dimension.height} >
            <Pie data={data01} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} fill="#8884d8" />
            <Pie data={data02} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#82ca9d" label />
        </PieChart>

        :

        <BarChart width={dimension.width} height={dimension.height} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="pv" fill="#8884d8" />
            <Bar dataKey="uv" fill="#82ca9d" />
        </BarChart>

    }

        </>
    )
}