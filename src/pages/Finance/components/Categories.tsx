import AddIcon from '@material-ui/icons/Add'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import CloseIcon from '@material-ui/icons/Close'
import React, { useContext, useEffect, useState } from 'react'
import RSpring, { animated } from 'react-spring'
import rfdc from 'rfdc'
import {
  categories_subscribe,
  delete_category,
  update_categories,
  update_details,
} from '../../../context/actions/categories_actions'
import { update_wallet } from '../../../context/actions/fin_actions'
import { AuthContext } from '../../../context/AuthProvider'
import { CategoriesContext } from '../../../context/CategoriesProvider'
import { FinanceContext } from '../../../context/FinanceProvider'
import { ICategory, IDetail, IWalletEntry } from '../../../context/reducers/fin_reducer'
import { r_id } from '../../../utils'
import { IDataState } from '../../Page'
import { capitalise_first } from '../utils'
import NewCategoryInput from './NewCategoryInput'

interface ICategoriesProps {
  data_state: IDataState
  ani_style: { opacity: RSpring.SpringValue<number> }
  close_categories: () => void
  wallet_entry: IWalletEntry | undefined
  is_details: boolean
}

const clone = rfdc()

const Categories = ({ data_state, ani_style, close_categories, wallet_entry, is_details }: ICategoriesProps) => {
  const { wallet_state } = useContext(FinanceContext)
  const { categories_state, dispatch_cat } = useContext(CategoriesContext)
  const [state, set_state] = useState<any[][]>([]) // ICategory[][] or IDetail[][]
  const [is_new_category_name, set_is_new_category_name] = useState(false)
  const { auth_state } = useContext(AuthContext)
  const { user, is_offline } = auth_state

  const add_category = (new_category_name: string) => {
    if (wallet_entry) {
      if (!is_details) update_categories(categories_state, new_category_name, wallet_entry.type)
      else update_details(categories_state, new_category_name, wallet_entry.type, wallet_entry.category)
    }
  }

  const set_category = (category_name: string, wallet_entry: IWalletEntry, is_details: boolean) => {
    const new_wallet_entry = clone(wallet_entry)

    if (is_details) {
      new_wallet_entry.detail = category_name
    } else {
      new_wallet_entry.category = category_name
      new_wallet_entry.detail = ''
    }

    update_wallet(wallet_state, new_wallet_entry, new_wallet_entry.id)
    close_categories()
  }

  const toggle_new_category_input = () => {
    set_is_new_category_name(!is_new_category_name)
  }

  useEffect(() => {
    let categories: any[] = [] // ICategory[] | IDetail[]

    if (wallet_entry) {
      if (wallet_entry.type === 'expenses' && !is_details) {
        const expenses = categories_state.find((category) => category.type === 'expenses')
        if (expenses) {
          categories = expenses.content
        } else throw new Error('categories object is missing "expenses" type')
      } else if (wallet_entry.type === 'income' && !is_details) {
        const income = categories_state.find((category) => category.type === 'income')
        if (income) {
          categories = income.content
        } else throw new Error('categories object is missing "income" type')
      } else if (wallet_entry.type === 'expenses' && is_details) {
        const expenses = categories_state.find((category) => category.type === 'expenses')
        if (expenses) {
          categories = expenses.content.find((category) => category.name === wallet_entry.category)!.details
        } else throw new Error('categories object is missing "expenses" type')
      } else if (wallet_entry.type === 'income' && is_details) {
        const income = categories_state.find((category) => category.type === 'income')
        if (income) {
          categories = income.content.find((category) => category.name === wallet_entry.category)!.details
        } else throw new Error('categories object is missing "income" type')
      }
    }

    if (categories.length === 0) {
      if (is_details) categories.push({ id: r_id(), name: '' })
      else categories.push({ id: r_id(), name: '', details: [] })
    } else if (categories.length !== 0) {
      if (categories[categories.length - 1].name !== '') {
        if (is_details) categories.push({ id: r_id(), name: '' })
        else categories.push({ id: r_id(), name: '', details: [] })
      }
    }

    const mod_exp_content: any[][] = [] as any[][] // ICategory[][] or IDetail[][]
    let temp_arr: ICategory[] | IDetail[] = [] as ICategory[] | IDetail[]

    for (let i = 0; i < categories.length; i++) {
      const item = categories[i]

      if (i % 2 === 0) temp_arr = []

      temp_arr.push(item)

      if (i % 2 === 0) mod_exp_content.push(temp_arr)
    }

    set_state(mod_exp_content)
  }, [is_details, categories_state, wallet_entry])

  useEffect(() => {
    let unsub = () => {}
    unsub = categories_subscribe(user.uid, dispatch_cat, data_state.set_data_received, is_offline)
    return () => unsub()
  }, [data_state.set_data_received, dispatch_cat, is_offline, user.uid])

  return (
    <animated.div style={ani_style} className='wallet-categories'>
      <div onClick={close_categories} className='close-overlay'></div>
      <div className='categories-header'>
        <h4>Categories</h4>
      </div>
      <div className='categories-body'>
        <div className='table-row-wrap'>
          {state.map((row, i) => (
            <div className='table-row' key={i}>
              {row.map((category) => (
                <div className='table-item' key={category.id}>
                  {category.name === '' ? (
                    <span onClick={toggle_new_category_input}>
                      <AddIcon className='add-icon' />
                    </span>
                  ) : (
                    <div>
                      <span
                        onClick={() => {
                          if (wallet_entry) set_category(category.name, wallet_entry, is_details)
                        }}
                      >
                        {capitalise_first(category.name)}
                      </span>
                      <span className='remove-category' onClick={() => delete_category(category.id, is_details)}>
                        <HighlightOffIcon className='remove-category-icon' />
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {is_new_category_name && (
        <NewCategoryInput add_category={add_category} toggle_new_category_input={toggle_new_category_input} />
      )}
      <div className='categories-footer' onClick={close_categories}>
        <CloseIcon className='close-icon' />
      </div>
    </animated.div>
  )
}

export default Categories
