import equal from 'fast-deep-equal/es6/react'
import React, { useContext, useState } from 'react'
import { Link, Redirect, useHistory } from 'react-router-dom'
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
      { url: '/skills', label: 'Skills' },
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

    const to_dashboard = () => {
      router_hist.push('/dashboard')
    }

    if (equal(user, { uid: '' }) && is_auth) return <Redirect to='/' />

    return (
      <main className={page_name}>
        <header>
          <h1>{page_name}</h1>
        </header>
        <Page data_state={{ data_received, set_data_received, transition }} />
        <nav>
          {links.map((link, i) => {
            return (
              <Link key={i} to={link.url}>
                {link.label}
              </Link>
            )
          })}
        </nav>
        <footer>
          <div className='back-button' onClick={() => router_hist.goBack()}></div>
          <div className='to-dashboard' onClick={() => to_dashboard()}></div>
          <div className='log-out-button' onClick={() => sign_out(dispatch)}></div>
        </footer>
      </main>
    )
  }
}

export default page_hoc
