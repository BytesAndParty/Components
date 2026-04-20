import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { Layout } from './layout'

const IndexPage = lazy(() => import('./pages/index').then(m => ({ default: m.IndexPage })))
const CardsPage = lazy(() => import('./pages/cards').then(m => ({ default: m.CardsPage })))
const TextPage = lazy(() => import('./pages/text').then(m => ({ default: m.TextPage })))
const IconsPage = lazy(() => import('./pages/icons').then(m => ({ default: m.IconsPage })))
const InputsPage = lazy(() => import('./pages/inputs').then(m => ({ default: m.InputsPage })))
const FeedbackPage = lazy(() => import('./pages/feedback').then(m => ({ default: m.FeedbackPage })))
const NavigationPage = lazy(() => import('./pages/navigation').then(m => ({ default: m.NavigationPage })))
const ShopPage = lazy(() => import('./pages/shop').then(m => ({ default: m.ShopPage })))
const TransitionsPage = lazy(() => import('./pages/transitions').then(m => ({ default: m.TransitionsPage })))

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Suspense><IndexPage /></Suspense> },
      { path: 'cards', element: <Suspense><CardsPage /></Suspense> },
      { path: 'text', element: <Suspense><TextPage /></Suspense> },
      { path: 'icons', element: <Suspense><IconsPage /></Suspense> },
      { path: 'inputs', element: <Suspense><InputsPage /></Suspense> },
      { path: 'feedback', element: <Suspense><FeedbackPage /></Suspense> },
      { path: 'navigation', element: <Suspense><NavigationPage /></Suspense> },
      { path: 'shop', element: <Suspense><ShopPage /></Suspense> },
      { path: 'transitions', element: <Suspense><TransitionsPage /></Suspense> },
    ],
  },
])

export function App() {
  return <RouterProvider router={router} />
}
