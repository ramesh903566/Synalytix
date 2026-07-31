import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { EmptyState } from '../shared/EmptyState';
import { cn } from '../../../../lib/utils';

interface AnalyticsTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
}

export function AnalyticsTable<TData, TValue>({
  columns,
  data,
  isLoading,
}: AnalyticsTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  const parentRef = React.useRef<HTMLDivElement>(null);
  const rows = table.getRowModel().rows;

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 53,
    overscan: 10,
  });

  if (isLoading) {
    return (
      <div className="w-full h-64 rounded-xl border border-border-light bg-bg-elevated animate-pulse flex items-center justify-center">
        <span className="text-text-muted">Loading data...</span>
      </div>
    );
  }

  if (data.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="w-full">
      <div className="rounded-xl border border-border-light overflow-hidden bg-bg-elevated backdrop-blur-sm">
        <div ref={parentRef} className="overflow-x-auto overflow-y-auto max-h-[600px] relative">
          <table className="w-full text-sm text-left grid">
            <thead className="text-xs text-text-secondary bg-bg-elevated border-b border-border-light uppercase tracking-wider sticky top-0 z-10 grid">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="flex w-full">
                  {headerGroup.headers.map((header) => {
                    return (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        className="px-6 py-4 font-semibold whitespace-nowrap flex items-center"
                        style={{ width: header.getSize() !== 150 ? header.getSize() : 'auto', flex: header.getSize() !== 150 ? 'none' : 1 }}
                        role="columnheader"
                        aria-sort={header.column.getIsSorted() === 'asc' ? 'ascending' : header.column.getIsSorted() === 'desc' ? 'descending' : 'none'}
                      >
                        {header.isPlaceholder ? null : (
                          <button
                            type="button"
                            {...{
                              className: header.column.getCanSort()
                                ? 'cursor-pointer select-none flex items-center gap-1 hover:text-text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded'
                                : 'flex items-center',
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: <ChevronUp className="w-3 h-3 text-blue-400 ml-1" />,
                              desc: <ChevronDown className="w-3 h-3 text-blue-400 ml-1" />,
                            }[header.column.getIsSorted() as string] ?? null}
                          </button>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody 
              className="divide-y divide-zinc-800/50 relative"
              style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[virtualRow.index];
                return (
                  <tr
                    key={row.id}
                    className="hover:bg-bg-sunken transition-colors group absolute w-full flex"
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    role="row"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td 
                        key={cell.id} 
                        className="px-6 py-4 text-text-secondary flex items-center overflow-hidden"
                        style={{ width: cell.column.getSize() !== 150 ? cell.column.getSize() : 'auto', flex: cell.column.getSize() !== 150 ? 'none' : 1 }}
                        role="gridcell"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-sm text-text-secondary">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-1 rounded bg-bg-elevated border border-border text-text-secondary hover:bg-bg-sunken disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-1 rounded bg-bg-elevated border border-border text-text-secondary hover:bg-bg-sunken disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
