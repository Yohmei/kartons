import React, { createContext, useEffect, useReducer } from 'react'
import { init_auth } from './actions/auth_actions'
import auth_reducer, { IAuthAction, IAuthPayload, ini_state } from './reducers/auth_reducer'

const initial_context: { auth_state: IAuthPayload; dispatch: React.Dispatch<IAuthAction> } = {
  auth_state: ini_state,
  dispatch: () => {},
}

export const AuthContext = createContext(initial_context)

const AuthProvider = ({ children }: any) => {
  const [auth_state, dispatch] = useReducer(auth_reducer, ini_state)

  useEffect(() => {
    let unsub = () => {}
    unsub = init_auth(dispatch)
    return () => unsub()
  }, [])

  return <AuthContext.Provider value={{ auth_state, dispatch }}>{children}</AuthContext.Provider>
}

export default AuthProvider
