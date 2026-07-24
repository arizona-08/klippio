'use client';

import Link from 'next/link';
import React from 'react';
import { Bell, ShieldAlert, UserRoundCheck } from 'lucide-react';
import { getNotifications } from '@/proxy/notifications/notification-functions';
import { NotificationItem } from '@/types/project';
import { formatDate } from '@/utils/date';
import { io } from 'socket.io-client';

function NotificationsList() {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const addNotification = React.useCallback((notification: NotificationItem) => {
    setNotifications((currentNotifications) => [
      notification,
      ...currentNotifications.filter((item) => item.id !== notification.id),
    ]);
  }, []);

  React.useEffect(() => {
    async function loadNotifications() {
      const response = await getNotifications();
      if (response.ok) {
        const result = await response.json();
        setNotifications(result.notifications);
      }
      setIsLoading(false);
    }

    loadNotifications();
  }, []);

  React.useEffect(() => {
    if (!process.env.NEXT_PUBLIC_BACKEND_URL) return;

    const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL, { withCredentials: true });
    socket.on('notification:created', addNotification);

    return () => {
      socket.disconnect();
    };
  }, [addNotification]);

  if (isLoading) return <p className='text-gray-500'>Chargement des notifications…</p>;
  if (!notifications.length) return <p className='rounded-lg border border-gray-200 bg-white p-6 text-gray-500'>Vous n’avez aucune notification.</p>;

  return (
    <ul className='space-y-3'>
      {notifications.map((notification) => {
        const isInvitation = notification.type === 'INVITATION';
        const Icon = notification.type === 'ACCESS_REMOVED' ? ShieldAlert : isInvitation ? UserRoundCheck : Bell;
        const href = isInvitation && notification.invitationToken
          ? `/invite/${notification.invitationToken}`
          : notification.type !== 'ACCESS_REMOVED' && notification.projectId ? `/project/${notification.projectId}/visualize` : undefined;
        const content = (
          <div className='flex gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:border-primary/50'>
            <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${notification.type === 'ACCESS_REMOVED' ? 'text-danger' : 'text-primary'}`} />
            <div>
              <p className='font-semibold text-gray-900'>{notification.title}</p>
              <p className='mt-1 text-sm text-gray-600'>{notification.message}</p>
              <p className='mt-2 text-xs text-gray-400'>{formatDate(notification.createdAt)}</p>
            </div>
          </div>
        );

        return <li key={notification.id}>{href ? <Link href={href}>{content}</Link> : content}</li>;
      })}
    </ul>
  );
}

export default NotificationsList;
