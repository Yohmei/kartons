import equal from 'fast-deep-equal/es6/react'
import React, { useContext, useState } from 'react'
import { Link, Redirect, useHistory, useLocation } from 'react-router-dom'
import RSpring, { useTransition } from 'react-spring'
import { sign_out } from '../context/actions/auth_actions'
import { AuthContext } from '../context/AuthProvider'

export interface IDataState {
  data_received: boolean
  set_data_received: React.Dispatch<React.SetStateAction<boolean>>
  transition: RSpring.TransitionFn<boolean, { opacity: number }>
}

export interface IPageProps {
  data_state: IDataState
}

const page_hoc = (Page: React.FunctionComponent<IPageProps>, page_name: string) => {
  return () => {
    const links = [
      { url: '/notes', label: 'Notes' },
      { url: '/finance', label: 'Finance' },
    ]

    const [data_received, set_data_received] = useState(false)
    const transition = useTransition(data_received, {
      enter: { opacity: 1 },
      leave: { opacity: 0 },
      config: { duration: 150 },
    })
    const { auth_state, dispatch } = useContext(AuthContext)
    const { user, is_auth } = auth_state
    const router_hist = useHistory()
    const location = useLocation()

    const to_dashboard = () => {
      router_hist.push('/')
    }

    if (equal(user, { uid: '' }) && is_auth) return <Redirect to='/' />

    return (
      <main className={page_name}>
        <header>
          <h1>{page_name}</h1>
        </header>
        <Page data_state={{ data_received, set_data_received, transition }} />
        {window.innerWidth < 768 && (
          <nav>
            {links.map((link, i) => {
              return (
                <Link key={i} to={link.url}>
                  {link.label}
                </Link>
              )
            })}
          </nav>
        )}
        {(window.innerWidth < 768 || location.pathname.includes('finance')) && (
          <footer style={{ marginTop: 'auto' }}>
            <div className='back-button' onClick={() => router_hist.goBack()}></div>
            <div className='to-dashboard' onClick={() => to_dashboard()}></div>
            <div className='log-out-button' onClick={() => sign_out(dispatch)}></div>
          </footer>
        )}
      </main>
    )
  }
}

export default page_hoc
