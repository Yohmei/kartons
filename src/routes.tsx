import Dashboard from './pages/Dashboard/Dashboard'
import Desktop from './pages/Desktop/Desktop'
import Finance from './pages/Finance/Finance'
import Finances from './pages/Finance/Finances'
import Home from './pages/Home/Home'
import Note from './pages/Notes/Note'
import Notes from './pages/Notes/Notes'
import NotFound from './pages/NotFound/NotFound'

const routes = [
  {
    path: '/',
    component: Home,
    exact: true,
  },
  {
    path: '/dashboard',
    component: Dashboard,
    exact: true,
  },
  {
    path: '/finance',
    component: Finance,
    exact: true,
  },
  {
    path: '/finances',
    component: Finances,
    exact: false,
  },
  {
    path: '/notes',
    component: Notes,
    exact: true,
  },
  {
    path: '/note/:note_id',
    component: Note,
    exact: true,
  },
  { path: '/desktop', component: Desktop, exact: true },
  {
    path: '*',
    component: NotFound,
    status: 404,
  },
]

export default routes
