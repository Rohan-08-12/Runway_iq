import { createBrowserRouter, Navigate, useLocation } from 'react-router'
import { Layout } from './components/Layout'
import { Dashboard } from './screens/Dashboard'
import { Forecast } from './screens/Forecast'
import { Transactions } from './screens/Transactions'
import { WhatIf } from './screens/WhatIf'
import { Chat } from './screens/Chat'
import { Settings } from './screens/Settings'
import { Login } from './screens/Login'
import { Landing } from './screens/Landing'
import { Terms, Privacy } from './screens/Legal'
import { useAuth } from '../contexts/AuthContext'

// "/" is the landing page for logged-out visitors and the app shell for
// logged-in users. Logged-out visits to deep app routes bounce back to "/".
function RootGate() {
  const { session, loading } = useAuth()
  const { pathname } = useLocation()
  if (loading) return null
  if (session) return <Layout />
  if (pathname !== '/') return <Navigate to="/" replace />
  return <Landing />
}

export const router = createBrowserRouter([
  {
    // Old bookmarked URL — keep it working
    path: '/landing',
    element: <Navigate to="/" replace />,
  },
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/terms',
    Component: Terms,
  },
  {
    path: '/privacy',
    Component: Privacy,
  },
  {
    path: '/',
    element: <RootGate />,
    children: [
      { index: true, Component: Dashboard },
      { path: 'forecast', Component: Forecast },
      { path: 'transactions', Component: Transactions },
      { path: 'what-if', Component: WhatIf },
      { path: 'chat', Component: Chat },
      { path: 'settings', Component: Settings },
    ],
  },
])
