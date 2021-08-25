import { Dispatch } from 'react'
import rfdc from 'rfdc'
import { BehaviorSubject } from 'rxjs'
import { ini_note, INotePayload } from '../context/reducers/note_reducer'
import { remove_arr_item } from '../utils'

const clone = rfdc()

const get_local_notes = () => {
  const notes = localStorage.getItem('notes')
  if (notes) return JSON.parse(notes) as INotePayload[]
  else return []
}

export const notes_observable = new BehaviorSubject<INotePayload[]>(get_local_notes())

export const set_local_notes = (local_notes: INotePayload[]) => {
  localStorage.setItem('notes', JSON.stringify(local_notes))
  notes_observable.next(get_local_notes())
}

export const add_local_note = (note: INotePayload) => {
  const notes = clone(get_local_notes())
  notes.push(note)
  set_local_notes(notes)
}

export const delete_local_note = (note_id: string) => {
  let notes = get_local_notes()

  for (let i = 0; i < notes.length; i++) {
    const item = notes[i]

    if (item.id === note_id) {
      set_local_notes(remove_arr_item(notes, i))
    }
  }
}

export const update_local_note = (note: INotePayload, set_save_state?: Dispatch<React.SetStateAction<string>>) => {
  const notes = clone(get_local_notes())

  for (let i = 0; i < notes.length; i++) {
    const item = notes[i]

    if (item.id === note.id) {
      notes[i] = note
    }
  }

  set_local_notes(notes)
  if (set_save_state) set_save_state('saved')
}

export const get_local_note = (note_id: string | undefined) => {
  const notes = clone(get_local_notes())
  let note: INotePayload
  note = notes.filter((note) => note.id === note_id)[0]

  if (note) return note
  else return ini_note
}
