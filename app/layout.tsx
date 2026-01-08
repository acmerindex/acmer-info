import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'ACMer.info',
  description: 'CN XCPC 群组交流'
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh_cn" suppressHydrationWarning>
      <body className="flex min-h-screen w-full flex-col">
        {children}
        {/* Analytics placed at end of body for optimal performance */}
        <Analytics />
      </body>
    </html>
  );
}
