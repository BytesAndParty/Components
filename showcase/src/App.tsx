import { createBrowserRouter, RouterProvider } from 'react-router'
import { Layout } from './layout'
import { IndexPage } from './pages/index'
import { CardsPage } from './pages/cards'
import { TextPage } from './pages/text'
import { IconsPage } from './pages/icons'
import { InputsPage } from './pages/inputs'
import { FeedbackPage } from './pages/feedback'
import { NavigationPage } from './pages/navigation'

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
    ],
  },
])

export function App() {
  return <RouterProvider router={router} />
}
