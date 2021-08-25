import React, { createContext, useReducer } from 'react'
import note_reducer, { ini_note, INoteAction, INotePayload } from './reducers/note_reducer'

const initial_context: { note_state: INotePayload; dispatch: React.Dispatch<INoteAction> } = {
  note_state: ini_note,
  dispatch: () => {},
}

export const NoteContext = createContext(initial_context)

const NoteProvider = ({ children }: any) => {
  const [note_state, dispatch] = useReducer(note_reducer, ini_note)

  return <NoteContext.Provider value={{ note_state, dispatch }}>{children}</NoteContext.Provider>
}

export default NoteProvider
