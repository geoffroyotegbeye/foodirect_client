'use client'

import React, { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const OrderForm = () => {
  const [formData, setFormData] = useState({
    phone: '',
    quartier: '',
    livraison: 'standard',
    commande: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const message = `🍽️ *Nouvelle Commande FOODIRECT*\n\n` +
      `📞 Téléphone: ${formData.phone}\n` +
      `📍 Quartier: ${formData.quartier}\n` +
      `🚚 Livraison: ${formData.livraison === 'standard' ? 'Standard' : 'Premium'}\n\n` +
      `📝 Commande:\n${formData.commande}`;
    
    const whatsappUrl = `https://wa.me/2290191260434?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div id="commander" className="container py-10 md:py-14 px-4">
      <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-cursive text-primary text-center mb-6">
          Formulaire de commande
        </h2>
        <p className="text-center text-gray-600 mb-6">Paiement à la livraison</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Numéro de téléphone */}
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

          {/* Quartier */}
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

          {/* Type de livraison */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Type de livraison <span className="text-red-500">*</span>
            </label>
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

          {/* Commande */}
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

          {/* Bouton de soumission */}
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
  );
};

export default OrderForm;
