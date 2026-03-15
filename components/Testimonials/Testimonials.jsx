'use client'

import React from 'react';
import { FaStar } from 'react-icons/fa';
import SectionTitle from '../SectionTitle/SectionTitle';

const testimonialsData = [
  {
    id: 1,
    name: "Marie K.",
    quartier: "Ganhi",
    rating: 5,
    comment: "La meilleure cuisine béninoise de Cotonou ! Le Gbota Royal est exceptionnel. Livraison rapide et service impeccable.",
    date: "Il y a 2 semaines"
  },
  {
    id: 2,
    name: "Jean-Paul A.",
    quartier: "Akpakpa",
    rating: 5,
    comment: "J'adore leur Chawarma du chef ! Le fromage fondant est délicieux. Je commande presque tous les jours.",
    date: "Il y a 1 mois"
  },
  {
    id: 3,
    name: "Sylvie D.",
    quartier: "Cadjehoun",
    rating: 5,
    comment: "Cuisine propre et authentique. Le Pack Banger est parfait pour les grandes occasions. Très bon rapport qualité-prix !",
    date: "Il y a 3 semaines"
  }
];

const Testimonials = () => {
  return (
    <div className="container py-10 md:py-14 px-4">
      <SectionTitle 
        title="Témoignages" 
        subtitle="Ce que nos clients disent de nous !!!"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {testimonialsData.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
          >
            {/* Rating */}
            <div className="flex gap-1 mb-3">
              {[...Array(testimonial.rating)].map((_, index) => (
                <FaStar key={index} className="text-yellow-400 text-lg" />
              ))}
            </div>
            
            {/* Comment */}
            <p className="text-gray-700 text-sm md:text-base mb-4 italic">
              &ldquo;{testimonial.comment}&rdquo;
            </p>
            
            {/* Author */}
            <div className="border-t pt-3">
              <p className="font-semibold text-primary">{testimonial.name}</p>
              <p className="text-xs text-gray-500">{testimonial.quartier}</p>
              <p className="text-xs text-gray-400 mt-1">{testimonial.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
