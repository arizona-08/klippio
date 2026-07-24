import NotificationsList from '@/app/components/organisms/notifications/NotificationsList';

export default function NotificationsPage() {
  return (
    <div className='min-h-full bg-gray-50 p-6 md:p-10'>
      <section className='mx-auto max-w-3xl'>
        <h1 className='mb-6 text-2xl font-semibold'>Notifications</h1>
        <NotificationsList />
      </section>
    </div>
  );
}
