export function formatDate(date: string): string {
  const dateObj = new Date(date);
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Les mois sont indexés à partir de 0
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
}