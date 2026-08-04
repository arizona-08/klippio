'use client';

import { FormEvent, KeyboardEvent, useState } from 'react';
import { Check, MailPlus, X } from 'lucide-react';
import { createUserInvitations, UserInvitationResult } from '@/proxy/users/user-functions';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function UserInvitationForm() {
  const [emails, setEmails] = useState<string[]>([]);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<UserInvitationResult | null>(null);
  const [sending, setSending] = useState(false);

  function addEmail(candidate: string) {
    const email = candidate.trim().toLowerCase();
    if (!email) return true;
    if (!emailPattern.test(email)) { setError(`« ${candidate.trim()} » n’est pas une adresse email valide.`); return false; }
    if (emails.includes(email)) { setError(`L’adresse ${email} est déjà ajoutée.`); return false; }
    setEmails((current) => [...current, email]); setError(''); return true;
  }
  function handleChange(nextValue: string) {
    if (!nextValue.includes(',')) { setValue(nextValue); return; }
    const parts = nextValue.split(','); const complete = parts.slice(0, -1);
    let allValid = true; complete.forEach((part) => { if (!addEmail(part)) allValid = false; });
    setValue(allValid ? parts.at(-1) ?? '' : nextValue);
  }
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) { if (event.key === 'Enter') { event.preventDefault(); if (addEmail(value)) setValue(''); } }
  async function submit(event: FormEvent) {
    event.preventDefault(); const pendingEmail = value.trim();
    if (pendingEmail && !addEmail(pendingEmail)) return;
    const invitations = pendingEmail && emailPattern.test(pendingEmail) && !emails.includes(pendingEmail.toLowerCase()) ? [...emails, pendingEmail.toLowerCase()] : emails;
    if (!invitations.length) { setError('Ajoutez au moins une adresse email.'); return; }
    setSending(true); setError(''); setResult(null);
    const response = await createUserInvitations(invitations); const payload = await response.json().catch(() => null);
    if (!response.ok) setError(typeof payload?.message === 'string' ? payload.message : 'Les invitations n’ont pas pu être envoyées.');
    else { setResult(payload as UserInvitationResult); setEmails([]); setValue(''); }
    setSending(false);
  }
  return <section className="mb-6 rounded-2xl border border-emerald-100 bg-white p-5 shadow-[0_8px_30px_rgba(19,41,31,.04)] sm:p-6"><div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-light text-primary"><MailPlus size={20} /></span><div><h2 className="font-semibold text-gray-950">Inviter des utilisateurs</h2><p className="mt-1 text-sm text-gray-500">Saisissez plusieurs adresses, séparées par des virgules. Chaque personne recevra sa propre clé d’accès.</p></div></div><form className="mt-5" onSubmit={submit}><div className="rounded-xl border border-gray-200 bg-gray-50 p-2 focus-within:border-primary focus-within:ring-3 focus-within:ring-emerald-50"><div className="flex flex-wrap gap-2">{emails.map((email) => <span key={email} className="inline-flex items-center gap-1 rounded-lg bg-primary-light px-2.5 py-1.5 text-sm font-medium text-primary">{email}<button type="button" onClick={() => setEmails((current) => current.filter((item) => item !== email))} aria-label={`Supprimer ${email}`} className="rounded hover:bg-emerald-200"><X size={15} /></button></span>)}</div><textarea value={value} onChange={(event) => handleChange(event.target.value)} onKeyDown={handleKeyDown} rows={2} placeholder="prenom@exemple.com, autre@exemple.com" className="mt-2 w-full resize-none bg-transparent px-2 py-1 text-sm outline-none" aria-label="Adresses email à inviter" /></div>{error && <p className="mt-3 text-sm text-red-600">{error}</p>}{result && <div className="mt-3 rounded-xl bg-primary-light px-4 py-3 text-sm text-emerald-800"><p className="flex items-center gap-2 font-semibold"><Check size={17} />{result.sent.length} invitation{result.sent.length > 1 ? 's' : ''} envoyée{result.sent.length > 1 ? 's' : ''}.</p>{result.failed.length > 0 && <ul className="mt-2 list-disc pl-5 text-amber-800">{result.failed.map((failure) => <li key={failure.email}>{failure.email} : {failure.reason}</li>)}</ul>}</div>}<button disabled={sending} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"><MailPlus size={17} />{sending ? 'Envoi…' : 'Envoyer les invitations'}</button></form></section>;
}
