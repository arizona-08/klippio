"use client";

import { getProjectDataForReport } from '@/proxy/projects/project-functions';
import { useCreateReportStore } from '@/stores/CreateReportStore';
import { ReportPlan } from '@/types/report';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import React, { useEffect } from 'react';
import ReportPdfDocument from './ReportPdfDocument';

type PageSelectionMode = 'all' | 'custom';

interface CreateReportModalProps {
  projectId: string;
}

function CreateReportModal({ projectId }: CreateReportModalProps) {
  const isOpen = useCreateReportStore((state) => state.isCreateReportModalOpen);
  const closeModal = useCreateReportStore((state) => state.closeCreateReportModal);
  const [isSelectionLoading, setIsSelectionLoading] = React.useState(true);
  const [selectionnablePlans, setSelectionnablePlans] = React.useState<ReportPlan[] | null>(null);
  const [selectedPlanIds, setSelectedPlanIds] = React.useState<Set<string>>(new Set());
  const [pageSelectionModes, setPageSelectionModes] = React.useState<Record<string, PageSelectionMode>>({});
  const [selectedPagesByPlan, setSelectedPagesByPlan] = React.useState<Record<string, Set<number>>>({});
  const [triggerExport, setTriggerExport] = React.useState(false);
  const [reportName, setReportName] = React.useState('Rapport d’observations');

  useEffect(() => {
    if (!isOpen) return;

    let isCurrentRequest = true;

    async function fetchDataForReport() {
      setIsSelectionLoading(true);
      const response = await getProjectDataForReport(projectId);

      if (!isCurrentRequest) return;

      if (!response.ok) {
        console.error('Failed to fetch report data');
        setSelectionnablePlans(null);
        setIsSelectionLoading(false);
        return;
      }

      const data: { selectionnablePlans: ReportPlan[] } = await response.json();
      setSelectionnablePlans(data.selectionnablePlans);
      setSelectedPlanIds(new Set(
        data.selectionnablePlans
          .filter((plan) => plan.totalMarkers > 0)
          .map((plan) => plan.id),
      ));
      setPageSelectionModes(Object.fromEntries(
        data.selectionnablePlans.map((plan) => [plan.id, 'all' as const]),
      ));
      setSelectedPagesByPlan({});
      setReportName('Rapport d’observations');
      setTriggerExport(false);
      setIsSelectionLoading(false);
    }

    fetchDataForReport();

    return () => {
      isCurrentRequest = false;
    };
  }, [isOpen, projectId]);

  const togglePlan = (plan: ReportPlan) => {
    if (plan.totalMarkers === 0) return;

    setTriggerExport(false);
    setSelectedPlanIds((current) => {
      const next = new Set(current);
      if (next.has(plan.id)) next.delete(plan.id);
      else next.add(plan.id);
      return next;
    });
  };

  const setPageSelectionMode = (planId: string, mode: PageSelectionMode) => {
    setTriggerExport(false);
    setPageSelectionModes((current) => ({ ...current, [planId]: mode }));
  };

  const togglePage = (planId: string, pageNumber: number) => {
    setTriggerExport(false);
    setSelectedPagesByPlan((current) => {
      const nextPages = new Set(current[planId] ?? []);
      if (nextPages.has(pageNumber)) nextPages.delete(pageNumber);
      else nextPages.add(pageNumber);
      return { ...current, [planId]: nextPages };
    });
  };

  const selectedReportPlans = React.useMemo(() => (selectionnablePlans ?? []).flatMap((plan) => {
    if (!selectedPlanIds.has(plan.id)) return [];

    const markers = pageSelectionModes[plan.id] === 'custom'
      ? plan.markers.filter((marker) => selectedPagesByPlan[plan.id]?.has(marker.planPageNumber))
      : plan.markers;

    return markers.length ? [{ ...plan, markers }] : [];
  }), [selectionnablePlans, selectedPlanIds, pageSelectionModes, selectedPagesByPlan]);

  const selectedMarkerCount = selectedReportPlans.reduce(
    (total, plan) => total + plan.markers.length,
    0,
  );
  const resolvedReportName = reportName.trim() || 'Rapport d’observations';
  const reportFileName = `${resolvedReportName.replace(/[\\/:*?"<>|]/g, '-').replace(/\s+/g, '-')}.pdf`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className={`max-h-[90vh]  max-w-7xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg ${triggerExport ? 'w-full lg:flex lg:gap-6' : ''}`}>
        <section className={triggerExport ? 'lg:w-[28rem] lg:shrink-0' : ''}>
          <h2 className="mb-0.5 text-lg font-semibold">Choisissez les plans</h2>
          <p className="text-xs text-gray-600">Seules les pages contenant des marqueurs peuvent être ajoutées au rapport.</p>

          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-gray-800" htmlFor="report-name">Nom du rapport</label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              id="report-name"
              onChange={(event) => {
                setReportName(event.target.value);
                setTriggerExport(false);
              }}
              placeholder="Ex. Rapport de visite - RDC"
              type="text"
              value={reportName}
            />
          </div>

          {isSelectionLoading && (
            <div className="flex h-32 items-center justify-center">
              <p>Chargement des plans…</p>
            </div>
          )}

          {!isSelectionLoading && selectionnablePlans === null && (
            <div className="flex h-32 items-center justify-center">
              <p>Aucune donnée disponible pour l&apos;export.</p>
            </div>
          )}

          {selectionnablePlans && (
            <div className="mt-4 space-y-3">
              {selectionnablePlans.map((plan) => {
                const isSelected = selectedPlanIds.has(plan.id);
                const mode = pageSelectionModes[plan.id] ?? 'all';
                const selectedPages = selectedPagesByPlan[plan.id] ?? new Set<number>();
                const isEmpty = plan.totalMarkers === 0;

                return (
                  <div key={plan.id} className="rounded-md border border-gray-200 p-3">
                    <div className="flex items-center gap-2">
                      <input checked={isSelected} className="accent-primary" disabled={isEmpty} id={`report-plan-${plan.id}`} onChange={() => togglePlan(plan)} type="checkbox" />
                      <label className={isEmpty ? 'text-gray-400' : 'font-medium'} htmlFor={`report-plan-${plan.id}`}>
                        {plan.name} ({plan.totalMarkers} {plan.totalMarkers > 1 ? 'marqueurs' : 'marqueur'})
                      </label>
                    </div>

                    {isSelected && (
                      <fieldset className="mt-3 border-l border-gray-200 pl-4">
                        <legend className="mb-2 font-medium">{plan.name}</legend>
                        <label className="flex items-center gap-2 text-sm">
                          <input checked={mode === 'all'} className="accent-primary" name={`report-pages-${plan.id}`} onChange={() => setPageSelectionMode(plan.id, 'all')} type="radio" />
                          Toutes les pages
                        </label>
                        <label className="mt-2 flex items-center gap-2 text-sm">
                          <input checked={mode === 'custom'} className="accent-primary" name={`report-pages-${plan.id}`} onChange={() => setPageSelectionMode(plan.id, 'custom')} type="radio" />
                          Choisir les pages
                        </label>

                        {mode === 'custom' && (
                          <div className="mt-2 space-y-1 pl-6">
                            {plan.pages.map((page) => (
                              <label className="flex items-center gap-2 text-sm" key={page.pageNumber}>
                                <input checked={selectedPages.has(page.pageNumber)} className="accent-primary" onChange={() => togglePage(plan.id, page.pageNumber)} type="checkbox" />
                                Page {page.pageNumber} ({page.markersCount})
                              </label>
                            ))}
                          </div>
                        )}
                      </fieldset>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-4 flex justify-end gap-3">
            <button className="rounded-md bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400" onClick={closeModal} type="button">
              Annuler
            </button>
            <button className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-50" disabled={selectedMarkerCount === 0} onClick={() => setTriggerExport(true)} type="button">
              Exporter
            </button>
          </div>
        </section>

        {triggerExport && (
          <section className="mt-6 border-t border-gray-200 pt-6 lg:mt-0 lg:min-w-0 lg:flex-1 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Aperçu du rapport</h2>
                <p className="text-sm text-gray-600">{selectedMarkerCount} {selectedMarkerCount > 1 ? 'observations incluses' : 'observation incluse'}</p>
              </div>
              <PDFDownloadLink
                document={<ReportPdfDocument plans={selectedReportPlans} reportName={resolvedReportName} />}
                fileName={reportFileName}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/80"
              >
                {({ loading }) => loading ? 'Préparation du PDF…' : 'Télécharger le PDF'}
              </PDFDownloadLink>
            </div>
            <div className="h-[65vh] min-h-[520px] overflow-hidden rounded-lg border border-gray-200 bg-gray-100 shadow-inner">
              <PDFViewer className="h-full w-full" showToolbar={false}>
                <ReportPdfDocument plans={selectedReportPlans} reportName={resolvedReportName} />
              </PDFViewer>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default CreateReportModal;
