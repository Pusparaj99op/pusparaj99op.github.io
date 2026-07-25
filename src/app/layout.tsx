import type { Metadata } from 'next';
import './globals.css';
import SmoothScrollProvider from '@/components/ui/SmoothScrollProvider';

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@500,700,800&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#050505" />
      </head>
      <body>
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
