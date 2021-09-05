import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import RSpring from 'react-spring'
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import Spinner from '../../../components/Spinner'
import { IWallet, IWalletEntry } from '../../../context/reducers/fin_reducer'

type QueryParams = {
  year: string
}

interface FinDetailsProps {
  fin_state: IWallet[]
  transition: RSpring.TransitionFn<boolean, { opacity: number }>
}

const colors = ['#b47eb3', '#25d0b9', '#ef6f6c', '#efa9ae', '#ee6c4d']

const FinDetails = ({ fin_state, transition }: FinDetailsProps) => {
  const { year } = useParams<QueryParams>()
  const [months, set_months] = useState<{ id: string; term: number; content: IWalletEntry[] }[]>([])
  const [bars, set_bars] = useState<any[]>([])
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
      name: 'Income',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Expense',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Total',
      uv: 10000,
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

  useEffect(() => {
    const a = []

    for (let inst of data) {
      for (let entry of Object.entries(inst)) if (a.indexOf(entry[0]) === -1 && entry[0] !== 'name') a.push(entry[0])
    }

    set_bars(a)
    setTimeout(() => {
      console.log(bars)
    }, 1)
  }, [])

  return (
    <div className='content'>
      <Spinner transition={transition} />
      <div className='cont'>
        {months.map((month) => (
          <div key={month.id} className='fin-detail-month'>
            <h5>{months_list[month.term]}</h5>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis dataKey='name' />
                <Tooltip />
                <Legend />
                {bars.map((bar_name, i) => {
                  return <Bar key={i} dataKey={bar_name} stackId='a' fill={colors[i]} />
                })}
              </BarChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FinDetails
