// import loadable from '@loadable/component'
// import React from 'react'
import Dashboard from './pages/Dashboard/Dashboard'
import Finance from './pages/Finance/Finance'
import Finances from './pages/Finance/Finances'
import Skills from './pages/Skills/Skills'
import Home from './pages/Home/Home'
import Note from './pages/Notes/Note'
import Notes from './pages/Notes/Notes'
import NotFound from './pages/NotFound/NotFound'

// const Home = loadable(() => import('./pages/Home/Home'), {
//   fallback: <div className='loadable-fallback'></div>,
// })
// const Dashboard = loadable(() => import('./pages/Dashboard/Dashboard'), {
//   fallback: <div className='loadable-fallback'></div>,
// })
// const Finance = loadable(() => import('./pages/Dashboard/Finance/Finance'), {
//   fallback: <div className='loadable-fallback'></div>,
// })
// const Notes = loadable(() => import('./pages/Notes/Notes'), {
//   fallback: <div className='loadable-fallback'></div>,
// })
// const Note = loadable(() => import('./pages/Notes/Note'), {
//   fallback: <div className='loadable-fallback'></div>,
// })
// const Skills = loadable(() => import('./pages/Dashboard/Skills/Skills'), {
//   fallback: <div className='loadable-fallback'></div>,
// })
// const NotFound = loadable(() => import('./pages/NotFound/NotFound'), {
//   fallback: <div className='loadable-fallback'></div>,
// })

const routes = [
  {
    path: '/',
    component: Home,
    name: 'Home',
    exact: true,
  },
  {
    path: '/dashboard',
    component: Dashboard,
    name: 'Dashboard',
    exact: true,
  },
  {
    path: '/finance',
    component: Finance,
    name: 'Finance',
    exact: true,
  },
  {
    path: '/finances',
    component: Finances,
    name: 'Finances',
    exact: true,
  },
  {
    path: '/notes',
    component: Notes,
    name: 'Notes',
    exact: true,
  },
  {
    path: '/note/:note_id',
    component: Note,
    name: 'Note',
    exact: true,
  },
  {
    path: '/skills',
    component: Skills,
    name: 'Skills',
    exact: true,
  },
  {
    path: '*',
    component: NotFound,
    status: 404,
  },
]

export default routes
