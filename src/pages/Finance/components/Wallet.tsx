import AddIcon from '@material-ui/icons/Add'
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline'
import React, { createRef, useContext, useEffect } from 'react'
import Spinner from '../../../components/Spinner'
import { delete_wallet_entry, update_wallet } from '../../../context/actions/fin_actions'
import { FinanceContext } from '../../../context/FinanceProvider'
import { IWalletEntry } from '../../../context/reducers/fin_reducer'
import { capitalise_first, r_id } from '../../../utils'
import { IDataState } from '../../Page'

export interface IWalletProp {
  is_edit: boolean
  data_state: IDataState
  open_categories: (wallet_entry: IWalletEntry, { is_details }: { is_details: boolean }) => void
  open_amount: (wallet_entry: IWalletEntry) => void
  type: 'expenses' | 'income'
}

const Wallet = ({ is_edit, data_state, open_categories, open_amount, type }: IWalletProp) => {
  const { wallet_state, dispatch } = useContext(FinanceContext)
  const table_body_ref = createRef<HTMLDivElement>()

  useEffect(() => {
    if (data_state.data_received) {
      const new_wallet_entry = {
        id: r_id(),
        timestamp: new Date(),
        type,
        category: '',
        detail: '',
        amount: 0,
      }

      if (wallet_state.length === 0) update_wallet(wallet_state, new_wallet_entry, new_wallet_entry.id)
      else if (wallet_state.length === 1) {
        if (wallet_state[0].type !== type) {
          update_wallet(wallet_state, new_wallet_entry, new_wallet_entry.id)
        }
      } else if (wallet_state.length > 1) {
        const f_wallet_entries = wallet_state.filter((entry) => entry.type === type)

        if (f_wallet_entries[f_wallet_entries.length - 1].amount !== 0) {
          update_wallet(wallet_state, new_wallet_entry, new_wallet_entry.id)
        }
      }
    }

    const table_body = table_body_ref.current
    if (table_body) table_body.scrollTop = table_body.scrollHeight
  }, [type, wallet_state, dispatch, data_state.data_received, table_body_ref])

  return (
    <div className='wallet-input-cont'>
      <p className='sub-header'>{capitalise_first(type)}</p>
      <div className={`${type}-table table`}>
        <Spinner transition={data_state.transition} />
        <div className='table-body' ref={table_body_ref}>
          {wallet_state.map((wallet_entry) => {
            if (type === wallet_entry.type)
              return (
                <div className='table-row' key={wallet_entry.id}>
                  <div className='table-item' onClick={() => open_categories(wallet_entry, { is_details: false })}>
                    {wallet_entry.category === '' ? (
                      <span className='add-icon-cont'>
                        <AddIcon className='add-icon' />
                      </span>
                    ) : (
                      <span>{capitalise_first(wallet_entry.category)}</span>
                    )}
                  </div>
                  <div
                    className='table-item'
                    style={wallet_entry.category === '' ? { pointerEvents: 'none' } : {}}
                    onClick={() => open_categories(wallet_entry, { is_details: true })}
                  >
                    {wallet_entry.detail === '' && wallet_entry.category !== '' ? (
                      <span className='add-icon-cont'>
                        <AddIcon className='add-icon' />
                      </span>
                    ) : (
                      <span>{capitalise_first(wallet_entry.detail)}</span>
                    )}
                  </div>
                  <div
                    className='table-item'
                    onClick={() => open_amount(wallet_entry)}
                    style={wallet_entry.category === '' ? { pointerEvents: 'none' } : {}}
                  >
                    {wallet_entry.amount === 0 && wallet_entry.category !== '' ? (
                      <span className='add-icon-cont'>
                        <AddIcon className='add-icon' />
                      </span>
                    ) : (
                      <span>{wallet_entry.amount !== 0 ? wallet_entry.amount : ''}</span>
                    )}
                  </div>
                  <div
                    style={{ display: `${is_edit ? 'flex' : 'none'}` }}
                    className='remove-wallet-entry'
                    onClick={() => delete_wallet_entry(wallet_entry.id)}
                  >
                    <RemoveCircleOutlineIcon className='remove-wallet-entry-icon' />
                  </div>
                </div>
              )
            else return ''
          })}
        </div>
      </div>
    </div>
  )
}

export default Wallet
