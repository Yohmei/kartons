import { addDoc, collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore'
import { Dispatch } from 'react'
import rfdc from 'rfdc'
import { db } from '../../config/fb_config'
import {
  categories_observable,
  get_local_categories,
  set_local_categories,
} from '../../local_storage/categories_storage'
import { remove_arr_item, r_id } from '../../utils'
import { ICategoriesAction, ICategoriesPayload, ini_state } from '../reducers/categories_reducer'
import { ICategories } from '../reducers/fin_reducer'

const clone = rfdc()

export const update_categories_context = (
  categories: ICategoriesPayload[],
  dispatch: React.Dispatch<ICategoriesAction>
) => {
  dispatch({ type: 'UPDATE_CATEGORIES', payload: categories })
}

const set_categories = (categories: ICategories[]) => {
  set_local_categories(categories)
  for (const cat of categories) {
    updateDoc(doc(db, 'categories', cat.id), { ...cat, timestamp: new Date() }).catch((err) => {
      console.log(err)
    })
  }
}

export const add_category = (new_category_name: string, type: 'expenses' | 'income') => {
  const categories_state = get_local_categories()
  const new_category = {
    id: r_id(),
    name: new_category_name,
    details: [{ id: r_id(), name: '' }],
  }

  if (type === 'expenses') {
    const expenses = categories_state.find((category) => {
      return category.type === 'expenses'
    })

    if (expenses) {
      const is_empty_field = expenses!.content.find((category) => {
        return category.name === ''
      })

      if (is_empty_field)
        expenses.content = expenses!.content.map((category) => {
          if (category.name === '') category = new_category
          return category
        })
      else expenses.content.push(new_category)
    }
  } else if (type === 'income') {
    const income = categories_state.find((category) => {
      return category.type === 'income'
    })

    if (income) {
      const is_empty_field = income!.content.find((category) => {
        return category.name === ''
      })

      if (is_empty_field)
        income.content = income!.content.map((category) => {
          if (category.name === '') category = new_category
          return category
        })
      else income.content.push(new_category)
    }
  }

  set_categories(categories_state)
}

export const add_detail = (new_detail: string, type: 'expenses' | 'income', category_name: string) => {
  const categories_state = get_local_categories()
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

  if (category) {
    const is_empty_field = category!.details.find((detail) => {
      return detail.name === ''
    })

    if (is_empty_field)
      category.details = category!.details.map((detail) => {
        if (detail.name === '') detail = { id: r_id(), name: new_detail }
        return detail
      })
    else category.details.push({ id: r_id(), name: new_detail })
  }

  set_categories(categories_state)
}

export const delete_category = (category_id: string, is_details: boolean) => {
  const categories = get_local_categories()

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

  set_categories(categories)
}

export const add_new_categories = async (user_uid: string) => {
  const categories = clone(ini_state)
  for (let cat of categories) {
    cat.uid = user_uid
    addDoc(collection(db, 'categories'), cat).catch((err) => {
      console.log(err)
    })
  }
}

export const categories_subscribe = (
  user_uid: string,
  dispatch: React.Dispatch<ICategoriesAction>,
  set_data_received: Dispatch<React.SetStateAction<boolean>>
) => {
  const q = query(collection(db, 'categories'), where('uid', '==', user_uid))

  const unsub = onSnapshot(q, (snapshot) => {
    if (snapshot.docs[0]) {
      const categories = [] as ICategoriesPayload[]

      for (const doc of snapshot.docs) {
        const category = doc.data() as ICategoriesPayload
        category.id = doc.id
        categories.push(category)
      }

      set_local_categories(categories)
      update_categories_context(categories, dispatch)
      set_data_received(true)
    } else {
      add_new_categories(user_uid)
    }
  })

  return unsub
}

export const categories_subscribe_local = (
  user_uid: string,
  dispatch: React.Dispatch<ICategoriesAction>,
  set_data_received: Dispatch<React.SetStateAction<boolean>>
) => {
  let sub
  sub = categories_observable.subscribe((categories) => {
    update_categories_context(categories, dispatch)
    set_data_received(true)
  })

  return sub.unsubscribe.bind(sub)
}
