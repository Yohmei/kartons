import React, { useContext, useEffect, useState } from 'react'
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'
import { Subject } from 'rxjs'
import { update_note_context } from '../../../context/actions/note_actions'
import { NoteContext } from '../../../context/NoteProvider'
import { INotePayload } from '../../../context/reducers/note_reducer'
import { getCaretIndex, s, setCaretIndex } from '../../../utils'

function TextNote({ subject }: { subject: Subject<INotePayload> }) {
  const re_open_div = new RegExp('<div>', 'g')
  const re_close_div = new RegExp('</div>', 'g')

  const { note_state, dispatch } = useContext(NoteContext)
  const [caret_pos, set_caret_pos] = useState<number>(0)

  const type_note_content = (e: ContentEditableEvent) => {
    let content = e.target.value
    let note = { ...note_state, content }
    subject.next(note)
    update_note_context(note, dispatch)
  }

  const focus_text = () => {
    s(`#text-note`).focus()
  }

  useEffect(() => {
    if (note_state.content.includes('<div>&nbsp;&nbsp;-&nbsp;</div>')) {
      setCaretIndex(s('#text-note'), caret_pos + 4)
    }

    if (note_state.content === '<br>') {
      let note = { ...note_state, content: '' }
      subject.next(note)
      update_note_context(note, dispatch)
    }
  }, [note_state, dispatch, subject, caret_pos])

  const handle_note_key_up_press = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowUp' && getCaretIndex(s('#text-note')) === 0) {
      const el = s('#title')
      el.focus()
      setCaretIndex(el, el.textContent?.length)
    }

    if (e.key === '-') {
      const arr_by_paragraph = note_state.content.replace(re_open_div, '~').replace(re_close_div, '').split('~')

      for (let i = 0; i < arr_by_paragraph.length; i++) {
        const element = arr_by_paragraph[i]
        let content = note_state.content

        if (element === '-') {
          if (i === 0) content = content.replace(new RegExp('-', 'g'), '&nbsp;&nbsp;-&nbsp;')
          else content = content.replace(new RegExp('<div>-</div>', 'g'), '<div>&nbsp;&nbsp;-&nbsp;</div>')
        }

        const note = { ...note_state, content }
        subject.next(note)
        update_note_context(note, dispatch)
      }
    }

    if (e.key === 'Enter') {
      set_caret_pos(getCaretIndex(s('#text-note')))
      const arr_by_paragraph = note_state.content.replace(re_open_div, '~').replace(re_close_div, '').split('~')

      for (let i = 0; i < arr_by_paragraph.length; i++) {
        const element = arr_by_paragraph[i]

        if (element === '<br>') {
          const prev_item = arr_by_paragraph[i - 1]
          let if_char1_dash = false

          if (prev_item) if_char1_dash = prev_item.trim().startsWith('&nbsp;&nbsp;-')

          let content = note_state.content

          if (prev_item === '<br>')
            content = content.replace(new RegExp('<div><br></div>', ''), '<div><br class="closed-br"></div>')

          if (if_char1_dash) content = content.replace(new RegExp('<br></div>', 'g'), '&nbsp;&nbsp;-&nbsp;</div>')

          if (prev_item === '&nbsp;&nbsp;-&nbsp;')
            content = content.replace(
              new RegExp('<div>&nbsp;&nbsp;-&nbsp;</div>', 'g'),
              '<div><br class="closed-br"></div>'
            )

          const note = { ...note_state, content }
          subject.next(note)
          update_note_context(note, dispatch)
        }
      }
    }
  }

  useEffect(() => {
    const el = s('#text-note')
    el.focus()
    setCaretIndex(el, el.textContent?.length)
  }, [])

  return (
    <div className='note-cont' onClick={focus_text}>
      <div className='note-body' onKeyUp={handle_note_key_up_press}>
        <ContentEditable id='text-note' html={note_state.content} disabled={false} onChange={type_note_content} />
      </div>
    </div>
  )
}

export default TextNote
