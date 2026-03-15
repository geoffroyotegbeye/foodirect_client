'use client'

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaStar, FaShoppingCart, FaMinus, FaPlus, FaArrowLeft } from 'react-icons/fa';
import { menuService } from '../../../services/menuService';
import { accompanimentService } from '../../../services/accompanimentService';
import { getImageUrl } from '../../../lib/imageHelper';
import { useCart } from '../../../context/CartContext';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';

const CATEGORY_LABELS = { plat: 'Plat Principal', boisson: 'Boisson', dessert: 'Dessert', extra: 'Extra' };
const CATEGORY_ICONS  = { plat: '🍽️', boisson: '🥤', dessert: '🍰', extra: '🍟' };

function ItemCard({ item, getQty, addItem, updateQty }) {
  const qty = getQty(item.id);
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
      <div className="relative h-32 w-full">
        <Image src={getImageUrl(item.image)} alt={item.name} fill className="object-cover" sizes="25vw" />
      </div>
      <div className="p-3">
        <p className="font-semibold text-sm text-gray-900 line-clamp-1">{item.name}</p>
        <p className="text-primary font-bold text-sm mb-2">{parseFloat(item.price).toLocaleString()} FCFA</p>
        {qty === 0 ? (
          <button onClick={() => addItem(item)} className="w-full bg-primary text-white text-xs font-semibold py-1.5 rounded-lg flex items-center justify-center gap-1">
            <FaPlus className="text-xs" /> Ajouter
          </button>
        ) : (
          <div className="flex items-center justify-between bg-orange-50 border border-primary rounded-lg px-2 py-1">
            <button onClick={() => updateQty(item.id, qty - 1)} className="text-primary font-bold"><FaMinus className="text-xs" /></button>
            <span className="font-bold text-primary text-sm">{qty}</span>
            <button onClick={() => addItem(item)} className="text-primary font-bold"><FaPlus className="text-xs" /></button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem, updateQty, getQty } = useCart();

  const [product, setProduct] = useState(null);
  const [accompaniments, setAccompaniments] = useState([]);
  const [extras, setExtras] = useState({ boisson: [], dessert: [], extra: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await menuService.getMenuById(params.id);
        if (res.success && res.data) {
          setProduct(res.data);
          const [accRes, menuRes] = await Promise.all([
            accompanimentService.getByMenu(res.data.id),
            menuService.getAvailableMenu(100)
          ]);
          setAccompaniments(accRes.data || []);
          const items = menuRes.data || [];
          setExtras({
            boisson: items.filter(i => i.category === 'boisson'),
            dessert: items.filter(i => i.category === 'dessert'),
            extra:   items.filter(i => i.category === 'extra'),
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) load();
  }, [params.id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h1>
        <button onClick={() => router.push('/')} className="bg-primary text-white px-6 py-3 rounded-lg">
          Retour à l&apos;accueil
        </button>
      </div>
    </div>
  );

  const qty = getQty(product.id);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 pb-10">
        <div className="container mx-auto px-4">

          {/* Retour */}
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition">
            <FaArrowLeft /><span>Retour</span>
          </button>

          {/* Fiche produit */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-0">

              {/* Image */}
              <div className="relative h-72 md:h-full min-h-[320px]">
                <Image
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {product.featured === 1 && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                    <FaStar className="animate-pulse" /><span>Menu du Jour</span>
                  </div>
                )}
              </div>

              {/* Détails */}
              <div className="p-6 md:p-8 flex flex-col">
                <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold mb-3 self-start">
                  <span>{CATEGORY_ICONS[product.category]}</span>
                  <span>{CATEGORY_LABELS[product.category]}</span>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => <FaStar key={i} className="text-yellow-400" />)}
                </div>

                <p className="text-gray-600 leading-relaxed mb-4">{product.description}</p>

                {product.note && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-lg mb-4 text-sm text-blue-700">
                    ℹ️ {product.note}
                  </div>
                )}

                <div className="bg-orange-50 rounded-xl p-4 mb-6">
                  <p className="text-3xl font-bold text-primary">
                    {parseFloat(product.price).toLocaleString()} <span className="text-base font-normal text-gray-500">FCFA</span>
                  </p>
                </div>

                {/* Bouton panier */}
                {qty === 0 ? (
                  <button
                    onClick={() => addItem(product)}
                    className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 text-lg"
                  >
                    <FaShoppingCart /> Ajouter au panier
                  </button>
                ) : (
                  <div className="flex items-center justify-between bg-orange-50 border-2 border-primary rounded-xl px-6 py-3">
                    <button onClick={() => updateQty(product.id, qty - 1)} className="text-primary font-bold text-xl"><FaMinus /></button>
                    <span className="font-bold text-primary text-2xl">{qty}</span>
                    <button onClick={() => addItem(product)} className="text-primary font-bold text-xl"><FaPlus /></button>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-100 space-y-1 text-sm text-gray-500">
                  <p>🚚 Livraison rapide à Ganhi et environs</p>
                  <p>📞 +229 01 60 55 76 23</p>
                </div>
              </div>
            </div>
          </div>

          {/* Accompagnements */}
          {accompaniments.length > 0 && (
            <div className="max-w-5xl mx-auto mt-10">
              <h2 className="text-xl font-bold text-gray-900 mb-4">🍹 Accompagnements suggérés</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {accompaniments.map(item => <ItemCard key={item.id} item={item} getQty={getQty} addItem={addItem} updateQty={updateQty} />)}
              </div>
            </div>
          )}

          {/* Boissons */}
          {extras.boisson.length > 0 && (
            <div className="max-w-5xl mx-auto mt-10">
              <h2 className="text-xl font-bold text-gray-900 mb-4">🥤 Boissons</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {extras.boisson.map(item => <ItemCard key={item.id} item={item} getQty={getQty} addItem={addItem} updateQty={updateQty} />)}
              </div>
            </div>
          )}

          {/* Desserts */}
          {extras.dessert.length > 0 && (
            <div className="max-w-5xl mx-auto mt-10">
              <h2 className="text-xl font-bold text-gray-900 mb-4">🍰 Desserts</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {extras.dessert.map(item => <ItemCard key={item.id} item={item} getQty={getQty} addItem={addItem} updateQty={updateQty} />)}
              </div>
            </div>
          )}

          {/* Extras */}
          {extras.extra.length > 0 && (
            <div className="max-w-5xl mx-auto mt-10">
              <h2 className="text-xl font-bold text-gray-900 mb-4">🍟 Extras</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {extras.extra.map(item => <ItemCard key={item.id} item={item} getQty={getQty} addItem={addItem} updateQty={updateQty} />)}
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
