import { createBrowserRouter, RouterProvider } from 'react-router'
import { Layout } from './layout'
import { IndexPage } from './pages/IndexPage'
import { SectionPage } from './pages/SectionPage'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <IndexPage /> },
      { path: ':sectionId', element: <SectionPage /> },
    ],
  },
])

export function App() {
  return <RouterProvider router={router} />
}
