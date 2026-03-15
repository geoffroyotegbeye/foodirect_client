import { Nunito, Dancing_Script } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from '../context/CartContext'
import CartDrawer from '../components/Cart/CartDrawer'

const nunito = Nunito({ 
  weight: ['400', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito',
})

const dancingScript = Dancing_Script({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dancing',
})

export const metadata = {
  title: 'FOODIRECT - Catering Cuisine Béninoise à Ganhi',
  description: 'FOODIRECT Catering à Ganhi - Cuisine béninoise authentique. Riz au gras créole, igname, couscous. Livraison disponible dès 500 FCFA.',
  keywords: ['restaurant béninois', 'cuisine béninoise', 'Ganhi', 'Cotonou', 'FOODIRECT', 'riz au gras', 'couscous', 'igname', 'livraison', 'catering'],
  authors: [{ name: 'FOODIRECT Catering' }],
  creator: 'FOODIRECT',
  publisher: 'FOODIRECT Catering',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://foodirect.netlify.app'), // À remplacer par votre URL Netlify
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'FOODIRECT - Restaurant Béninois à Ganhi',
    description: 'Cuisine béninoise authentique à Ganhi. Riz au gras créole, igname, couscous. Livraison dès 500 FCFA.',
    url: 'https://foodirect.netlify.app',
    siteName: 'FOODIRECT Catering',
    images: [
      {
        url: '/assets/1.png',
        width: 1200,
        height: 630,
        alt: 'FOODIRECT - Cuisine Béninoise',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FOODIRECT - Restaurant Béninois à Ganhi',
    description: 'Cuisine béninoise authentique. Livraison disponible dès 500 FCFA.',
    images: ['/assets/1.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // google: 'votre-code-verification-google',
    // bing: 'votre-code-verification-bing',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${nunito.variable} ${dancingScript.variable} font-sans`}>
        <CartProvider>
          {children}
          <CartDrawer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#363636',
                padding: '16px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </CartProvider>
      </body>
    </html>
  )
}
