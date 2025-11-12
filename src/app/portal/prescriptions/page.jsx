'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { fetchPortalPrescriptions, downloadPrescriptionPDF } from '@/lib/api';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export default function PrescriptionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [prescriptions, setPrescriptions] = useState([]);
  const [filter, setFilter] = useState('ALL'); // ALL, ACTIVE, COMPLETED, CANCELLED
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      if (session?.user?.role !== 'PATIENT') {
        router.push('/dashboard');
      } else {
        fetchPrescriptionsData();
      }
    }
  }, [status, session, router]);

  const fetchPrescriptionsData = async () => {
    try {
      const data = await fetchPortalPrescriptions();
      setPrescriptions(data.prescriptions || []);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredPrescriptions = () => {
    if (filter === 'ALL') return prescriptions;
    return prescriptions.filter((p) => p.status.toUpperCase() === filter);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'completed':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-300';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const parseMedications = (medications) => {
    if (typeof medications === 'string') {
      try {
        return JSON.parse(medications);
      } catch {
        return [];
      }
    }
    return medications || [];
  };

  const openDetailModal = (prescription) => {
    setSelectedPrescription(prescription);
    setShowDetailModal(true);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const filteredPrescriptions = getFilteredPrescriptions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                My Prescriptions
              </h1>
              <p className="text-gray-600">View and manage your medication prescriptions</p>
            </div>

            {/* Filter Buttons */}
            <div className="mb-6 flex flex-wrap gap-3">
              {['ALL', 'ACTIVE', 'COMPLETED', 'CANCELLED'].map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    filter === filterOption
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                      : 'bg-white/70 backdrop-blur-xl text-gray-700 hover:shadow-lg'
                  }`}
                >
                  {filterOption.charAt(0) + filterOption.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            {/* Prescriptions List */}
            {filteredPrescriptions.length === 0 ? (
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-12 text-center">
                <div className="text-6xl mb-4">💊</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No Prescriptions Found</h3>
                <p className="text-gray-600 mb-6">
                  {filter === 'ALL'
                    ? "You don't have any prescriptions yet."
                    : `You don't have any ${filter.toLowerCase()} prescriptions.`}
                </p>
                <button
                  onClick={() => router.push('/portal/book-appointment')}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  Book Appointment
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredPrescriptions.map((prescription) => {
                  const medications = parseMedications(prescription.medications);
                  return (
                    <div
                      key={prescription.id}
                      className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all"
                    >
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        {/* Prescription Details */}
                        <div className="flex-1">
                          <div className="flex items-start gap-4 mb-4">
                            {/* Doctor Avatar */}
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                              {prescription.doctor?.name?.charAt(0) || 'D'}
                            </div>

                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-800 mb-1">
                                Dr. {prescription.doctor?.name || 'Unknown Doctor'}
                              </h3>
                              <p className="text-gray-600 mb-2">
                                Issued on {formatDate(prescription.issuedAt)}
                              </p>
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                  prescription.status
                                )}`}
                              >
                                {prescription.status.toUpperCase()}
                              </span>
                            </div>
                          </div>

                          {/* Medications Summary */}
                          <div className="ml-20">
                            {prescription.diagnosis && (
                              <div className="mb-3">
                                <span className="text-xs font-semibold text-gray-500 uppercase">Diagnosis:</span>
                                <p className="text-gray-800 font-medium">{prescription.diagnosis}</p>
                              </div>
                            )}
                            <div className="mb-3">
                              <span className="text-xs font-semibold text-gray-500 uppercase">
                                Medications ({medications.length}):
                              </span>
                              <div className="space-y-2 mt-2">
                                {medications.slice(0, 2).map((med, index) => (
                                  <div key={index} className="bg-green-50 p-3 rounded-lg border border-green-200">
                                    <p className="text-gray-800 font-semibold">{med.name}</p>
                                    <p className="text-gray-600 text-sm">{med.dosage} - {med.frequency}</p>
                                  </div>
                                ))}
                                {medications.length > 2 && (
                                  <p className="text-gray-600 text-sm">
                                    +{medications.length - 2} more medication(s)
                                  </p>
                                )}
                              </div>
                            </div>

                            {prescription.expiresAt && (
                              <div className="text-sm text-gray-600">
                                <span className="font-semibold">Expires:</span> {formatDate(prescription.expiresAt)}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3 md:items-end">
                          <button
                            onClick={() => openDetailModal(prescription)}
                            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all font-medium whitespace-nowrap"
                          >
                            View Full Details
                          </button>
                          {prescription.pdfUrl ? (
                            <a
                              href={prescription.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-medium text-center"
                            >
                              📄 Download PDF
                            </a>
                          ) : (
                            <button
                              onClick={() => {
                                alert('PDF generation will be implemented soon');
                              }}
                              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-medium"
                            >
                              📄 Generate PDF
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedPrescription && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Prescription Details</h2>
                  <p className="text-green-100">
                    Dr. {selectedPrescription.doctor?.name} • {formatDate(selectedPrescription.issuedAt)}
                  </p>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-all"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {selectedPrescription.diagnosis && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Diagnosis</h3>
                  <p className="text-gray-700 bg-purple-50 p-4 rounded-lg font-medium">
                    {selectedPrescription.diagnosis}
                  </p>
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Medications</h3>
                <div className="space-y-4">
                  {parseMedications(selectedPrescription.medications).map((med, index) => (
                    <div key={index} className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-lg font-bold text-gray-800">{med.name}</h4>
                        <span className="text-green-700 font-semibold text-sm">{med.dosage}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600 font-medium">Frequency:</span>
                          <p className="text-gray-800">{med.frequency}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 font-medium">Duration:</span>
                          <p className="text-gray-800">{med.duration}</p>
                        </div>
                      </div>
                      {med.instructions && (
                        <div className="mt-3 pt-3 border-t border-green-200">
                          <span className="text-gray-600 font-medium text-sm">Instructions:</span>
                          <p className="text-gray-800 text-sm mt-1">{med.instructions}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {selectedPrescription.notes && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Additional Notes</h3>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedPrescription.notes}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <span className="text-gray-600 font-medium">Status:</span>
                  <p className="text-gray-800 font-bold mt-1">{selectedPrescription.status.toUpperCase()}</p>
                </div>
                {selectedPrescription.expiresAt && (
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <span className="text-gray-600 font-medium">Expires On:</span>
                    <p className="text-gray-800 font-bold mt-1">{formatDate(selectedPrescription.expiresAt)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 p-6 rounded-b-2xl flex justify-end gap-3">
              {selectedPrescription.pdfUrl ? (
                <a
                  href={selectedPrescription.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-all"
                >
                  📄 Download PDF
                </a>
              ) : (
                <button
                  onClick={() => {
                    alert('PDF generation will be implemented soon');
                  }}
                  className="px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-all"
                >
                  📄 Generate PDF
                </button>
              )}
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
