import { Outlet } from 'react-router'
import { AtelierProvider } from '@components/atelier'
import { CommandBar } from './components/command-bar'
import { ShowcaseProvider } from './showcase-context'

export function Layout() {
  return (
    <AtelierProvider defaultTheme="dark" defaultAccent="indigo" defaultLocale="de">
      <ShowcaseProvider>
        <div className="bg-background text-foreground min-h-screen">
          <main>
            <Outlet />
          </main>
          <CommandBar />
        </div>
      </ShowcaseProvider>
    </AtelierProvider>
  )
}
