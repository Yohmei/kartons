import equal from 'fast-deep-equal/es6/react'
import React, { useContext } from 'react'
import { Redirect } from 'react-router-dom'
import { useTransition } from 'react-spring'
// @ts-ignore
import video_src from '../../assets/media/home-bg.mp4'
import Spinner from '../../components/Spinner'
import Video from '../../components/Video'
import { sign_in_google } from '../../context/actions/auth_actions'
import { AuthContext } from '../../context/AuthProvider'

const Home = () => {
  const { auth_state, dispatch } = useContext(AuthContext)
  const { user, is_auth } = auth_state
  const is_transition = is_auth ? true : false
  const transition = useTransition(is_transition, {
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  })

  if (!equal(user, { uid: '' }) && is_auth) return <Redirect to='/dashboard' />

  return (
    <>
      <Video video_src={video_src} />
      <Spinner transition={transition} />
      <main className='Home'>
        <footer>
          <div className='log-in-button' onClick={() => sign_in_google(dispatch)}></div>
        </footer>
      </main>
    </>
  )
}

export default Home
