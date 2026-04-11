import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { LayoutWithProviders } from './layout'

const WineListPage = lazy(() => import('./pages/wine-list').then(m => ({ default: m.WineListPage })))
const WineDetailPage = lazy(() => import('./pages/wine-detail').then(m => ({ default: m.WineDetailPage })))
const CartPage = lazy(() => import('./pages/cart').then(m => ({ default: m.CartPage })))
const AdminInfoPage = lazy(() => import('./pages/admin-info').then(m => ({ default: m.AdminInfoPage })))

const router = createBrowserRouter([
  {
    element: <LayoutWithProviders />,
    children: [
      { index: true, element: <Suspense><WineListPage /></Suspense> },
      { path: 'wine/:slug', element: <Suspense><WineDetailPage /></Suspense> },
      { path: 'cart', element: <Suspense><CartPage /></Suspense> },
      { path: 'admin-info', element: <Suspense><AdminInfoPage /></Suspense> },
    ],
  },
])

export function App() {
  return <RouterProvider router={router} />
}
