import React, { useEffect } from 'react'
import CloseIcon from '@material-ui/icons/Close'
import { useState } from 'react'

interface INewCategoryInput {
  add_category: (new_category_name: string) => void
  toggle_new_category_input: () => void
}

const NewCategoryInput = ({ add_category, toggle_new_category_input }: INewCategoryInput) => {
  const [state, setState] = useState('')
  const input = React.createRef<HTMLInputElement>()

  const handle_input = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault()
    setState(e.currentTarget.value)
  }

  const close_and_save = () => {
    toggle_new_category_input()
    add_category(state)
  }

  const press_enter = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      close_and_save()
    }
  }

  useEffect(() => {
    if (input) input.current!.focus()
  }, [input])

  return (
    <div className='new-category-input-cont'>
      <div onClick={close_and_save} className='close-overlay'></div>
      <h4>New Entry</h4>
      <input type='text' className='new-category-input' onChange={handle_input} onKeyDown={press_enter} ref={input} />
      <div onClick={close_and_save}>
        <CloseIcon className='close-icon' />
      </div>
    </div>
  )
}

export default NewCategoryInput
