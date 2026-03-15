'use client'

import AdminLayout from '../../../components/admin/AdminLayout';
import ComingSoon from '../../../components/admin/ComingSoon';

export default function SettingsPage() {
  return (
    <AdminLayout>
      <ComingSoon
        title="Paramètres"
        description="Le module de paramètres est en cours de développement. Vous pourrez bientôt configurer les informations du restaurant, les horaires, les tarifs de livraison, etc."
        icon="⚙️"
      />
    </AdminLayout>
  );
}
