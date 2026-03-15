'use client'

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SectionTitle from "../SectionTitle/SectionTitle";
import { menuService } from "../../services/menuService";
import { getImageUrl } from "../../lib/imageHelper";
import { useCart } from "../../context/CartContext";
import { FaPlus, FaMinus } from "react-icons/fa";

const TopList = () => {
  const router = useRouter();
  const { addItem, updateQty, getQty } = useCart();
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

      {/* Liste du menu */}
      <div>
        {currentMenu.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            Aucun plat disponible dans cette catégorie
          </div>
        ) : (
          <>
            {/* Mobile : grille de cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
              {currentMenu.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleProductClick(item)}
                  className="bg-white rounded-2xl shadow-md overflow-hidden group cursor-pointer border border-gray-100 active:scale-95 transition-transform"
                >
                  {/* Image pleine largeur */}
                  <div className="relative w-full h-44 overflow-hidden">
                    <Image
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="50vw"
                    />
                    {item.featured === 1 && (
                      <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                        ⭐ Top
                      </div>
                    )}
                  </div>
                  {/* Contenu */}
                  <div className="p-3">
                    <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-base font-bold text-primary">
                        {parseFloat(item.price).toLocaleString()} <span className="text-xs font-normal text-gray-500">FCFA</span>
                      </p>
                    </div>
                    {getQty(item.id) === 0 ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); addItem(item); }}
                        className="mt-2 w-full bg-primary text-white text-xs font-semibold py-1.5 rounded-lg flex items-center justify-center gap-1"
                      >
                        <FaPlus className="text-xs" /> Ajouter
                      </button>
                    ) : (
                      <div className="mt-2 flex items-center justify-between bg-orange-50 rounded-lg px-2 py-1">
                        <button onClick={(e) => { e.stopPropagation(); updateQty(item.id, getQty(item.id) - 1); }} className="text-primary font-bold p-1"><FaMinus className="text-xs" /></button>
                        <span className="font-bold text-primary">{getQty(item.id)}</span>
                        <button onClick={(e) => { e.stopPropagation(); addItem(item); }} className="text-primary font-bold p-1"><FaPlus className="text-xs" /></button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop : grille 2 colonnes */}
            <div className="hidden md:grid md:grid-cols-2 gap-4">
              {currentMenu.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleProductClick(item)}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 cursor-pointer hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3 p-4">
                    {/* Image */}
                    <div className="flex-shrink-0 relative w-28 h-28 rounded-xl overflow-hidden shadow">
                      <Image
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="112px"
                      />
                      {item.featured === 1 && (
                        <div className="absolute top-1.5 left-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
                          ⭐ Top
                        </div>
                      )}
                    </div>

                    {/* Infos */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-2">{item.description}</p>
                      {item.note && (
                        <p className="text-xs text-blue-600 italic line-clamp-1">ℹ️ {item.note}</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-lg font-bold text-primary">
                          {parseFloat(item.price).toLocaleString()} <span className="text-xs font-normal text-gray-500">FCFA</span>
                        </p>
                        {getQty(item.id) === 0 ? (
                          <button
                            onClick={(e) => { e.stopPropagation(); addItem(item); }}
                            className="bg-primary hover:bg-orange-600 text-white text-xs font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1 transition"
                          >
                            <FaPlus className="text-xs" /> Ajouter
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 bg-orange-50 border border-primary rounded-lg px-2 py-1">
                            <button onClick={(e) => { e.stopPropagation(); updateQty(item.id, getQty(item.id) - 1); }} className="text-primary font-bold"><FaMinus className="text-xs" /></button>
                            <span className="font-bold text-primary text-sm">{getQty(item.id)}</span>
                            <button onClick={(e) => { e.stopPropagation(); addItem(item); }} className="text-primary font-bold"><FaPlus className="text-xs" /></button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  </>
  );
};

export default TopList;
