import equal from 'fast-deep-equal/es6/react'
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTransition } from 'react-spring'
import { update_wallet, wallet_subscribe } from '../../context/actions/fin_actions'
import { AuthContext } from '../../context/AuthProvider'
import { FinanceContext } from '../../context/FinanceProvider'
import { IWalletEntry } from '../../context/reducers/fin_reducer'
import page_hoc, { IPageProps } from '../Page'
import Categories from './components/Categories'
import NewAmountInput from './components/NewAmountInput'
import Wallet from './components/Wallet'

const category_transition_o = {
  from: { opacity: 0, transform: 'scale(0.95)' },
  enter: { opacity: 1, transform: 'scale(1)' },
  leave: { opacity: 0, transform: 'scale(0.95)' },
  config: { duration: 100 },
}

const Finance = ({ data_state }: IPageProps) => {
  const { wallet_state, dispatch } = useContext(FinanceContext)
  const [wallet_entry, set_wallet_entry] = useState<IWalletEntry>()
  const [is_categories, set_is_categories] = useState(false)
  const [is_details, set_is_details] = useState(false)
  const [is_amount, set_is_amount] = useState(false)
  const category_transition = useTransition(is_categories, category_transition_o)
  const amount_transition = useTransition(is_amount, category_transition_o)
  const { auth_state } = useContext(AuthContext)
  const { user } = auth_state

  const open_categories = (wallet_entry: IWalletEntry, { is_details }: { is_details: boolean }) => {
    set_is_details(is_details)
    set_wallet_entry(wallet_entry)
    set_is_categories(true)
  }

  const close_categories = () => {
    set_is_categories(false)
  }

  const open_amount = (wallet_entry: IWalletEntry) => {
    set_wallet_entry(wallet_entry)
    set_is_amount(true)
  }

  const close_amount = (wallet_entry: IWalletEntry | undefined) => {
    if (wallet_entry) {
      if (wallet_entry.amount !== 0) {
        update_wallet(wallet_state, wallet_entry, wallet_entry.id)
      }
    }
    set_is_amount(false)
  }

  useEffect(() => {
    let unsub = () => {}

    if (!equal(user, { uid: '' })) unsub = wallet_subscribe(user.uid, dispatch, data_state.set_data_received)

    return () => unsub()
  }, [user.uid, dispatch, data_state.set_data_received])

  return (
    <div className='content'>
      <h4 className=''>Current period</h4>
      {category_transition((style, is_categories) =>
        is_categories ? (
          <Categories
            data_state={data_state}
            ani_style={style}
            close_categories={close_categories}
            wallet_entry={wallet_entry}
            is_details={is_details}
          />
        ) : (
          ''
        )
      )}
      {amount_transition((style, is_amount) =>
        is_amount ? <NewAmountInput ani_style={style} wallet_entry={wallet_entry} close_amount={close_amount} /> : ''
      )}
      <Wallet data_state={data_state} open_categories={open_categories} open_amount={open_amount} type={'expenses'} />
      <Wallet data_state={data_state} open_categories={open_categories} open_amount={open_amount} type={'income'} />
      <Link to='finances' className='history-link'>
        History
      </Link>
    </div>
  )
}

export default page_hoc(Finance, 'Finance')
