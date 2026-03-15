'use client'

import AdminLayout from '../../../components/admin/AdminLayout';
import { useEffect, useState } from 'react';
import { orderService } from '../../../services/orderService';
import { FaEye, FaTrash, FaList, FaTh, FaFilter } from 'react-icons/fa';
import toast from 'react-hot-toast';
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal';

const STATUSES = [
  { value: 'en_attente', label: 'En attente', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'confirmee', label: 'Confirmée', color: 'bg-blue-100 text-blue-700' },
  { value: 'en_preparation', label: 'En préparation', color: 'bg-orange-100 text-orange-700' },
  { value: 'en_livraison', label: 'En livraison', color: 'bg-purple-100 text-purple-700' },
  { value: 'livree', label: 'Livrée', color: 'bg-green-100 text-green-700' },
  { value: 'annulee', label: 'Annulée', color: 'bg-red-100 text-red-700' },
];

const PAYMENT_STATUSES = [
  { value: 'en_attente', label: 'En attente', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'payee', label: 'Payée', color: 'bg-green-100 text-green-700' },
  { value: 'echouee', label: 'Échouée', color: 'bg-red-100 text-red-700' },
];

const getStatus = (value) => STATUSES.find(s => s.value === value) || STATUSES[0];
const getPaymentStatus = (value) => PAYMENT_STATUSES.find(s => s.value === value) || PAYMENT_STATUSES[0];

const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailOrder, setDetailOrder] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, onConfirm: () => {} });

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (filterStatus === 'all') setFiltered(orders);
    else setFiltered(orders.filter(o => o.status === filterStatus));
  }, [filterStatus, orders]);

  const load = async () => {
    try {
      setLoading(true);
      const res = await orderService.getAllOrders();
      setOrders(res.data || []);
    } catch { toast.error('Erreur chargement'); }
    finally { setLoading(false); }
  };

  const openDetail = async (order) => {
    setSelectedOrder(order);
    setLoadingDetail(true);
    try {
      const res = await orderService.getOrderById(order.id);
      setDetailOrder(res.data);
    } catch { toast.error('Erreur chargement détail'); }
    finally { setLoadingDetail(false); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await orderService.updateOrderStatus(id, status);
      toast.success('Statut mis à jour');
      load();
      if (detailOrder?.id === id) {
        setDetailOrder(prev => ({ ...prev, status }));
      }
    } catch { toast.error('Erreur mise à jour statut'); }
  };

  const handlePaymentStatusChange = async (id, payment_status) => {
    try {
      await orderService.updatePaymentStatus(id, payment_status);
      toast.success('Statut paiement mis à jour');
      load();
      if (detailOrder?.id === id) {
        setDetailOrder(prev => ({ ...prev, payment_status }));
      }
    } catch { toast.error('Erreur mise à jour paiement'); }
  };

  const handleDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      onConfirm: async () => {
        try {
          await orderService.deleteOrder(id);
          toast.success('Commande supprimée');
          if (selectedOrder?.id === id) { setSelectedOrder(null); setDetailOrder(null); }
          load();
        } catch { toast.error('Erreur suppression'); }
      }
    });
  };

  const counts = STATUSES.reduce((acc, s) => {
    acc[s.value] = orders.filter(o => o.status === s.value).length;
    return acc;
  }, {});

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
            <h1 className="text-2xl font-bold text-gray-900">Commandes</h1>
            <p className="text-sm text-gray-500 mt-0.5">{filtered.length} commande(s)</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button onClick={() => setViewMode('card')} className={`p-2 rounded-md transition ${viewMode === 'card' ? 'bg-white shadow text-primary' : 'text-gray-400 hover:text-gray-600'}`} title="Vue carte"><FaTh /></button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition ${viewMode === 'list' ? 'bg-white shadow text-primary' : 'text-gray-400 hover:text-gray-600'}`} title="Vue liste"><FaList /></button>
            </div>
          </div>
        </div>

        {/* Filtres par statut */}
        <div className="flex gap-2 flex-wrap mb-4">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${filterStatus === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Toutes ({orders.length})
          </button>
          {STATUSES.map(s => (
            <button
              key={s.value}
              onClick={() => setFilterStatus(s.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${filterStatus === s.value ? s.color + ' ring-2 ring-offset-1 ring-gray-400' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {s.label} ({counts[s.value] || 0})
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400 bg-white rounded-xl shadow">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-lg font-medium">Aucune commande</p>
          </div>
        ) : viewMode === 'list' ? (
          /* Vue liste */
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Paiement</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(order => {
                  const st = getStatus(order.status);
                  const ps = getPaymentStatus(order.payment_status);
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-mono text-gray-500 text-xs">#{order.id}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{order.customer_name}</p>
                        <p className="text-xs text-gray-400">{order.customer_phone}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell">{formatDate(order.created_at)}</td>
                      <td className="px-4 py-3 font-bold text-primary">{parseFloat(order.total_amount).toLocaleString()} F</td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={e => handleStatusChange(order.id, e.target.value)}
                          className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer ${st.color}`}
                        >
                          {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <select
                          value={order.payment_status}
                          onChange={e => handlePaymentStatusChange(order.id, e.target.value)}
                          className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer ${ps.color}`}
                        >
                          {PAYMENT_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => openDetail(order)} className="text-blue-600 hover:text-blue-800 transition"><FaEye /></button>
                          <button onClick={() => handleDelete(order.id)} className="text-red-600 hover:text-red-800 transition"><FaTrash /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Vue carte */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(order => {
              const st = getStatus(order.status);
              const ps = getPaymentStatus(order.payment_status);
              return (
                <div key={order.id} className="bg-white rounded-xl shadow border border-gray-100 p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-mono text-xs text-gray-400">#{order.id}</p>
                      <p className="font-semibold text-gray-900">{order.customer_name}</p>
                      <p className="text-xs text-gray-400">{order.customer_phone}</p>
                    </div>
                    <p className="font-bold text-primary">{parseFloat(order.total_amount).toLocaleString()} F</p>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">{formatDate(order.created_at)}</p>
                  <div className="flex gap-2 mb-3 flex-wrap">
                    <select
                      value={order.status}
                      onChange={e => handleStatusChange(order.id, e.target.value)}
                      className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer flex-1 ${st.color}`}
                    >
                      {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                    <select
                      value={order.payment_status}
                      onChange={e => handlePaymentStatusChange(order.id, e.target.value)}
                      className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer flex-1 ${ps.color}`}
                    >
                      {PAYMENT_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openDetail(order)} className="flex-1 flex items-center justify-center gap-1 text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-lg py-1.5 text-xs transition">
                      <FaEye /> Détail
                    </button>
                    <button onClick={() => handleDelete(order.id)} className="flex-1 flex items-center justify-center gap-1 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg py-1.5 text-xs transition">
                      <FaTrash /> Supprimer
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal détail commande */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
              <h2 className="text-lg font-bold">Commande #{selectedOrder.id}</h2>
              <button onClick={() => { setSelectedOrder(null); setDetailOrder(null); }} className="text-gray-400 hover:text-gray-700 text-xl">✕</button>
            </div>

            {loadingDetail ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : detailOrder ? (
              <div className="p-6 space-y-5">
                {/* Infos client */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                  <p className="text-xs text-gray-400 uppercase font-medium mb-2">Client</p>
                  <p className="font-semibold text-gray-900">{detailOrder.customer_name}</p>
                  <p className="text-sm text-gray-600">{detailOrder.customer_phone}</p>
                  <p className="text-sm text-gray-600">{detailOrder.customer_address}</p>
                  {detailOrder.notes && <p className="text-sm text-gray-500 italic">Note : {detailOrder.notes}</p>}
                </div>

                {/* Items */}
                <div>
                  <p className="text-xs text-gray-400 uppercase font-medium mb-2">Articles commandés</p>
                  <div className="space-y-2">
                    {detailOrder.items?.map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-400">x{item.quantity} × {parseFloat(item.price).toLocaleString()} F</p>
                        </div>
                        <p className="font-bold text-gray-800">{(item.quantity * item.price).toLocaleString()} F</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                    <p className="font-bold text-gray-900">Total</p>
                    <p className="font-bold text-primary text-lg">{parseFloat(detailOrder.total_amount).toLocaleString()} FCFA</p>
                  </div>
                </div>

                {/* Statuts */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-medium mb-1">Statut commande</p>
                    <select
                      value={detailOrder.status}
                      onChange={e => handleStatusChange(detailOrder.id, e.target.value)}
                      className={`w-full text-sm font-semibold px-3 py-2 rounded-lg border-0 cursor-pointer ${getStatus(detailOrder.status).color}`}
                    >
                      {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-medium mb-1">Paiement</p>
                    <select
                      value={detailOrder.payment_status}
                      onChange={e => handlePaymentStatusChange(detailOrder.id, e.target.value)}
                      className={`w-full text-sm font-semibold px-3 py-2 rounded-lg border-0 cursor-pointer ${getPaymentStatus(detailOrder.payment_status).color}`}
                    >
                      {PAYMENT_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 text-xs text-gray-400">
                  <span>Méthode : <strong className="text-gray-600">{detailOrder.payment_method}</strong></span>
                  <span>•</span>
                  <span>{formatDate(detailOrder.created_at)}</span>
                </div>

                <button
                  onClick={() => handleDelete(detailOrder.id)}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-lg text-sm font-semibold transition"
                >
                  <FaTrash /> Supprimer la commande
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title="Supprimer la commande"
        message="Cette action est irréversible."
        type="danger"
      />
    </AdminLayout>
  );
}
