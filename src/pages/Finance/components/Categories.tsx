import AddIcon from '@material-ui/icons/Add'
import BlockIcon from '@material-ui/icons/Block'
import CloseIcon from '@material-ui/icons/Close'
import DoneIcon from '@material-ui/icons/Done'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import equal from 'fast-deep-equal/es6/react'
import React, { useContext, useEffect, useState } from 'react'
import RSpring, { animated, useTransition } from 'react-spring'
import rfdc from 'rfdc'
import Spinner from '../../../components/Spinner'
import {
  add_category,
  add_detail,
  categories_subscribe,
  delete_category,
} from '../../../context/actions/categories_actions'
import { update_wallet } from '../../../context/actions/fin_actions'
import { AuthContext } from '../../../context/AuthProvider'
import { CategoriesContext } from '../../../context/CategoriesProvider'
import { FinanceContext } from '../../../context/FinanceProvider'
import { ICategory, IDetail, IWalletEntry } from '../../../context/reducers/fin_reducer'
import { capitalise_first, r_id } from '../../../utils'
import NewCategoryInput from './NewCategoryInput'

interface ICategoriesProps {
  ani_style: { opacity: RSpring.SpringValue<number> }
  close_categories: () => void
  wallet_entry: IWalletEntry | undefined
  is_details: boolean
}

const clone = rfdc()

const Categories = ({ ani_style, close_categories, wallet_entry, is_details }: ICategoriesProps) => {
  const { wallet_state } = useContext(FinanceContext)
  const { categories_state, dispatch_cat } = useContext(CategoriesContext)
  const [state, set_state] = useState<any[][]>([]) // ICategory[][] or IDetail[][]
  const [is_new_category_name, set_is_new_category_name] = useState(false)
  const [is_edit, set_is_edit] = useState(false)
  const [category_not_exist, set_category_not_exist] = useState(false)
  const { auth_state } = useContext(AuthContext)
  const { user } = auth_state
  const [data_received, set_data_received] = useState(false)
  const transition = useTransition(data_received, {
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 150 },
  })

  const add_category_m = (new_category_name: string) => {
    if (wallet_entry) {
      if (!is_details) add_category(new_category_name, wallet_entry.type)
      else add_detail(new_category_name, wallet_entry.type, wallet_entry.category)
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
    const categories_loc = clone(categories_state)
    let categories: any[] = [] // ICategory[] | IDetail[]

    if (wallet_entry) {
      if (wallet_entry.type === 'expenses' && !is_details) {
        const expenses = categories_loc.find((category) => category.type === 'expenses')
        if (expenses) categories = expenses.content
      } else if (wallet_entry.type === 'income' && !is_details) {
        const income = categories_loc.find((category) => category.type === 'income')
        if (income) categories = income.content
      } else if (wallet_entry.type === 'expenses' && is_details) {
        const expenses = categories_loc.find((category) => category.type === 'expenses')
        if (expenses) {
          const is_categories = expenses.content.find((category) => category.name === wallet_entry.category)
          if (is_categories) categories = is_categories.details
          else set_category_not_exist(true)
        }
      } else if (wallet_entry.type === 'income' && is_details) {
        const income = categories_loc.find((category) => category.type === 'income')
        if (income) {
          const is_categories = income.content.find((category) => category.name === wallet_entry.category)
          if (is_categories) categories = is_categories.details
          else set_category_not_exist(true)
        }
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
    if (!equal(user, { uid: '' })) unsub = categories_subscribe(user.uid, dispatch_cat, set_data_received)
    return () => unsub()
  }, [user, set_data_received, dispatch_cat, user.uid])

  return (
    <animated.div style={ani_style} className='wallet-categories'>
      <div onClick={close_categories} className='close-overlay'></div>
      <div className='categories-header'>
        <h4>Categories</h4>
      </div>
      {category_not_exist ? (
        <div
          className='categories-body'
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0 auto',
            fontWeight: 'bold',
          }}
        >
          <Spinner transition={transition} />
          Category does not exist.
        </div>
      ) : (
        <div className='categories-body'>
          <Spinner transition={transition} />
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
                        <span
                          style={{ display: `${is_edit ? 'initial' : 'none'}` }}
                          className='remove-category'
                          onClick={() => delete_category(category.id, is_details)}
                        >
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
      )}
      {is_new_category_name && (
        <NewCategoryInput add_category={add_category_m} toggle_new_category_input={toggle_new_category_input} />
      )}
      <div className='categories-footer'>
        <div
          onClick={() => {
            if (is_edit) set_is_edit(false)
            else set_is_edit(true)
          }}
        >
          {is_edit ? <DoneIcon className='close-icon' /> : <BlockIcon className='close-icon edit-icon' />}
        </div>
        <div onClick={close_categories}>
          <CloseIcon className='close-icon' />
        </div>
      </div>
    </animated.div>
  )
}

export default Categories
