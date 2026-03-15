'use client'

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaHome, 
  FaUtensils, 
  FaShoppingCart, 
  FaUsers, 
  FaChartBar, 
  FaCog,
  FaSignOutAlt,
  FaTimes
} from 'react-icons/fa';

const Sidebar = ({ user, onLogout, onClose }) => {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: FaHome },
    { name: 'Menu', path: '/admin/menu', icon: FaUtensils },
    { name: 'Commandes', path: '/admin/orders', icon: FaShoppingCart },
    { name: 'Utilisateurs', path: '/admin/users', icon: FaUsers },
    { name: 'Statistiques', path: '/admin/stats', icon: FaChartBar },
    { name: 'Paramètres', path: '/admin/settings', icon: FaCog },
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  const handleNavigation = (path) => {
    router.push(path);
    if (onClose) onClose(); // Fermer le menu mobile après navigation
  };

  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col">
      {/* Header avec bouton fermer (mobile) */}
      <div className="p-6 border-b border-gray-700 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">FOODIRECT</h1>
          <p className="text-sm text-gray-400 mt-1">Administration</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <FaTimes className="text-2xl" />
          </button>
        )}
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${
                active
                  ? 'bg-primary text-white border-r-4 border-orange-600'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="text-xl" />
              <span className="font-medium">{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer: User Info + Déconnexion */}
      <div className="border-t border-gray-700">
        {/* User Info */}
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Bouton Déconnexion */}
        <div className="px-4 pb-4">
          <button
            onClick={onLogout}
            className="flex items-center justify-center gap-3 px-4 py-3 w-full bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium cursor-pointer"
          >
            <FaSignOutAlt className="text-xl" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
