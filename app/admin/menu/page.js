'use client'

import AdminLayout from '../../../components/admin/AdminLayout';
import { useEffect, useState } from 'react';
import { menuService } from '../../../services/menuService';
import { FaPlus, FaEdit, FaTrash, FaStar } from 'react-icons/fa';
import Image from 'next/image';
import { getImageUrl } from '../../../lib/imageHelper';
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal';
import toast from 'react-hot-toast';

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: 'danger',
    title: '',
    message: '',
    onConfirm: () => {}
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'plat',
    featured: false,
    available: true,
    note: ''
  });

  useEffect(() => {
    loadMenu();
  }, [currentPage]);

  const loadMenu = async () => {
    try {
      setLoading(true);
      const data = await menuService.getAllMenu(currentPage, 10);
      console.log('📊 Données menu reçues:', data);
      
      if (data && data.data) {
        setMenuItems(data.data);
      }
      
      if (data && data.pagination) {
        setPagination(data.pagination);
        console.log('📊 Pagination menu:', data.pagination);
      }
    } catch (error) {
      console.error('❌ Erreur chargement menu:', error);
      toast.error('Erreur lors du chargement du menu');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
      setSelectedItems([]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const dataToSend = { ...formData };
      
      // Ajouter le fichier image si présent
      if (imageFile) {
        dataToSend.image = imageFile;
      }
      
      if (editingItem) {
        await menuService.updateMenu(editingItem.id, dataToSend);
        toast.success('Plat modifié avec succès!');
      } else {
        await menuService.createMenu(dataToSend);
        toast.success('Plat ajouté avec succès!');
      }
      
      setShowModal(false);
      setEditingItem(null);
      resetForm();
      loadMenu();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      featured: item.featured,
      available: item.available,
      note: item.note || ''
    });
    setImageFile(null);
    setImagePreview(item.image ? getImageUrl(item.image) : null);
    setShowPreview(false);
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        toast.error('Veuillez sélectionner une image valide');
        return;
      }
      
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('L\'image ne doit pas dépasser 5MB');
        return;
      }
      
      setImageFile(file);
      
      // Créer une preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePreview = (item) => {
    setPreviewItem(item);
    setShowPreview(true);
  };

  const handleEditFromPreview = () => {
    handleEdit(previewItem);
    setShowPreview(false);
  };

  const handleDelete = async (id) => {
    setConfirmModal({
      isOpen: true,
      type: 'danger',
      title: 'Supprimer le plat',
      message: 'Êtes-vous sûr de vouloir supprimer ce plat ? Cette action est irréversible.',
      onConfirm: async () => {
        try {
          await menuService.deleteMenu(id);
          toast.success('Plat supprimé avec succès!');
          loadMenu();
        } catch (error) {
          console.error('Erreur:', error);
          toast.error('Erreur lors de la suppression');
        }
      }
    });
  };

  const handleToggleFeatured = async (item) => {
    try {
      console.log('Toggle featured:', item.id, !item.featured);
      await menuService.toggleFeatured(item.id, !item.featured);
      toast.success(item.featured ? 'Retiré du menu du jour' : 'Ajouté au menu du jour');
      loadMenu();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === menuItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(menuItems.map(item => item.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) {
      toast.error('Aucun plat sélectionné');
      return;
    }

    setConfirmModal({
      isOpen: true,
      type: 'danger',
      title: 'Supprimer plusieurs plats',
      message: `Êtes-vous sûr de vouloir supprimer ${selectedItems.length} plat(s) ? Cette action est irréversible.`,
      onConfirm: async () => {
        try {
          // Supprimer tous les plats sélectionnés
          await Promise.all(selectedItems.map(id => menuService.deleteMenu(id)));
          toast.success(`${selectedItems.length} plat(s) supprimé(s) avec succès!`);
          setSelectedItems([]);
          loadMenu();
        } catch (error) {
          console.error('Erreur:', error);
          toast.error('Erreur lors de la suppression');
        }
      }
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'plat',
      featured: false,
      available: true,
      note: ''
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const getCategoryLabel = (category) => {
    const labels = {
      'plat': 'Plat',
      'boisson': 'Boisson',
      'dessert': 'Dessert',
      'extra': 'Extra'
    };
    return labels[category] || category;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion du Menu</h1>
            {selectedItems.length > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                {selectedItems.length} sélectionné(s)
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {selectedItems.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition text-sm"
              >
                <FaTrash /> Supprimer ({selectedItems.length})
              </button>
            )}
            <button
              onClick={() => {
                setEditingItem(null);
                resetForm();
                setShowModal(true);
              }}
              className="bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition text-sm"
            >
              <FaPlus /> Ajouter
            </button>
          </div>
        </div>

        {/* Liste des plats - Desktop */}
        <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === menuItems.length && menuItems.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-primary rounded cursor-pointer"
                  />
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Menu</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {menuItems.map((item) => (
                <tr key={item.id} className={`hover:bg-gray-50 ${selectedItems.includes(item.id) ? 'bg-blue-50' : ''}`}>
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="w-4 h-4 text-primary rounded cursor-pointer"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Image
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <span className="font-medium text-gray-900">{item.name}</span>
                  </td>
                  <td className="px-3 py-2 text-gray-500">{getCategoryLabel(item.category)}</td>
                  <td className="px-3 py-2 font-semibold text-gray-900">{parseFloat(item.price).toLocaleString()} F</td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => handleToggleFeatured(item)}
                      className="cursor-pointer"
                      title={item.featured ? 'Retirer du menu du jour' : 'Ajouter au menu du jour'}
                    >
                      <FaStar className={`text-lg ${item.featured ? 'text-yellow-500' : 'text-gray-300'}`} />
                    </button>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.available ? 'Dispo' : 'Indispo'}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit className="text-base" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash className="text-base" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Liste des plats - Mobile (Cards) */}
        <div className="md:hidden space-y-4">
          {selectedItems.length > 0 && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg flex justify-between items-center">
              <span className="text-blue-700 font-medium">
                {selectedItems.length} sélectionné(s)
              </span>
              <button
                onClick={handleDeleteSelected}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition text-sm"
              >
                <FaTrash /> Supprimer
              </button>
            </div>
          )}
          
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-lg shadow p-4 ${selectedItems.includes(item.id) ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div className="flex items-start gap-3 mb-3">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleSelectItem(item.id)}
                  className="w-5 h-5 text-primary rounded cursor-pointer mt-1"
                />
                <div 
                  onClick={() => handlePreview(item)}
                  className="flex items-center gap-4 cursor-pointer active:bg-gray-50 flex-1"
                >
                  <Image
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="rounded-full flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                    </div>
                    <p className="text-sm text-gray-500">{getCategoryLabel(item.category)}</p>
                    <p className="text-lg font-bold text-primary mt-1">
                      {parseFloat(item.price).toLocaleString()} FCFA
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.available ? '✓' : '✗'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Toggle Menu du Jour */}
              <div className="pt-3 border-t border-gray-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFeatured(item);
                  }}
                  className="flex items-center justify-between w-full"
                >
                  <span className="text-sm text-gray-600">Menu du Jour</span>
                  <div className="flex items-center gap-2">
                    {item.featured ? (
                      <>
                        <FaStar className="text-xl text-yellow-500" />
                        <span className="text-xs text-yellow-600 font-medium">Oui</span>
                      </>
                    ) : (
                      <>
                        <FaStar className="text-xl text-gray-300" />
                        <span className="text-xs text-gray-400">Non</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pagination.total > 10 && (
          <div className="mt-3 bg-white p-3 rounded-lg shadow">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="text-sm text-gray-600">
                Page {pagination.page}/{pagination.totalPages} • {pagination.total} plats
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed text-sm"
                >
                  ««
                </button>
                
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrev}
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed text-sm"
                >
                  ‹
                </button>
                
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 border rounded text-sm ${
                      pageNum === pagination.page
                        ? 'bg-primary text-white border-primary font-bold'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasNext}
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed text-sm"
                >
                  ›
                </button>
                
                <button
                  onClick={() => handlePageChange(pagination.totalPages)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed text-sm"
                >
                  »»
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Preview Mobile */}
        {showPreview && previewItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50">
            <div className="bg-white rounded-t-3xl md:rounded-lg w-full md:max-w-2xl md:mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Détails du plat</h2>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Image */}
                <div className="mb-6 flex justify-center">
                  <Image
                    src={getImageUrl(previewItem.image)}
                    alt={previewItem.name}
                    width={200}
                    height={200}
                    className="rounded-full shadow-lg"
                  />
                </div>

                {/* Info */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{previewItem.name}</h3>
                      {previewItem.featured && <FaStar className="text-yellow-500" />}
                    </div>
                    <p className="text-gray-600">{previewItem.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Prix</p>
                      <p className="text-2xl font-bold text-primary">
                        {parseFloat(previewItem.price).toLocaleString()} FCFA
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Catégorie</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {getCategoryLabel(previewItem.category)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-2">Statut</p>
                    <span className={`inline-block px-4 py-2 text-sm font-semibold rounded-full ${
                      previewItem.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {previewItem.available ? 'Disponible' : 'Indisponible'}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-2">Menu du Jour</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFeatured(previewItem);
                        setShowPreview(false);
                      }}
                      className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-lg transition"
                    >
                      {previewItem.featured ? (
                        <>
                          <FaStar className="text-2xl text-yellow-500" />
                          <div className="text-left">
                            <p className="font-semibold text-gray-900">Oui</p>
                            <p className="text-xs text-gray-500">Cliquer pour retirer</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <FaStar className="text-2xl text-gray-300" />
                          <div className="text-left">
                            <p className="font-semibold text-gray-900">Non</p>
                            <p className="text-xs text-gray-500">Cliquer pour ajouter</p>
                          </div>
                        </>
                      )}
                    </button>
                  </div>

                  {previewItem.note && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                      <p className="text-sm text-blue-700">
                        <strong>Note:</strong> {previewItem.note}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleEditFromPreview}
                    className="flex-1 bg-primary hover:bg-orange-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <FaEdit /> Modifier
                  </button>
                  <button
                    onClick={() => {
                      setShowPreview(false);
                      handleDelete(previewItem.id);
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <FaTrash /> Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">
                  {editingItem ? 'Modifier le plat' : 'Ajouter un plat'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nom du plat</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                      rows="3"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Prix (FCFA)</label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Catégorie</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                      >
                        <option value="plat">Plat</option>
                        <option value="boisson">Boisson</option>
                        <option value="dessert">Dessert</option>
                        <option value="extra">Extra</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Image du plat</label>
                    <div className="space-y-3">
                      {/* Preview de l'image */}
                      {imagePreview && (
                        <div className="relative w-32 h-32 mx-auto">
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            width={128}
                            height={128}
                            className="w-full h-full object-cover rounded-lg border-2 border-gray-300"
                          />
                        </div>
                      )}
                      
                      {/* Input file */}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-orange-600 file:cursor-pointer"
                      />
                      <p className="text-xs text-gray-500">
                        Formats acceptés: JPG, PNG, GIF, WEBP (max 5MB)
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Note (optionnel)</label>
                    <input
                      type="text"
                      value={formData.note}
                      onChange={(e) => setFormData({...formData, note: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                      placeholder="Ex: Le plat avec le tilapia est à partir de 3500"
                    />
                  </div>

                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Plat en vedette</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.available}
                        onChange={(e) => setFormData({...formData, available: e.target.checked})}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Disponible</span>
                    </label>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-primary hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition"
                    >
                      {editingItem ? 'Modifier' : 'Ajouter'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setEditingItem(null);
                        resetForm();
                      }}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-lg font-semibold transition"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de confirmation */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
      />
    </AdminLayout>
  );
}
