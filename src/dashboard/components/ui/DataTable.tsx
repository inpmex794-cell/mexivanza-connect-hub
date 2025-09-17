import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronUp, ChevronDown, Search, Download } from 'lucide-react';

interface Column {
  key: string;
  title: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  searchable?: boolean;
  exportable?: boolean;
  onExport?: () => void;
  className?: string;
}

export function DataTable({ 
  data, 
  columns, 
  searchable = true, 
  exportable = false,
  onExport,
  className 
}: DataTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const filteredData = data.filter(row =>
    searchTerm === '' || 
    Object.values(row).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className={cn('space-y-4', className)}>
      {(searchable || exportable) && (
        <div className="flex items-center justify-between">
          {searchable && (
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          )}
          {exportable && (
            <Button variant="outline" onClick={onExport}>
              <Download size={16} />
              <span className="ml-2">Export CSV</span>
            </Button>
          )}
        </div>
      )}

      <div className="rounded-md border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider',
                    column.sortable && 'cursor-pointer hover:bg-muted/80'
                  )}
                  onClick={column.sortable ? () => handleSort(column.key) : undefined}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        <ChevronUp 
                          size={12} 
                          className={cn(
                            'text-muted-foreground',
                            sortColumn === column.key && sortDirection === 'asc' && 'text-primary'
                          )} 
                        />
                        <ChevronDown 
                          size={12} 
                          className={cn(
                            'text-muted-foreground -mt-1',
                            sortColumn === column.key && sortDirection === 'desc' && 'text-primary'
                          )} 
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {sortedData.map((row, index) => (
              <tr key={index} className="hover:bg-muted/50">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm">
                    {column.render 
                      ? column.render(row[column.key], row)
                      : row[column.key]
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {sortedData.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No data found
          </div>
        )}
      </div>
    </div>
  );
}