import React from 'react';
import { Pencil, Trash2, FileDown } from 'lucide-react';
import { exportToCSV, exportToPDF } from '@/utils/export';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  title: string;
}

export function DataTable<T>({ data, columns, onEdit, onDelete, title }: DataTableProps<T>) {
  const handleExportCSV = () => {
    exportToCSV(data, columns as any, title);
  };

  const handleExportPDF = () => {
    exportToPDF(data, columns as any, title);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <FileDown size={16} />
          Експорт CSV
        </button>
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <FileDown size={16} />
          Експорт PDF
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full overflow-hidden bg-white rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  {column.header}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                  Дії
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    {typeof column.accessor === 'function'
                      ? column.accessor(item)
                      : (item[column.accessor] as React.ReactNode)}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className="mr-3 text-indigo-600 hover:text-indigo-900"
                      >
                        <Pencil size={16} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}