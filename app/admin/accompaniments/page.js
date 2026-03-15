'use client'

import AdminLayout from '../../../components/admin/AdminLayout';
import { useEffect, useState } from 'react';
import { accompanimentService } from '../../../services/accompanimentService';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaList, FaTh, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import Image from 'next/image';
import { getImageUrl } from '../../../lib/imageHelper';
import toast from 'react-hot-toast';
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal';

const empty = { name: '', description: '', price: '', available: true, image: null };

export default function AccompanimentsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('card');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [preview, setPreview] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, onConfirm: () => {} });

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      setLoading(true);
      const res = await accompanimentService.getAll();
      setItems(res.data || []);
    } catch { toast.error('Erreur chargement'); }
    finally { setLoading(false); }
  };

  const openCreate = () => { setEditing(null); setForm(empty); setPreview(null); setShowModal(true); };
  const openEdit = (item) => {
    setEditing(item);
    setForm({ name: item.name, description: item.description || '', price: item.price, available: !!item.available, image: null });
    setPreview(getImageUrl(item.image));
    setShowModal(true);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Image invalide'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Max 5MB'); return; }
    setForm(f => ({ ...f, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await accompanimentService.update(editing.id, form);
        toast.success('Accompagnement modifié');
      } else {
        await accompanimentService.create(form);
        toast.success('Accompagnement créé');
      }
      setShowModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur enregistrement');
    }
  };

  const handleDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      onConfirm: async () => {
        try {
          await accompanimentService.remove(id);
          toast.success('Supprimé');
          load();
        } catch { toast.error('Erreur suppression'); }
      }
    });
  };

  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) return;
    setConfirmModal({
      isOpen: true,
      onConfirm: async () => {
        try {
          await Promise.all(selectedItems.map(id => accompanimentService.remove(id)));
          toast.success(`${selectedItems.length} supprimé(s)`);
          setSelectedItems([]);
          load();
        } catch { toast.error('Erreur suppression'); }
      }
    });
  };

  const handleToggle = async (item) => {
    try {
      await accompanimentService.update(item.id, { ...item, available: !item.available });
      toast.success(item.available ? 'Désactivé' : 'Activé');
      load();
    } catch { toast.error('Erreur'); }
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    setSelectedItems(selectedItems.length === items.length ? [] : items.map(i => i.id));
  };

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Accompagnements</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {selectedItems.length > 0 ? `${selectedItems.length} sélectionné(s)` : `${items.length} accompagnement(s)`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selectedItems.length > 0 ? (
              <button onClick={handleDeleteSelected} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition">
                <FaTrash /> Supprimer ({selectedItems.length})
              </button>
            ) : null}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button onClick={() => setViewMode('card')} className={`p-2 rounded-md transition ${viewMode === 'card' ? 'bg-white shadow text-primary' : 'text-gray-400 hover:text-gray-600'}`} title="Vue carte"><FaTh /></button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition ${viewMode === 'list' ? 'bg-white shadow text-primary' : 'text-gray-400 hover:text-gray-600'}`} title="Vue liste"><FaList /></button>
            </div>
            <button onClick={openCreate} className="bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition">
              <FaPlus /> Ajouter
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 text-gray-400 bg-white rounded-xl shadow">
            <p className="text-5xl mb-4">🍹</p>
            <p className="text-lg font-medium">Aucun accompagnement</p>
            <p className="text-sm mt-1">Créez votre premier accompagnement</p>
            <button onClick={openCreate} className="mt-4 bg-primary text-white px-6 py-2 rounded-lg text-sm">
              <FaPlus className="inline mr-2" />Ajouter
            </button>
          </div>
        ) : viewMode === 'card' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map(item => (
              <div key={item.id} className={`bg-white rounded-xl shadow overflow-hidden border border-gray-100 hover:shadow-md transition group ${selectedItems.includes(item.id) ? 'ring-2 ring-primary' : ''}`}>
                <div className="relative h-40 w-full overflow-hidden">
                  <Image src={getImageUrl(item.image)} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="25vw" />
                  <div className="absolute top-2 left-2">
                    <input type="checkbox" checked={selectedItems.includes(item.id)} onChange={() => handleSelectItem(item.id)} className="w-4 h-4 text-primary rounded cursor-pointer" />
                  </div>
                  {!item.available && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white text-xs font-bold bg-red-500 px-2 py-1 rounded-full">Indisponible</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${!!item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {!!item.available ? 'Dispo' : 'Indispo'}
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <p className="font-semibold text-gray-900 truncate">{item.name}</p>
                  <p className="text-primary font-bold text-sm mt-0.5">{parseFloat(item.price).toLocaleString()} FCFA</p>
                  {item.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>}
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => handleToggle(item)} className="text-gray-400 hover:text-primary transition" title="Toggle disponibilité">
                      {!!item.available ? <FaToggleOn className="text-xl text-green-500" /> : <FaToggleOff className="text-xl text-gray-400" />}
                    </button>
                    <button onClick={() => openEdit(item)} className="flex-1 flex items-center justify-center gap-1 text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-lg py-1.5 text-xs transition">
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
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input type="checkbox" checked={selectedItems.length === items.length && items.length > 0} onChange={handleSelectAll} className="w-4 h-4 text-primary rounded cursor-pointer" />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map(item => (
                  <tr key={item.id} className={`hover:bg-gray-50 transition ${selectedItems.includes(item.id) ? 'bg-blue-50' : ''}`}>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selectedItems.includes(item.id)} onChange={() => handleSelectItem(item.id)} className="w-4 h-4 text-primary rounded cursor-pointer" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                        <Image src={getImageUrl(item.image)} alt={item.name} fill className="object-cover" sizes="48px" />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell max-w-xs truncate">{item.description || '-'}</td>
                    <td className="px-4 py-3 font-bold text-primary">{parseFloat(item.price).toLocaleString()} F</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleToggle(item)}>
                        {item.available ? <FaToggleOn className="text-2xl text-green-500" /> : <FaToggleOff className="text-2xl text-gray-400" />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(item)} className="text-blue-600 hover:text-blue-800 transition"><FaEdit /></button>
                        <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 transition"><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal création/modification */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
              <h2 className="text-lg font-bold">{editing ? 'Modifier' : 'Ajouter'} un accompagnement</h2>
              <button onClick={() => setShowModal(false)}><FaTimes className="text-gray-400 hover:text-gray-700 text-xl" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Image</label>
                {preview && (
                  <div className="relative h-40 w-full rounded-xl overflow-hidden mb-3 border">
                    <Image src={preview} alt="preview" fill className="object-cover" />
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleImage}
                  className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-orange-600 file:cursor-pointer" />
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — max 5MB</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nom *</label>
                <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" placeholder="Ex: Jus naturel" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input type="text" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" placeholder="Ex: Jus de gingembre maison" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Prix (FCFA) *</label>
                <input type="number" required min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" placeholder="500" />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={form.available} onChange={e => setForm(f => ({ ...f, available: e.target.checked }))} />
                  <div className={`w-10 h-6 rounded-full transition ${form.available ? 'bg-primary' : 'bg-gray-300'}`}></div>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.available ? 'translate-x-5' : 'translate-x-1'}`}></div>
                </div>
                <span className="text-sm font-medium">Disponible</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-primary hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition">
                  {editing ? 'Modifier' : 'Créer'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold transition">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title="Supprimer les accompagnements"
        message="Cette action est irréversible."
        type="danger"
      />
    </AdminLayout>
  );
}
