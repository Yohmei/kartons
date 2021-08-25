import { useCallback, useState } from 'react'
import rfdc from 'rfdc'
import { ICategories } from '../../context/reducers/fin_reducer'
import { r_id } from '../../utils'

const clone = rfdc()

const categories: ICategories[] = [
  {
    id: r_id(),
    timestamp: new Date(),
    type: 'expenses',
    content: [
      {
        id: r_id(),
        name: 'food',
        details: [
          { id: r_id(), name: 'groceries' },
          { id: r_id(), name: 'restaurant' },
          { id: r_id(), name: 'other' },
        ],
      },
      {
        id: r_id(),
        name: 'house',
        details: [
          { id: r_id(), name: 'rent' },
          { id: r_id(), name: 'electricity' },
          { id: r_id(), name: 'water' },
        ],
      },
      {
        id: r_id(),
        name: 'transport',
        details: [
          { id: r_id(), name: 'fuel' },
          { id: r_id(), name: 'parking' },
          { id: r_id(), name: 'other' },
        ],
      },
      {
        id: r_id(),
        name: 'personal',
        details: [
          { id: r_id(), name: 'hobbies' },
          { id: r_id(), name: 'entertainment' },
          { id: r_id(), name: 'other' },
        ],
      },
      {
        id: r_id(),
        name: 'pet',
        details: [
          { id: r_id(), name: 'food' },
          { id: r_id(), name: 'medicine' },
          { id: r_id(), name: 'other' },
        ],
      },
      {
        id: r_id(),
        name: 'police',
        details: [
          { id: r_id(), name: 'fine' },
          { id: r_id(), name: 'other' },
        ],
      },
      {
        id: r_id(),
        name: 'medicine',
        details: [
          { id: r_id(), name: 'doctor' },
          { id: r_id(), name: 'pharmacy' },
          { id: r_id(), name: 'other' },
        ],
      },
    ],
  },
  {
    id: r_id(),
    timestamp: new Date(),
    type: 'income',
    content: [
      { id: r_id(), name: 'salary', details: [] },
      { id: r_id(), name: 'interest', details: [] },
      { id: r_id(), name: 'loan', details: [] },
    ],
  },
]

const useMockCategory = () => {
  const [categories_state, set_state] = useState(categories)
  const update_categories = useCallback(
    (new_category_name: string, type: 'expenses' | 'income') => {
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

      const new_state = clone(categories_state)

      set_state(new_state)
    },
    [categories_state]
  )

  const update_details = useCallback(
    (new_detail: string, type: 'expenses' | 'income', category_name: string) => {
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

      const new_state = clone(categories_state)

      set_state(new_state)
    },
    [categories_state]
  )

  return { categories_state, update_categories, update_details }
}

export default useMockCategory
