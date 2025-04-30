import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Column {
  header: string;
  accessor: string | ((item: any) => string);
}

export function exportToCSV(data: any[], columns: Column[], filename: string) {
  const headers = columns.map(col => col.header);
  const rows = data.map(item =>
    columns.map(col =>
      typeof col.accessor === 'function' ? col.accessor(item) : item[col.accessor]
    )
  );

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToPDF(data: any[], columns: Column[], filename: string) {
  const doc = new jsPDF();
  
  // Add Cyrillic font support
  doc.addFont('https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf', 'Roboto', 'normal');
  doc.setFont('Roboto');
  
  const headers = columns.map(col => col.header);
  const rows = data.map(item =>
    columns.map(col =>
      typeof col.accessor === 'function' ? col.accessor(item) : item[col.accessor]
    )
  );

  autoTable(doc, {
    head: [headers],
    body: rows,
    styles: { 
      font: 'Roboto',
      fontSize: 8 
    },
    headStyles: { 
      fillColor: [75, 85, 99],
      font: 'Roboto'
    }
  });

  doc.save(`${filename}.pdf`);
}