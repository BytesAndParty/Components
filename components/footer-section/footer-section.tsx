import React from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  FacebookIcon,
  FrameIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
} from 'lucide-react';

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
  className?: string;
  style?: React.CSSProperties;
}

const defaultSections: FooterSectionData[] = [
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
];

export function Footer({
  sections = defaultSections,
  companyName = 'Asme',
  logo,
  className,
  style,
}: FooterProps) {
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
          gridTemplateColumns: '1fr 2fr',
        }}
      >
        {/* Brand column */}
        <AnimatedContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {logo ?? <FrameIcon style={{ width: '2rem', height: '2rem' }} />}
            <p
              style={{
                fontSize: '0.8125rem',
                color: 'var(--muted-foreground, #71717a)',
              }}
            >
              &copy; {new Date().getFullYear()} {companyName}. All rights
              reserved.
            </p>
          </div>
        </AnimatedContainer>

        {/* Link columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${sections.length}, 1fr)`,
            gap: '2rem',
          }}
        >
          {sections.map((section, index) => (
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
        </div>
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
