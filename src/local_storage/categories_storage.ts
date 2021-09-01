import { BehaviorSubject } from 'rxjs'
import { ICategoriesPayload } from '../context/reducers/categories_reducer'

export const get_local_categories = () => {
  const notes = localStorage.getItem('categories')
  if (notes) return JSON.parse(notes) as ICategoriesPayload[]
  else return [] as ICategoriesPayload[]
}

export const categories_observable = new BehaviorSubject<ICategoriesPayload[]>(get_local_categories())

export const set_local_categories = (local_categories: ICategoriesPayload[]) => {
  localStorage.setItem('categories', JSON.stringify(local_categories))
  categories_observable.next(get_local_categories())
}
