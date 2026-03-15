'use client'

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import SectionTitle from '../SectionTitle/SectionTitle';
import { menuService } from '../../services/menuService';
import { getImageUrl } from '../../lib/imageHelper';

const MenuDuJour = () => {
  const router = useRouter();
  const [platsDuJour, setPlatsDuJour] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger les plats en vedette depuis la BDD
    const loadFeaturedMenu = async () => {
      try {
        const response = await menuService.getFeaturedMenu();
        if (response.success && response.data) {
          setPlatsDuJour(response.data); // Afficher TOUS les plats Menu du Jour
        }
      } catch (error) {
        console.error('Erreur chargement menu du jour:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedMenu();
  }, []);

  const handleProductClick = (plat) => {
    router.push(`/produit/${plat.id}`);
  };

  if (loading) {
    return (
      <div id="menu-du-jour" className="container py-10 md:py-14 px-4">
        <SectionTitle 
          title="Menu du Jour" 
          subtitle="Les plats les plus populaires du terroir béninois"
        />
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (platsDuJour.length === 0) {
    return null;
  }

  return (
    <>
      <div id="menu-du-jour" className="container py-10 md:py-14 px-4">
        <SectionTitle 
          title="Menu du Jour" 
          subtitle="Les plats les plus populaires du terroir béninois"
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {platsDuJour.map((plat, index) => (
            <div
              key={plat.id}
              onClick={() => handleProductClick(plat)}
              className="relative bg-gradient-to-br from-white to-orange-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer transform hover:-translate-y-2"
            >
              {/* Badge Menu du Jour */}
              <div className="absolute top-3 right-3 z-10">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                  <span className="animate-pulse">⭐</span>
                  <span>Menu du Jour</span>
                </div>
              </div>

              {/* Image avec overlay gradient */}
              <div className="relative h-56 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
                <Image
                  src={getImageUrl(plat.image)}
                  alt={plat.name}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Contenu */}
              <div className="p-5">
                {/* Nom du plat */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                  {plat.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 h-10">
                  {plat.description}
                </p>

                {/* Prix et étoiles */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      {parseFloat(plat.price).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">FCFA</p>
                  </div>
                </div>

                {/* Bouton Commander */}
                <button className="mt-4 w-full bg-primary hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform group-hover:scale-105 shadow-md hover:shadow-lg">
                  Voir les détails
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MenuDuJour;
