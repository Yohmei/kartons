import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import RSpring from 'react-spring'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Spinner from '../../../components/Spinner'
import { IWallet, IWalletEntry } from '../../../context/reducers/fin_reducer'

type QueryParams = {
  year: string
}

interface FinDetailsProps {
  fin_state: IWallet[]
  transition: RSpring.TransitionFn<boolean, { opacity: number }>
}

const FinDetails = ({ fin_state, transition }: FinDetailsProps) => {
  const { year } = useParams<QueryParams>()
  const [months, set_months] = useState<{ id: string; term: number; content: IWalletEntry[] }[]>([])
  const months_list = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const data = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
  ]

  useEffect(() => {
    if (fin_state.length !== 0)
      set_months(
        fin_state.filter((wallet) => {
          return wallet.year === Number(year)
        })[0].months
      )
  }, [fin_state, year])

  return (
    <div className='content'>
      <Spinner transition={transition} />
      <div className='cont'>
        {months.map((month) => (
          <div key={month.id} className='fin-detail-month'>
            <h5>{months_list[month.term]}</h5>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart
                width={500}
                height={300}
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey='pv' stackId='a' fill='#8884d8' />
                <Bar dataKey='amt' stackId='a' fill='#82ca9d' />
                <Bar dataKey='uv' fill='#ffc658' />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FinDetails
