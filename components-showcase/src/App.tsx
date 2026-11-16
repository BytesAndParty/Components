import { useEffect, lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, RouterProvider, useLocation, useNavigationType } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HotkeysProvider } from '@components/hotkeys/hotkeys-provider'
import { AtelierProvider } from '@components/atelier'
import { Layout } from './layout'

// Route-level code splitting: each page lands in its own chunk so the
// initial bundle only carries the index page + provider chain.
import { IndexPage } from './pages/index'
import { CardsPage } from './pages/cards'
import { WineDetailPage } from './pages/wine-detail'
// Fehlerseiten bewusst eager: ein fehlgeschlagener Chunk-Load darf sie nicht mitreißen.
import { NotFoundPage, RouteErrorPage } from './pages/error-pages'

// Route-level code splitting for non-critical pages
const Buchart58Page       = lazy(() => import('./pages/buchart58').then(m => ({ default: m.Buchart58Page })))
const TextPage            = lazy(() => import('./pages/text').then(m => ({ default: m.TextPage })))
const IconsSections       = lazy(() => import('./pages/icons').then(m => ({ default: m.IconsSections })))
const InputsPage          = lazy(() => import('./pages/inputs').then(m => ({ default: m.InputsPage })))
const FeedbackSections    = lazy(() => import('./pages/feedback').then(m => ({ default: m.FeedbackSections })))
const NavigationPage      = lazy(() => import('./pages/navigation').then(m => ({ default: m.NavigationPage })))
const ShopPage            = lazy(() => import('./pages/shop').then(m => ({ default: m.ShopPage })))
const TransitionsSections = lazy(() => import('./pages/transitions').then(m => ({ default: m.TransitionsSections })))
const DesignerPage        = lazy(() => import('./pages/designer').then(m => ({ default: m.DesignerPage })))
const DataPage            = lazy(() => import('./pages/data').then(m => ({ default: m.DataPage })))
const LaborPage           = lazy(() => import('./pages/labor').then(m => ({ default: m.LaborPage })))

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
    errorElement: <RouteErrorPage />,
    children: [
      { index: true,           element: <IndexPage /> },
      { path: 'buchart58',     element: withSuspense(<Buchart58Page />) },
      // Merged pages: each route renders the old page bodies one after another.
      { path: 'cards',         element: <><CardsPage />{withSuspense(<IconsSections />)}</> },
      { path: 'text',          element: withSuspense(<TextPage />) },
      { path: 'inputs',        element: withSuspense(<><InputsPage /><FeedbackSections /></>) },
      { path: 'navigation',    element: withSuspense(<><NavigationPage /><TransitionsSections /></>) },
      { path: 'shop',          element: withSuspense(<ShopPage />) },
      { path: 'data',          element: withSuspense(<DataPage />) },
      { path: 'designer',      element: withSuspense(<DesignerPage />) },
      { path: 'labor',         element: withSuspense(<LaborPage />) },
      { path: 'icons',         element: <Navigate to="/cards" replace /> },
      { path: 'feedback',      element: <Navigate to="/inputs" replace /> },
      { path: 'transitions',   element: <Navigate to="/navigation" replace /> },
      { path: 'wine/:slug',    element: <WineDetailPage /> },
      { path: '*',             element: <NotFoundPage /> },
    ],
  },
], {
  // Vite's `base` only rewrites assets; the router needs the subpath too so
  // <Link>/navigate stay under /components/ in the combined deploy. Dev: '/'.
  basename: import.meta.env.BASE_URL.replace(/\/$/, '') || undefined,
})

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
