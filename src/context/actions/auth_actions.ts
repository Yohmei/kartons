import { db } from '../../config/fb_config'
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithRedirect, signOut, User } from 'firebase/auth'
import { IAuthAction } from '../reducers/auth_reducer'
import { getDoc, doc } from 'firebase/firestore'

export interface IUser extends User {
  profile?: any
}

const auth = getAuth()

export const init_auth = function (dispatch: React.Dispatch<IAuthAction>) {
  return onAuthStateChanged(auth, async function (f_user) {
    if (f_user) {
      const user: IUser = f_user
      const document = await getDoc(doc(db, 'users', user.uid))
      user.profile = document.data()
      dispatch({ type: 'INIT_AUTH', payload: { user, is_auth: true } })
    } else {
      dispatch({ type: 'INIT_AUTH', payload: { user: { uid: '' }, is_auth: true } })
    }
  })
}

export const sign_in_google = async function (dispatch: React.Dispatch<IAuthAction>) {
  try {
    const base_provider = new GoogleAuthProvider()
    await signInWithRedirect(auth, base_provider)
  } catch (err) {
    dispatch({ type: 'THROW_ERROR', payload: { user: { uid: '' }, is_auth: true, err } })
  }
}

export const sign_out = async function (dispatch: React.Dispatch<IAuthAction>) {
  try {
    await signOut(auth)
  } catch (err) {
    dispatch({ type: 'THROW_ERROR', payload: { user: { uid: '' }, is_auth: true, err } })
  }
}
