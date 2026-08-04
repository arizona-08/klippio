import { fetchFromClient } from '../api';

export type PhotoReport = {
  id: string;
  reason: string | null;
  createdAt: string;
  reporter: { id: number; firstname: string; lastname: string; email: string };
  photo: {
    id: string;
    photoLabel: string;
    comment: string | null;
    temporaryAccessUrl: string;
    uploadedBy: { id: number; firstname: string; lastname: string; email: string; isBanned: boolean } | null;
    marker: { title: string; plan: { project: { id: string; title: string } } };
  };
};

export function getPhotoReports() {
  return fetchFromClient('/api/photo-reports', { method: 'GET' });
}

export function removePhotoAndWarnUploader(reportId: string) {
  return fetchFromClient(`/api/photo-reports/${reportId}/remove-and-warn`, { method: 'POST' });
}

export function removePhotoAndBanUploader(reportId: string) {
  return fetchFromClient(`/api/photo-reports/${reportId}/remove-and-ban`, { method: 'POST' });
}
