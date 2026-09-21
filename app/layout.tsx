import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { MobileAppDock } from '@/components/layout/MobileAppDock';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#020617',
};

export const metadata: Metadata = {
  title: 'RentaRide | Self-Drive Fleet India',
  description: 'Rent smarter. Drive easier. Zero security deposit self-drive car rentals, keyless Bluetooth unlock, and instant booking across India.',
  manifest: '/manifest.json',
  icons: {
    icon: '/images/icons/icon.svg',
    apple: '/images/icons/icon.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'RentaRide',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
        <MobileAppDock />
      </body>
    </html>
  );
}
