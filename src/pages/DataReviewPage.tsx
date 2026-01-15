import { useState, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { mockProgressReports } from '@/services/mockData';
import { formatDate } from '@/lib/utils';

export default function DataReviewPage() {
  const [filter, setFilter] = useState<'all' | 'potential' | 'approved' | 'rejected'>('all');
  const [reports, setReports] = useState(() => [...mockProgressReports]);
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const statusBadge = (status?: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'potential':
        return <Badge variant="warning">Potential</Badge>;
      case 'rejected':
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return <Badge variant="primary">{status || 'unknown'}</Badge>;
    }
  };

  const filtered = useMemo(() => reports.filter((r) => (filter === 'all' ? true : (r as any).status === filter)), [reports, filter]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleSelect = (id: string) => {
    setSelected((s) => (s.includes(id) ? s.filter(x => x !== id) : [...s, id]));
  };

  const setStatusForSelected = (status: 'approved' | 'rejected') => {
    if (selected.length === 0) return;
    const updated = reports.map(r => selected.includes(r.id) ? { ...r, status } : r);
    setReports(updated);
    for (const id of selected) {
      const idx = mockProgressReports.findIndex(m => m.id === id);
      if (idx !== -1) mockProgressReports[idx].status = status;
    }
    setSelected([]);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Review</h1>
          <p className="text-gray-600 mt-1">Review recent progress reports and manage their status.</p>
        </div>

        <div className="flex gap-3 items-center">
          {(['all', 'potential', 'approved', 'rejected'] as const).map((s) => (
            <button
              key={s}
              onClick={() => { setFilter(s); setPage(1); }}
              className={`px-3 py-1 rounded ${filter === s ? 'bg-primary-600 text-white' : 'bg-white border-2 border-primary-100 text-gray-700'}`}>
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)} ({reports.filter(r => (s === 'all' ? true : (r as any).status === s)).length})
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => setStatusForSelected('approved')} className="px-3 py-1 rounded bg-success-600 text-white" disabled={selected.length===0}>Bulk Approve</button>
            <button onClick={() => setStatusForSelected('rejected')} className="px-3 py-1 rounded bg-danger-600 text-white" disabled={selected.length===0}>Bulk Reject</button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Progress Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y-2 divide-primary-200">
                <thead className="bg-primary-50">
                  <tr>
                    <th className="px-4 py-2 text-left"><input type="checkbox" checked={selected.length>0 && pageItems.every(pi=>selected.includes(pi.id))} onChange={(e)=>{
                      if(e.target.checked) setSelected(pageItems.map(p=>p.id)); else setSelected([]);
                    }} /></th>
                    <th className="px-4 py-2 text-left">Report</th>
                    <th className="px-4 py-2 text-left">Data (label / value)</th>
                    <th className="px-4 py-2 text-left">Progress</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pageItems.length === 0 ? (
                    <tr><td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">No reports</td></tr>
                  ) : pageItems.map((r) => (
                    <tr key={r.id} className="hover:bg-primary-50">
                      <td className="px-4 py-3"><input type="checkbox" checked={selected.includes(r.id)} onChange={()=>toggleSelect(r.id)} /></td>
                      <td className="px-4 py-3">
                        <div className="font-medium">Report #{r.id}</div>
                        <div className="text-sm text-gray-500">{r.achievements}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        <div><strong>Progress:</strong> {r.progress}%</div>
                        <div className="text-xs text-gray-500">Challenges: {r.challenges}</div>
                      </td>
                      <td className="px-4 py-3">{r.progress}%</td>
                      <td className="px-4 py-3">{statusBadge((r as any).status)}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{formatDate(r.reportDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">Showing {filtered.length === 0 ? 0 : ((page-1)*pageSize)+1} - {Math.min(page*pageSize, filtered.length)} of {filtered.length}</div>
              <div className="flex items-center gap-2">
                <button onClick={()=>setPage(p=>Math.max(1,p-1))} className="px-2 py-1 border rounded" disabled={page===1}>Prev</button>
                <span className="px-2">{page}/{totalPages}</span>
                <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} className="px-2 py-1 border rounded" disabled={page===totalPages}>Next</button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
