import { fetchFromClient } from '../api';

export type TicketStatus = 'OPEN' | 'RESOLVED' | 'CLOSED';
export type SupportTicket = { id: string; subject: string; status: TicketStatus; createdAt: string; updatedAt: string; _count?: { messages: number } };
export type SupportTicketDetails = SupportTicket & { author?: { firstname: string; lastname: string; email: string }; messages: { id: string; content: string; createdAt: string; author: { id: number; firstname: string; lastname: string; role: string } }[] };

export function createSupportTicket(subject: string, content: string) { return fetchFromClient('/api/support/tickets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject, content }) }); }
export function getMySupportTickets() { return fetchFromClient('/api/support/tickets/mine', { method: 'GET' }); }
export function getAllSupportTickets() { return fetchFromClient('/api/support/tickets', { method: 'GET' }); }
export function getSupportTicket(id: string) { return fetchFromClient(`/api/support/tickets/${id}`, { method: 'GET' }); }
export function sendSupportMessage(id: string, content: string) { return fetchFromClient(`/api/support/tickets/${id}/messages`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content }) }); }
export function updateSupportTicketStatus(id: string, status: TicketStatus) { return fetchFromClient(`/api/support/tickets/${id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) }); }
