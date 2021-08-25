import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { Dispatch } from 'react'
import { db } from '../../config/fb_config'
import { INoteAction, INotePayload } from '../reducers/note_reducer'

export const update_note_context = (payload: INotePayload, dispatch: React.Dispatch<INoteAction>) => {
  dispatch({ type: 'UPDATE_NOTE', payload })
}

export const create_new_note = async (
  user_uid: string,
  { is_list, is_dashboard }: { is_list: boolean; is_dashboard?: boolean }
) => {
  let note: INotePayload = {
    id: '',
    uid: user_uid,
    title: '',
    note_type: 'text',
    content: '',
    dashboard_note: false,
    timestamp: new Date(),
  }

  if (is_list) {
    note = { ...note, note_type: 'list', content: [''] }
    if (is_dashboard) note = { ...note, dashboard_note: true }
  }

  const doc_ref = (await addDoc(collection(db, 'notes'), note).catch((err) => {
    console.log(err)
  })) as DocumentReference<DocumentData>

  return doc_ref.id
}

export const delete_note = async (note_id: string) => {
  await deleteDoc(doc(db, 'notes', note_id))
}

export const update_note = async (note: INotePayload, set_save_state?: Dispatch<React.SetStateAction<string>>) => {
  await updateDoc(doc(db, 'notes', note.id), { ...note, timestamp: new Date() }).catch((err) => {
    console.log(err)
  })

  if (set_save_state) set_save_state('saved')
}

export const get_note = async (note_id: string) => {
  let payload: INotePayload

  const note = await getDoc(doc(db, 'notes', note_id))
  const note_data = note.data() as INotePayload
  payload = { ...note_data, id: note.id }

  return payload
}

export const notes_subscribe = (
  user_uid: string,
  set_notes_state: Dispatch<React.SetStateAction<INotePayload[]>>,
  set_data_received: Dispatch<React.SetStateAction<boolean>>
) => {
  const q = query(collection(db, 'notes'), where('uid', '==', user_uid), orderBy('timestamp', 'desc'))

  const unsub = onSnapshot(q, (snapshot) => {
    const notes = []

    for (let item of snapshot.docs) {
      const note_data = item.data() as INotePayload
      const { uid, dashboard_note } = note_data
      const payload = { ...note_data, id: item.id }

      if (uid === user_uid && !dashboard_note) notes.push(payload)
    }

    set_notes_state(notes)
    set_data_received(true)
  })

  return unsub
}

export const dash_note_subscribe = (
  user_uid: string,
  dispatch: React.Dispatch<INoteAction>,
  set_data_received: Dispatch<React.SetStateAction<boolean>>
) => {
  const q = query(collection(db, 'notes'), where('uid', '==', user_uid), where('dashboard_note', '==', true))

  const unsub = onSnapshot(q, (snapshot) => {
    if (snapshot.docs[0]) {
      const doc = snapshot.docs[0]
      const payload = doc.data() as INotePayload
      payload.id = doc.id
      set_data_received(true)
      update_note_context(payload, dispatch)
    } else {
      create_new_note(user_uid, { is_list: true, is_dashboard: true })
    }
  })

  return unsub
}
