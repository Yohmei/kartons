import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import RSpring from 'react-spring'
import { Bar, BarChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import Spinner from '../../../components/Spinner'
import { IWallet, IWalletEntry } from '../../../context/reducers/fin_reducer'
import { capitalise_first, clone, r_id } from '../../../utils'

type QueryParams = {
  year: string
}

interface FinDetailsProps {
  fin_state: IWallet[]
  transition: RSpring.TransitionFn<boolean, { opacity: number }>
}

const FinDetails = ({ fin_state, transition }: FinDetailsProps) => {
  let expense_colors = clone(['#EA5348', '#EC645B', '#EE766D', '#F0877F', '#F29891', '#F4A9A4'])
  let income_colors = clone(['#06EFB1', '#10F9BB', '#24F9C1', '#38FAC6', '#4CFACC', '#60FBD2'])

  const get_expense_color = () => {
    if (expense_colors.length === 0) expense_colors = ['#EA5348', '#EC645B', '#EE766D', '#F0877F', '#F29891', '#F4A9A4']
    return expense_colors.splice(expense_colors.length - 1, 1)[0]
  }

  const get_income_color = () => {
    if (income_colors.length === 0) income_colors = ['#06EFB1', '#10F9BB', '#24F9C1', '#38FAC6', '#4CFACC', '#60FBD2']
    return income_colors.splice(income_colors.length - 1, 1)[0]
  }

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
      const data = fin_state.filter((wallet) => {
        return wallet.year === Number(year)
      })[0].months

      const total: {
        id: string
        term: number
        content: IWalletEntry[]
      } = { id: r_id(), term: -1, content: [] }

      for (let item of data) {
        for (let content_item of item.content) {
          total.content.push(content_item)
        }
      }

      const is_total = data.filter((obj) => obj.term === -1)

      if (is_total.length === 0) data.unshift(total)

      set_months(data)
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
                if (data[i][item.category]) data[i][item.category] = data[i][item.category] + item.amount
                else data[i][item.category] = item.amount
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

          data.push({ name: 'Revenue', total })

          data.sort((a) => (a.name === 'Income' ? -1 : 1))

          const bars: any[] = []

          for (let inst of data) {
            for (let entry of Object.entries(inst))
              if (bars.indexOf(entry[0]) === -1 && entry[0] !== 'name')
                bars.push({ name: inst.name, category: entry[0] })
          }

          bars.sort((a) => (a.category === 'diff' ? -1 : 1))

          if (data.length !== 0)
            return (
              <div key={month.id} className='fin-detail-month'>
                <h5 style={{ position: 'relative', bottom: '-20px' }}>
                  {months_list[month.term] ? months_list[month.term] : 'Year'}
                </h5>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart
                    data={data}
                    margin={{
                      top: 20,
                      right: 10,
                      left: 10,
                      bottom: 5,
                    }}
                  >
                    <XAxis dataKey='name' />
                    <Tooltip
                      itemStyle={{ backgroundColor: 'black' }}
                      labelStyle={{ backgroundColor: 'black' }}
                      contentStyle={{ backgroundColor: 'black', border: 'none' }}
                    />
                    <ReferenceLine y={0} stroke='#000' />
                    {bars.map((bar, i) => {
                      if (bar.category === 'diff')
                        return <Bar key={i} dataKey={bar.category} stackId='a' fill='transparent' />
                      else if (bar.name === 'Revenue')
                        return <Bar key={i} dataKey={bar.category} stackId='a' fill='#FFDA85' />
                      else if (bar.name === 'Expenses')
                        return <Bar key={i} dataKey={bar.category} stackId='a' fill={get_expense_color()} />
                      else return <Bar key={i} dataKey={bar.category} stackId='a' fill={get_income_color()}></Bar>
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
