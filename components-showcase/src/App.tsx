import { useEffect, lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider, useLocation, useNavigationType } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HotkeysProvider } from '@components/hotkeys/hotkeys-provider'
import { AtelierProvider } from '@components/atelier'
import { Layout } from './layout'

// Route-level code splitting: each page lands in its own chunk so the
// initial bundle only carries the index page + provider chain.
const IndexPage       = lazy(() => import('./pages/index').then(m => ({ default: m.IndexPage })))
const CardsPage       = lazy(() => import('./pages/cards').then(m => ({ default: m.CardsPage })))
const TextPage        = lazy(() => import('./pages/text').then(m => ({ default: m.TextPage })))
const IconsPage       = lazy(() => import('./pages/icons').then(m => ({ default: m.IconsPage })))
const InputsPage      = lazy(() => import('./pages/inputs').then(m => ({ default: m.InputsPage })))
const FeedbackPage    = lazy(() => import('./pages/feedback').then(m => ({ default: m.FeedbackPage })))
const NavigationPage  = lazy(() => import('./pages/navigation').then(m => ({ default: m.NavigationPage })))
const ShopPage        = lazy(() => import('./pages/shop').then(m => ({ default: m.ShopPage })))
const TransitionsPage = lazy(() => import('./pages/transitions').then(m => ({ default: m.TransitionsPage })))
const DesignerPage    = lazy(() => import('./pages/designer').then(m => ({ default: m.DesignerPage })))
const DataPage        = lazy(() => import('./pages/data').then(m => ({ default: m.DataPage })))
const WineDetailPage  = lazy(() => import('./pages/wine-detail').then(m => ({ default: m.WineDetailPage })))

const queryClient = new QueryClient()

// Native scroll restoration (auto) handles refresh + back/forward.
// Only PUSH navigation needs an explicit reset.
function ScrollToTopOnPush() {
  const { pathname } = useLocation()
  const type = useNavigationType()
  useEffect(() => {
    if (type === 'PUSH') window.scrollTo(0, 0)
  }, [pathname, type])
  return null
}

function PageFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="text-muted-foreground flex h-32 items-center justify-center text-sm"
    >
      <span className="sr-only">Lade Seite</span>
    </div>
  )
}

function withSuspense(node: React.ReactNode) {
  return <Suspense fallback={<PageFallback />}>{node}</Suspense>
}

const router = createBrowserRouter([
  {
    element: (
      <>
        <Layout />
        <ScrollToTopOnPush />
      </>
    ),
    children: [
      { index: true,           element: withSuspense(<IndexPage />) },
      { path: 'cards',         element: withSuspense(<CardsPage />) },
      { path: 'text',          element: withSuspense(<TextPage />) },
      { path: 'icons',         element: withSuspense(<IconsPage />) },
      { path: 'inputs',        element: withSuspense(<InputsPage />) },
      { path: 'feedback',      element: withSuspense(<FeedbackPage />) },
      { path: 'navigation',    element: withSuspense(<NavigationPage />) },
      { path: 'shop',          element: withSuspense(<ShopPage />) },
      { path: 'data',          element: withSuspense(<DataPage />) },
      { path: 'transitions',   element: withSuspense(<TransitionsPage />) },
      { path: 'designer',      element: withSuspense(<DesignerPage />) },
      { path: 'wine/:slug',    element: withSuspense(<WineDetailPage />) },
    ],
  },
])

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AtelierProvider>
        <HotkeysProvider>
          <RouterProvider router={router} />
        </HotkeysProvider>
      </AtelierProvider>
    </QueryClientProvider>
  )
}
