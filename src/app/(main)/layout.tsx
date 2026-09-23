import type { Metadata } from 'next';
import { Playfair_Display, Inter, Space_Mono } from 'next/font/google';
import './globals.css';
import SmoothScrollProvider from '@/components/ui/SmoothScrollProvider';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Pranay Krupakar Gajbhiye — Full Stack Developer & Quant Trader',
  description:
    'Personal website of Pranay Gajbhiye — Full Stack Developer, Quantitative Trader, and Founder of BlackObsidian (AMC) and Zorvain Street. Building algorithmic systems, premium digital products, and scalable web experiences.',
  keywords: [
    'Pranay Gajbhiye', 'Full Stack Developer', 'Quantitative Trader',
    'Algorithmic Trading', 'BlackObsidian', 'Zorvain Street',
    'React', 'Next.js', 'Python', 'Options Trading', 'Nagpur',
  ],
  authors: [{ name: 'Pranay Krupakar Gajbhiye', url: 'https://pranaygajbhiye.me' }],
  creator: 'Pranay Krupakar Gajbhiye',
  openGraph: {
    title: 'Pranay Gajbhiye — Full Stack Developer & Quant Trader',
    description: 'Founder of BlackObsidian & Zorvain Street. Building algorithmic trading systems and premium web experiences.',
    url: 'https://pranaygajbhiye.me',
    siteName: 'Pranay Gajbhiye',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pranay Gajbhiye — Full Stack Developer & Quant Trader',
    description: 'Founder of BlackObsidian & Zorvain Street. Algorithmic trader & systems builder.',
    creator: '@pranaygajbhiye',
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${spaceMono.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#060606" />
      </head>
      <body>
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
