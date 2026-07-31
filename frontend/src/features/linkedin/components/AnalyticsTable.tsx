import React, { useState, useMemo } from 'react';
import { 
  useReactTable, 
  getCoreRowModel, 
  getSortedRowModel, 
  flexRender,
  createColumnHelper,
  SortingState
} from '@tanstack/react-table';
import { LinkedInPost, PostType } from '../types/linkedin';
import { ArrowUpDown, Image as ImageIcon, Video, FileText, AlignLeft, BarChart2, Mail } from 'lucide-react';

interface AnalyticsTableProps {
  data: LinkedInPost[];
  onRowClick?: (post: LinkedInPost) => void;
}

const columnHelper = createColumnHelper<LinkedInPost>();

const getTypeIcon = (type: PostType) => {
  switch (type) {
    case 'Image': return <ImageIcon className="w-4 h-4 text-blue-400" />;
    case 'Video': return <Video className="w-4 h-4 text-purple-400" />;
    case 'Article': return <AlignLeft className="w-4 h-4 text-emerald-400" />;
    case 'Carousel': return <FileText className="w-4 h-4 text-orange-400" />;
    case 'Poll': return <BarChart2 className="w-4 h-4 text-pink-400" />;
    case 'Newsletter': return <Mail className="w-4 h-4 text-indigo-400" />;
    default: return <FileText className="w-4 h-4 text-text-secondary" />;
  }
};

const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

export const AnalyticsTable: React.FC<AnalyticsTableProps> = ({ data, onRowClick }) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo(() => [
    columnHelper.accessor('title', {
      header: 'Post',
      cell: info => (
        <div className="flex items-center gap-3 max-w-[400px]">
          <div className="w-10 h-10 rounded bg-bg-sunken flex items-center justify-center shrink-0 overflow-hidden border border-border-light">
            {info.row.original.img ? (
              <img src={info.row.original.img} alt="" className="w-full h-full object-cover" />
            ) : (
              getTypeIcon(info.row.original.type)
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-text-primary truncate max-w-[300px]">{info.getValue()}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-text-muted font-medium bg-bg-sunken px-1.5 py-0.5 rounded">{info.row.original.type}</span>
              <span className="text-[10px] text-text-muted">{new Date(info.row.original.publishedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('impressions', {
      header: ({ column }) => (
        <button className="flex items-center gap-1 hover:text-text-primary transition-colors" onClick={column.getToggleSortingHandler()}>
          Impressions <ArrowUpDown className="w-3 h-3" />
        </button>
      ),
      cell: info => <span className="font-medium text-text-primary">{formatNumber(info.getValue())}</span>,
    }),
    columnHelper.accessor('engagementRate', {
      header: ({ column }) => (
        <button className="flex items-center gap-1 hover:text-text-primary transition-colors" onClick={column.getToggleSortingHandler()}>
          Eng. Rate <ArrowUpDown className="w-3 h-3" />
        </button>
      ),
      cell: info => <span className="font-medium text-emerald-400">{info.getValue()}%</span>,
    }),
    columnHelper.accessor('comments', {
      header: ({ column }) => (
        <button className="flex items-center gap-1 hover:text-text-primary transition-colors" onClick={column.getToggleSortingHandler()}>
          Comments <ArrowUpDown className="w-3 h-3" />
        </button>
      ),
      cell: info => <span className="text-text-secondary">{formatNumber(info.getValue())}</span>,
    }),
    columnHelper.accessor('reposts', {
      header: ({ column }) => (
        <button className="flex items-center gap-1 hover:text-text-primary transition-colors" onClick={column.getToggleSortingHandler()}>
          Reposts <ArrowUpDown className="w-3 h-3" />
        </button>
      ),
      cell: info => <span className="text-text-secondary">{formatNumber(info.getValue())}</span>,
    }),
    columnHelper.accessor('score', {
      header: ({ column }) => (
        <button className="flex items-center gap-1 hover:text-text-primary transition-colors" onClick={column.getToggleSortingHandler()}>
          AI Score <ArrowUpDown className="w-3 h-3" />
        </button>
      ),
      cell: info => {
        const score = info.getValue();
        let color = 'text-emerald-400';
        if (score < 50) color = 'text-red-400';
        else if (score < 80) color = 'text-yellow-400';
        return <span className={`font-bold ${color}`}>{score}/100</span>;
      },
    }),
  ], []);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="bg-bg-elevated border border-border-light rounded-2xl overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-bg-canvas border-b border-border-light text-xs uppercase tracking-wider font-bold text-text-muted">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-6 py-4">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-[rgba(255,255,255,0.06)]">
            {table.getRowModel().rows.map(row => (
              <tr 
                key={row.id} 
                onClick={() => onRowClick?.(row.original)}
                className="hover:bg-bg-sunken transition-colors cursor-pointer group"
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
