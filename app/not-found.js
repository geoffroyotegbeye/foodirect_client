'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Page non trouvée
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.back()}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            ← Retour
          </button>
          <Link
            href="/"
            className="bg-primary hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            🏠 Accueil
          </Link>
        </div>

        {/* Illustration */}
        <div className="mt-12">
          <div className="text-8xl mb-4">🍽️</div>
          <p className="text-gray-500 text-sm">
            Peut-être cherchez-vous notre délicieux menu?
          </p>
        </div>
      </div>
    </div>
  );
}
