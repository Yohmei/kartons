import dayjs from 'dayjs'
import { Dispatch } from 'react'
import rfdc from 'rfdc'
import { get_local_wallet, set_local_wallet, wallet_observable } from '../../local_storage/fin_storage'
import { remove_arr_item } from '../../utils'
import { IWallet, IWalletAction, IWalletEntry } from '../reducers/fin_reducer'

const clone = rfdc()

export const update_wallet_context = (payload: IWalletEntry[], dispatch: React.Dispatch<IWalletAction>) => {
  dispatch({ type: 'UPDATE_WALLET', payload })
}

export const get_current_wallet_entries = (wallet: IWallet[]) => {
  for (let wallet_o of wallet) {
    if (wallet_o.year === dayjs(new Date()).year()) {
      for (let month of wallet_o.months) {
        if (month.term === dayjs(new Date()).month()) return month.content
      }
    }
  }

  return []
}

export const set_current_wallet = (wallet: IWallet[], content: IWalletEntry[]) => {
  for (let wallet_o of wallet) {
    if (wallet_o.year === dayjs(new Date()).year()) {
      for (let month of wallet_o.months) {
        if (month.term === dayjs(new Date()).month()) {
          month.content = content
        }
      }
    }
  }

  set_local_wallet(clone(wallet))
  return wallet
}

export const delete_wallet_entry = (wallet_entry_id: string) => {
  const wallet = get_local_wallet()
  let wallet_entries = get_current_wallet_entries(wallet)

  for (let i = 0; i < wallet_entries.length; i++) {
    const item = wallet_entries[i]

    if (item.id === wallet_entry_id) {
      wallet_entries = remove_arr_item(wallet_entries, i)
    }
  }

  set_current_wallet(wallet, wallet_entries)
}

export const update_wallet = (
  wallet_entries: IWalletEntry[],
  new_wallet_entry: IWalletEntry,
  wallet_entry_id: string
) => {
  const is_wallet_entry = !!wallet_entries.find((wallet_entry: IWalletEntry) => {
    return wallet_entry.id === wallet_entry_id
  })

  if (is_wallet_entry)
    wallet_entries = wallet_entries.map((wallet_entry) => {
      if (wallet_entry.id === wallet_entry_id) {
        wallet_entry = new_wallet_entry
        wallet_entry.timestamp = new Date()
      }
      return wallet_entry
    })
  else {
    wallet_entries.push(new_wallet_entry)
  }

  const wallet = get_local_wallet()

  set_current_wallet(wallet, wallet_entries)
}

export const wallet_subscribe = (
  user_uid: string,
  dispatch: React.Dispatch<IWalletAction>,
  set_data_received: Dispatch<React.SetStateAction<boolean>>,
  is_offline: boolean | undefined
) => {
  let sub
  if (is_offline) {
    sub = wallet_observable.subscribe((wallet) => {
      wallet = wallet.filter((wallet) => wallet.uid === user_uid)

      if (wallet) {
        const wallet_entries = get_current_wallet_entries(wallet)
        set_data_received(true)
        update_wallet_context(wallet_entries, dispatch)
      }
    })

    return sub.unsubscribe.bind(sub)
  } else {
    // firebase
    return () => {}
  }
}
