import CloseIcon from '@material-ui/icons/Close'
import DoneOutlineIcon from '@material-ui/icons/DoneOutline'
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted'
import SaveIcon from '@material-ui/icons/Save'
import TextFieldsIcon from '@material-ui/icons/TextFields'
import equal from 'fast-deep-equal/es6/react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'
import { useHistory, useParams } from 'react-router-dom'
import rfdc from 'rfdc'
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import { delete_note, get_note, update_note, update_note_context } from '../../context/actions/note_actions'
import { AuthContext } from '../../context/AuthProvider'
import { NoteContext } from '../../context/NoteProvider'
import { INotePayload } from '../../context/reducers/note_reducer'
import { s, setCaretIndex, usePrevious } from '../../utils'
import page_hoc from '../Page'
import ListNote from './components/ListNote'
import TextNote from './components/TextNote'

type QueryParams = {
  note_id: string
}

const clone = rfdc()
const subject = new Subject<INotePayload>()
const observable = subject.pipe(debounceTime(1000))

const Note = () => {
  const re_open_div = new RegExp('<div>', 'g')
  const re_close_div = new RegExp('</div>', 'g')

  const route_history = useHistory()
  const { note_id } = useParams<QueryParams>()
  const [save_state, set_save_state] = useState('unsaved')
  const save_state_ref = useRef(save_state)
  const { note_state, dispatch } = useContext(NoteContext)
  const prev_note_state = usePrevious(clone(note_state))
  const { auth_state } = useContext(AuthContext)
  const { user } = auth_state

  const close_note = () => {
    if (
      !note_state.dashboard_note &&
      note_state.title === '' &&
      (note_state.content === '' || (note_state.content.length === 1 && note_state.content[0] === ''))
    )
      delete_note(note_id).then(() => route_history.goBack())
    else {
      route_history.goBack()
    }
  }

  const toggle_note = () => {
    if (note_state.note_type === 'list') {
      let content = ''

      for (let i = 0; i < note_state.content.length; i++) {
        const item = note_state.content[i]
        if (i === 0) content = content + item
        else content = content + `<div>${item}</div>`
      }

      const note = { ...note_state, note_type: 'text', content }
      subject.next(note)
      update_note_context(note, dispatch)
    } else if (note_state.note_type === 'text') {
      const content = note_state.content.replace(re_open_div, '~').replace(re_close_div, '').split('~')
      const note = { ...note_state, note_type: 'list', content }
      subject.next(note)
      update_note_context(note, dispatch)
    }
  }

  const type_title = (e: ContentEditableEvent) => {
    const title = e.target.value

    if (title !== null) {
      const note = { ...note_state, title }
      subject.next(note)
      update_note_context(note, dispatch)
    }
  }

  const press_enter_title = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === 'ArrowDown') {
      event.preventDefault()
      if (s(`#list-item-${0}`)) {
        const el = s(`#list-item-${0}`)
        el.focus()
        setCaretIndex(el, el.textContent?.length)
      } else {
        const el = s(`#text-note`)
        el.focus()
        setCaretIndex(el, el.textContent?.length)
      }
    }
  }

  useEffect(() => {
    if (note_state.id !== note_id)
      get_note(note_id).then((note) => {
        update_note_context(note, dispatch)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    let subscription = observable.subscribe()

    if (!equal(user, { uid: '' })) {
      subscription = observable.subscribe((note: INotePayload) => {
        update_note(note, set_save_state)
      })
    }

    return () => {
      subscription.unsubscribe()
    }
  }, [user, dispatch, note_id])

  useEffect(() => {
    let save_done_timeout = setTimeout(() => {}, 0)

    if (save_state === 'saved') {
      save_done_timeout = setTimeout(() => {
        if (save_state_ref.current !== 'saving') set_save_state('unsaved')
      }, 1000)
    }

    return () => clearTimeout(save_done_timeout)
  }, [save_state])

  useEffect(() => {
    if (typeof prev_note_state === 'object') {
      const pns = clone(prev_note_state!) as INotePayload
      const ns = clone(note_state)

      if (!equal(pns, ns) && pns.id[0] !== '_') {
        set_save_state('saving')
      }
    }
  }, [note_state, prev_note_state])

  return (
    <div className='content'>
      <div className='note-header' onKeyDown={press_enter_title}>
        {note_state.title === '' && <div className='title-label'>Title</div>}
        <ContentEditable id='title' html={note_state.title} disabled={false} onChange={type_title} />
      </div>
      <hr></hr>
      <div className='header-shadow'></div>
      {note_state.note_type === 'list' ? <ListNote subject={subject} /> : <TextNote subject={subject} />}
      <div className='button-cont'>
        {note_state.note_type === 'list' ? (
          <TextFieldsIcon
            className={`note-button toggle-note-button${
              save_state === 'saving' || note_state.dashboard_note ? ' disabled' : ''
            }`}
            onClick={toggle_note}
          />
        ) : (
          <FormatListBulletedIcon
            className={`note-button toggle-note-button${save_state === 'saving' ? ' disabled' : ''}`}
            onClick={toggle_note}
          />
        )}
        {save_state === 'unsaved' && <div className='note-button'></div>}
        {save_state === 'saving' && <SaveIcon className='note-button saving-icon' />}
        {save_state === 'saved' && <DoneOutlineIcon className='note-button saved-icon' />}
        <CloseIcon
          className={`note-button close-button ${save_state === 'saving' ? ' disabled' : ''}`}
          onClick={close_note}
        />
      </div>
    </div>
  )
}

export default page_hoc(Note, 'Note')
