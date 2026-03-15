'use client'

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SectionTitle from "../SectionTitle/SectionTitle";
import { menuService } from "../../services/menuService";
import { getImageUrl } from "../../lib/imageHelper";

const TopList = () => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('plat');
  const [allMenuItems, setAllMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger tous les plats disponibles depuis la BDD
    const loadMenu = async () => {
      try {
        const response = await menuService.getAvailableMenu(50);
        if (response.success && response.data) {
          setAllMenuItems(response.data);
        }
      } catch (error) {
        console.error('Erreur chargement menu:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, []);

  // Filtrer les plats par catégorie
  const currentMenu = allMenuItems.filter(item => item.category === activeCategory);

  const getCategoryLabel = (cat) => {
    const labels = {
      'plat': '🍽️ Repas',
      'dessert': '🍰 Desserts',
      'extra': '🥤 Extras',
      'boisson': '🥤 Boissons'
    };
    return labels[cat] || cat;
  };

  // Obtenir les catégories uniques
  const categories = [...new Set(allMenuItems.map(item => item.category))];

  const handleProductClick = (item) => {
    router.push(`/produit/${item.id}`);
  };

  if (loading) {
    return (
      <div id="menu" className="container py-10 md:py-14 px-4">
        <SectionTitle 
          title="Nos Spécialités" 
          subtitle="Faites votre choix"
        />
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div id="menu" className="container py-10 md:py-14 px-4">
        <SectionTitle 
          title="Nos Spécialités" 
          subtitle="Faites votre choix"
        />

      {/* Filtres de catégories */}
      <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
              activeCategory === cat
                ? 'bg-primary text-white shadow-lg scale-105'
                : 'bg-white/70 text-gray-700 hover:bg-white hover:shadow-md'
            }`}
          >
            {getCategoryLabel(cat)}
          </button>
        ))}
      </div>

      {/* Liste du menu en lignes */}
      <div className="max-w-5xl mx-auto space-y-4">
        {currentMenu.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            Aucun plat disponible dans cette catégorie
          </div>
        ) : (
          currentMenu.map((item, index) => (
            <div
              key={item.id}
              onClick={() => handleProductClick(item)}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden group border border-gray-100 cursor-pointer transform hover:-translate-y-1"
            >
              <div className="flex flex-col md:flex-row items-center gap-4 p-5">
                {/* Image */}
                <div className="flex-shrink-0 relative">
                  <div className="relative">
                    <Image
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      width={120}
                      height={120}
                      className="w-28 h-28 md:w-32 md:h-32 object-cover rounded-2xl shadow-lg group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    {item.featured === 1 && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                        ⭐ Top
                      </div>
                    )}
                  </div>
                </div>

                {/* Nom et composition */}
                <div className="flex-grow text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 mb-2 leading-relaxed">
                    {item.description}
                  </p>
                  {item.note && (
                    <div className="inline-flex items-start gap-2 bg-blue-50 border-l-4 border-blue-400 px-3 py-2 rounded mt-2">
                      <span className="text-blue-600 text-sm">ℹ️</span>
                      <p className="text-xs text-blue-700 italic">
                        {item.note}
                      </p>
                    </div>
                  )}
                </div>

                {/* Prix et bouton */}
                <div className="flex-shrink-0 text-center md:text-right">
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 mb-3">
                    <p className="text-3xl md:text-4xl font-bold text-primary whitespace-nowrap">
                      {parseFloat(item.price).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 font-medium">FCFA</p>
                  </div>
                  <button className="w-full bg-primary hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg text-sm">
                    Voir les détails
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </>
  );
};

export default TopList;
