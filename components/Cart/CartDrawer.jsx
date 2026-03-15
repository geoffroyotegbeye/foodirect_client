'use client'

import { useState } from 'react';
import Image from 'next/image';
import { useCart } from '../../context/CartContext';
import { orderService } from '../../services/orderService';
import { getImageUrl } from '../../lib/imageHelper';
import { FaTrash, FaMinus, FaPlus, FaTimes, FaWhatsapp, FaShoppingCart } from 'react-icons/fa';
import toast from 'react-hot-toast';

const WHATSAPP_NUMBER = '22901160557623'; // numéro sans +

export default function CartDrawer() {
  const { cart, removeItem, updateQty, clearCart, total, itemCount, clientInfo, saveClientInfo } = useCart();
  const [open, setOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(clientInfo);

  // Sync form avec clientInfo quand le drawer s'ouvre
  const openDrawer = () => {
    setForm(clientInfo);
    setOpen(true);
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setLoading(true);

    try {
      // Sauvegarder les infos client pour la prochaine fois
      saveClientInfo(form);

      // Enregistrer en BDD
      const orderData = {
        customer_name: form.name,
        customer_phone: form.phone,
        customer_address: form.address,
        payment_method: 'especes',
        items: cart.map(i => ({ menu_id: i.id, quantity: i.quantity })),
      };

      const response = await orderService.createOrder(orderData);
      const orderId = response.data?.id || '?';

      // Construire le message WhatsApp
      const separator = '─────────────────────';
      const lines = cart.map((i, idx) =>
        `${idx + 1}. ${i.name}\n   ${i.quantity} x ${parseFloat(i.price).toLocaleString()} FCFA = *${(parseFloat(i.price) * i.quantity).toLocaleString()} FCFA*`
      ).join('\n');

      const message =
`🍽️ *NOUVELLE COMMANDE FOODIRECT*
${separator}
🔖 Commande N° *#${orderId}*
📅 ${new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
${separator}

📋 *DÉTAIL DE LA COMMANDE*

${lines}

${separator}
🛒 Nombre d'articles : *${itemCount}*
💰 *TOTAL À PAYER : ${total.toLocaleString()} FCFA*
${separator}

👤 *CLIENT*
Tél : ${form.phone}
📍 Adresse : ${form.address}
${separator}

✅ Merci de confirmer la commande !`;

      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

      clearCart();
      setOpen(false);
      setCheckout(false);
      toast.success('Commande enregistrée !');
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de la commande');
    } finally {
      setLoading(false);
    }
  };

  if (itemCount === 0 && !open) return (
    <button
      data-cart-trigger
      onClick={openDrawer}
      className="hidden"
      aria-hidden="true"
    />
  );

  return (
    <>
      {/* Trigger caché pour la navbar */}
      <button data-cart-trigger onClick={openDrawer} className="hidden" aria-hidden="true" />

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />

          {/* Drawer */}
          <div className="relative bg-white w-full max-w-md h-full flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FaShoppingCart className="text-primary" /> Mon panier
              </h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-700">
                <FaTimes className="text-2xl" />
              </button>
            </div>

            {!checkout ? (
              <>
                {/* Liste des articles */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                  {cart.length === 0 ? (
                    <p className="text-center text-gray-400 py-10">Panier vide</p>
                  ) : (
                    cart.map(item => (
                      <div key={item.id} className="flex items-center gap-2 bg-gray-50 rounded-xl p-2.5">
                        <div className="relative w-11 h-11 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src={getImageUrl(item.image)} alt={item.name} fill className="object-cover" sizes="44px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-xs truncate">{item.name}</p>
                          <p className="text-primary font-bold text-xs">{parseFloat(item.price).toLocaleString()} F</p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button onClick={() => updateQty(item.id, item.quantity - 1)} className="bg-gray-200 hover:bg-gray-300 rounded-full w-6 h-6 flex items-center justify-center">
                            <FaMinus className="text-xs" />
                          </button>
                          <span className="font-bold w-4 text-center text-xs">{item.quantity}</span>
                          <button onClick={() => updateQty(item.id, item.quantity + 1)} className="bg-primary hover:bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
                            <FaPlus className="text-xs" />
                          </button>
                        </div>
                        <p className="text-xs font-bold text-gray-700 flex-shrink-0">{(parseFloat(item.price) * item.quantity).toLocaleString()}</p>
                        <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 flex-shrink-0">
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer panier */}
                {cart.length > 0 && (
                  <div className="border-t px-5 py-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold text-gray-700">Total</span>
                      <span className="text-2xl font-bold text-primary">{total.toLocaleString()} FCFA</span>
                    </div>
                    <button
                      onClick={() => setCheckout(true)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl text-lg transition flex items-center justify-center gap-2"
                    >
                      <FaWhatsapp className="text-xl" /> Commander via WhatsApp
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Formulaire checkout */
              <form onSubmit={handleOrder} className="flex-1 flex flex-col px-5 py-4">
                <button type="button" onClick={() => setCheckout(false)} className="text-sm text-gray-500 hover:text-gray-700 mb-4 self-start">
                  ← Retour au panier
                </button>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Vos informations</h3>

                <div className="space-y-4 flex-1">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Numéro à contacter</label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      placeholder="+229 01 XX XX XX XX"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quartier</label>
                    <input
                      type="text"
                      required
                      value={form.address}
                      onChange={e => setForm({ ...form, address: e.target.value })}
                      placeholder="Ex: Ganhi, Cotonou"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                    />
                  </div>

                  {/* Récap commande */}
                  <div className="bg-orange-50 rounded-xl p-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">{itemCount} article(s)</p>
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-800">Total</span>
                      <span className="font-bold text-primary text-lg">{total.toLocaleString()} FCFA</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl text-lg transition flex items-center justify-center gap-2"
                >
                  <FaWhatsapp className="text-xl" />
                  {loading ? 'Envoi...' : 'Confirmer et envoyer sur WhatsApp'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
