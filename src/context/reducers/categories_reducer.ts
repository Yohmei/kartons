import { r_id } from '../../utils'
import { ICategories } from './fin_reducer'

export const ini_state: ICategories[] = [
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

export interface ICategoriesPayload extends ICategories {}

export interface ICategoriesAction {
  type: string
  payload: ICategoriesPayload[]
}

const reducer = (state: ICategoriesPayload[], action: ICategoriesAction) => {
  const { type, payload } = action

  switch (type) {
    case 'UPDATE_CATEGORIES':
      return payload
    default:
      throw new Error()
  }
}

export default reducer
