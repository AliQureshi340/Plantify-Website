import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthSystem';

const Drives = () => {
  const { isAuthenticated, token } = useAuth();
  const [drives, setDrives] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('All');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [joinForm, setJoinForm] = useState({ firstName: '', lastName: '', phone: '', email: '' });
  const [joinSubmitting, setJoinSubmitting] = useState(false);
  const [joinMessage, setJoinMessage] = useState('');
  const [toast, setToast] = useState(null);

  const plantImages = [
    '/images/indoor-plant.png',
    '/images/plant-hero.png',
    '/images/plant.png',
    '/images/plantify_logo_400x400.jpg',
    '/logo512.png'
  ];
  const [heroImgIndex, setHeroImgIndex] = useState(0);

  const fetchDrives = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('q', search);
      if (region && region !== 'All') params.set('q', `${search ? search + ' ' : ''}${region}`.trim());
      const query = params.toString() ? `?${params.toString()}` : '';
      const apiUrl = `${process.env.REACT_APP_API_BASE || ''}/api/drives${query}`;
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error('Failed to load drives');
      const data = await res.json();
      setDrives(data);
      const now = Date.now();
      const upcomingList = data.filter(d => new Date(d.date).getTime() >= now).sort((a,b)=>new Date(a.date)-new Date(b.date));
      const pastList = data.filter(d => new Date(d.date).getTime() < now).sort((a,b)=>new Date(b.date)-new Date(a.date));
      setUpcoming(upcomingList);
      setPast(pastList);
      setError('');
    } catch (e) {
      setError(e.message || 'Failed to load drives');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region]);

  const openJoinModal = (drive) => {
    setSelectedDrive(drive);
    setJoinMessage('');
    setError('');
    setShowJoinModal(true);
  };

  const submitJoin = async (e) => {
    e.preventDefault();
    if (!selectedDrive) return;
    if (!isAuthenticated) {
      setJoinMessage('Please sign in to complete joining.');
      return;
    }
    if (!joinForm.firstName || !joinForm.lastName || !joinForm.phone || !joinForm.email) {
      setJoinMessage('Please complete all fields.');
      return;
    }
    try {
      setJoinSubmitting(true);
      setJoinMessage('');
      const res = await fetch(`${process.env.REACT_APP_API_BASE || ''}/api/drives/${selectedDrive._id}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(joinForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to join');
      setShowJoinModal(false);
      setJoinForm({ firstName: '', lastName: '', phone: '', email: '' });
      fetchDrives();
      setToast({ type: 'success', message: 'You have successfully joined the drive!' });
      setTimeout(() => setToast(null), 2500);
    } catch (e) {
      setJoinMessage(e.message || 'Failed to join');
      setToast({ type: 'error', message: e.message || 'Failed to join drive' });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setJoinSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #f0fdf4 0%, #ecfdf5 100%)' }}>
      {/* Local styles for shimmer/small animations */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -400px 0 }
          100% { background-position: 400px 0 }
        }
        .shimmer {
          background: linear-gradient(90deg, #e6f6ec 25%, #f5fffa 50%, #e6f6ec 75%);
          background-size: 800px 100%;
          animation: shimmer 1.4s infinite;
        }
        @keyframes floatIn { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }
        .animate-floatIn { animation: floatIn .5s ease-out both }
      `}</style>
      <div className="w-full" style={{
        background: 'linear-gradient(90deg, #22c55e 0%, #34d399 100%)',
        color: 'white',
        boxShadow: '0 6px 20px rgba(34,197,94,0.25)'
      }}>
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Plantation Drives</h1>
          <p className="opacity-90 mt-2">Join upcoming community tree-planting events near you</p>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-white/70 backdrop-blur shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="animate-floatIn">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight" style={{ color: '#1f3d2b' }}>
              Join Community <span className="text-green-600">Plantation Drives</span>
            </h1>
            <p className="mt-4 text-gray-600 text-lg">Make cities greener with us. Find upcoming drives near you, reserve a spot, and plant together.</p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })} className="px-6 py-3 rounded-lg text-white font-semibold" style={{ backgroundColor: '#22c55e' }}>View Drives</button>
              <button className="px-6 py-3 rounded-lg font-semibold" style={{ border: '1px solid #a7f3d0', color: '#065f46', background: 'white' }}>Learn More</button>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { label: 'Light', desc: 'Bright but Indirect' },
                { label: 'Water', desc: 'Moderate Watering' },
                { label: 'Care', desc: 'Easy & Occasional' }
              ].map((b, i) => (
                <div key={i} className="rounded-xl px-4 py-3 border" style={{ borderColor: '#e2f7eb', background: '#f8fffb' }}>
                  <div className="text-sm font-semibold" style={{ color: '#065f46' }}>{b.label}</div>
                  <div className="text-xs text-gray-600">{b.desc}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center animate-floatIn" style={{ animationDelay: '.1s' }}>
            <div className="relative w-80 h-80 rounded-2xl shadow-xl overflow-hidden" style={{ background: 'linear-gradient(180deg, #e7f7ee 0%, #ffffff 100%)', border: '1px solid #d1fae5' }}>
              <div className="absolute -top-6 -right-6 w-40 h-40 rounded-full" style={{ background: 'radial-gradient(circle at center, rgba(34,197,94,0.25), transparent 60%)' }}></div>
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={plantImages[heroImgIndex]}
                  alt="Plant"
                  className="w-56 h-56 object-contain drop-shadow-md transition-transform duration-300"
                  onError={() => setHeroImgIndex((i) => (i + 1) % plantImages.length)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and content */}
      <div className="max-w-6xl mx-auto px-6 py-10" id="drives">
      <div className="mb-6">
        <div className="w-full bg-white rounded-2xl px-3 py-3 shadow-sm" style={{ border: '1px solid #bbf7d0' }}>
          <div className="flex items-center gap-6">
            {['Islamabad', 'Lahore', 'KPK', 'All'].map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={`relative font-medium transition-all ${region === r ? 'text-[#047857]' : 'text-gray-700 hover:text-[#10b981]'} hover:-translate-y-0.5`}
                style={{ padding: '8px 14px', borderRadius: '12px', backgroundColor: region === r ? '#ecfdf5' : 'transparent', boxShadow: region === r ? '0 6px 14px rgba(16,185,129,0.15)' : 'none' }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: '#065f46' }}>Find an event</h2>
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or location"
            className="rounded-md px-3 py-2 focus:outline-none"
            style={{ backgroundColor: '#ffffff', border: '1px solid #a7f3d0' }}
          />
          <button
            onClick={fetchDrives}
            className="text-white px-4 py-2 rounded-md shadow-md"
            style={{ backgroundColor: '#22c55e' }}
          >
            Search
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 text-sm" style={{ color: '#8c2f39' }}>{error}</div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-6">
          {[1,2,3].map((i) => (
            <div key={i} className="rounded-xl p-5 shadow-sm shimmer" style={{ height: 160, border: '1px solid #d1fae5' }}></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-10">
          {drives.length === 0 && (
            <div className="text-gray-600">No drives found.</div>
          )}

          {upcoming.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: '#065f46' }}>Upcoming Drives</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcoming.map((d) => {
                  const joined = (d.participants || []).length;
                  const cap = d.capacity || 0;
                  const left = Math.max(0, cap - joined);
                  const pct = cap > 0 ? Math.min(100, Math.round((joined / cap) * 100)) : 0;
                  return (
                    <div
                      key={d._id}
                      className="rounded-xl p-5 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg"
                      style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%)', border: '1px solid #d1fae5' }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-lg font-semibold" style={{ color: '#065f46' }}>{d.title}</div>
                        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#ecfdf5', color: '#065f46', border: '1px solid #bbf7d0' }}>{new Date(d.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#d1fae5', color: '#065f46', border: '1px solid #bbf7d0' }}>📍 {d.location}</span>
                        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#d1fae5', color: '#065f46', border: '1px solid #bbf7d0' }}>🌱 Community Drive</span>
                      </div>
                      {d.description && (
                        <div className="text-sm mb-3" style={{ color: '#065f46' }}>{d.description}</div>
                      )}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1 text-xs" style={{ color: '#047857' }}>
                          <span>Participation</span>
                          <span>{joined}/{cap}</span>
                        </div>
                        <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#d1fae5' }}>
                          <div className="h-full" style={{ width: pct + '%', background: 'linear-gradient(90deg, #22c55e 0%, #34d399 100%)' }}></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-sm" style={{ color: '#047857' }}>Spots left: {left}</div>
                        <button onClick={() => openJoinModal(d)} className="text-white px-4 py-2 rounded-md disabled:opacity-50 shadow transform hover:-translate-y-0.5 hover:shadow-md" style={{ backgroundColor: '#22c55e' }} disabled={joined >= cap}>{joined >= cap ? 'Full' : 'Join'}</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: '#065f46' }}>Past Drives</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {past.map((d) => (
                  <div key={d._id} className="rounded-xl p-5 shadow-sm" style={{ background: '#ffffff', border: '1px solid #e5e7eb', opacity: 0.95 }}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-lg font-semibold" style={{ color: '#065f46' }}>{d.title}</div>
                      <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#f0fdf4', color: '#047857', border: '1px solid #bbf7d0' }}>{new Date(d.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#ecfeff', color: '#0e7490', border: '1px solid #bae6fd' }}>✔ Completed</span>
                      <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#d1fae5', color: '#065f46', border: '1px solid #bbf7d0' }}>📍 {d.location}</span>
                    </div>
                    {d.description && (<div className="text-sm" style={{ color: '#065f46' }}>{d.description}</div>)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fallback map kept for structure; not used now */}
          {drives.length === -1 && drives.map((d) => {
            const joined = (d.participants || []).length;
            const cap = d.capacity || 0;
            const left = Math.max(0, cap - joined);
            const pct = cap > 0 ? Math.min(100, Math.round((joined / cap) * 100)) : 0;
            return (
            <div
                key={d._id}
                className="rounded-xl p-5 shadow-sm transition-transform hover:-translate-y-1"
                style={{
                  background: 'linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%)',
                  border: '1px solid #d1fae5'
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="text-lg font-semibold" style={{ color: '#065f46' }}>{d.title}</div>
                  <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#ecfdf5', color: '#065f46', border: '1px solid #bbf7d0' }}>
                    {new Date(d.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#d1fae5', color: '#065f46', border: '1px solid #bbf7d0' }}>📍 {d.location}</span>
                  <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#d1fae5', color: '#065f46', border: '1px solid #bbf7d0' }}>🌱 Community Drive</span>
                </div>
                {d.description && (
                  <div className="text-sm mb-3" style={{ color: '#065f46' }}>{d.description}</div>
                )}

                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1 text-xs" style={{ color: '#047857' }}>
                    <span>Participation</span>
                    <span>{joined}/{cap}</span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#d1fae5' }}>
                    <div className="h-full" style={{ width: pct + '%', background: 'linear-gradient(90deg, #22c55e 0%, #34d399 100%)' }}></div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="text-sm" style={{ color: '#047857' }}>
                    Spots left: {left}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openJoinModal(d)}
                      className="text-white px-4 py-2 rounded-md disabled:opacity-50 shadow"
                      style={{ backgroundColor: '#22c55e' }}
                      disabled={joined >= cap}
                    >
                      {joined >= cap ? 'Full' : 'Join'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      </div>

      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.45)' }}>
          <div className="w-full max-w-lg rounded-xl p-6 transform transition-all duration-200" style={{ backgroundColor: '#ffffff', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', border: '1px solid #e3eadb' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm" style={{ color: '#4d6340' }}>Join Drive</div>
                <div className="text-xl font-bold" style={{ color: '#2f3f1c' }}>{selectedDrive?.title}</div>
              </div>
              <button onClick={() => setShowJoinModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            <form onSubmit={submitJoin}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1" style={{ color: '#3f531f' }}>First Name</label>
                  <input
                    className="w-full rounded-md px-3 py-2"
                    style={{ border: '1px solid #c9d5bf' }}
                    value={joinForm.firstName}
                    onChange={(e) => setJoinForm({ ...joinForm, firstName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: '#3f531f' }}>Last Name</label>
                  <input
                    className="w-full rounded-md px-3 py-2"
                    style={{ border: '1px solid #c9d5bf' }}
                    value={joinForm.lastName}
                    onChange={(e) => setJoinForm({ ...joinForm, lastName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: '#3f531f' }}>Phone Number</label>
                  <input
                    className="w-full rounded-md px-3 py-2"
                    style={{ border: '1px solid #c9d5bf' }}
                    value={joinForm.phone}
                    onChange={(e) => setJoinForm({ ...joinForm, phone: e.target.value })}
                    placeholder="03001234567"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: '#3f531f' }}>Email</label>
                  <input
                    type="email"
                    className="w-full rounded-md px-3 py-2"
                    style={{ border: '1px solid #c9d5bf' }}
                    value={joinForm.email}
                    onChange={(e) => setJoinForm({ ...joinForm, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              {joinMessage && (
                <div className="mt-3 text-sm" style={{ color: '#8c2f39' }}>{joinMessage}</div>
              )}

              <div className="mt-5 flex justify-end gap-3">
                <button type="button" onClick={() => setShowJoinModal(false)} className="px-4 py-2 rounded-md transform hover:-translate-y-0.5" style={{ border: '1px solid #c9d5bf', backgroundColor: '#fff', color: '#274019' }}>Cancel</button>
                <button type="submit" disabled={joinSubmitting} className="px-5 py-2 rounded-md text-white disabled:opacity-60 transform hover:-translate-y-0.5" style={{ backgroundColor: '#6b8f3d' }}>
                  {joinSubmitting ? 'Joining...' : 'Join Drive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-lg shadow-lg z-50 ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default Drives;


