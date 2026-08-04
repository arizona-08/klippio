'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Ban, BellRing, Flag, ImageOff, ShieldAlert, UserRound } from 'lucide-react';
import { useUser } from '@/app/Context/AuthContext/AuthUserProvider';
import { isAdministrativeRole } from '@/app/utils/roles';
import { getPhotoReports, PhotoReport, removePhotoAndBanUploader, removePhotoAndWarnUploader } from '@/proxy/photo-reports/photo-report-functions';

export default function AdminReportsPage() {
  const router = useRouter();
  const { user } = useUser();
  const [reports, setReports] = useState<PhotoReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionReport, setActionReport] = useState<PhotoReport | null>(null);
  const [action, setAction] = useState<'warn' | 'ban' | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (user && !isAdministrativeRole(user.role)) router.replace('/dashboard'); }, [router, user]);
  useEffect(() => {
    if (!isAdministrativeRole(user?.role)) return;
    getPhotoReports().then(async (response) => {
      if (response.ok) setReports(await response.json());
      else setError('Impossible de charger les signalements.');
      setLoading(false);
    });
  }, [user]);

  async function confirmAction() {
    if (!actionReport || !action) return;
    setSaving(true);
    const response = action === 'warn' ? await removePhotoAndWarnUploader(actionReport.id) : await removePhotoAndBanUploader(actionReport.id);
    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setError(typeof payload?.message === 'string' ? payload.message : 'L’action n’a pas pu être effectuée.');
      setSaving(false);
      return;
    }
    setReports((items) => items.filter((report) => report.photo.id !== actionReport.photo.id));
    setActionReport(null);
    setAction(null);
    setSaving(false);
  }

  if (!isAdministrativeRole(user?.role)) return null;
  return <div className="min-h-full bg-[#fafcfb] px-4 py-6 sm:px-6 lg:px-10 lg:py-9"><div className="mx-auto max-w-6xl"><div className="mb-8"><div className="mb-3 flex items-center gap-2 text-sm font-medium text-primary"><ShieldAlert size={18} /> Modération</div><h1 className="text-3xl font-semibold tracking-tight text-gray-950">Signalements</h1><p className="mt-2 text-sm text-gray-600">Examinez les photos signalées par les utilisateurs et intervenez si nécessaire.</p></div>{error && <p className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}<div className="mb-5 flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800"><Flag size={18} /><span><strong>{reports.length}</strong> signalement{reports.length > 1 ? 's' : ''} à examiner.</span></div><section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_8px_30px_rgba(19,41,31,0.04)]">{loading ? <p className="px-5 py-14 text-center text-sm text-gray-500">Chargement des signalements…</p> : reports.length === 0 ? <div className="px-5 py-16 text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary-light text-primary"><Flag size={22} /></span><h2 className="mt-4 font-semibold text-gray-900">Aucun signalement en attente</h2><p className="mt-1 text-sm text-gray-500">Les signalements de photos apparaîtront ici.</p></div> : <div className="divide-y divide-gray-100">{reports.map((report) => <ReportCard key={report.id} report={report} onDelete={() => { setError(''); setActionReport(report); setAction('warn'); }} onBan={() => { setError(''); setActionReport(report); setAction('ban'); }} />)}</div>}</section></div>{actionReport && action && <ActionModal report={actionReport} action={action} saving={saving} onClose={() => { setAction(null); setActionReport(null); }} onConfirm={confirmAction} />}</div>;
}

function ReportCard({ report, onDelete, onBan }: { report: PhotoReport; onDelete: () => void; onBan: () => void }) {
  const uploader = report.photo.uploadedBy;
  return <article className="grid gap-5 p-5 sm:grid-cols-[170px_1fr] sm:p-6"><div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">{report.photo.temporaryAccessUrl ? <Image src={report.photo.temporaryAccessUrl} alt={report.photo.photoLabel || 'Photo signalée'} fill unoptimized className="object-cover" sizes="170px" /> : <ImageOff className="absolute inset-0 m-auto text-gray-400" />}</div><div className="min-w-0"><div className="flex flex-col justify-between gap-3 sm:flex-row"><div><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700"><Flag size={14} /> Signalé le {new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(new Date(report.createdAt))}</div><h2 className="mt-2 font-semibold text-gray-950">{report.photo.photoLabel || 'Photo sans libellé'}</h2><p className="mt-1 text-sm text-gray-500">Observation « {report.photo.marker.title} » · Projet {report.photo.marker.plan.project.title}</p></div><div className="flex flex-wrap gap-2">{uploader && <><button onClick={onDelete} className="inline-flex h-9 items-center gap-2 rounded-lg border border-amber-200 px-3 text-xs font-semibold text-amber-700 hover:bg-amber-50"><BellRing size={15} /> Supprimer et avertir</button>{!uploader.isBanned && <button onClick={onBan} className="inline-flex h-9 items-center gap-2 rounded-lg border border-red-200 px-3 text-xs font-semibold text-red-600 hover:bg-red-50"><Ban size={15} /> Supprimer et suspendre</button>}</>}</div></div><div className="mt-4 grid gap-3 rounded-xl bg-gray-50 p-3 text-sm sm:grid-cols-2"><div><p className="text-xs font-medium text-gray-500">Signalé par</p><p className="mt-1 font-medium text-gray-800">{report.reporter.firstname} {report.reporter.lastname}</p><p className="text-xs text-gray-500">{report.reporter.email}</p></div><div><p className="text-xs font-medium text-gray-500">Auteur de la photo</p>{uploader ? <><p className="mt-1 font-medium text-gray-800">{uploader.firstname} {uploader.lastname} {uploader.isBanned && <span className="ml-1 text-xs text-red-600">Suspendu</span>}</p><p className="text-xs text-gray-500">{uploader.email}</p></> : <p className="mt-1 text-gray-600">Non disponible (ancienne photo)</p>}</div></div>{report.reason && <p className="mt-3 text-sm text-gray-600"><span className="font-medium text-gray-700">Motif : </span>{report.reason}</p>}</div></article>;
}

function ActionModal({ report, action, saving, onClose, onConfirm }: { report: PhotoReport; action: 'warn' | 'ban'; saving: boolean; onClose: () => void; onConfirm: () => void }) {
  const isWarning = action === 'warn';
  return <div className="fixed inset-0 z-50 grid place-items-center bg-gray-950/30 p-4 backdrop-blur-sm"><div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><span className={`grid h-11 w-11 place-items-center rounded-xl ${isWarning ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-600'}`}>{isWarning ? <BellRing size={21} /> : <UserRound size={21} />}</span><h2 className="mt-4 text-xl font-semibold text-gray-950">{isWarning ? 'Supprimer la photo et avertir ?' : 'Supprimer la photo et suspendre ?'}</h2><p className="mt-2 text-sm leading-6 text-gray-600">{isWarning ? 'La photo sera retirée définitivement. Son auteur recevra une notification expliquant que le contenu ne respecte pas les règles de la plateforme.' : `La photo sera retirée et le compte de ${report.photo.uploadedBy?.firstname} ${report.photo.uploadedBy?.lastname} ne pourra plus accéder à Klippio.`}</p><div className="mt-7 flex justify-end gap-3"><button onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100">Annuler</button><button onClick={onConfirm} disabled={saving} className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60 ${isWarning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-red-600 hover:bg-red-700'}`}>{saving ? 'Traitement…' : isWarning ? 'Supprimer et avertir' : 'Supprimer et suspendre'}</button></div></div></div>;
}
