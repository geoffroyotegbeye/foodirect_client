'use client'

import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import MenuDuJour from "../components/MenuDuJour/MenuDuJour";
import TopList from "../components/TopList/TopList";
import Banner from "../components/Banner/Banner";
import OurServices from "../components/OurServices/OurServices";
import OrderForm from "../components/OrderForm/OrderForm";
import Testimonials from "../components/Testimonials/Testimonials";
import Footer from "../components/Footer/Footer";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";

export default function Home() {
  const bgStyle = {
    backgroundImage: `url('/assets/2.png')`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  // Données structurées JSON-LD pour le SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "FOODIRECT Catering",
    "description": "Restaurant de cuisine béninoise authentique à Ganhi, Cotonou",
    "image": "https://foodirect.netlify.app/assets/1.png",
    "url": "https://foodirect.netlify.app",
    "telephone": "+2290191260434",
    "priceRange": "500-10000 FCFA",
    "servesCuisine": "Béninoise",
    "acceptsReservations": "True",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "En face du Marché de Ganhi, près de LG",
      "addressLocality": "Ganhi",
      "addressRegion": "Littoral",
      "addressCountry": "BJ",
      "postalCode": ""
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "6.3703",
      "longitude": "2.3912"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "09:00",
        "closes": "20:00"
      }
    ],
    "menu": "https://foodirect.netlify.app/#menu",
    "sameAs": [
      "https://wa.me/2290191260434"
    ]
  };

  return (
    <>
      {/* Données structurées JSON-LD pour le SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="overflow-x-hidden">
        <Navbar />
        <div style={bgStyle} className="overflow-x-hidden">
          <div className="min-h-screen bg-white/50 backdrop-blur-3xl">
            <Hero />
            <MenuDuJour />
            <TopList />
            <Banner />
            <OurServices />
            <OrderForm />
            <Testimonials />
          </div>
        </div>
        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
}
