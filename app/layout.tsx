import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import I18nProvider from '@/components/I18nProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SolarPro ERP - Solar Installation Management System',
  description: 'Comprehensive ERP system for solar installation companies in Tunisia',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}