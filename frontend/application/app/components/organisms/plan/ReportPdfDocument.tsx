"use client";

import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import type { ReportMarker, ReportPhoto, ReportPlan } from '@/types/report';

const styles = StyleSheet.create({
  page: { padding: 32, fontFamily: 'Helvetica', color: '#172033', fontSize: 9 },
  header: { marginBottom: 24, borderBottomWidth: 2, borderBottomColor: '#00AF63', paddingBottom: 12 },
  eyebrow: { color: '#00AF63', fontSize: 8, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 5 },
  title: { fontSize: 22, fontFamily: 'Helvetica-Bold' },
  subtitle: { color: '#667085', fontSize: 9, marginTop: 5 },
  plan: { marginTop: 16 },
  planTitle: { fontSize: 14, fontFamily: 'Helvetica-Bold', marginBottom: 8 },
  table: { borderWidth: 1, borderColor: '#e4e7ec', borderRadius: 4 },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e4e7ec', minHeight: 141 },
  rowLast: { borderBottomWidth: 0 },
  headerRow: { flexDirection: 'row', backgroundColor: '#f8fafc', minHeight: 25 },
  headerText: { fontFamily: 'Helvetica-Bold', color: '#475467', fontSize: 8, padding: 7 },
  cell: { padding: 7, justifyContent: 'center' },
  pageCell: { width: '10%' },
  numberCell: { width: '14%' },
  imageCell: { width: '32%' },
  observationCell: { width: '44%' },
  image: { width: 192, height: 126, objectFit: 'cover', borderRadius: 4 },
  imagePlaceholder: { width: 192, height: 126, backgroundColor: '#f2f4f7', color: '#98a2b3', fontSize: 8, textAlign: 'center', paddingTop: 55, borderRadius: 4 },
  markerNumber: { fontFamily: 'Helvetica-Bold', color: '#00AF63' },
  markerTitle: { fontFamily: 'Helvetica-Bold', marginBottom: 4 },
  observation: { color: '#475467', lineHeight: 1.35, marginBottom: 2 },
  muted: { color: '#98a2b3', fontStyle: 'italic' },
  footer: { position: 'absolute', bottom: 20, left: 32, right: 32, color: '#98a2b3', fontSize: 8, textAlign: 'center' },
});

type ReportRow = {
  marker: ReportMarker;
  photo?: ReportPhoto;
};

function createRows(markers: ReportMarker[]): ReportRow[] {
  return markers.flatMap((marker) => {

    return marker.photos.length
      ? marker.photos.map((photo) => ({ marker, photo }))
      : [{ marker }];
  });
}

function ReportRows({ markers }: { markers: ReportMarker[] }) {
  const rows = createRows(markers);

  return (
    <>
      <View style={styles.headerRow} fixed>
        <View style={[styles.pageCell, styles.cell]}><Text style={styles.headerText}>Page</Text></View>
        <View style={[styles.numberCell, styles.cell]}><Text style={styles.headerText}>N° marqueur</Text></View>
        <View style={[styles.imageCell, styles.cell]}><Text style={styles.headerText}>Image</Text></View>
        <View style={[styles.observationCell, styles.cell]}><Text style={styles.headerText}>Observation</Text></View>
      </View>
      {rows.map((row, index) => (
        <View key={`${row.marker.id}-${row.photo?.id ?? 'no-photo'}`} style={[styles.row, index === rows.length - 1 ? styles.rowLast : {}]} wrap={false}>
          <View style={[styles.pageCell, styles.cell]}><Text>{row.marker.planPageNumber}</Text></View>
          <View style={[styles.numberCell, styles.cell]}><Text style={styles.markerNumber}>{row.marker.markerNumber === null ? '—' : `#${row.marker.markerNumber}`}</Text></View>
          <View style={[styles.imageCell, styles.cell]}>
            {row.photo?.temporaryAccessUrl ? (
              // react-pdf's Image does not expose the HTML `alt` attribute.
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image src={row.photo.temporaryAccessUrl} style={styles.image} />
            ) : <Text style={styles.imagePlaceholder}>Aucune image</Text>}
          </View>
          <View style={[styles.observationCell, styles.cell]}>
            <Text style={styles.markerTitle}>Titre : {row.marker.title}</Text>
            {row.photo?.label ? <Text style={styles.observation}>Libellé : {row.photo.label}</Text> : null}
            {row.photo?.comment ? <Text style={styles.observation}>Commentaire : {row.photo.comment}</Text> : null}
          </View>
        </View>
      ))}
    </>
  );
}

export default function ReportPdfDocument({ plans, reportName }: { plans: ReportPlan[]; reportName: string }) {
  const totalMarkers = plans.reduce((count, plan) => count + plan.markers.length, 0);

  return (
    <Document title={reportName} author="Klippio">
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Klippio · Rapport d&apos;observations</Text>
          <Text style={styles.title}>{reportName}</Text>
          <Text style={styles.subtitle}>{totalMarkers} observations · Généré le {new Date().toLocaleDateString('fr-FR')}</Text>
        </View>
        {plans.map((plan) => (
          <View key={plan.id} style={styles.plan}>
            <Text style={styles.planTitle}>{plan.name}</Text>
            <View style={styles.table}>
              <ReportRows markers={plan.markers} />
            </View>
          </View>
        ))}
        <Text style={styles.footer} fixed render={({ pageNumber, totalPages }) => `Klippio · ${pageNumber} / ${totalPages}`} />
      </Page>
    </Document>
  );
}
