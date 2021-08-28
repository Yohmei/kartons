import React, { useContext, useEffect } from 'react'
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'
import { Subject } from 'rxjs'
import { update_note_context } from '../../../context/actions/note_actions'
import { NoteContext } from '../../../context/NoteProvider'
import { INotePayload } from '../../../context/reducers/note_reducer'
import { s } from '../../../utils'

function TextNote({ subject }: { subject: Subject<INotePayload> }) {
  const re_open_div = new RegExp('<div>', 'g')
  const re_close_div = new RegExp('</div>', 'g')

  const { note_state, dispatch } = useContext(NoteContext)

  const type_note_content = (e: ContentEditableEvent) => {
    let content = e.target.value
    let note = { ...note_state, content }
    subject.next(note)
    update_note_context(note, dispatch)
  }

  const focus_text = () => {
    s('#text-note').focus()
  }

  const handle_note_key_up_press = (e: React.KeyboardEvent<HTMLDivElement>) => {
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
      const arr_by_paragraph = note_state.content.replace(re_open_div, '~').replace(re_close_div, '').split('~')

      for (let i = 0; i < arr_by_paragraph.length; i++) {
        const element = arr_by_paragraph[i]

        if (element === '<br>') {
          const prev_item = arr_by_paragraph[i - 1]
          let if_char1_dash = false

          if (prev_item) if_char1_dash = prev_item.trim().startsWith('&nbsp;&nbsp;-')
          else if_char1_dash = false

          let content = note_state.content

          if (if_char1_dash) content = content.replace(new RegExp('<br></div>$', 'g'), '&nbsp;&nbsp;-&nbsp;</div>')

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
    s('#title').focus()
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
