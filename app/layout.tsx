import './globals.css';

import { Analytics } from '@vercel/analytics/react';

export const metadata = {
  title: 'ACMer.info',
  description: 'CN XCPC 群组交流'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh_cn" suppressHydrationWarning>
      <body className="flex min-h-screen w-full flex-col">{children}</body>
      <Analytics />
    </html>
  );
}
