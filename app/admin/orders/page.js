'use client'

import AdminLayout from '../../../components/admin/AdminLayout';
import ComingSoon from '../../../components/admin/ComingSoon';

export default function OrdersPage() {
  return (
    <AdminLayout>
      <ComingSoon
        title="Gestion des Commandes"
        description="Le module de gestion des commandes est en cours de développement. Vous pourrez bientôt voir, modifier et gérer toutes les commandes clients."
        icon="🛒"
      />
    </AdminLayout>
  );
}
