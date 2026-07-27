import { fetchFromClient } from '../api';

export async function getNotifications() {
  return fetchFromClient('/api/notifications', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
}
