'use client'

import AdminLayout from '../../../components/admin/AdminLayout';
import { useEffect, useState } from 'react';
import { menuService } from '../../../services/menuService';
import { accompanimentService } from '../../../services/accompanimentService';
import { FaPlus, FaEdit, FaTrash, FaStar, FaList, FaTh, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import Image from 'next/image';
import { getImageUrl } from '../../../lib/imageHelper';
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal';
import toast from 'react-hot-toast';

export default function MenuManagement() {
  const [viewMode, setViewMode] = useState('card');
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
  const [allAccompaniments, setAllAccompaniments] = useState([]);
  const [selectedAccompaniments, setSelectedAccompaniments] = useState([]);
  const [accompSearch, setAccompSearch] = useState('');
  const [formStep, setFormStep] = useState(1);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: 'danger',
    title: '',
    message: '',
    onConfirm: () => {}
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
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
    accompanimentService.getAll().then(res => setAllAccompaniments(res.data || []));
  }, [currentPage]);

  const loadMenu = async () => {
    try {
      setLoading(true);
      const data = await menuService.getAllMenu(currentPage, 8);
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
    if (e && e.preventDefault) e.preventDefault();
    try {
      const dataToSend = { ...formData };
      if (imageFile) dataToSend.image = imageFile;

      let menuId;
      if (editingItem) {
        await menuService.updateMenu(editingItem.id, dataToSend);
        menuId = editingItem.id;
        toast.success('Plat modifié avec succès!');
      } else {
        const res = await menuService.createMenu(dataToSend);
        menuId = res.data?.id;
        toast.success('Plat ajouté avec succès!');
      }

      // Sauvegarder les accompagnements associés
      if (menuId) {
        await accompanimentService.setMenuAccompaniments(menuId, selectedAccompaniments);
      }

      setShowModal(false);
      setEditingItem(null);
      setSelectedAccompaniments([]);
      setAccompSearch('');
      setFormStep(1);
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
      featured: !!item.featured,
      available: !!item.available,
      note: item.note || ''
    });
    setImageFile(null);
    setImagePreview(item.image ? getImageUrl(item.image) : null);
    setShowPreview(false);
    setFormStep(1);
    // Charger les accompagnements associés
    accompanimentService.getByMenu(item.id).then(res => {
      setSelectedAccompaniments((res.data || []).map(a => a.id));
    });
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
            {selectedItems.length > 0 ? (
              <p className="text-sm text-gray-600 mt-1">
                {selectedItems.length} sélectionné(s)
              </p>
            ) : null}
          </div>
          <div className="flex gap-2">
            {selectedItems.length > 0 ? (
              <button
                onClick={handleDeleteSelected}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition text-sm"
              >
                <FaTrash /> Supprimer ({selectedItems.length})
              </button>
            ) : null}
            {/* Toggle vue */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('card')}
                className={`p-2 rounded-md transition ${viewMode === 'card' ? 'bg-white shadow text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                title="Vue carte"
              >
                <FaTh />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition ${viewMode === 'list' ? 'bg-white shadow text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                title="Vue liste"
              >
                <FaList />
              </button>
            </div>
            <button
              onClick={() => {
                setEditingItem(null);
                resetForm();
                setSelectedAccompaniments([]);
                setFormStep(1);
                setShowModal(true);
              }}
              className="bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition text-sm"
            >
              <FaPlus /> Ajouter
            </button>
          </div>
        </div>

        {/* Vue carte */}
        {viewMode === 'card' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {menuItems.map(item => (
              <div key={item.id} className={`bg-white rounded-xl shadow overflow-hidden border border-gray-100 hover:shadow-md transition group ${selectedItems.includes(item.id) ? 'ring-2 ring-primary' : ''}`}>
                <div className="relative h-40 w-full overflow-hidden">
                  <Image src={getImageUrl(item.image)} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="25vw" />
                  <div className="absolute top-2 left-2">
                    <input type="checkbox" checked={selectedItems.includes(item.id)} onChange={() => handleSelectItem(item.id)} className="w-4 h-4 text-primary rounded cursor-pointer" />
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {item.available ? 'Dispo' : 'Indispo'}
                    </span>
                  </div>
                  {item.featured && (
                    <div className="absolute bottom-2 left-2">
                      <FaStar className="text-yellow-400 text-lg drop-shadow" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-semibold text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-400">{getCategoryLabel(item.category)}</p>
                  <p className="text-primary font-bold text-sm mt-0.5">{parseFloat(item.price).toLocaleString()} FCFA</p>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => handleToggleFeatured(item)} title={item.featured ? 'Retirer du menu du jour' : 'Ajouter au menu du jour'}>
                      <FaStar className={`text-xl ${item.featured ? 'text-yellow-500' : 'text-gray-300'}`} />
                    </button>
                    <button onClick={() => handleEdit(item)} className="flex-1 flex items-center justify-center gap-1 text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-lg py-1.5 text-xs transition">
                      <FaEdit /> Modifier
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="flex-1 flex items-center justify-center gap-1 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg py-1.5 text-xs transition">
                      <FaTrash /> Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Vue liste - Desktop */}
        {viewMode === 'list' && (
          <>
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
          {selectedItems.length > 0 ? (
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
          ) : null}
          
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
        </>
        )}

        {/* Pagination */}
        {pagination.total > 8 && (
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
            <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] flex flex-col">

              {/* Header fixe */}
              <div className="px-6 pt-5 pb-4 border-b flex-shrink-0">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">{editingItem ? 'Modifier le plat' : 'Ajouter un plat'}</h2>
                  <button type="button" onClick={() => { setShowModal(false); setEditingItem(null); setAccompSearch(''); setFormStep(1); resetForm(); }} className="text-gray-400 hover:text-gray-700 text-xl">✕</button>
                </div>
                {/* Stepper */}
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-2 flex-1`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      formStep === 1 ? 'bg-primary text-white' : 'bg-green-500 text-white'
                    }`}>
                      {formStep > 1 ? '✓' : '1'}
                    </div>
                    <span className={`text-sm font-medium ${formStep === 1 ? 'text-gray-900' : 'text-gray-400'}`}>Informations</span>
                  </div>
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <div className={`flex items-center gap-2 flex-1 justify-end`}>
                    <span className={`text-sm font-medium ${formStep === 2 ? 'text-gray-900' : 'text-gray-400'}`}>Accompagnements</span>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      formStep === 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
                    }`}>2</div>
                  </div>
                </div>
              </div>

              {/* Contenu scrollable */}
              <div className="overflow-y-auto flex-1 px-6 py-4">

                {/* Étape 1 */}
                {formStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Nom du plat *</label>
                      <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" required />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Description *</label>
                      <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                        className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" rows="3" required />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Prix (FCFA) *</label>
                        <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
                          className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Catégorie</label>
                        <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                          className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none">
                          <option value="plat">Plat</option>
                          <option value="boisson">Boisson</option>
                          <option value="dessert">Dessert</option>
                          <option value="extra">Extra</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Image</label>
                      {imagePreview && (
                        <div className="relative w-28 h-28 mx-auto mb-2">
                          <Image src={imagePreview} alt="Preview" width={112} height={112} className="w-full h-full object-cover rounded-lg border-2 border-gray-200" />
                        </div>
                      )}
                      <input type="file" accept="image/*" onChange={handleImageChange}
                        className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-orange-600 file:cursor-pointer" />
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — max 5MB</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Note (optionnel)</label>
                      <input type="text" value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})}
                        className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                        placeholder="Ex: Le plat avec le tilapia est à partir de 3500" />
                    </div>

                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="w-4 h-4" />
                        <span className="text-sm">Plat en vedette</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={formData.available} onChange={e => setFormData({...formData, available: e.target.checked})} className="w-4 h-4" />
                        <span className="text-sm">Disponible</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Étape 2 */}
                {formStep === 2 && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-500">Sélectionnez les accompagnements à proposer avec ce plat.</p>

                    {/* Tags sélectionnés */}
                    {selectedAccompaniments.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {selectedAccompaniments.map(id => {
                          const a = allAccompaniments.find(x => x.id === id);
                          if (!a) return null;
                          return (
                            <span key={id} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
                              {a.name}
                              <button type="button" onClick={() => setSelectedAccompaniments(prev => prev.filter(i => i !== id))} className="hover:text-red-500 transition">✕</button>
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {/* Recherche */}
                    <input type="text" value={accompSearch} onChange={e => setAccompSearch(e.target.value)}
                      placeholder="Rechercher..."
                      className="w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none" />

                    {/* Liste */}
                    {allAccompaniments.length === 0 ? (
                      <div className="text-center py-10 text-gray-400">
                        <p className="text-3xl mb-2">🍹</p>
                        <p className="text-sm">Aucun accompagnement créé</p>
                      </div>
                    ) : (
                      <div className="border rounded-lg overflow-hidden">
                        <div className="divide-y divide-gray-100">
                          {allAccompaniments.filter(a => a.name.toLowerCase().includes(accompSearch.toLowerCase())).map(a => (
                            <label key={a.id} className={`flex items-center gap-3 px-3 py-3 cursor-pointer transition ${
                              selectedAccompaniments.includes(a.id) ? 'bg-primary/5' : 'hover:bg-gray-50'
                            }`}>
                              <input type="checkbox" checked={selectedAccompaniments.includes(a.id)}
                                onChange={() => setSelectedAccompaniments(prev =>
                                  prev.includes(a.id) ? prev.filter(id => id !== a.id) : [...prev, a.id]
                                )}
                                className="w-4 h-4 accent-primary flex-shrink-0" />
                              <span className="text-sm text-gray-800 flex-1">{a.name}</span>
                              <span className="text-xs text-primary font-semibold">{parseFloat(a.price).toLocaleString()} F</span>
                            </label>
                          ))}
                          {allAccompaniments.filter(a => a.name.toLowerCase().includes(accompSearch.toLowerCase())).length === 0 && (
                            <p className="text-xs text-gray-400 text-center py-6">Aucun résultat</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer fixe */}
              <div className="px-6 py-4 border-t flex-shrink-0 flex gap-3">
                {formStep === 1 ? (
                  <>
                    <button type="button" onClick={() => { setShowModal(false); setEditingItem(null); setAccompSearch(''); setFormStep(1); resetForm(); }}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold transition text-sm">
                      Annuler
                    </button>
                    <button type="button"
                      onClick={() => { if (!formData.name || !formData.description || !formData.price) { toast.error('Remplissez les champs obligatoires'); return; } setFormStep(2); }}
                      className="flex-1 bg-primary hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition text-sm">
                      Suivant →
                    </button>
                  </>
                ) : (
                  <>
                    <button type="button" onClick={() => setFormStep(1)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold transition text-sm">
                      ← Retour
                    </button>
                    <button type="button" onClick={handleSubmit}
                      className="flex-1 bg-primary hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition text-sm">
                      {editingItem ? 'Modifier' : 'Créer'}
                    </button>
                  </>
                )}
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
