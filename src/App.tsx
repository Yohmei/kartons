import 'normalize.css'
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import AuthProvider from './context/AuthProvider'
import CategoriesProvider from './context/CategoriesProvider'
import FinanceProvider from './context/FinanceProvider'
import NoteProvider from './context/NoteProvider'
import routes from './routes'
import './scss/styles.scss'

function App() {
  return (
    <div className='App'>
      <Route
        render={({ location }) => (
          <AuthProvider>
            <NoteProvider>
              <FinanceProvider>
                <CategoriesProvider>
                  <Switch location={location}>
                    {routes.map((route) => (
                      <Route key={route.path} path={route.path} exact={route.exact} component={route.component} />
                    ))}
                  </Switch>
                </CategoriesProvider>
              </FinanceProvider>
            </NoteProvider>
          </AuthProvider>
        )}
      />
    </div>
  )
}

export default App
