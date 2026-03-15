'use client'

import AdminLayout from '../../../components/admin/AdminLayout';
import ComingSoon from '../../../components/admin/ComingSoon';

export default function StatsPage() {
  return (
    <AdminLayout>
      <ComingSoon
        title="Statistiques"
        description="Le module de statistiques est en cours de développement. Vous pourrez bientôt voir des graphiques détaillés sur les ventes, les revenus et les performances."
        icon="📊"
      />
    </AdminLayout>
  );
}
