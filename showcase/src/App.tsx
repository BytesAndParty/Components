import { createBrowserRouter, RouterProvider } from 'react-router'
import { Layout } from './layout'
import { IndexPage } from './pages/index'
import { CardsPage } from './pages/cards'
import { TextPage } from './pages/text'
import { IconsPage } from './pages/icons'
import { InputsPage } from './pages/inputs'
import { FeedbackPage } from './pages/feedback'
import { NavigationPage } from './pages/navigation'
import { ShopPage } from './pages/shop'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <IndexPage /> },
      { path: 'cards', element: <CardsPage /> },
      { path: 'text', element: <TextPage /> },
      { path: 'icons', element: <IconsPage /> },
      { path: 'inputs', element: <InputsPage /> },
      { path: 'feedback', element: <FeedbackPage /> },
      { path: 'navigation', element: <NavigationPage /> },
      { path: 'shop', element: <ShopPage /> },
    ],
  },
])

export function App() {
  return <RouterProvider router={router} />
}
