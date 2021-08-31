import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import equal from 'fast-deep-equal/es6/react'
import React, { useContext, useEffect, useState } from 'react'
// @ts-ignore
import LinesEllipsis from 'react-lines-ellipsis'
import { useHistory } from 'react-router-dom'
import {
  create_new_note,
  delete_note,
  get_note,
  notes_subscribe,
  update_note_context,
} from '../../context/actions/note_actions'
import { AuthContext } from '../../context/AuthProvider'
import { ini_note, INotePayload } from '../../context/reducers/note_reducer'
import page_hoc from '../Page'
import { NoteContext } from './../../context/NoteProvider'
import { IPageProps } from './../Page'

const Notes = ({ data_state }: IPageProps) => {
  const new_note_ref = React.createRef<HTMLDivElement>()
  const notes_content_ref = React.createRef<HTMLDivElement>()
  const [state, set_state] = useState<INotePayload[]>([ini_note, ini_note, ini_note])
  const { dispatch } = useContext(NoteContext)
  const { auth_state } = useContext(AuthContext)
  const { user } = auth_state
  const router_hist = useHistory()

  const cre_open_note = (is_list: boolean) => {
    create_new_note(user.uid, { is_list }).then((note_id) => {
      get_note(note_id).then((payload) => {
        update_note_context(payload, dispatch)
        router_hist.push(`/note/${note_id}`)
      })
    })
  }

  const open_note = (id: string | undefined) => {
    if (id) {
      update_note_context(state.filter((note) => note.id === id)[0], dispatch)
      router_hist.push(`/note/${id}`)
    }
  }

  const del_note = (note_id: string | undefined) => {
    if (note_id) delete_note(note_id)
  }

  useEffect(() => {
    const notes_content_div = notes_content_ref.current as HTMLDivElement
    const new_note_btn = new_note_ref.current as HTMLDivElement

    notes_content_div.onscroll = function (ev: any) {
      if (notes_content_div.scrollHeight - notes_content_div.clientHeight <= Math.ceil(notes_content_div.scrollTop)) {
        new_note_btn.style.display = 'none'
      } else {
        if (new_note_btn.style.display === 'none') new_note_btn.style.display = 'flex'
      }
    }

    return () => {
      notes_content_div.onscroll = () => {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    let unsub = () => {}

    if (!equal(user, { uid: '' })) unsub = notes_subscribe(user.uid, set_state, data_state.set_data_received)

    return () => unsub()
  }, [set_state, user, data_state.set_data_received, data_state])

  return (
    <div className='content' ref={notes_content_ref}>
      {state.map((note, i) => {
        if (typeof note.content === 'string')
          return (
            <div className='note-block' key={i}>
              <div className='note-cont' onClick={() => open_note(note.id)}>
                {note.title !== '' && <h4>{note.title}</h4>}
                {note.title !== '' || note.content !== '' ? (
                  <div className='note-body'>
                    <LinesEllipsis
                      text={note.content
                        .replaceAll('<div>', '\n')
                        .replaceAll('</div>', '')
                        .replaceAll('<br>', '')
                        .replaceAll('<br class="closed-br">', '')
                        .replaceAll('&nbsp;', ' ')}
                      maxLine='6'
                      ellipsis=' 🚩🚩🚩'
                      trimRight
                    />
                  </div>
                ) : (
                  <div className='loading-body'>
                    <div className='loading-title'></div>
                    <div className='loading-content'></div>
                  </div>
                )}
              </div>
              <div className='icon-cont'>
                <DeleteForeverIcon onClick={() => del_note(note.id)} className='icon delete-note' />
              </div>
            </div>
          )
        else
          return (
            <div className='note-block' key={i}>
              <div className='note-cont' onClick={() => open_note(note.id)}>
                {note.title !== '' && <h4>{note.title}</h4>}
                {note.title !== '' || note.content !== '' ? (
                  <div className='note-body'>
                    {note.content.map((content: string, i: number) => {
                      if (i < 6) {
                        if (i === 0 && content === '') return <div key={i}></div>
                        else
                          return (
                            <div key={i} className='list-note-container'>
                              {i !== 5 && <input className='checkbox-input' type='checkbox' name='my-checkbox' />}
                              <span style={i === 5 ? { paddingLeft: '10px' } : {}}>{i === 5 ? '🤸🤸🤸' : content}</span>
                            </div>
                          )
                      } else return <div key={i}></div>
                    })}
                  </div>
                ) : (
                  <div className='loading-body'>
                    <div className='loading-title'></div>
                    <div className='loading-content'></div>
                  </div>
                )}
              </div>
              <div className='icon-cont'>
                <DeleteForeverIcon onClick={() => del_note(note.id)} className='icon delete-note' />
              </div>
            </div>
          )
      })}
      <div className='new-note' ref={new_note_ref}>
        <button onClick={() => cre_open_note(false)}>New</button>
      </div>
    </div>
  )
}

export default page_hoc(Notes, 'Notes')
