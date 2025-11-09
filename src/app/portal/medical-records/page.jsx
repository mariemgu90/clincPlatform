'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { fetchMedicalRecords } from '@/lib/api';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export default function MedicalRecordsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [consultations, setConsultations] = useState([]);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      if (session?.user?.role !== 'PATIENT') {
        router.push('/dashboard');
      } else {
        fetchRecords();
      }
    }
  }, [status, session, router]);

  const fetchRecords = async () => {
    try {
      const data = await fetchMedicalRecords();
      setConsultations(data.consultations || []);
    } catch (error) {
      console.error('Error fetching medical records:', error);
    } finally {
      setLoading(false);
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

  const openDetailModal = (consultation) => {
    setSelectedConsultation(consultation);
    setShowDetailModal(true);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 ml-64">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                Medical Records
              </h1>
              <p className="text-gray-600">View your consultation history and prescriptions</p>
            </div>

            {/* Medical Records List */}
            {consultations.length === 0 ? (
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-12 text-center">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No Medical Records</h3>
                <p className="text-gray-600 mb-6">
                  You don't have any consultation records yet. Your medical history will appear here after your first visit.
                </p>
                <button
                  onClick={() => router.push('/portal/book-appointment')}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  Book Appointment
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Timeline */}
                <div className="relative">
                  {consultations.map((consultation, index) => (
                    <div key={consultation.id} className="relative pb-8">
                      {/* Timeline Line */}
                      {index !== consultations.length - 1 && (
                        <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-gradient-to-b from-emerald-600 to-teal-600"></div>
                      )}

                      {/* Consultation Card */}
                      <div className="flex gap-6">
                        {/* Timeline Dot */}
                        <div className="relative flex-shrink-0">
                          <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                            {index + 1}
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="flex-1 bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all">
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="flex-1">
                              {/* Header */}
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                                  {consultation.doctor?.name?.charAt(0) || 'D'}
                                </div>
                                <div>
                                  <h3 className="text-lg font-bold text-gray-800">
                                    Dr. {consultation.doctor?.name || 'Unknown Doctor'}
                                  </h3>
                                  <p className="text-sm text-gray-600">{formatDate(consultation.createdAt)}</p>
                                </div>
                              </div>

                              {/* Consultation Details */}
                              <div className="space-y-3">
                                {consultation.chiefComplaint && (
                                  <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Chief Complaint</p>
                                    <p className="text-sm text-gray-800">{consultation.chiefComplaint}</p>
                                  </div>
                                )}
                                {consultation.diagnosis && (
                                  <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Diagnosis</p>
                                    <p className="text-sm text-gray-800 font-medium">{consultation.diagnosis}</p>
                                  </div>
                                )}
                                {consultation.treatment && (
                                  <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Treatment</p>
                                    <p className="text-sm text-gray-800">{consultation.treatment}</p>
                                  </div>
                                )}
                              </div>

                              {/* Tags */}
                              <div className="flex flex-wrap gap-2 mt-4">
                                {consultation.symptoms && (
                                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                                    Symptoms Recorded
                                  </span>
                                )}
                                {consultation.vitalSigns && (
                                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                    Vitals Checked
                                  </span>
                                )}
                                {consultation._count?.prescriptions > 0 && (
                                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                    {consultation._count.prescriptions} Prescription(s)
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-3 md:items-end">
                              <button
                                onClick={() => openDetailModal(consultation)}
                                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all font-medium whitespace-nowrap"
                              >
                                View Full Record
                              </button>
                              {consultation._count?.prescriptions > 0 && (
                                <button
                                  onClick={() => {
                                    // TODO: Download prescription PDF
                                    alert('Prescription PDF download will be implemented soon');
                                  }}
                                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-medium whitespace-nowrap"
                                >
                                  📄 Download Prescription
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedConsultation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Consultation Details</h2>
                  <p className="text-purple-100">
                    Dr. {selectedConsultation.doctor?.name} • {formatDate(selectedConsultation.createdAt)}
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
              {selectedConsultation.chiefComplaint && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Chief Complaint</h3>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedConsultation.chiefComplaint}</p>
                </div>
              )}

              {selectedConsultation.symptoms && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Symptoms</h3>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedConsultation.symptoms}</p>
                </div>
              )}

              {selectedConsultation.vitalSigns && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Vital Signs</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                      {JSON.stringify(selectedConsultation.vitalSigns, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {selectedConsultation.diagnosis && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Diagnosis</h3>
                  <p className="text-gray-700 bg-purple-50 p-4 rounded-lg font-medium">
                    {selectedConsultation.diagnosis}
                  </p>
                </div>
              )}

              {selectedConsultation.treatment && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Treatment Plan</h3>
                  <p className="text-gray-700 bg-green-50 p-4 rounded-lg">{selectedConsultation.treatment}</p>
                </div>
              )}

              {selectedConsultation.notes && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Additional Notes</h3>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedConsultation.notes}</p>
                </div>
              )}

              {selectedConsultation._count?.prescriptions > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Prescriptions</h3>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-gray-700 mb-3">
                      {selectedConsultation._count.prescriptions} prescription(s) issued
                    </p>
                    <button
                      onClick={() => {
                        // TODO: Download prescription PDF
                        alert('Prescription PDF download will be implemented soon');
                      }}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-medium"
                    >
                      📄 Download Prescription PDF
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 p-6 rounded-b-2xl flex justify-end gap-3">
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
