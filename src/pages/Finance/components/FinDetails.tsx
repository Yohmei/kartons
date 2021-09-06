import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import RSpring from 'react-spring'
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import Spinner from '../../../components/Spinner'
import { IWallet, IWalletEntry } from '../../../context/reducers/fin_reducer'
import { capitalise_first } from './../utils'

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
  const data = useMemo(
    () => [
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
    ],
    []
  )

  useEffect(() => {
    if (fin_state.length !== 0) {
      set_months(
        fin_state.filter((wallet) => {
          return wallet.year === Number(year)
        })[0].months
      )

      const a = []

      for (let inst of data) {
        for (let entry of Object.entries(inst)) if (a.indexOf(entry[0]) === -1 && entry[0] !== 'name') a.push(entry[0])
      }

      set_bars(a)
    }
  }, [fin_state, year, data])

  return (
    <div className='content'>
      <Spinner transition={transition} />
      <div className='cont'>
        {months.map((month) => {
          const data: any[] = []

          for (let item of month.content) {
            if (item.amount !== 0) {
              const obj: any = {}
              obj.name = capitalise_first(item.type)

              const i = data.map((obj) => obj.name).indexOf(obj.name)

              if (i !== -1) {
                data[i][item.category] = item.amount
              } else {
                obj[item.category] = item.amount
                data.push(obj)
              }
            }
          }

          let total = 0
          let total_expenses = 0
          let total_income = 0

          for (let inst of data) {
            if (inst.name === 'Expenses') {
              for (let entry of Object.entries(inst)) {
                if (entry[0] !== 'name') {
                  total = total - inst[entry[0]]
                  total_expenses = total_expenses + inst[entry[0]]
                }
              }
            } else if (inst.name === 'Income') {
              for (let entry of Object.entries(inst)) {
                if (entry[0] !== 'name') {
                  total = total + inst[entry[0]]
                  total_income = total_income + inst[entry[0]]
                }
              }
            }
          }

          for (let inst of data) {
            if (inst.name === 'Expenses') {
              inst.diff = total_income - total_expenses
            }
          }

          data.push({ name: 'Total', total })

          data.sort((a) => (a.name === 'Income' ? -1 : 1))

          const bars: any[] = []

          for (let inst of data) {
            for (let entry of Object.entries(inst))
              if (bars.indexOf(entry[0]) === -1 && entry[0] !== 'name')
                bars.push({ name: inst.name, category: entry[0] })
          }

          bars.sort((a) => (a.category === 'diff' ? -1 : 1))

          console.log(bars)

          if (data.length !== 0)
            return (
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
                    {bars.map((bar, i) => {
                      if (bar.category === 'diff')
                        return <Bar key={i} dataKey={bar.category} stackId='a' fill='transparent' />
                      else return <Bar key={i} dataKey={bar.category} stackId='a' fill={colors[i]} />
                    })}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )
          else return <div key={month.id} className='fin-detail-month'></div>
        })}
      </div>
    </div>
  )
}

export default FinDetails
