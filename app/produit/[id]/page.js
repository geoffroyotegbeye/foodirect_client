'use client'

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaStar, FaShoppingCart, FaMinus, FaPlus, FaArrowLeft } from 'react-icons/fa';
import { menuService } from '../../../services/menuService';
import { getImageUrl } from '../../../lib/imageHelper';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await menuService.getMenuById(params.id);
        if (response.success && response.data) {
          setProduct(response.data);
        }
      } catch (error) {
        console.error('Erreur chargement produit:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadProduct();
    }
  }, [params.id]);

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  const getCategoryLabel = (category) => {
    const labels = {
      'plat': 'Plat Principal',
      'boisson': 'Boisson',
      'dessert': 'Dessert',
      'extra': 'Extra'
    };
    return labels[category] || category;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'plat': '🍽️',
      'boisson': '🥤',
      'dessert': '🍰',
      'extra': '🍟'
    };
    return icons[category] || '🍴';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h1>
          <button
            onClick={() => router.push('/')}
            className="bg-primary hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition"
          >
            Retour à l&apos;accueil
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = parseFloat(product.price) * quantity;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Bouton retour */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition"
        >
          <FaArrowLeft />
          <span>Retour</span>
        </button>

        {/* Contenu produit */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 p-6 md:p-10">
            {/* Colonne gauche - Image */}
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-auto object-cover"
                />
                {product.featured === 1 && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                    <FaStar className="animate-pulse" />
                    <span>Menu du Jour</span>
                  </div>
                )}
              </div>

              {/* Étoiles */}
              <div className="flex items-center justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 text-xl" />
                ))}
                <span className="ml-2 text-gray-600 text-sm">(5.0)</span>
              </div>
            </div>

            {/* Colonne droite - Détails */}
            <div className="flex flex-col">
              {/* Catégorie */}
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 self-start">
                <span>{getCategoryIcon(product.category)}</span>
                <span>{getCategoryLabel(product.category)}</span>
              </div>

              {/* Nom */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Description */}
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Note spéciale */}
              {product.note && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg mb-6">
                  <div className="flex items-start gap-3">
                    <span className="text-blue-600 text-xl">ℹ️</span>
                    <div>
                      <p className="text-sm font-semibold text-blue-900 mb-1">Information importante</p>
                      <p className="text-sm text-blue-700">{product.note}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Prix */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 mb-6">
                <p className="text-sm text-gray-600 mb-1">Prix unitaire</p>
                <p className="text-4xl md:text-5xl font-bold text-primary">
                  {parseFloat(product.price).toLocaleString()} <span className="text-2xl">FCFA</span>
                </p>
              </div>

              {/* Sélecteur de quantité */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Quantité
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 rounded-full p-3 transition-all duration-300 hover:scale-110"
                  >
                    <FaMinus />
                  </button>
                  <span className="text-3xl font-bold text-gray-900 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 99}
                    className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 rounded-full p-3 transition-all duration-300 hover:scale-110"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-700">Total</span>
                  <span className="text-3xl font-bold text-primary">
                    {totalPrice.toLocaleString()} FCFA
                  </span>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="space-y-3">
                <button className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-lg">
                  <FaShoppingCart />
                  <span>Ajouter au panier</span>
                </button>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg">
                  Commander maintenant
                </button>
              </div>

              {/* Info livraison */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span>🚚</span>
                  <span>Livraison rapide à Ganhi et environs</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 mt-2">
                  <span>📞</span>
                  <span>Appelez-nous: +229 01 91 26 04 34</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
