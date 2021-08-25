import React, { useEffect } from 'react'
import CloseIcon from '@material-ui/icons/Close'
import { useState } from 'react'
import RSpring, { animated } from 'react-spring'
import rfdc from 'rfdc'
import { IWalletEntry } from '../../../context/reducers/fin_reducer'

interface INewCategoryInput {
  ani_style: { opacity: RSpring.SpringValue<number> }
  wallet_entry: IWalletEntry | undefined
  close_amount: (value: IWalletEntry | undefined) => void
}

const clone = rfdc()

const NewAmountInput = ({ ani_style, wallet_entry, close_amount }: INewCategoryInput) => {
  const [state, setState] = useState('')
  const input = React.createRef<HTMLInputElement>()

  const handle_input = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault()
    setState(e.currentTarget.value)
  }

  const close_and_save = () => {
    if (wallet_entry) {
      const new_wallet_entry = clone(wallet_entry)
      new_wallet_entry.amount = Number(state)
      close_amount(new_wallet_entry)
    } else {
      close_amount(undefined)
    }
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
    <animated.div style={ani_style} className='new-amount-input-cont'>
      <div onClick={close_and_save} className='close-overlay'></div>
      <h4>New Entry</h4>
      <input type='number' className='new-amount-input' onChange={handle_input} onKeyDown={press_enter} ref={input} />
      <div onClick={close_and_save}>
        <CloseIcon className='close-icon' />
      </div>
    </animated.div>
  )
}

export default NewAmountInput
