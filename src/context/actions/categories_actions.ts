import { Dispatch } from 'react'
import rfdc from 'rfdc'
import {
  categories_observable,
  get_local_categories,
  set_local_categories,
} from '../../local_storage/categories_storage'
import { remove_arr_item, r_id } from '../../utils'
import { ICategoriesAction, ICategoriesPayload } from '../reducers/categories_reducer'
import { ICategories } from '../reducers/fin_reducer'

const clone = rfdc()

export const update_categories_context = (
  categories: ICategoriesPayload[],
  dispatch: React.Dispatch<ICategoriesAction>
) => {
  dispatch({ type: 'UPDATE_CATEGORIES', payload: categories })
}

export const update_categories = (
  categories_state: ICategories[],
  new_category_name: string,
  type: 'expenses' | 'income'
) => {
  const new_category = {
    id: r_id(),
    name: new_category_name,
    details: [{ id: r_id(), name: '' }],
  }

  if (type === 'expenses') {
    const expenses = categories_state.find((category) => {
      return category.type === 'expenses'
    })

    if (expenses)
      expenses.content = expenses!.content.map((category) => {
        if (category.name === '') category = new_category
        return category
      })
  } else if (type === 'income') {
    const income = categories_state.find((category) => {
      return category.type === 'income'
    })

    if (income)
      income.content = income!.content.map((category) => {
        if (category.name === '') category = new_category
        return category
      })
  }

  set_local_categories(clone(categories_state))
}

export const update_details = (
  categories_state: ICategories[],
  new_detail: string,
  type: 'expenses' | 'income',
  category_name: string
) => {
  let categories

  if (type === 'expenses') {
    categories = categories_state.find((category) => {
      return category.type === 'expenses'
    })
  } else if (type === 'income') {
    categories = categories_state.find((category) => {
      return category.type === 'income'
    })
  }

  const category = categories?.content.find((category) => {
    return category.name === category_name
  })

  if (category)
    category.details = category!.details.map((detail) => {
      if (detail.name === '') detail = { id: r_id(), name: new_detail }
      return detail
    })

  set_local_categories(clone(categories_state))
}

export const delete_category = (category_id: string, is_details: boolean) => {
  let categories = get_local_categories()

  for (let i = 0; i < categories.length; i++) {
    const item = categories[i]

    for (let j = 0; j < item.content.length; j++) {
      const category = item.content[j]

      if (is_details) {
        for (let a = 0; a < category.details.length; a++) {
          const detail = category.details[a]

          if (detail.id === category_id) {
            category.details = remove_arr_item(category.details, a)
          }
        }
      } else {
        if (category.id === category_id) {
          item.content = remove_arr_item(item.content, j)
        }
      }
    }
  }

  set_local_categories(clone(categories))
}

export const categories_subscribe = (
  user_uid: string,
  dispatch: React.Dispatch<ICategoriesAction>,
  set_data_received: Dispatch<React.SetStateAction<boolean>>,
  is_offline: boolean | undefined
) => {
  let sub
  if (is_offline) {
    sub = categories_observable.subscribe((categories) => {
      set_data_received(true)
      update_categories_context(categories, dispatch)
    })

    return sub.unsubscribe.bind(sub)
  } else {
    return () => {}
  }
}
