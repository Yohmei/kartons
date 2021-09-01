import dayjs from 'dayjs'
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  DocumentReference,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { Dispatch } from 'react'
import rfdc from 'rfdc'
import { db } from '../../config/fb_config'
import { get_local_wallet, set_local_wallet } from '../../local_storage/fin_storage'
import { remove_arr_item } from '../../utils'
import { ini_state, IWallet, IWalletAction, IWalletEntry } from '../reducers/fin_reducer'

const clone = rfdc()

export const update_wallet_context = (payload: IWalletEntry[], dispatch: React.Dispatch<IWalletAction>) => {
  dispatch({ type: 'UPDATE_WALLET', payload })
}

const set_wallet = async (wallet: IWallet) => {
  await updateDoc(doc(db, 'finance', wallet.id), { ...wallet, timestamp: new Date() }).catch((err) => {
    console.log(err)
  })
}

export const get_current_wallet = (wallet: IWallet[]) => {
  for (let wallet_o of wallet) {
    if (wallet_o.year === dayjs(new Date()).year()) {
      return clone(wallet_o)
    }
  }

  return {} as IWallet
}

export const get_current_wallet_entries = (wallet: IWallet) => {
  for (let month of wallet.months) {
    if (month.term === dayjs(new Date()).month()) return month.content
  }

  return []
}

export const set_current_wallet = (wallet: IWallet, content: IWalletEntry[]) => {
  for (let month of wallet.months) {
    if (month.term === dayjs(new Date()).month()) {
      month.content = content
    }
  }

  set_local_wallet(clone(wallet))
  set_wallet(wallet)
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

export const add_new_wallet = async (user_uid: string) => {
  const new_wallet = clone(ini_state)
  new_wallet[0].uid = user_uid

  const doc_ref = (await addDoc(collection(db, 'finance'), new_wallet[0]).catch((err) => {
    console.log(err)
  })) as DocumentReference<DocumentData>

  return doc_ref.id
}

export const wallet_subscribe = (
  user_uid: string,
  dispatch: React.Dispatch<IWalletAction>,
  set_data_received: Dispatch<React.SetStateAction<boolean>>
) => {
  const q = query(collection(db, 'finance'), where('uid', '==', user_uid))

  const unsub = onSnapshot(q, (snapshot) => {
    if (snapshot.docs[0]) {
      const finance = [] as IWallet[]

      for (const doc of snapshot.docs) {
        const wallet = doc.data() as IWallet
        wallet.id = doc.id
        finance.push(wallet)
      }

      const wallet = get_current_wallet(finance)
      const wallet_entries = get_current_wallet_entries(wallet)

      set_local_wallet(wallet)
      update_wallet_context(wallet_entries, dispatch)
      set_data_received(true)
    } else {
      add_new_wallet(user_uid)
    }
  })

  return unsub
}

// const wallet_sub_local = (
//   user_uid: string,
//   dispatch: React.Dispatch<IWalletAction>,
//   set_data_received: Dispatch<React.SetStateAction<boolean>>
// ) => {
//   let sub
//   sub = wallet_observable.subscribe((finance) => {
//     let f_finance = finance.filter((wallet) => wallet.uid === user_uid)

//     if (f_finance.length !== 0) {
//       const wallet = get_current_wallet(f_finance)
//       const wallet_entries = get_current_wallet_entries(wallet)
//       update_wallet_context(wallet_entries, dispatch)
//       set_data_received(true)
//     } else {
//       if (finance.length === 1) {
//         finance[0].uid = user_uid
//       } else {
//         const new_wallet = clone(ini_state)
//         new_wallet[0].uid = user_uid
//         finance.push(new_wallet[0])
//       }

//       set_local_finance(finance)
//     }
//   })

//   return sub.unsubscribe.bind(sub)
// }
