import { r_id } from '../../utils'

export type INotePayload = {
  id: string
  uid: string
  title: string
  note_type: string
  content: any
  dashboard_note: boolean
  timestamp: Date
}

export interface INoteDB {
  id: string
  uid: string
  device_ids: string[]
  notes: INotePayload[]
  timestamp: Date
}

export interface INoteAction {
  type: string
  payload: INotePayload
}

export const ini_note: INotePayload = {
  id: r_id(),
  uid: '',
  title: '',
  note_type: 'text',
  content: '',
  dashboard_note: false,
  timestamp: new Date(),
}

const reducer = (state: INotePayload, action: INoteAction) => {
  const { type, payload } = action

  switch (type) {
    case 'UPDATE_NOTE':
      return payload
    default:
      throw new Error()
  }
}

export default reducer
