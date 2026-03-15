'use client'

import AdminLayout from '../../../components/admin/AdminLayout';
import ComingSoon from '../../../components/admin/ComingSoon';

export default function CustomersPage() {
  return (
    <AdminLayout>
      <ComingSoon
        title="Gestion des Clients"
        description="Le module de gestion des clients est en cours de développement. Vous pourrez bientôt voir la liste des clients, leurs commandes et leurs informations."
        icon="👥"
      />
    </AdminLayout>
  );
}
