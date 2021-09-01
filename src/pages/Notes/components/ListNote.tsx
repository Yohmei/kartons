import DragIndicatorIcon from '@material-ui/icons/DragIndicator'
import React, { useCallback, useContext, useEffect } from 'react'
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'
import rfdc from 'rfdc'
import { Subject } from 'rxjs'
import { update_note_context } from '../../../context/actions/note_actions'
import { NoteContext } from '../../../context/NoteProvider'
import { INotePayload } from '../../../context/reducers/note_reducer'
import { remove_arr_item, replace_arr_item, s, setCaretIndex } from '../../../utils'

const clone = rfdc()

function ListNote({ subject }: { subject: Subject<INotePayload> }) {
  const { note_state, dispatch } = useContext(NoteContext)

  const set_note_content = useCallback(
    (content: string[]) => {
      const note = { ...note_state, content }
      subject.next(note)
      update_note_context(note, dispatch)
    },
    [dispatch, note_state, subject]
  )

  const remove_item = (id: number) => {
    set_note_content(remove_arr_item(note_state.content, id))
  }

  const type_list_item = (e: ContentEditableEvent, i: number) => {
    const input = e.target.value
    if (input !== null) note_state.content[i] = input
    set_note_content(clone(note_state.content))
  }

  const handle_item_key_press = (event: React.KeyboardEvent<HTMLDivElement>, i: number) => {
    const if_item_empty = note_state.content[i] === ''
    const prev_item = s(`#list-item-${i - 1}`) && s(`#list-item-${i - 1}`)
    const next_item = s(`#list-item-${i + 1}`) && s(`#list-item-${i + 1}`)

    if (event.key === 'ArrowDown')
      if (next_item) {
        event.preventDefault()
        next_item.focus()
        setCaretIndex(next_item, next_item.textContent?.length)
      }

    if (event.key === 'ArrowUp') {
      if (prev_item) {
        event.preventDefault()
        prev_item.focus()
        setCaretIndex(prev_item, prev_item.textContent?.length)
      } else {
        const el = s('#title')
        el.focus()
        setCaretIndex(el, el.textContent?.length)
      }
    }

    if (event.key === 'Backspace')
      if (if_item_empty && note_state.content.length !== 1) {
        event.preventDefault()
        remove_item(i)
        setTimeout(() => {
          if (prev_item) {
            prev_item.focus()
            setCaretIndex(prev_item, prev_item.textContent?.length)
          }
        }, 0)
      }

    if (event.key === 'Enter') {
      event.preventDefault()

      if (!if_item_empty) {
        set_note_content(replace_arr_item(note_state.content, i + 1, ''))

        setTimeout(() => {
          s(`#list-item-${i + 1}`).focus()
        }, 0)
      }
    }
  }

  const onDragEnd = ({ source, destination }: DropResult) => {
    note_state.content = replace_arr_item(
      note_state.content,
      destination!.index,
      note_state.content.splice(source.index, 1)[0]
    )
    const note = clone(note_state)
    subject.next(note)
    update_note_context(note, dispatch)
  }

  useEffect(() => {
    const el = s(`#list-item-${note_state.content.length - 1}`)
    el.focus()
    setCaretIndex(el, el.textContent?.length)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (note_state.content.length === 0) {
      note_state.content[0] = ''
      set_note_content(clone(note_state.content))

      setTimeout(() => {
        s(`#list-item-${0}`).focus()
      }, 0)
    }

    if (note_state.content.length !== 1) {
      if (
        note_state.content[note_state.content.length - 2] === '' &&
        note_state.content[note_state.content.length - 1] === ''
      ) {
        note_state.content.pop()
        set_note_content(clone(note_state.content))
      }
    }
  }, [note_state.content, set_note_content])

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className='note-cont'>
        <Droppable droppableId='droppable-1'>
          {(provided, _) => (
            <div className='note-body' ref={provided.innerRef} {...provided.droppableProps}>
              {note_state.content.map((item: string, i: number) => {
                return (
                  <Draggable key={i} draggableId={`draggable-${i}`} index={i}>
                    {(provided, _) => (
                      <div
                        className='list-note-container'
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        onKeyDown={(event) => {
                          handle_item_key_press(event, i)
                        }}
                      >
                        <span className='drag-indicator' {...provided.dragHandleProps}>
                          <DragIndicatorIcon />
                        </span>
                        <input
                          className={`checkbox-input${item === '' ? ' empty' : ''}`}
                          onClick={() => remove_item(i)}
                          type='checkbox'
                          name='my-checkbox'
                        />
                        {item === '' && <div className='list-item-label'>New Item</div>}
                        <ContentEditable
                          className='list-item'
                          id={`list-item-${i}`}
                          html={item}
                          onChange={(event) => {
                            type_list_item(event, i)
                          }}
                        />
                      </div>
                    )}
                  </Draggable>
                )
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  )
}

export default ListNote
