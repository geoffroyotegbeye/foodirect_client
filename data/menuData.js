export const menuCategories = {
  repas: [
    {
      id: 1,
      name: "Pack Banger",
      price: "10000",
      description: "Riz + Hors d'oeuvres chaud + lapin/poulet bicyclette + wassa wassa + 2 ailerons + Chawarma viande",
      image: "/assets/3.png",
      category: "repas",
      featured: true
    },
    {
      id: 2,
      name: "Sauce Gbota Royal (tête de mouton)",
      price: "5000/9000",
      description: "Avec Akassa ou Piron",
      image: "/assets/4.png",
      category: "repas",
      featured: true
    },
    {
      id: 3,
      name: "Sauce Assrokouin bien garnie",
      price: "3000/3500/4000/5000/6000",
      description: "Avec telibo",
      image: "/assets/5.png",
      category: "repas"
    },
    {
      id: 4,
      name: "Telibo avec sauce gombo (Fetri gboman)",
      price: "3000/3500/4000/5000/6000",
      description: "Avec telibo ou Akassa",
      image: "/assets/3.png",
      category: "repas"
    },
    {
      id: 5,
      name: "Agbeli",
      price: "3000/3500/4000/5000/6000",
      description: "Avec sauce gombo ou sauce mouton fromage",
      image: "/assets/4.png",
      category: "repas"
    },
    {
      id: 6,
      name: "Sauce Mouton",
      price: "3000/3500/4000/5000/6000",
      description: "Avec Telibo ou Akassa ou Agbeli",
      image: "/assets/5.png",
      category: "repas"
    },
    {
      id: 7,
      name: "Sauce Gombo Fretri gboman",
      price: "3000/3500/4500/5000/6000",
      description: "Avec Agbeli ou telibo ou akassa",
      image: "/assets/3.png",
      category: "repas"
    },
    {
      id: 8,
      name: "Hors d'oeuvres à Chaud",
      price: "3000/3500/4000/5000/6000",
      description: "Avec du pain",
      image: "/assets/4.png",
      category: "repas"
    },
    {
      id: 9,
      name: "Attieke",
      price: "3000/3500/4000/5000/6000",
      description: "Avec poulet bicyclette braisé ou lapin braisé ou mouton braisé ou aileron braisé ou aloco poisson (silivi ou tilapia) ou croupion de dinde",
      image: "/assets/5.png",
      category: "repas",
      note: "Le plat avec le tilapia est à partir de 3500 et avec poisson silivi à partir de 2500"
    },
    {
      id: 10,
      name: "Frites avec aloco",
      price: "3000/3500/4000/5000/6000",
      description: "Avec poulet bicyclette braisé ou lapin braisé ou mouton braisé ou aileron braisé ou poisson (silivi ou tilapia) ou croupion de dinde",
      image: "/assets/3.png",
      category: "repas",
      note: "Le plat avec le tilapia est à partir de 3500"
    },
    {
      id: 11,
      name: "Poulet bicyclette braisé Complet",
      price: "6000",
      description: "Poulet entier braisé sans accompagnement",
      image: "/assets/4.png",
      category: "repas"
    },
    {
      id: 12,
      name: "Wassa wassa",
      price: "3000/3500/4000/5000/6000",
      description: "Avec poulet bicyclette braisé ou lapin braisé ou mouton braisé ou aileron braisé ou poisson (silivi ou tilapia) ou croupion de dinde",
      image: "/assets/5.png",
      category: "repas",
      note: "Le plat avec le tilapia est à partir de 3500"
    },
    {
      id: 13,
      name: "Chawarma du chef",
      price: "3500/4000/5000/6000",
      description: "Viande de boeuf et fromage fondant",
      image: "/assets/3.png",
      category: "repas",
      featured: true
    },
    {
      id: 14,
      name: "Chawarma standard",
      price: "2000/2500/3000/4000",
      description: "Avec Viande de bœuf",
      image: "/assets/4.png",
      category: "repas"
    },
    {
      id: 15,
      name: "Riz au gras",
      price: "3000/3500/4000/6000",
      description: "Avec poulet bicyclette ou lapin braisé ou mouton braisé ou aileron braisé ou poisson (silivi ou tilapia)",
      image: "/assets/5.png",
      category: "repas",
      note: "Le plat avec le tilapia est à partir de 3500"
    }
  ],
  desserts: [
    {
      id: 16,
      name: "Tapio riz au lait",
      price: "1500",
      description: "Bouillie à base de riz et de tapioca + lait + arachide",
      image: "/assets/2.png",
      category: "dessert"
    }
  ],
  extras: [
    {
      id: 17,
      name: "Portion piron",
      price: "500",
      description: "Pâte faite à base du gari",
      image: "/assets/1.png",
      category: "extra"
    },
    {
      id: 18,
      name: "Portions frites",
      price: "1000",
      description: "Portions de frites, aloko, ou de riz",
      image: "/assets/2.png",
      category: "extra"
    }
  ]
};

export const getAllMenuItems = () => {
  return [
    ...menuCategories.repas,
    ...menuCategories.desserts,
    ...menuCategories.extras
  ];
};
