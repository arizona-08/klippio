'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Pencil, Plus, Search, ShieldCheck, Trash2, UserRound, Users, X } from 'lucide-react';
import { useUser } from '@/app/Context/AuthContext/AuthUserProvider';
import { createUser, deleteUser, getUsers, ManagedUser, updateUser, UserPayload, UserRole } from '@/proxy/users/user-functions';

const roleLabels: Record<UserRole, string> = {
  ADMIN: 'Administrateur',
  PREMIUM: 'Premium',
  STANDARD: 'Standard',
};

const emptyForm = { firstname: '', lastname: '', email: '', password: '', role: 'STANDARD' as UserRole };

function getErrorMessage(payload: unknown) {
  if (typeof payload === 'object' && payload && 'message' in payload) {
    const message = (payload as { message: string | string[] }).message;
    return Array.isArray(message) ? message[0] : message;
  }
  return 'Une erreur est survenue. Veuillez réessayer.';
}

export default function AdminUsersPage() {
  const router = useRouter();
  const { user: currentUser } = useUser();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ManagedUser | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState('');

  async function loadUsers() {
    setIsLoading(true);
    const response = await getUsers();
    if (response.ok) setUsers(await response.json());
    else setError('Impossible de charger les utilisateurs.');
    setIsLoading(false);
  }

  useEffect(() => {
    if (currentUser && currentUser.role !== 'ADMIN') router.replace('/dashboard');
  }, [currentUser, router]);

  useEffect(() => { if (currentUser?.role === 'ADMIN') loadUsers(); }, [currentUser]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return users;
    return users.filter((user) => `${user.firstname} ${user.lastname} ${user.email} ${roleLabels[user.role]}`.toLowerCase().includes(query));
  }, [search, users]);

  function openCreate() {
    setEditingUser(null);
    setForm(emptyForm);
    setError('');
    setIsModalOpen(true);
  }

  function openEdit(user: ManagedUser) {
    setEditingUser(user);
    setForm({ firstname: user.firstname, lastname: user.lastname, email: user.email, password: '', role: user.role });
    setError('');
    setIsModalOpen(true);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    if (!editingUser && form.password.length < 10) {
      setError('Le mot de passe doit contenir au moins 10 caractères.');
      return;
    }
    setIsSaving(true);
    const data: UserPayload = { firstname: form.firstname, lastname: form.lastname, email: form.email, role: form.role };
    if (form.password) data.password = form.password;
    const response = editingUser
      ? await updateUser(editingUser.id, data)
      : await createUser({ ...data, password: form.password });
    if (!response.ok) {
      setError(getErrorMessage(await response.json().catch(() => null)));
      setIsSaving(false);
      return;
    }
    const result = await response.json();
    if (editingUser) {
      setUsers((items) => items.map((user) => user.id === editingUser.id ? result.user : user));
      setNotice('Utilisateur mis à jour.');
    } else {
      setUsers((items) => [result, ...items]);
      setNotice('Utilisateur créé.');
    }
    setIsSaving(false);
    setIsModalOpen(false);
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setIsSaving(true);
    const response = await deleteUser(pendingDelete.id);
    if (response.ok) {
      setUsers((items) => items.filter((user) => user.id !== pendingDelete.id));
      setNotice('Utilisateur supprimé.');
      setPendingDelete(null);
    } else setError(getErrorMessage(await response.json().catch(() => null)));
    setIsSaving(false);
  }

  if (!currentUser || currentUser.role !== 'ADMIN') return null;

  return (
    <div className="min-h-full bg-[#fafcfb] px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-primary"><ShieldCheck size={18} /> Administration</div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-950">Utilisateurs</h1>
            <p className="mt-2 text-sm text-gray-600">Gérez les accès et les rôles de votre espace Klippio.</p>
          </div>
          <button onClick={openCreate} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover"><Plus size={18} /> Ajouter un utilisateur</button>
        </div>

        {notice && <div className="mb-5 flex items-center justify-between rounded-xl border border-emerald-100 bg-primary-light px-4 py-3 text-sm font-medium text-emerald-800"><span className="flex items-center gap-2"><Check size={17} />{notice}</span><button onClick={() => setNotice('')} aria-label="Fermer"><X size={17} /></button></div>}
        {error && !isModalOpen && <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_8px_30px_rgba(19,41,31,0.04)]">
          <div className="flex flex-col gap-4 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-light text-primary"><Users size={20} /></span><div><h2 className="font-semibold text-gray-900">Tous les utilisateurs</h2><p className="text-sm text-gray-500">{users.length} compte{users.length > 1 ? 's' : ''} au total</p></div></div>
            <label className="relative block sm:w-72"><Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher un utilisateur" className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pr-3 pl-10 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-3 focus:ring-emerald-50" /></label>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-180 text-left">
              <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500"><tr><th className="px-5 py-4">Utilisateur</th><th className="px-5 py-4">Rôle</th><th className="hidden px-5 py-4 md:table-cell">Créé le</th><th className="px-5 py-4 text-right">Actions</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? <tr><td colSpan={4} className="px-5 py-12 text-center text-sm text-gray-500">Chargement des utilisateurs…</td></tr> : filteredUsers.length === 0 ? <tr><td colSpan={4} className="px-5 py-12 text-center text-sm text-gray-500">Aucun utilisateur ne correspond à votre recherche.</td></tr> : filteredUsers.map((user) => <tr key={user.id} className="transition hover:bg-emerald-50/30"><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-light text-sm font-bold text-primary">{user.firstname[0]}{user.lastname[0]}</span><div><p className="font-medium text-gray-900">{user.firstname} {user.lastname}</p><p className="text-sm text-gray-500">{user.email}</p></div></div></td><td className="px-5 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${user.role === 'ADMIN' ? 'bg-violet-50 text-violet-700' : user.role === 'PREMIUM' ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>{roleLabels[user.role]}</span></td><td className="hidden px-5 py-4 text-sm text-gray-500 md:table-cell">{new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(user.createdAt))}</td><td className="px-5 py-4"><div className="flex justify-end gap-2"><button onClick={() => openEdit(user)} className="grid h-9 w-9 place-items-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-primary hover:bg-primary-light hover:text-primary" aria-label={`Modifier ${user.firstname}`}><Pencil size={16} /></button><button onClick={() => { setError(''); setPendingDelete(user); }} disabled={user.id === currentUser.id} title={user.id === currentUser.id ? 'Vous ne pouvez pas supprimer votre propre compte' : undefined} className="grid h-9 w-9 place-items-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-35" aria-label={`Supprimer ${user.firstname}`}><Trash2 size={16} /></button></div></td></tr>)}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {isModalOpen && <UserFormModal editingUser={editingUser} form={form} setForm={setForm} error={error} isSaving={isSaving} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit} />}
      {pendingDelete && <DeleteModal user={pendingDelete} error={error} isSaving={isSaving} onClose={() => setPendingDelete(null)} onConfirm={confirmDelete} />}
    </div>
  );
}

function UserFormModal({ editingUser, form, setForm, error, isSaving, onClose, onSubmit }: { editingUser: ManagedUser | null; form: typeof emptyForm; setForm: (form: typeof emptyForm) => void; error: string; isSaving: boolean; onClose: () => void; onSubmit: (event: FormEvent) => void }) {
  const change = (field: keyof typeof emptyForm, value: string) => setForm({ ...form, [field]: value });
  return <div className="fixed inset-0 z-50 grid place-items-center bg-gray-950/30 p-4 backdrop-blur-sm"><form onSubmit={onSubmit} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"><div className="mb-6 flex items-start justify-between"><div><div className="mb-2 grid h-10 w-10 place-items-center rounded-xl bg-primary-light text-primary"><UserRound size={20} /></div><h2 className="text-xl font-semibold text-gray-950">{editingUser ? 'Modifier l’utilisateur' : 'Nouvel utilisateur'}</h2><p className="mt-1 text-sm text-gray-500">{editingUser ? 'Laissez le mot de passe vide pour ne pas le modifier.' : 'Créez un accès à l’espace Klippio.'}</p></div><button type="button" onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"><X /></button></div>{error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}<div className="grid gap-4 sm:grid-cols-2"><Field label="Prénom" value={form.firstname} onChange={(value) => change('firstname', value)} /><Field label="Nom" value={form.lastname} onChange={(value) => change('lastname', value)} /></div><div className="mt-4"><Field label="Adresse e-mail" type="email" value={form.email} onChange={(value) => change('email', value)} /></div><div className="mt-4"><Field label={editingUser ? 'Nouveau mot de passe' : 'Mot de passe'} type="password" required={!editingUser} value={form.password} onChange={(value) => change('password', value)} /></div><label className="mt-4 block text-sm font-medium text-gray-700">Rôle<select value={form.role} onChange={(event) => change('role', event.target.value)} className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-3 focus:ring-emerald-50"><option value="STANDARD">Standard</option><option value="PREMIUM">Premium</option><option value="ADMIN">Administrateur</option></select></label><div className="mt-7 flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100">Annuler</button><button disabled={isSaving} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60">{isSaving ? 'Enregistrement…' : editingUser ? 'Enregistrer' : 'Créer l’utilisateur'}</button></div></form></div>;
}

function Field({ label, type = 'text', value, onChange, required = true }: { label: string; type?: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return <label className="block text-sm font-medium text-gray-700">{label}<input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-3 focus:ring-emerald-50" /></label>;
}

function DeleteModal({ user, error, isSaving, onClose, onConfirm }: { user: ManagedUser; error: string; isSaving: boolean; onClose: () => void; onConfirm: () => void }) {
  return <div className="fixed inset-0 z-50 grid place-items-center bg-gray-950/30 p-4 backdrop-blur-sm"><div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><div className="grid h-11 w-11 place-items-center rounded-xl bg-red-50 text-red-600"><Trash2 size={20} /></div><h2 className="mt-4 text-xl font-semibold text-gray-950">Supprimer cet utilisateur ?</h2><p className="mt-2 text-sm leading-6 text-gray-600">Le compte de <strong>{user.firstname} {user.lastname}</strong> et les données qui lui sont associées seront définitivement supprimés.</p>{error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}<div className="mt-7 flex justify-end gap-3"><button onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100">Annuler</button><button onClick={onConfirm} disabled={isSaving} className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">{isSaving ? 'Suppression…' : 'Supprimer'}</button></div></div></div>;
}
