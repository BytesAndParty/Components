import { useEffect } from 'react'
import { createBrowserRouter, RouterProvider, useLocation, useNavigationType } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HotkeysProvider } from '@components/hotkeys/hotkeys-provider'
import { AtelierProvider } from '@components/atelier'
import { Layout } from './layout'
import { IndexPage } from './pages/index'
import { CardsPage } from './pages/cards'
import { TextPage } from './pages/text'
import { IconsPage } from './pages/icons'
import { InputsPage } from './pages/inputs'
import { FeedbackPage } from './pages/feedback'
import { NavigationPage } from './pages/navigation'
import { ShopPage } from './pages/shop'
import { TransitionsPage } from './pages/transitions'
import { DesignerPage } from './pages/designer'

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

const router = createBrowserRouter([
  {
    element: (
      <>
        <Layout />
        <ScrollToTopOnPush />
      </>
    ),
    children: [
      { index: true, element: <IndexPage /> },
      { path: 'cards', element: <CardsPage /> },
      { path: 'text', element: <TextPage /> },
      { path: 'icons', element: <IconsPage /> },
      { path: 'inputs', element: <InputsPage /> },
      { path: 'feedback', element: <FeedbackPage /> },
      { path: 'navigation', element: <NavigationPage /> },
      { path: 'shop', element: <ShopPage /> },
      { path: 'transitions', element: <TransitionsPage /> },
      { path: 'designer', element: <DesignerPage /> },
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
