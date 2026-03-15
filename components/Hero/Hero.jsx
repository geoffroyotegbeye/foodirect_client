'use client'

import React, { useEffect, useRef } from "react";
import { FaWhatsapp } from "react-icons/fa";
import Image from "next/image";
import gsap from "gsap";

const Hero = () => {
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const buttonsRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 1.2 }
    )
    .fromTo(
      descRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1 },
      "-=0.8"
    )
    .fromTo(
      buttonsRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1 },
      "-=0.7"
    )
    .fromTo(
      imageRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 1.2 },
      "-=1"
    );
  }, []);

  return (
    <div id="accueil" className="pt-16 md:pt-20">
      <div className="container grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[500px] md:min-h-[600px] px-4">
        {/* text section */}
        <div className="flex flex-col justify-center gap-4 md:gap-8 text-center md:text-left pt-8 md:pt-24 pb-10">
          <h1 
            ref={titleRef}
            className="text-3xl md:text-4xl lg:text-6xl font-bold leading-tight"
          >
            La Cuisine Béninoise <span className="font-cursive text-primary">Authentique</span>
          </h1>
          <p ref={descRef} className="text-sm md:text-base">
            Découvrez les saveurs du terroir béninois chez FOODIRECT Catering. 
            Situé en face du marché de Ganhi, près de LG, nous vous proposons 
            des plats traditionnels préparés comme à la maison, à partir de 500 FCFA.
          </p>
          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-3 md:gap-4 items-center md:items-start md:justify-start justify-center">
            <a href="#menu" className="primary-btn hover:scale-105 duration-200 w-full sm:w-auto text-center">
              Voir nos Spécialités
            </a>
            <a 
              href="https://wa.me/2290191260434?text=Bonjour%20FOODIRECT,%20je%20souhaite%20commander" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-500 text-white font-bold px-4 py-2 rounded-full hover:scale-105 duration-200 hover:bg-green-600 w-full sm:w-auto"
            >
              <FaWhatsapp className="text-xl md:text-2xl" />
              <span className="hidden sm:inline">Commander via WhatsApp</span>
              <span className="sm:hidden">WhatsApp</span>
            </a>
          </div>
        </div>
        {/* image section */}
        <div className="flex flex-col justify-center items-center">
          <div ref={imageRef}>
            <Image
              src="/assets/1.png"
              alt="Plat FOODIRECT"
              width={400}
              height={400}
              className="animate-spin-slow img-shadow w-[250px] md:w-[350px] lg:w-[400px] mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
