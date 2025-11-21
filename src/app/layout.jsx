import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from '@/components/AuthProvider';
import { I18nProvider } from '@/lib/i18n/i18nContext';
import { Toaster } from 'react-hot-toast';
import { RootQueryProvider } from '@/components/providers/RootQueryProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MedFlow - Medical Practice Management",
  description: "Modern SaaS platform for clinics and physicians",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Accessibility meta tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#10b981" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
        {/* Skip to main content link for keyboard navigation */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-600 focus:text-white focus:rounded-lg focus:ring-2 focus:ring-emerald-300"
          aria-label="Skip to main content"
        >
          Skip to main content
        </a>
        
        <I18nProvider>
          <AuthProvider>
            <RootQueryProvider>
              <main id="main-content" role="main">
                {children}
              </main>
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#10b981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 4000,
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
                // Accessibility for toast notifications
                ariaProps={{
                  role: 'status',
                  'aria-live': 'polite',
                }}
              />
            </RootQueryProvider>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
