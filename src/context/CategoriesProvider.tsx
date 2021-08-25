import React, { createContext, useReducer } from 'react'
import reducer, { ICategoriesAction, ICategoriesPayload, ini_state } from './reducers/categories_reducer'

const initial_context: { categories_state: ICategoriesPayload[]; dispatch_cat: React.Dispatch<ICategoriesAction> } = {
  categories_state: ini_state,
  dispatch_cat: () => {},
}

export const CategoriesContext = createContext(initial_context)

const CategoriesProvider = ({ children }: any) => {
  const [categories_state, dispatch_cat] = useReducer(reducer, ini_state)

  return <CategoriesContext.Provider value={{ categories_state, dispatch_cat }}>{children}</CategoriesContext.Provider>
}

export default CategoriesProvider
