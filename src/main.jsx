import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import { StoreProvider } from './lib/store.jsx'
import Home from './pages/Home.jsx'
import NotFound from './pages/NotFound.jsx'
import './styles.css'

// admin ships as its own chunk, so shoppers never download it
const Admin = lazy(() => import('./admin/Admin.jsx'))

const Store = () => (
  <StoreProvider>
    <Outlet />
  </StoreProvider>
)

const router = createBrowserRouter([
  {
    path: '/admin/*',
    element: (
      <Suspense fallback={<div className="notfound"><p>Duke ngarkuar panelin…</p></div>}>
        <Admin />
      </Suspense>
    ),
  },
  {
    element: <Store />,
    children: [
      // product links render inside Home (as a modal) so filters and scroll survive
      { path: '/', element: <Home />, children: [{ path: 'p/:ref', element: null }] },
      { path: '*', element: <NotFound /> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
