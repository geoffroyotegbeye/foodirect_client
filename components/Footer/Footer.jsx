'use client'

import React from "react";
import { FaMapMarkerAlt, FaPhone, FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 md:py-12">
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Section 1 - À propos */}
          <div>
            <h3 className="text-2xl md:text-3xl font-semibold mb-4">
              FOO<span className="text-primary">DIRECT</span>
            </h3>
            <p className="text-sm md:text-base text-gray-300 mb-4">
              Votre restaurant de cuisine béninoise authentique à Ganhi. 
              Des plats traditionnels préparés comme à la maison.
            </p>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="text-2xl hover:text-primary transition duration-300"
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>
              <a 
                href="#" 
                className="text-2xl hover:text-primary transition duration-300"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a 
                href="https://wa.me/2290191260434" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:text-primary transition duration-300"
                aria-label="WhatsApp"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>

          {/* Section 2 - Localisation */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Nous Trouver</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-primary text-xl mt-1 flex-shrink-0" />
                <p className="text-sm md:text-base text-gray-300">
                  Ganhi, Cotonou<br />
                  En face du Marché de Ganhi<br />
                  Près de LG
                </p>
              </div>
              <div className="flex items-center gap-3">
                <FaPhone className="text-primary text-xl flex-shrink-0" />
                <a 
                  href="tel:+2290191260434" 
                  className="text-sm md:text-base text-gray-300 hover:text-primary transition"
                >
                  +229 01 91 26 04 34
                </a>
              </div>
            </div>
          </div>

          {/* Section 3 - Horaires */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Horaires d&apos;Ouverture</h4>
            <div className="space-y-2 text-sm md:text-base text-gray-300">
              <p><span className="font-semibold">Tous les jours:</span> 9h - 20h</p>
              <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/30">
                <p className="text-primary font-semibold">📍 Livraison disponible</p>
                <p className="text-xs text-gray-300 mt-1">Démarrage des livraisons à partir de 12h</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} FOODIRECT Catering. Tous droits réservés.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Cuisine béninoise authentique - Ganhi, Cotonou
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
