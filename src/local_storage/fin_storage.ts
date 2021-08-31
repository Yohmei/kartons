import dayjs from 'dayjs'
import { BehaviorSubject } from 'rxjs'
import { ini_state, IWallet } from '../context/reducers/fin_reducer'
import { r_id } from '../utils'

export const mock_wallet: IWallet[] = [
  {
    id: r_id(),
    uid: '',
    year: dayjs(new Date()).year(),
    months: [
      {
        id: r_id(),
        term: dayjs(new Date()).month() - 2,
        content: [
          {
            id: r_id(),
            timestamp: new Date('2021-08-24T13:14:05.806Z'),
            type: 'expenses',
            category: 'transport',
            detail: 'parking',
            amount: 10,
          },
          {
            id: r_id(),
            timestamp: new Date('2021-08-24T13:14:58.832Z'),
            type: 'income',
            category: 'loan',
            detail: '',
            amount: 80,
          },
          {
            id: r_id(),
            timestamp: new Date('2021-08-24T13:14:05.812Z'),
            type: 'expenses',
            category: '',
            detail: '',
            amount: 0,
          },
          {
            id: r_id(),
            timestamp: new Date('2021-08-24T13:14:58.838Z'),
            type: 'income',
            category: '',
            detail: '',
            amount: 0,
          },
        ],
      },
      {
        id: r_id(),
        term: dayjs(new Date()).month() - 1,
        content: [
          {
            id: r_id(),
            timestamp: new Date('2021-08-24T13:12:27.351Z'),
            type: 'expenses',
            category: 'food',
            detail: 'other',
            amount: 5,
          },
          {
            id: r_id(),
            timestamp: new Date('2021-08-24T13:12:32.023Z'),
            type: 'income',
            category: 'interest',
            detail: '',
            amount: 10,
          },
          {
            id: r_id(),
            timestamp: new Date('2021-08-24T13:12:27.360Z'),
            type: 'expenses',
            category: '',
            detail: '',
            amount: 0,
          },
          {
            id: r_id(),
            timestamp: new Date('2021-08-24T13:12:32.029Z'),
            type: 'income',
            category: '',
            detail: '',
            amount: 0,
          },
        ],
      },
      {
        id: r_id(),
        term: dayjs(new Date()).month(),
        content: [
          {
            id: r_id(),
            timestamp: new Date('2021-08-24T13:03:50.800Z'),
            type: 'income',
            category: 'salary',
            detail: '',
            amount: 1900,
          },
          {
            id: r_id(),
            timestamp: new Date('2021-08-24T13:01:25.263Z'),
            type: 'expenses',
            category: 'food',
            detail: 'groceries',
            amount: 100,
          },
          {
            id: r_id(),
            timestamp: new Date('2021-08-24T13:01:37.285Z'),
            type: 'expenses',
            category: 'house',
            detail: 'rent',
            amount: 995,
          },
          {
            id: r_id(),
            timestamp: new Date('2021-08-24T13:01:52.366Z'),
            type: 'expenses',
            category: 'house',
            detail: 'electricity',
            amount: 90,
          },
          {
            id: r_id(),
            timestamp: new Date('2021-08-24T13:02:11.074Z'),
            type: 'expenses',
            category: 'personal',
            detail: 'hobbies',
            amount: 100,
          },
          {
            id: r_id(),
            timestamp: new Date('2021-08-24T13:03:11.172Z'),
            type: 'expenses',
            category: 'food',
            detail: 'restaurant',
            amount: 100,
          },
          {
            id: r_id(),
            timestamp: new Date('2021-08-24T13:03:23.073Z'),
            type: 'expenses',
            category: 'food',
            detail: 'groceries',
            amount: 200,
          },
          {
            id: r_id(),
            timestamp: new Date('2021-08-24T13:03:50.807Z'),
            type: 'income',
            category: '',
            detail: '',
            amount: 0,
          },
          {
            id: r_id(),
            timestamp: new Date('2021-08-24T13:04:36.834Z'),
            type: 'expenses',
            category: '',
            detail: '',
            amount: 0,
          },
        ],
      },
    ],
    timestamp: new Date(),
  },
  {
    id: r_id(),
    uid: '',
    year: dayjs(new Date()).year() - 1,
    months: [
      {
        id: r_id(),
        term: 11,
        content: [
          {
            id: r_id(),
            timestamp: new Date('2021-08-24T13:16:33.093Z'),
            type: 'expenses',
            category: 'police',
            detail: 'fine',
            amount: 10,
          },
          {
            id: r_id(),
            timestamp: new Date('2021-08-24T13:16:38.192Z'),
            type: 'income',
            category: 'salary',
            detail: '',
            amount: 60,
          },
          {
            id: r_id(),
            timestamp: new Date('2021-08-24T13:16:33.098Z'),
            type: 'expenses',
            category: '',
            detail: '',
            amount: 0,
          },
          {
            id: r_id(),
            timestamp: new Date('2021-08-24T13:16:38.198Z'),
            type: 'income',
            category: '',
            detail: '',
            amount: 0,
          },
        ],
      },
    ],
    timestamp: new Date(),
  },
]

export const get_local_finance = () => {
  const finance = localStorage.getItem('finance')
  if (finance) return JSON.parse(finance) as IWallet[]
  else return ini_state
}

export const wallet_observable = new BehaviorSubject<IWallet[]>(get_local_finance())

export const set_local_finance = (local_wallet: IWallet[]) => {
  localStorage.setItem('finance', JSON.stringify(local_wallet))
  wallet_observable.next(get_local_finance())
}

export const get_local_wallet = () => {
  const wallet = localStorage.getItem('wallet')
  if (wallet) return JSON.parse(wallet) as IWallet
  else return {} as IWallet
}

export const set_local_wallet = (local_wallet: IWallet) => {
  localStorage.setItem('wallet', JSON.stringify(local_wallet))
}
