export const ini_state = {
  user: { uid: '' },
  is_auth: false,
}

export interface IAuthPayload {
  user: any
  is_auth: boolean
  err?: any
}

export interface IAuthAction {
  type: string
  payload: IAuthPayload
}

const reducer = (state: IAuthPayload, action: IAuthAction) => {
  const { type, payload } = action
  const { err } = payload

  switch (type) {
    case 'INIT_AUTH':
      return payload
    case 'THROW_ERROR':
      return { ...state, err: err.message }
    default:
      throw new Error()
  }
}

export default reducer
