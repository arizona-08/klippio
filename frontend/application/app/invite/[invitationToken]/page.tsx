'use client';

import Logo from '@/app/components/atoms/Logo';
import CTA from '@/app/components/atoms/CTA';
import { useUser } from '@/app/Context/AuthContext/AuthUserProvider';
import {
  acceptProjectInvitation,
  denyProjectInvitation,
  getInvitationDetails,
} from '@/proxy/projects/project-functions';
import { ProjectInvitationDetailsType } from '@/types/project';
import { formatDate } from '@/utils/date';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

const roleLabels = {
  OWNER: 'Proprietaire',
  EDITOR: 'Editeur',
  VIEWER: 'Lecteur',
};

function InvitePage() {
  const params = useParams<{ invitationToken: string }>();
  const invitationToken = params.invitationToken;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const autoAcceptRef = React.useRef(false);

  const [invitation, setInvitation] =
    React.useState<ProjectInvitationDetailsType | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAccepting, setIsAccepting] = React.useState(false);
  const [isDeclining, setIsDeclining] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null,
  );

  const invitationPath = `/invite/${invitationToken}`;
  const isExpired = invitation
    ? new Date(invitation.expiresAt).getTime() < Date.now()
    : false;
  const canAnswer = invitation?.status === 'PENDING' && !isExpired;
  const acceptPath = `${invitationPath}?accept=1`;

  React.useEffect(() => {
    async function loadInvitation() {
      setIsLoading(true);
      setErrorMessage(null);

      const response = await getInvitationDetails(invitationToken);
      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.message || 'Invitation introuvable.');
        setIsLoading(false);
        return;
      }

      setInvitation(result.invitation);
      setIsLoading(false);
    }

    loadInvitation();
  }, [invitationToken]);

  async function handleAccept() {
    if (!invitation) return;

    if (!user) {
      router.push(`/auth/login?redirect=${encodeURIComponent(acceptPath)}`);
      return;
    }

    if (user.email !== invitation.email) {
      setErrorMessage(
        `Cette invitation est destinee a ${invitation.email}. Connectez-vous avec cette adresse pour l'accepter.`,
      );
      return;
    }

    setIsAccepting(true);
    setErrorMessage(null);

    const response = await acceptProjectInvitation(invitationToken);
    const result = await response.json();

    if (!response.ok) {
      setErrorMessage(result.message || "Impossible d'accepter l'invitation.");
      setIsAccepting(false);
      return;
    }

    router.push(`/project/${result.projectId}/visualize`);
  }

  React.useEffect(() => {
    if (
      autoAcceptRef.current ||
      searchParams.get('accept') !== '1' ||
      !user ||
      !invitation ||
      !canAnswer
    ) {
      return;
    }

    autoAcceptRef.current = true;
    handleAccept();
  }, [canAnswer, invitation, searchParams, user]);

  async function handleDecline() {
    if (!invitation) return;

    setIsDeclining(true);
    setErrorMessage(null);

    const response = await denyProjectInvitation(invitationToken);
    const result = await response.json();

    if (!response.ok) {
      setErrorMessage(result.message || "Impossible de refuser l'invitation.");
      setIsDeclining(false);
      return;
    }

    setInvitation({ ...invitation, status: 'DECLINED' });
    setSuccessMessage('Invitation refusee.');
    setIsDeclining(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <section className="mx-auto flex w-full max-w-2xl flex-col gap-8">
        <div className="flex justify-center">
          <Logo type="long" color="black" />
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
          {isLoading && (
            <p className="text-center text-gray-500">Chargement...</p>
          )}

          {!isLoading && errorMessage && !invitation && (
            <div className="space-y-4 text-center">
              <h1 className="text-2xl font-semibold">Invitation indisponible</h1>
              <p className="text-gray-600">{errorMessage}</p>
              <CTA
                type="link"
                color="primary"
                text="Retour a la connexion"
                href="/auth/login"
                className="inline-block"
              />
            </div>
          )}

          {!isLoading && invitation && (
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-primary">
                  Invitation a collaborer
                </p>
                <h1 className="text-2xl font-semibold">
                  {invitation.project.title}
                </h1>
                <p className="text-gray-600">
                  {invitation.project.author.firstname}{' '}
                  {invitation.project.author.lastname} vous invite a rejoindre
                  ce projet.
                </p>
              </div>

              <dl className="grid gap-4 rounded-md bg-gray-50 p-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-gray-500">Email invite</dt>
                  <dd className="font-medium">{invitation.email}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Role</dt>
                  <dd className="font-medium">{roleLabels[invitation.role]}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Envoyee le</dt>
                  <dd className="font-medium">
                    {formatDate(invitation.createdAt)}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Expire le</dt>
                  <dd className="font-medium">
                    {formatDate(invitation.expiresAt)}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-gray-500">Adresse du projet</dt>
                  <dd className="font-medium">
                    {invitation.project.address}, {invitation.project.zipcode}{' '}
                    {invitation.project.city}
                  </dd>
                </div>
              </dl>

              {invitation.status === 'ACCEPTED' && (
                <p className="rounded-md bg-green-50 p-3 text-sm text-green-700">
                  Cette invitation a deja ete acceptee.
                </p>
              )}

              {invitation.status === 'DECLINED' && (
                <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                  Cette invitation a ete refusee.
                </p>
              )}

              {isExpired && invitation.status === 'PENDING' && (
                <p className="rounded-md bg-orange-50 p-3 text-sm text-orange-700">
                  Cette invitation a expire.
                </p>
              )}

              {successMessage && (
                <p className="rounded-md bg-green-50 p-3 text-sm text-green-700">
                  {successMessage}
                </p>
              )}

              {errorMessage && (
                <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                  {errorMessage}
                </p>
              )}

              {canAnswer && (
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <CTA
                      type="button"
                      color="primary"
                      text={user ? 'Accepter' : 'Me connecter pour accepter'}
                      onClick={handleAccept}
                      disabled={isAccepting || isDeclining}
                      isLoading={isAccepting}
                    />
                    {!user && (
                      <CTA
                        type="link"
                        color="secondary"
                        text="Creer un compte"
                        href={`/auth/register?redirect=${encodeURIComponent(acceptPath)}`}
                      />
                    )}
                  </div>

                  <CTA
                    type="button"
                    color="danger_reverse"
                    text="Refuser"
                    onClick={handleDecline}
                    disabled={isAccepting || isDeclining}
                    isLoading={isDeclining}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default InvitePage;
