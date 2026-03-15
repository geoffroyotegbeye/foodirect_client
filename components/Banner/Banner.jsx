'use client'

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import SectionTitle from "../SectionTitle/SectionTitle";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Banner = () => {
  const imageRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      imageRef.current,
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: imageRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    gsap.fromTo(
      textRef.current,
      { opacity: 0, x: 50 },
      {
        opacity: 1,
        x: 0,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, []);

  return (
    <>
      <div id="apropos" className="container py-10 md:py-14 px-4">
        <SectionTitle
          title="À Propos"
          subtitle="Une cuisine propre et authentique"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
          {/* img section */}
          <div ref={imageRef} className="flex justify-center items-center order-2 md:order-1">
            <Image
              src="/assets/2.png"
              alt="FOODIRECT Restaurant"
              width={500}
              height={500}
              className="w-full max-w-[300px] md:max-w-full rounded-3xl shadow-2xl"
            />
          </div>
          {/* text section */}
          <div ref={textRef} className="flex flex-col justify-center text-center md:text-left order-1 md:order-2">
            <p className="text-sm md:text-base leading-relaxed">
              Chez FOODIRECT, nous vous garantissons une cuisine béninoise traditionnelle
              préparée dans le respect des normes d&apos;hygiène. Notre service de livraison
              est disponible pour vous apporter nos délicieux plats directement à votre bureau
              ou à domicile dans la zone de Ganhi et ses environs.
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <span className="text-2xl">✅</span>
                <span className="font-semibold">Hygiène professionnelle</span>
              </div>
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <span className="text-2xl">🍽️</span>
                <span className="font-semibold">Cuisine authentique</span>
              </div>
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <span className="text-2xl">🚚</span>
                <span className="font-semibold">Livraison rapide</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Banner;
