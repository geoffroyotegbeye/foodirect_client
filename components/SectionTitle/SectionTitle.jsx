'use client'

import React from 'react';

const SectionTitle = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-8 md:mb-12">
      <div className="flex items-center justify-center gap-4 mb-3">
        <div className="h-[2px] w-12 md:w-20 bg-primary"></div>
        <h2 className="text-3xl md:text-5xl font-cursive text-gray-900">
          {title}
        </h2>
        <div className="h-[2px] w-12 md:w-20 bg-primary"></div>
      </div>
      {subtitle && (
        <p className="text-sm md:text-base text-gray-600 mt-2">{subtitle}</p>
      )}
    </div>
  );
};

export default SectionTitle;
