'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, BarChart3, FileStack, FolderKanban, ShieldCheck, Users } from 'lucide-react';
import { useUser } from '@/app/Context/AuthContext/AuthUserProvider';
import { getAdminStats } from '@/proxy/stats/stats-functions';

type AdminStats = {
  users: { total: number; newLastThirtyDays: number; byRole: { ADMIN: number; PREMIUM: number; STANDARD: number } };
  projects: { total: number; active: number; archived: number; newLastThirtyDays: number };
  plans: { total: number };
  markers: { total: number; newLastSevenDays: number };
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user } = useUser();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'ADMIN') router.replace('/dashboard');
  }, [router, user]);

  useEffect(() => {
    if (user?.role !== 'ADMIN') return;
    getAdminStats().then(async (response) => {
      if (response.ok) setStats(await response.json());
      else setError(true);
    });
  }, [user]);

  if (!user || user.role !== 'ADMIN') return null;

  const roleTotal = stats?.users.total || 0;
  return <div className="min-h-full bg-[#fafcfb] px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
    <div className="mx-auto max-w-6xl">
      <section className="relative overflow-hidden rounded-2xl bg-primary px-6 py-7 text-white shadow-sm sm:px-8">
        <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/10" />
        <div className="relative"><div className="mb-3 flex items-center gap-2 text-sm font-medium text-white/80"><ShieldCheck size={18} /> Administration Klippio</div><h1 className="text-3xl font-semibold tracking-tight">Vue d’ensemble</h1><p className="mt-2 max-w-2xl text-sm text-white/80">Suivez la croissance de votre espace et l’activité des équipes en un coup d’œil.</p></div>
      </section>

      {error && <p className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">Impossible de charger les indicateurs d’administration.</p>}
      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={<Users size={21} />} label="Utilisateurs" value={stats?.users.total} detail={`+${stats?.users.newLastThirtyDays ?? 0} ces 30 derniers jours`} loading={!stats} />
        <MetricCard icon={<FolderKanban size={21} />} label="Projets actifs" value={stats?.projects.active} detail={`${stats?.projects.archived ?? 0} archivé${(stats?.projects.archived ?? 0) > 1 ? 's' : ''}`} loading={!stats} />
        <MetricCard icon={<FileStack size={21} />} label="Plans déposés" value={stats?.plans.total} detail={`${stats?.projects.total ?? 0} projets au total`} loading={!stats} />
        <MetricCard icon={<BarChart3 size={21} />} label="Observations" value={stats?.markers.total} detail={`+${stats?.markers.newLastSevenDays ?? 0} sur les 7 derniers jours`} loading={!stats} />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_8px_30px_rgba(19,41,31,0.04)]"><div className="flex items-center justify-between"><div><h2 className="font-semibold text-gray-950">Répartition des comptes</h2><p className="mt-1 text-sm text-gray-500">Par niveau d’accès</p></div><Users className="text-primary" size={22} /></div><div className="mt-7 space-y-5"><RoleRow label="Standard" value={stats?.users.byRole.STANDARD ?? 0} total={roleTotal} color="bg-gray-400" /><RoleRow label="Premium" value={stats?.users.byRole.PREMIUM ?? 0} total={roleTotal} color="bg-amber-400" /><RoleRow label="Administrateurs" value={stats?.users.byRole.ADMIN ?? 0} total={roleTotal} color="bg-primary" /></div></div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_8px_30px_rgba(19,41,31,0.04)]"><h2 className="font-semibold text-gray-950">Gestion des utilisateurs</h2><p className="mt-1 text-sm leading-6 text-gray-500">Créez des comptes, attribuez les rôles et maintenez les accès à jour.</p><Link href="/dashboard/admin/users" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary-light px-4 py-3 text-sm font-semibold text-primary transition hover:bg-emerald-100">Ouvrir les utilisateurs <ArrowRight size={17} /></Link></div>
      </section>
    </div>
  </div>;
}

function MetricCard({ icon, label, value, detail, loading }: { icon: React.ReactNode; label: string; value: number | undefined; detail: string; loading: boolean }) {
  return <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_8px_30px_rgba(19,41,31,0.04)]"><span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-light text-primary">{icon}</span><p className="mt-5 text-sm font-medium text-gray-500">{label}</p><p className="mt-1 text-3xl font-semibold tracking-tight text-gray-950">{loading ? '—' : value}</p><p className="mt-2 text-xs font-medium text-gray-500">{loading ? 'Chargement…' : detail}</p></div>;
}

function RoleRow({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const percentage = total ? Math.round((value / total) * 100) : 0;
  return <div><div className="mb-2 flex justify-between text-sm"><span className="font-medium text-gray-700">{label}</span><span className="text-gray-500">{value} · {percentage}%</span></div><div className="h-2 overflow-hidden rounded-full bg-gray-100"><div className={`h-full rounded-full ${color}`} style={{ width: `${percentage}%` }} /></div></div>;
}
