import { fetchFromClient } from '../api';

export type UserRole = 'STANDARD' | 'PREMIUM' | 'ADMIN';

export type ManagedUser = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

export type UserPayload = {
  firstname: string;
  lastname: string;
  email: string;
  role: UserRole;
  password?: string;
};

export function getUsers() {
  return fetchFromClient('/api/users', { method: 'GET' });
}

export function createUser(data: UserPayload & { password: string }) {
  return fetchFromClient('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export function updateUser(id: number, data: UserPayload) {
  return fetchFromClient(`/api/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export function deleteUser(id: number) {
  return fetchFromClient(`/api/users/${id}`, { method: 'DELETE' });
}
