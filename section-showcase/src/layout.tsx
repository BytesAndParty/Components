import { Outlet } from 'react-router'
import { CommandBar } from './components/command-bar'
import { ShowcaseProvider } from './showcase-context'

export function Layout() {
  return (
    <ShowcaseProvider>
      <div className="bg-background text-foreground min-h-screen">
        <main>
          <Outlet />
        </main>
        <CommandBar />
      </div>
    </ShowcaseProvider>
  )
}
