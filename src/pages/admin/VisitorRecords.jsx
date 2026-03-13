import React, { useEffect, useMemo, useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import { Button, Card } from '../../components/ui';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../context/AuthContext';
import {
  addToBlacklist,
  subscribeToAllVisitors,
} from '../../firebase/visitorService';

const VisitorRecords = () => {
  const toast = useToast();
  const { user } = useAuth();
  const role = user?.role || '';
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [flat, setFlat] = useState('');
  const [type, setType] = useState('all');
  const [date, setDate] = useState('');

  const toCsv = (dataRows) => {
    const headers = [
      'Visitor Name', 'Phone Number', 'Flat Number', 'Purpose', 'Visitor Type',
      'Entry Time', 'Exit Time', 'Status', 'Approval Method'
    ];
    const body = dataRows.map((r) => [
      r.visitorName || '-',
      r.phone || '-',
      r.flatNumber || '-',
      r.purpose || '-',
      r.visitorType || '-',
      r.entryTime || '-',
      r.exitTime || '-',
      r.status || '-',
      r.approvalMethod || '-',
    ]);
    return [headers, ...body].map((row) => row.map((cell) => `"${String(cell || '').replace(/"/g, '""')}"`).join(',')).join('\n');
  };

  const downloadTextFile = (fileName, content, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const unsub = subscribeToAllVisitors((items) => {
      const normalized = items.map((row) => ({
        id: row.id,
        visitorName: row.visitorName || row.visitor_name || '-',
        phone: row.phone || row.phone_number || '-',
        flatNumber: row.flatNumber || row.flat_number || '-',
        purpose: row.purpose || '-',
        visitorType: row.visitorType || row.visitor_type || '-',
        entryTime: row.entryTime || '-',
        exitTime: row.exitTime || '-',
        status: row.status || '-',
        approvalMethod: row.approvalMethod || row.approval_method || '-',
        createdDate: row.createdAt?.toDate?.()?.toISOString?.().slice(0, 10) || '',
      }));
      setRows(normalized);
    });
    return () => unsub && unsub();
  }, []);

  const filtered = useMemo(() => rows.filter((row) => {
    const s = search.trim().toLowerCase();
    const matchSearch = !s || [row.visitorName, row.phone, row.purpose, row.flatNumber].some((x) => String(x || '').toLowerCase().includes(s));
    const matchFlat = !flat.trim() || String(row.flatNumber || '').toLowerCase().includes(flat.trim().toLowerCase());
    const matchType = type === 'all' || row.visitorType === type;
    const matchDate = !date || row.createdDate === date;
    return matchSearch && matchFlat && matchType && matchDate;
  }), [rows, search, flat, type, date]);

  const exportCsv = () => {
    const csv = toCsv(filtered);
    downloadTextFile(`visitor-records-${Date.now()}.csv`, csv, 'text/csv;charset=utf-8');
  };

  const exportExcel = () => {
    const csv = toCsv(filtered);
    const html = `<html><body><table border="1">${csv.split('\n').map((line) => `<tr>${line.split(',').map((cell) => `<td>${cell.replace(/^"|"$/g, '')}</td>`).join('')}</tr>`).join('')}</table></body></html>`;
    downloadTextFile(`visitor-records-${Date.now()}.xls`, html, 'application/vnd.ms-excel');
  };

  const onBlacklist = async (row) => {
    const reason = window.prompt('Blacklist reason for this visitor:', 'Security policy violation');
    if (!reason) return;
    try {
      await addToBlacklist({
        visitor_name: row.visitorName,
        phone_number: row.phone,
        phone: row.phone,
        reason,
        addedBy: user?.uid || user?.id || 'admin',
      });
      toast.success('Visitor added to blacklist.');
    } catch (error) {
      toast.error(error.message || 'Failed to blacklist visitor');
    }
  };

  if (role !== 'admin') {
    return <Card><div style={{ padding: 20 }}>Unauthorized: admin role required.</div></Card>;
  }

  return (
    <div>
      <PageHeader title="Visitor Records" subtitle="Search, filter, and export complete visitor history" />

      <Card>
        <div style={{ padding: 16, display: 'grid', gap: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto auto', gap: 8 }}>
            <input placeholder="Search visitor / phone / purpose / flat" value={search} onChange={(e) => setSearch(e.target.value)} />
            <input placeholder="Filter by flat" value={flat} onChange={(e) => setFlat(e.target.value)} />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="all">All Types</option>
              <option value="Guest">Guest</option>
              <option value="Delivery">Delivery</option>
              <option value="Service">Service</option>
            </select>
            <Button variant="secondary" onClick={exportCsv}>Export CSV</Button>
            <Button variant="outline" onClick={exportExcel}>Export Excel</Button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Visitor Name</th>
                  <th>Flat Number</th>
                  <th>Purpose</th>
                  <th>Entry Time</th>
                  <th>Exit Time</th>
                  <th>Status</th>
                  <th>Approval Method</th>
                  <th>Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id}>
                    <td>{row.visitorName}</td>
                    <td>{row.flatNumber}</td>
                    <td>{row.purpose}</td>
                    <td>{row.entryTime || '-'}</td>
                    <td>{row.exitTime || '-'}</td>
                    <td>{row.status}</td>
                    <td>{row.approvalMethod}</td>
                    <td>{row.visitorType}</td>
                    <td><Button variant="danger" size="sm" onClick={() => onBlacklist(row)}>Blacklist</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default VisitorRecords;
