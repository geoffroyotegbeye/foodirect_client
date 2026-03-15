'use client'

import AdminLayout from '../../../components/admin/AdminLayout';
import { useEffect, useState } from 'react';
import { userService } from '../../../services/userService';
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaShieldAlt, FaEye, FaPencilAlt } from 'react-icons/fa';
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal';
import toast from 'react-hot-toast';

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
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
    email: '',
    password: '',
    phone: '',
    role: 'viewer'
  });

  useEffect(() => {
    // Récupérer l'utilisateur connecté
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
    loadUsers();
  }, [currentPage]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers(currentPage, 10);
      console.log('📊 Données utilisateurs reçues:', data);
      
      if (data && data.data) {
        setUsers(data.data);
      }
      
      if (data && data.pagination) {
        setPagination(data.pagination);
        console.log('📊 Pagination utilisateurs:', data.pagination);
      }
    } catch (error) {
      console.error('❌ Erreur chargement utilisateurs:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingUser) {
        // Si pas de nouveau mot de passe, ne pas l'envoyer
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password;
        }
        await userService.updateUser(editingUser.id, updateData);
        toast.success('Utilisateur modifié avec succès!');
      } else {
        await userService.createUser(formData);
        toast.success('Utilisateur créé avec succès!');
      }
      
      setShowModal(false);
      setEditingUser(null);
      resetForm();
      loadUsers();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Ne pas pré-remplir le mot de passe
      phone: user.phone || '',
      role: user.role
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    setConfirmModal({
      isOpen: true,
      type: 'danger',
      title: 'Supprimer l\'utilisateur',
      message: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.',
      onConfirm: async () => {
        try {
          await userService.deleteUser(id);
          toast.success('Utilisateur supprimé avec succès!');
          loadUsers();
        } catch (error) {
          console.error('Erreur:', error);
          toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
        }
      }
    });
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await userService.toggleUserStatus(id, !currentStatus);
      toast.success(currentStatus ? 'Utilisateur désactivé' : 'Utilisateur activé');
      loadUsers();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.response?.data?.message || 'Erreur lors du changement de statut');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      role: 'viewer'
    });
  };

  const getRoleLabel = (role) => {
    const labels = {
      'admin': 'Administrateur',
      'editor': 'Éditeur',
      'viewer': 'Lecteur',
      'staff': 'Staff',
      'customer': 'Client'
    };
    return labels[role] || role;
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin': return <FaShieldAlt className="text-red-500" />;
      case 'editor': return <FaPencilAlt className="text-blue-500" />;
      case 'viewer': return <FaEye className="text-green-500" />;
      default: return null;
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      'admin': 'bg-red-100 text-red-800',
      'editor': 'bg-blue-100 text-blue-800',
      'viewer': 'bg-green-100 text-green-800',
      'staff': 'bg-purple-100 text-purple-800',
      'customer': 'bg-gray-100 text-gray-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
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
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
          </div>
          <button
            onClick={() => {
              setEditingUser(null);
              resetForm();
              setShowModal(true);
            }}
            className="bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition text-sm"
          >
            <FaPlus /> Ajouter
          </button>
        </div>

        {/* Info sur les rôles */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4">
          <p className="text-sm text-blue-700">
            <strong>Admin:</strong> Accès complet • <strong>Éditeur:</strong> Créer/modifier • <strong>Lecteur:</strong> Lecture seule
          </p>
        </div>

        {/* Liste des utilisateurs */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Téléphone</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{user.name}</span>
                      {currentUser?.id === user.id && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Vous</span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-gray-500">{user.email}</td>
                  <td className="px-3 py-2 text-gray-500">{user.phone || '-'}</td>
                  <td className="px-3 py-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => handleToggleStatus(user.id, user.is_active)}
                      disabled={currentUser?.id === user.id}
                      className={`flex items-center gap-1 ${currentUser?.id === user.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {user.is_active ? (
                        <>
                          <FaToggleOn className="text-xl text-green-500" />
                          <span className="text-xs text-green-600">Actif</span>
                        </>
                      ) : (
                        <>
                          <FaToggleOff className="text-xl text-gray-400" />
                          <span className="text-xs text-gray-500">Inactif</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Modifier"
                      >
                        <FaEdit className="text-base" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={currentUser?.id === user.id}
                        className={`text-red-600 hover:text-red-800 ${currentUser?.id === user.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title="Supprimer"
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

        {/* Pagination */}
        {pagination.total > 10 && (
          <div className="mt-3 bg-white p-3 rounded-lg shadow">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="text-sm text-gray-600">
                Page {pagination.page}/{pagination.totalPages} • {pagination.total} utilisateurs
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

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">
                  {editingUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nom complet</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Mot de passe {editingUser && '(laisser vide pour ne pas changer)'}
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                      required={!editingUser}
                      minLength="6"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Téléphone (optionnel)</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Rôle</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    >
                      <option value="admin">Administrateur (Accès complet)</option>
                      <option value="editor">Éditeur (Créer et modifier)</option>
                      <option value="viewer">Lecteur (Lecture seule)</option>
                    </select>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-primary hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition"
                    >
                      {editingUser ? 'Modifier' : 'Créer'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setEditingUser(null);
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
