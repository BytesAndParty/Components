import { createBrowserRouter, RouterProvider } from 'react-router'
import { Layout } from './layout'
import { IndexPage } from './pages/IndexPage'
import { SectionPage } from './pages/SectionPage'
import { PreviewPage } from './pages/PreviewPage'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <IndexPage /> },
      // Static `preview` outranks the dynamic `:sectionId` segment in v7.
      { path: 'preview', element: <PreviewPage /> },
      { path: ':sectionId', element: <SectionPage /> },
    ],
  },
], {
  // Vite's `base` only rewrites assets; the router needs the subpath too so
  // <Link>/navigate stay under /sections/ in the combined deploy. Dev: '/'.
  basename: import.meta.env.BASE_URL.replace(/\/$/, '') || undefined,
})

export function App() {
  return <RouterProvider router={router} />
}
