import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthSystem';

const AdminDrives = () => {
  const { token, user } = useAuth();
  const [drives, setDrives] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', description: '', date: '', location: '', capacity: 100, isPublic: true });
  const [editingId, setEditingId] = useState(null);

  const apiBase = process.env.REACT_APP_API_BASE || '';

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiBase}/api/admin/drives`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setDrives(data);
      // analytics
      const a = await fetch(`${apiBase}/api/admin/drives/analytics`, { headers: { 'Authorization': `Bearer ${token}` } });
      const aData = await a.json();
      if (a.ok) setAnalytics(aData);
      setError('');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [apiBase, token]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Light polling so participant counts reflect recent joins
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAll();
    }, 20000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${apiBase}/api/admin/drives/${editingId}` : `${apiBase}/api/admin/drives`;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      setForm({ title: '', description: '', date: '', location: '', capacity: 100, isPublic: true });
      setEditingId(null);
      fetchAll();
    } catch (e) {
      setError(e.message);
    }
  };

  const edit = (d) => {
    setEditingId(d._id);
    setForm({
      title: d.title || '',
      description: d.description || '',
      date: d.date ? new Date(d.date).toISOString().slice(0,16) : '',
      location: d.location || '',
      capacity: d.capacity || 100,
      isPublic: d.isPublic !== false
    });
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this drive?')) return;
    try {
      const res = await fetch(`${apiBase}/api/admin/drives/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');
      fetchAll();
    } catch (e) {
      setError(e.message);
    }
  };

  const togglePublic = async (id) => {
    try {
      const res = await fetch(`${apiBase}/api/admin/drives/${id}/toggle-public`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to toggle');
      fetchAll();
    } catch (e) {
      setError(e.message);
    }
  };

  if (user?.role !== 'admin') {
    return <div className="max-w-4xl mx-auto p-6">Admin access required.</div>;
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #f0fdf4 0%, #ecfdf5 100%)' }}>
      {/* Topbar */}
      <div className="w-full" style={{
        background: 'linear-gradient(90deg, #22c55e 0%, #34d399 100%)',
        color: 'white',
        boxShadow: '0 6px 20px rgba(34,197,94,0.25)'
      }}>
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Plantation Drives — Admin</h1>
          <p className="opacity-90 mt-1">Create, manage and analyze community drives</p>
        </div>
      </div>

      {/* Layout with vertical sidebar */}
      <div className="p-6 flex gap-6">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 rounded-xl p-4 sticky top-0 h-screen" style={{ background: 'linear-gradient(180deg, #22c55e 0%, #34d399 100%)', color: '#ffffff', boxShadow: '0 8px 20px rgba(16,185,129,0.18)' }}>
          <div className="text-sm font-semibold mb-3">Admin Panel</div>
          <nav className="flex flex-col gap-2">
            <button
              onClick={() => {
                const el = document.getElementById('admin-drive-form');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="text-left px-4 py-2 rounded-md"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.25)' }}
            >
              Add Plantation Drive
            </button>
            <button
              onClick={() => window.location.href = '/admin/drives/verification'}
              className="text-left px-4 py-2 rounded-md"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.25)' }}
            >
              Verify User Drives
            </button>
            <button
              onClick={() => {
                if (drives && drives.length > 0) {
                  const withParticipants = drives.find(d => (d.participants || []).length > 0);
                  const target = withParticipants || drives[0];
                  window.location.href = `/admin/drives/${target._id}/participants`;
                } else {
                  alert('No drives available yet. Create a drive first.');
                }
              }}
              className="text-left px-4 py-2 rounded-md"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.25)' }}
            >
              <span className="flex items-center justify-between">
                <span>Participants</span>
                <span
                  className="ml-3 inline-flex items-center justify-center text-xs font-semibold"
                  style={{
                    minWidth: '1.5rem',
                    height: '1.25rem',
                    padding: '0 0.4rem',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: '#ffffff',
                    borderRadius: '9999px',
                    border: '1px solid rgba(255,255,255,0.35)'
                  }}
                >
                  {(drives || []).reduce((sum, d) => sum + ((d.participants || []).length || 0), 0)}
                </span>
              </span>
            </button>
            <button
              onClick={() => { window.location.href = '/admin/drives/analytics'; }}
              className="text-left px-4 py-2 rounded-md"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.25)' }}
            >
              Analytics
            </button>
          </nav>
        </aside>

        {/* Main content */}
        <div className="flex-1">
        {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl p-5" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%)', border: '1px solid #d1fae5' }}>
            <div className="text-sm" style={{ color: '#047857' }}>Total Drives</div>
            <div className="text-3xl font-extrabold" style={{ color: '#065f46' }}>{analytics.totals.totalDrives}</div>
          </div>
          <div className="rounded-xl p-5" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%)', border: '1px solid #d1fae5' }}>
            <div className="text-sm" style={{ color: '#047857' }}>Upcoming / Past</div>
            <div className="text-3xl font-extrabold" style={{ color: '#065f46' }}>{analytics.totals.upcoming} / {analytics.totals.past}</div>
          </div>
          <div className="rounded-xl p-5" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%)', border: '1px solid #d1fae5' }}>
            <div className="text-sm" style={{ color: '#047857' }}>Participants / Capacity</div>
            <div className="text-2xl font-extrabold" style={{ color: '#065f46' }}>{analytics.totals.totalParticipants} / {analytics.totals.totalCapacity} ({analytics.totals.averageFillPercent}%)</div>
          </div>
        </div>
      )}

      {/* Create / Edit Card */}
      <form id="admin-drive-form" onSubmit={submit} className="rounded-xl p-5 mb-8" style={{ background: '#ffffff', border: '1px solid #d1fae5', boxShadow: '0 8px 20px rgba(16,185,129,0.08)' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="rounded px-3 py-2" style={{ border: '1px solid #a7f3d0' }} placeholder="Title" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} />
          {/* Location dropdown */}
          <select
            className="rounded px-3 py-2"
            style={{ border: '1px solid #a7f3d0' }}
            value={form.location}
            onChange={(e)=>setForm({...form,location:e.target.value})}
          >
            <option value="">Select Location</option>
            <option value="Islamabad">Islamabad</option>
            <option value="Lahore">Lahore</option>
            <option value="KPK">KPK</option>
          </select>
          <input className="rounded px-3 py-2" style={{ border: '1px solid #a7f3d0' }} type="datetime-local" value={form.date} onChange={(e)=>setForm({...form,date:e.target.value})} />
          <input className="rounded px-3 py-2" style={{ border: '1px solid #a7f3d0' }} type="number" min="1" placeholder="Capacity" value={form.capacity} onChange={(e)=>setForm({...form,capacity:Number(e.target.value)})} />
          <textarea className="rounded px-3 py-2 md:col-span-2" style={{ border: '1px solid #a7f3d0' }} placeholder="Description" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.isPublic} onChange={(e)=>setForm({...form,isPublic:e.target.checked})} />
            <span>Public</span>
          </label>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button className="text-white px-5 py-2 rounded-md" style={{ backgroundColor: '#22c55e', boxShadow: '0 6px 14px rgba(34,197,94,0.25)' }}>{editingId ? 'Update Drive' : 'Create Drive'}</button>
          {editingId && (
            <button type="button" className="px-4 py-2 rounded-md" style={{ border: '1px solid #a7f3d0', backgroundColor: '#fff', color: '#065f46' }} onClick={()=>{ setEditingId(null); setForm({ title: '', description: '', date: '', location: '', capacity: 100, isPublic: true }); }}>Cancel</button>
          )}
        </div>
      </form>

      {loading ? (
        <div className="text-center" style={{ color: '#065f46' }}>Loading drives...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {drives.map((d)=> (
            <div key={d._id} className="rounded-xl p-5" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%)', border: '1px solid #d1fae5' }}>
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold" style={{ color: '#065f46' }}>{d.title}</div>
                <div className="text-xs px-2 py-1 rounded-full" style={{backgroundColor: d.isPublic ? '#dcfce7' : '#fee2e2', color: d.isPublic ? '#166534' : '#991b1b', border: d.isPublic ? '1px solid #bbf7d0' : '1px solid #fecaca' }}>{d.isPublic ? 'Public' : 'Private'}</div>
              </div>
              <div className="text-sm mt-1" style={{ color: '#047857' }}>{new Date(d.date).toLocaleString()} • {d.location}</div>
              {d.description && <div className="text-sm mt-2" style={{ color: '#065f46' }}>{d.description}</div>}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm" style={{ color: '#047857' }}>Capacity: {d.capacity} • Joined: {(d.participants || []).length}</div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 rounded" style={{ border: '1px solid #a7f3d0', backgroundColor: '#ecfdf5', color: '#065f46' }} onClick={()=>{ window.location.href = `/admin/drives/${d._id}/participants`; }}>Participants</button>
                  <button className="px-3 py-1 rounded" style={{ border: '1px solid #a7f3d0', backgroundColor: '#fff', color: '#065f46' }} onClick={()=>edit(d)}>Edit</button>
                  <button className="px-3 py-1 rounded" style={{ border: '1px solid #a7f3d0', backgroundColor: '#ecfdf5', color: '#065f46' }} onClick={()=>togglePublic(d._id)}>{d.isPublic ? 'Make Private' : 'Make Public'}</button>
                  <button className="px-3 py-1 rounded text-white" style={{ backgroundColor: '#ef4444' }} onClick={()=>remove(d._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
      </div>
    </div>
  );
};

export default AdminDrives;



