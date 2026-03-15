'use client'

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from 'next/navigation';
import { FaPhone, FaShoppingCart } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import { useCart } from "../../context/CartContext";

const NAV_LINKS = [
  { label: 'Accueil',     anchor: 'accueil' },
  { label: 'Spécialités', anchor: 'menu' },
  { label: 'Services',    anchor: 'services' },
  { label: 'Commander',   anchor: 'commander' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleNav = (anchor) => {
    closeMenu();
    if (pathname === '/') {
      document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push(`/#${anchor}`);
    }
  };

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
            {NAV_LINKS.map(({ label, anchor }) => (
              <li key={anchor} className="hover:border-b-2 border-primary uppercase cursor-pointer transition">
                <button onClick={() => handleNav(anchor)}>{label}</button>
              </li>
            ))}
          </ul>
          <a
            href="tel:+22901160557623"
            className="hidden lg:flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/90 transition font-semibold"
          >
            <FaPhone className="text-sm" />
            <span>01 60 55 76 23</span>
          </a>

          {/* Icône panier */}
          <button
            onClick={() => document.querySelector('[data-cart-trigger]')?.click()}
            className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-orange-50 transition"
            aria-label="Panier"
          >
            <FaShoppingCart className="text-xl text-gray-700" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile : panier + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => document.querySelector('[data-cart-trigger]')?.click()}
            className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-orange-50 transition"
            aria-label="Panier"
          >
            <FaShoppingCart className="text-xl text-gray-700" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </button>
          <button
            className="text-2xl text-gray-700 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg px-6 py-4 flex flex-col gap-4 text-sm uppercase font-medium">
          {NAV_LINKS.map(({ label, anchor }) => (
            <button key={anchor} onClick={() => handleNav(anchor)} className="text-left hover:text-primary transition">{label}</button>
          ))}
          <a
            href="tel:+22901160557623"
            onClick={closeMenu}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full w-fit hover:bg-primary/90 transition font-semibold"
          >
            <FaPhone className="text-sm" />
            <span>01 60 55 76 23</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default Navbar;
