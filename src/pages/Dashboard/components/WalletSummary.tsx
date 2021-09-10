import equal from 'fast-deep-equal/es6/react'
import React, { useContext, useEffect, useState } from 'react'
import { useTransition } from 'react-spring'
import Spinner from '../../../components/Spinner'
import { wallet_subscribe } from '../../../context/actions/fin_actions'
import { AuthContext } from '../../../context/AuthProvider'
import { FinanceContext } from '../../../context/FinanceProvider'
import { capitalise_first } from '../../../utils'

const WalletSummary = () => {
  const { wallet_state, dispatch } = useContext(FinanceContext)
  const [state, set_state] = useState({
    savings: 0,
    heavy_expenses: [
      { name: '', amount: 0 },
      { name: '', amount: 0 },
      { name: '', amount: 0 },
      { name: '', amount: 0 },
    ],
  })
  const [data_received, set_data_received] = useState(false)
  const { auth_state } = useContext(AuthContext)
  const { user } = auth_state
  const transition = useTransition(data_received, {
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 150 },
  })

  useEffect(() => {
    let unsub = () => {}

    if (!equal(user, { uid: '' })) unsub = wallet_subscribe(user.uid, dispatch, set_data_received)

    return () => unsub()
  }, [user, dispatch, set_data_received])

  useEffect(() => {
    if (wallet_state.length !== 0) {
      const heavy_expenses = [{ name: '', amount: 0 }]
      const prep_state = {
        savings: 0,
        heavy_expenses: [{ name: '', amount: 0 }],
      }

      for (let item of wallet_state) {
        if (item.type === 'expenses') {
          prep_state.savings = prep_state.savings - item.amount
          const i = heavy_expenses.map((obj) => obj.name).indexOf(item.category)

          if (i !== -1) {
            if (heavy_expenses[i].name === item.category)
              heavy_expenses[i].amount = heavy_expenses[i].amount + item.amount
            else heavy_expenses[i].amount = item.amount
          } else {
            heavy_expenses.push({ name: item.category, amount: item.amount })
          }
        } else {
          prep_state.savings = prep_state.savings + item.amount
        }
      }

      heavy_expenses.sort((a, b) => {
        return a.amount > b.amount ? -1 : 1
      })

      for (let i = 0; i < 4; i++) {
        prep_state.heavy_expenses[i] = heavy_expenses[i]
      }

      set_state(prep_state)
    }

    return () => {}
  }, [wallet_state])

  return (
    <div className='item wallet-summary'>
      <Spinner transition={transition} />
      <h4 className='item-header'>Wallet</h4>
      <div
        className='wallet'
        style={{ height: '3em', backgroundColor: '#25d0b9', color: '#000000', fontWeight: 'bold' }}
      >
        <span>Savings</span>
        <span>{String(state.savings).replace(/(?=.{3}$)/, ' ')}</span>
      </div>
      <p className='item-sub-header'>Expenses</p>
      {state.heavy_expenses.map((data, i) => {
        if (data && data.name !== '')
          return (
            <div className='wallet' key={i}>
              <span>{capitalise_first(data.name)}</span>
              <span>-{data.amount}</span>
            </div>
          )
        else
          return (
            <div className='wallet' key={i}>
              <span>Emmm...</span>
              <span>Ꝏ</span>
            </div>
          )
      })}
    </div>
  )
}

export default WalletSummary
