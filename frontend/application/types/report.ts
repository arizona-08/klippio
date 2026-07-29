export type ReportPhoto = {
  id: string;
  label: string;
  comment: string | null;
  temporaryAccessUrl: string;
};

export type ReportMarker = {
  id: string;
  title: string;
  planId: string;
  planPageNumber: number;
  photos: ReportPhoto[];
};

export type ReportPage = {
  pageNumber: number;
  markersCount: number;
};

export type ReportPlan = {
  id: string;
  name: string;
  totalMarkers: number;
  pages: ReportPage[];
  markers: ReportMarker[];
};
