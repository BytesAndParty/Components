import React from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { FrameIcon } from 'lucide-react';
import { useI18n, useComponentMessages } from '../i18n';
import { MESSAGES, type FooterMessages } from './messages';

// Brand glyphs (Facebook/Instagram/YouTube/LinkedIn) were removed from
// lucide-react in v1 for trademark reasons. Re-created here as local
// components in lucide's outline style so the footer keeps its prior look
// without pulling in a separate brand-icon dependency.
type BrandIconProps = React.SVGProps<SVGSVGElement>;

function BrandSvg({ children, ...props }: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

function FacebookIcon(props: BrandIconProps) {
  return (
    <BrandSvg {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </BrandSvg>
  );
}

function InstagramIcon(props: BrandIconProps) {
  return (
    <BrandSvg {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </BrandSvg>
  );
}

function YoutubeIcon(props: BrandIconProps) {
  return (
    <BrandSvg {...props}>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </BrandSvg>
  );
}

function LinkedinIcon(props: BrandIconProps) {
  return (
    <BrandSvg {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </BrandSvg>
  );
}

interface FooterLink {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

interface FooterSectionData {
  label: string;
  links: FooterLink[];
}

export interface FooterProps {
  /** Override the default link sections */
  sections?: FooterSectionData[];
  /** Company name shown in copyright */
  companyName?: string;
  /** Logo element or icon */
  logo?: ReactNode;
  /** i18n overrides for the copyright suffix. */
  messages?: Partial<FooterMessages>;
  className?: string;
  style?: React.CSSProperties;
}

const defaultSectionsByLocale: Record<'de' | 'en', FooterSectionData[]> = {
  en: [
    {
      label: 'Product',
      links: [
        { title: 'Features', href: '#features' },
        { title: 'Pricing', href: '#pricing' },
        { title: 'Testimonials', href: '#testimonials' },
        { title: 'Integration', href: '#' },
      ],
    },
    {
      label: 'Company',
      links: [
        { title: 'FAQs', href: '#' },
        { title: 'About Us', href: '#' },
        { title: 'Privacy Policy', href: '#' },
        { title: 'Terms of Services', href: '#' },
      ],
    },
    {
      label: 'Resources',
      links: [
        { title: 'Blog', href: '#' },
        { title: 'Changelog', href: '#' },
        { title: 'Brand', href: '#' },
        { title: 'Help', href: '#' },
      ],
    },
    {
      label: 'Social Links',
      links: [
        { title: 'Facebook', href: '#', icon: FacebookIcon },
        { title: 'Instagram', href: '#', icon: InstagramIcon },
        { title: 'Youtube', href: '#', icon: YoutubeIcon },
        { title: 'LinkedIn', href: '#', icon: LinkedinIcon },
      ],
    },
  ],
  de: [
    {
      label: 'Produkt',
      links: [
        { title: 'Funktionen', href: '#features' },
        { title: 'Preise', href: '#pricing' },
        { title: 'Stimmen', href: '#testimonials' },
        { title: 'Integration', href: '#' },
      ],
    },
    {
      label: 'Unternehmen',
      links: [
        { title: 'FAQ', href: '#' },
        { title: 'Über uns', href: '#' },
        { title: 'Datenschutz', href: '#' },
        { title: 'AGB', href: '#' },
      ],
    },
    {
      label: 'Ressourcen',
      links: [
        { title: 'Blog', href: '#' },
        { title: 'Änderungen', href: '#' },
        { title: 'Marke', href: '#' },
        { title: 'Hilfe', href: '#' },
      ],
    },
    {
      label: 'Soziale Netzwerke',
      links: [
        { title: 'Facebook', href: '#', icon: FacebookIcon },
        { title: 'Instagram', href: '#', icon: InstagramIcon },
        { title: 'Youtube', href: '#', icon: YoutubeIcon },
        { title: 'LinkedIn', href: '#', icon: LinkedinIcon },
      ],
    },
  ],
};

export function Footer({
  sections,
  companyName = 'Asme',
  logo,
  messages,
  className,
  style,
}: FooterProps) {
  const { locale } = useI18n();
  const m = useComponentMessages(MESSAGES, messages);
  const resolvedSections = sections ?? defaultSectionsByLocale[locale];
  return (
    <footer
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '72rem',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderTop: '1px solid var(--border, rgba(255,255,255,0.1))',
        borderRadius: '2rem 2rem 0 0',
        padding: '3rem 1.5rem',
        background:
          'radial-gradient(35% 128px at 50% 0%, rgba(255,255,255,0.06), transparent)',
        ...style,
      }}
    >
      {/* Top highlight line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%) translateY(-50%)',
          width: '33%',
          height: '1px',
          background: 'rgba(255,255,255,0.15)',
          borderRadius: '9999px',
          filter: 'blur(1px)',
        }}
      />

      <div
        style={{
          display: 'grid',
          width: '100%',
          gap: '2rem',
          // Intrinsically responsive: two columns when there's room, stacks to
          // one below ~32rem. Inline styles have no breakpoints, so auto-fit
          // does the collapsing instead of a media query.
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 16rem), 1fr))',
        }}
      >
        {/* Brand column */}
        <AnimatedContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {logo ?? <FrameIcon aria-hidden style={{ width: '2rem', height: '2rem' }} />}
            <p
              style={{
                fontSize: '0.8125rem',
                color: 'var(--muted-foreground, #71717a)',
              }}
            >
              &copy; {new Date().getFullYear()} {companyName}. {m.rightsReserved}
            </p>
          </div>
        </AnimatedContainer>

        {/* Link columns */}
        <nav
          aria-label={companyName}
          style={{
            display: 'grid',
            // auto-fit collapses the link columns as width shrinks (e.g. 4 → 2
            // → 1 on a phone) without a media query — inline styles can't carry
            // breakpoints, so the track sizing handles the reflow.
            gridTemplateColumns: 'repeat(auto-fit, minmax(8rem, 1fr))',
            gap: '2rem',
          }}
        >
          {resolvedSections.map((section, index) => (
            <AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
              <div>
                <h3
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '1rem',
                  }}
                >
                  {section.label}
                </h3>
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  {section.links.map((link) => (
                    <li key={link.title}>
                      <a
                        href={link.href}
                        className="footer-link"
                        style={{
                          color: 'var(--muted-foreground, #71717a)',
                          textDecoration: 'none',
                          fontSize: '0.8125rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          transition: 'color 0.2s',
                        }}
                      >
                        {link.icon && (
                          <link.icon
                            aria-hidden
                            style={{ width: '1rem', height: '1rem' }}
                          />
                        )}
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedContainer>
          ))}
        </nav>
      </div>
    </footer>
  );
}

/* ---- Animated wrapper ---- */

type ViewAnimationProps = {
  delay?: number;
  className?: ComponentProps<typeof motion.div>['className'];
  children: ReactNode;
};

function AnimatedContainer({
  className,
  delay = 0.1,
  children,
}: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
      whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
