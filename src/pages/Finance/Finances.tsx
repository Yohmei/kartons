import equal from 'fast-deep-equal/es6/react'
import React, { useContext, useEffect, useState } from 'react'
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom'
import Spinner from '../../components/Spinner'
import { get_finance } from '../../context/actions/fin_actions'
import { AuthContext } from '../../context/AuthProvider'
import { IWallet } from '../../context/reducers/fin_reducer'
import page_hoc, { IPageProps } from '../Page'
import FinDetails from './components/FinDetails'

const Finances = ({ data_state }: IPageProps) => {
  let { path, url } = useRouteMatch()
  const [fin_state, set_fin_state] = useState<IWallet[]>([])
  const { auth_state } = useContext(AuthContext)
  const { user } = auth_state

  useEffect(() => {
    if (!equal(user, { uid: '' })) get_finance(user.uid, set_fin_state, data_state.set_data_received)
  }, [user, set_fin_state, data_state.set_data_received])

  return (
    <Switch>
      <Route path={`${path}/:year`} exact={true}>
        <FinDetails fin_state={fin_state} transition={data_state.transition} />
      </Route>
      <Route path={path}>
        <div className='content'>
          <Spinner transition={data_state.transition} />
          <div className='cont'>
            {fin_state.map((wallet) => {
              return (
                <div key={wallet.id} className='list-item'>
                  <h4>
                    <Link to={`${url}/${wallet.year}`}>Year {wallet.year}</Link>
                  </h4>
                </div>
              )
            })}
          </div>
        </div>
      </Route>
    </Switch>
  )
}

export default page_hoc(Finances, 'Finances')
