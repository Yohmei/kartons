import AspectRatioIcon from '@material-ui/icons/AspectRatio'
import equal from 'fast-deep-equal/es6/react'
import React, { useContext, useEffect } from 'react'
import Spinner from '../../../components/Spinner'
import { dash_note_subscribe, update_note } from '../../../context/actions/note_actions'
import { remove_arr_item } from '../../../utils'
import { AuthContext } from './../../../context/AuthProvider'
import { NoteContext } from './../../../context/NoteProvider'
import { IPageProps } from './../../Page'

interface FavNoteProps extends IPageProps {
  open_note: () => void
}

const FavNote = ({ open_note, data_state }: FavNoteProps) => {
  const { note_state, dispatch } = useContext(NoteContext)
  const { auth_state } = useContext(AuthContext)
  const { user } = auth_state

  const remove_item = () => {
    let content = remove_arr_item(note_state.content, 0)
    if (content.length === 0) content = ['']
    const note = { ...note_state, content }
    update_note(note)
  }

  useEffect(() => {
    let unsub = () => {}

    if (!equal(user, { uid: '' })) unsub = dash_note_subscribe(user.uid, dispatch, data_state.set_data_received)

    return () => unsub()
  }, [user, dispatch, data_state.set_data_received, data_state.data_received])

  return (
    <div className='item next-task'>
      <Spinner transition={data_state.transition} />
      <h4 className='item-header'>Next Task</h4>
      {(note_state.content.length === 1 && note_state.content[0] === '') || note_state.content.length === 0 ? (
        <div className='next-task-body'>
          <div>All done</div>
        </div>
      ) : (
        <div className='next-task-body'>
          <input className='checkbox-input' onClick={remove_item} type='checkbox' name='my-checkbox' />
          <span>{note_state.content[0]}</span>
        </div>
      )}
      <AspectRatioIcon className='expand-icon' onClick={open_note} />
    </div>
  )
}

export default FavNote
