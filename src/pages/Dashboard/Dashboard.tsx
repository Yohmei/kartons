import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { NoteContext } from '../../context/NoteProvider'
import page_hoc, { IPageProps } from '../Page'
import { AuthContext } from './../../context/AuthProvider'
import FavNote from './components/FavNote'
import WalletSummary from './components/WalletSummary'

const Dashboard = ({ data_state }: IPageProps) => {
  const { note_state } = useContext(NoteContext)
  const route_history = useHistory()
  const { auth_state } = useContext(AuthContext)
  const { user } = auth_state

  const open_note = () => {
    if (user) route_history.push(`/note/${note_state.id}`)
  }

  return (
    <div className='content'>
      <div className='items-container'>
        <WalletSummary />
        <FavNote data_state={data_state} open_note={open_note} />
      </div>
    </div>
  )
}

export default page_hoc(Dashboard, 'Dashboard')
