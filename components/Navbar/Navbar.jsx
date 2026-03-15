'use client'

import React, { useState, useEffect } from "react";
import { FaPhone } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3 lg:py-4 ${
      scrolled ? 'bg-white shadow-lg' : 'bg-white/90 backdrop-blur-md shadow-md'
    }`}>
      <div className="container flex justify-between items-center px-4">
        {/* Logo */}
        <div>
          <a href="#accueil" className="text-2xl md:text-3xl lg:text-4xl font-bold cursor-pointer">
            FOO<span className="text-primary">DIRECT</span>
          </a>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex justify-center items-center gap-4 md:gap-6">
          <ul className="gap-6 lg:gap-8 flex text-sm lg:text-base">
            <li className="hover:border-b-2 border-primary uppercase cursor-pointer transition">
              <a href="#accueil">Accueil</a>
            </li>
            <li className="hover:border-b-2 border-primary uppercase cursor-pointer transition">
              <a href="#menu">Spécialités</a>
            </li>
            <li className="hover:border-b-2 border-primary uppercase cursor-pointer transition">
              <a href="#services">Services</a>
            </li>
            <li className="hover:border-b-2 border-primary uppercase cursor-pointer transition">
              <a href="#commander">Commander</a>
            </li>
          </ul>
          <a
            href="tel:+2290191260434"
            className="hidden lg:flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/90 transition font-semibold"
          >
            <FaPhone className="text-sm" />
            <span>01 91 26 04 34</span>
          </a>
        </div>

        {/* Hamburger button (mobile only) */}
        <button
          className="md:hidden text-2xl text-gray-700 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg px-6 py-4 flex flex-col gap-4 text-sm uppercase font-medium">
          <a href="#accueil" onClick={closeMenu} className="hover:text-primary transition">Accueil</a>
          <a href="#menu" onClick={closeMenu} className="hover:text-primary transition">Spécialités</a>
          <a href="#services" onClick={closeMenu} className="hover:text-primary transition">Services</a>
          <a href="#commander" onClick={closeMenu} className="hover:text-primary transition">Commander</a>
          <a
            href="tel:+2290191260434"
            onClick={closeMenu}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full w-fit hover:bg-primary/90 transition font-semibold"
          >
            <FaPhone className="text-sm" />
            <span>01 91 26 04 34</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default Navbar;
