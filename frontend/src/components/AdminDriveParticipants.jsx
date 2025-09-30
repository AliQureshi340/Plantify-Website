import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthSystem';
import { useParams } from 'react-router-dom';

const AdminDriveParticipants = ({ driveId }) => {
  const { token } = useAuth();
  const params = useParams();
  const effectiveDriveId = driveId || params.id;
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [drives, setDrives] = useState([]);
  const apiBase = process.env.REACT_APP_API_BASE || '';

  const load = async () => {
    try {
      setLoading(true);
      if (!effectiveDriveId) {
        setParticipants([]);
        setError('Missing drive id in URL.');
        setLoading(false);
        return;
      }
      const res = await fetch(`${apiBase}/api/admin/drives/${encodeURIComponent(effectiveDriveId)}/participants`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Failed to fetch participants (status ${res.status})`);
      const normalized = Array.isArray(data) ? data : (data.participants || []);
      setParticipants(normalized);
      setError('');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const loadDrives = async () => {
    try {
      const res = await fetch(`${apiBase}/api/admin/drives`, { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setDrives(Array.isArray(data) ? data : []);
    } catch {}
  };

  useEffect(() => { load(); loadDrives(); // eslint-disable-next-line
  }, [effectiveDriveId]);

  // Light polling to refresh the list as users join
  useEffect(() => {
    const interval = setInterval(() => {
      load();
    }, 20000);
    return () => clearInterval(interval);
  }, [effectiveDriveId]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Drive Participants</h2>
        <div>
          <select
            value={effectiveDriveId || ''}
            onChange={(e) => { if (e.target.value) { window.location.href = `/admin/drives/${e.target.value}/participants`; } }}
            className="px-3 py-2 border rounded-md"
          >
            <option value="">Select Drive</option>
            {drives.map(d => (
              <option key={d._id} value={d._id}>
                {d.title} ({(d.participants || []).length})
              </option>
            ))}
          </select>
        </div>
      </div>
      {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Joined At</th>
              </tr>
            </thead>
            <tbody>
              {participants.map(p => (
                <tr key={p._id} className="border-t">
                  <td className="px-4 py-2">{(p.firstName || '') + ' ' + (p.lastName || '')}</td>
                  <td className="px-4 py-2">{p.email || p.userId?.email}</td>
                  <td className="px-4 py-2">{p.phone || '-'}</td>
                  <td className="px-4 py-2">{new Date(p.createdAt).toLocaleString()}</td>
                </tr>
              ))}
              {participants.length === 0 && (
                <tr><td className="px-4 py-6 text-gray-500" colSpan={4}>No participants yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDriveParticipants;



