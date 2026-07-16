import React from 'react';
import type { Metadata } from 'next';
import { Outfit, Space_Grotesk, JetBrains_Mono, Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Fly & Flourish Overseas',
  description: 'Fly & Flourish Overseas - Leading educational consultants offering ultra-precise admissions profiling, Ivy League matches, and high-success visa consulting.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/FFlogo-icon-only.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/FFlogo-icon-only.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${playfairDisplay.variable} ${plusJakartaSans.variable}`}>
      <head />
      <body>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  );
}
