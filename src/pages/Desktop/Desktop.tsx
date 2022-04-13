import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { sign_out } from '../../context/actions/auth_actions'
import { AuthContext } from '../../context/AuthProvider'
import Dashboard from '../Dashboard/Dashboard'
import Finance from '../Finance/Finance'
import Notes from '../Notes/Notes'

const Desktop = () => {
  const router_hist = useHistory()
  const { dispatch } = useContext(AuthContext)

  const to_dashboard = () => {
    router_hist.push('/')
  }

  return (
    <div style={{ display: 'flex', height: '100%', padding: '10px 20px' }}>
      <Dashboard />
      <Notes />
      <Finance />
      <footer style={{ position: 'fixed', bottom: '10px', left: 0, display: 'flex' }}>
        <div className='back-button' onClick={() => router_hist.goBack()}></div>
        <div className='to-dashboard' onClick={() => to_dashboard()}></div>
        <div className='log-out-button' onClick={() => sign_out(dispatch)}></div>
      </footer>
    </div>
  )
}

export default Desktop
