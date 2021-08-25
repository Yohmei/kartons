import dayjs from 'dayjs'
import { r_id } from '../../utils'

export interface IWalletEntry {
  id: string
  timestamp: Date
  type: 'expenses' | 'income'
  category: string
  detail: string
  amount: number
}

export interface IWallet {
  id: string
  uid: string
  year: number
  months: { id: string; term: number; content: IWalletEntry[] }[]
  timestamp: Date
}

export interface IWalletDB {
  id: string
  uid: string
  device_ids: string[]
  wallet: IWallet[]
  timestamp: Date
}

export interface IDetail {
  id: string
  name: string
}

export interface ICategory {
  id: string
  name: string
  details: IDetail[]
}

export interface ICategories {
  id: string
  timestamp: Date
  type: 'expenses' | 'income'
  content: ICategory[]
}

export const ini_state: IWallet[] = [
  {
    id: r_id(),
    uid: '',
    year: dayjs(new Date()).year(),
    months: [
      {
        id: r_id(),
        term: dayjs(new Date()).month(),
        content: [],
      },
    ],
    timestamp: new Date(),
  },
]

export interface IWalletAction {
  type: string
  payload: IWalletEntry[]
}

const reducer = (state: IWalletEntry[], action: IWalletAction) => {
  const { type, payload } = action

  switch (type) {
    case 'UPDATE_WALLET':
      return payload
    default:
      throw new Error()
  }
}

export default reducer
