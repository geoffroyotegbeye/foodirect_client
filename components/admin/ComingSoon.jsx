'use client'

import { FaClock, FaTools } from 'react-icons/fa';

const ComingSoon = ({ title, description, icon }) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="mb-6">
          {icon ? (
            <div className="text-6xl mb-4">{icon}</div>
          ) : (
            <div className="inline-flex items-center justify-center w-24 h-24 bg-orange-100 rounded-full mb-4">
              <FaTools className="text-4xl text-primary" />
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {title || 'Bientôt disponible'}
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          {description || 'Cette fonctionnalité est en cours de développement et sera disponible prochainement.'}
        </p>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full">
          <FaClock />
          <span className="font-semibold">En développement</span>
        </div>

        {/* Progress indicator */}
        <div className="mt-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Progression: 60%</p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
