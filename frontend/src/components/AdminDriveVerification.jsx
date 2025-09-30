import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthSystem';

const AdminDriveVerification = () => {
  const { authFetch } = useAuth();
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPendingDrives = useCallback(async () => {
    try {
      setLoading(true);
      const response = await authFetch('/api/admin/drives/pending');
      
      if (!response.ok) {
        throw new Error('Failed to fetch pending drives');
      }

      const data = await response.json();
      setDrives(data);
    } catch (err) {
      console.error('Error fetching pending drives:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    fetchPendingDrives();
  }, [fetchPendingDrives]);

  const handleApprove = async (driveId) => {
    try {
      setActionLoading(true);
      const response = await authFetch(`/api/admin/drives/${driveId}/approve`, {
        method: 'PATCH'
      });

      if (!response.ok) {
        throw new Error('Failed to approve drive');
      }

      // Update the drive status in the list
      setDrives(prev => prev.map(drive => 
        drive._id === driveId ? { ...drive, status: 'approved' } : drive
      ));
      
      setShowModal(false);
      setSelectedDrive(null);
    } catch (err) {
      console.error('Error approving drive:', err);
      alert('Failed to approve drive: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (driveId, reason) => {
    try {
      setActionLoading(true);
      const response = await authFetch(`/api/admin/drives/${driveId}/reject`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });

      if (!response.ok) {
        throw new Error('Failed to reject drive');
      }

      // Update the drive status in the list
      setDrives(prev => prev.map(drive => 
        drive._id === driveId ? { ...drive, status: 'rejected', rejectionReason: reason } : drive
      ));
      
      setShowModal(false);
      setSelectedDrive(null);
    } catch (err) {
      console.error('Error rejecting drive:', err);
      alert('Failed to reject drive: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const openModal = (drive) => {
    setSelectedDrive(drive);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDrive(null);
  };

  const filteredDrives = drives.filter(drive => {
    if (filter === 'all') return true;
    return drive.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return '✓';
      case 'pending':
        return '⏳';
      case 'rejected':
        return '✗';
      default:
        return '?';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading drives...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Drives</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchPendingDrives}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Drive Verification</h1>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Drives</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredDrives.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Drives Found</h3>
            <p className="text-gray-600">
              {filter === 'pending' ? 'No pending drives to review.' : 'No drives match the current filter.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredDrives.map((drive) => (
              <div key={drive._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {drive.title}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(drive.status)}`}>
                      <span className="mr-1">{getStatusIcon(drive.status)}</span>
                      {drive.status.charAt(0).toUpperCase() + drive.status.slice(1)}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {drive.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {drive.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(drive.date).toLocaleDateString()} at {drive.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Max {drive.maxParticipants} participants
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.143-5.714L5 12l5.714-2.143L13 3z" />
                      </svg>
                      {drive.treesToPlant} trees to plant
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Created by: {drive.createdBy?.name || 'Unknown User'}
                    </div>
                  </div>

                  {drive.status === 'rejected' && drive.rejectionReason && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                      <p className="text-sm text-red-800">
                        <strong>Rejection Reason:</strong> {drive.rejectionReason}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      Created {new Date(drive.createdAt).toLocaleDateString()}
                    </div>
                    <button
                      onClick={() => openModal(drive)}
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      {drive.status === 'pending' ? 'Review' : 'View Details'} →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedDrive && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Drive Details</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Title</h3>
                  <p className="text-gray-600">{selectedDrive.title}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">Description</h3>
                  <p className="text-gray-600">{selectedDrive.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">Location</h3>
                    <p className="text-gray-600">{selectedDrive.location}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Date & Time</h3>
                    <p className="text-gray-600">
                      {new Date(selectedDrive.date).toLocaleDateString()} at {selectedDrive.time}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">Max Participants</h3>
                    <p className="text-gray-600">{selectedDrive.maxParticipants}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Trees to Plant</h3>
                    <p className="text-gray-600">{selectedDrive.treesToPlant}</p>
                  </div>
                </div>

                {selectedDrive.requirements && (
                  <div>
                    <h3 className="font-semibold text-gray-900">Requirements</h3>
                    <p className="text-gray-600">{selectedDrive.requirements}</p>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-gray-900">Contact Information</h3>
                  <p className="text-gray-600">{selectedDrive.contactInfo}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">Created By</h3>
                  <p className="text-gray-600">{selectedDrive.createdBy?.name || 'Unknown User'}</p>
                </div>

                {selectedDrive.status === 'rejected' && selectedDrive.rejectionReason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <h3 className="font-semibold text-red-900">Rejection Reason</h3>
                    <p className="text-red-800">{selectedDrive.rejectionReason}</p>
                  </div>
                )}
              </div>

              {selectedDrive.status === 'pending' && (
                <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleReject(selectedDrive._id, prompt('Please provide a reason for rejection:'))}
                    disabled={actionLoading}
                    className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 disabled:opacity-50"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(selectedDrive._id)}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {actionLoading ? 'Processing...' : 'Approve'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDriveVerification;
