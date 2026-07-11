import { Footer } from '@components/footer-section/footer-section'

export function FooterV1() {
  return (
    <section className="bg-background pt-16 sm:pt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Footer 
          companyName="Lacombe & Fils" 
          logo={<span className="text-2xl font-bold tracking-tighter">🍷 Lacombe</span>}
          className="border-border max-w-none! border-t"
        />
      </div>
    </section>
  )
}
