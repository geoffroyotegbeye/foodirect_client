'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaWhatsapp } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { getSettings } from '../../services/settingsService';
import { getImageUrl } from '../../lib/imageHelper';

const OrderForm = () => {
  const { cart, total } = useCart();
  const [deliveryImage, setDeliveryImage] = useState('/assets/3.png');

  useEffect(() => {
    getSettings()
      .then(s => { if (s?.delivery_image) setDeliveryImage(s.delivery_image); })
      .catch(() => {});
  }, []);

  const buildCommande = (items, totalAmount) => {
    if (!items.length) return '';
    const lines = items.map(i => `${i.name} x${i.quantity} — ${(parseFloat(i.price) * i.quantity).toLocaleString()} FCFA`);
    lines.push(`\nTotal : ${totalAmount.toLocaleString()} FCFA`);
    return lines.join('\n');
  };

  const [formData, setFormData] = useState({
    phone: '',
    quartier: '',
    livraison: 'standard',
    commande: buildCommande(cart, total)
  });

  useEffect(() => {
    setFormData(prev => ({ ...prev, commande: buildCommande(cart, total) }));
  }, [cart, total]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = `🍽️ *Nouvelle Commande FOODIRECT*\n\n` +
      `📞 Téléphone: ${formData.phone}\n` +
      `📍 Quartier: ${formData.quartier}\n` +
      `🚚 Livraison: ${formData.livraison === 'standard' ? 'Standard' : 'Premium'}\n\n` +
      `📝 Commande:\n${formData.commande}`;
    window.open(`https://wa.me/22901160557623?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div id="commander" className="container py-10 md:py-14 px-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">

        {/* Image gauche — desktop uniquement */}
        <div className="hidden md:block md:w-1/2 relative min-h-[520px]">
          <Image
            src={getImageUrl(deliveryImage)}
            alt="Tarifs de livraison FOODIRECT"
            fill
            className="object-cover"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
          <div className="absolute bottom-10 left-8 text-white">
            <p className="text-3xl font-cursive">Livraison rapide</p>
            <p className="text-sm opacity-80 mt-1">Dès 12h, à votre porte 🚀</p>
          </div>
        </div>

        {/* Formulaire droite */}
        <div className="w-full md:w-1/2 p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-cursive text-primary text-center mb-6">
            Formulaire de commande
          </h2>
          <p className="text-center text-gray-600 mb-6">Paiement à la livraison</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Numéro à contacter <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+229 XX XX XX XX"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Quartier <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="quartier"
                value={formData.quartier}
                onChange={handleChange}
                placeholder="Ex: Ganhi, Cotonou"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Type de livraison <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-3">Le tarif des livraisons est visible sur l&apos;image à gauche.</p>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-primary transition">
                  <input
                    type="radio"
                    name="livraison"
                    value="standard"
                    checked={formData.livraison === 'standard'}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary"
                  />
                  <span>Livraison standard</span>
                </label>
                <label className="flex items-center gap-3 p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-primary transition">
                  <input
                    type="radio"
                    name="livraison"
                    value="premium"
                    checked={formData.livraison === 'premium'}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary"
                  />
                  <span>Livraison premium</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Nom du plat et montant <span className="text-red-500">*</span>
              </label>
              <textarea
                name="commande"
                value={formData.commande}
                onChange={handleChange}
                placeholder="Ex: Attieke poulet 3500, Chawarma du chef 4000"
                required
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-3 transition transform hover:scale-105"
            >
              <FaWhatsapp className="text-2xl" />
              <span>Commander via WhatsApp</span>
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-4">
            Démarrage des livraisons à partir de 12h
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
