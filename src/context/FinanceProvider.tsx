import React, { createContext, useReducer } from 'react'
import { get_current_wallet_entries } from './actions/fin_actions'
import reducer, { ini_state, IWalletAction, IWalletEntry } from './reducers/fin_reducer'

const initial_context: { wallet_state: IWalletEntry[]; dispatch: React.Dispatch<IWalletAction> } = {
  wallet_state: get_current_wallet_entries(ini_state[0]),
  dispatch: () => {},
}

export const FinanceContext = createContext(initial_context)

const FinanceProvider = ({ children }: any) => {
  const [wallet_state, dispatch] = useReducer(reducer, get_current_wallet_entries(ini_state[0]))

  return <FinanceContext.Provider value={{ wallet_state, dispatch }}>{children}</FinanceContext.Provider>
}

export default FinanceProvider
