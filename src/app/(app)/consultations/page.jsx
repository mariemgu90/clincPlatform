'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { fetchConsultations } from '@/lib/api';

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadConsultations();
  }, []);

  const loadConsultations = async () => {
    try {
      const data = await fetchConsultations();
      setConsultations(data);
    } catch (error) {
      toast.error('Failed to fetch consultations');
    } finally {
      setLoading(false);
    }
  };

  const filteredConsultations = consultations.filter(consultation => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      consultation.patient?.firstName?.toLowerCase().includes(search) ||
      consultation.patient?.lastName?.toLowerCase().includes(search) ||
      consultation.diagnosis?.toLowerCase().includes(search) ||
      consultation.chiefComplaint?.toLowerCase().includes(search)
    );
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      {/* Header Section */}
          <div className="glass-card p-6 mb-6 animate-slideUp">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold gradient-text mb-2">Consultations</h1>
                <p className="text-gray-600">View and manage patient consultations</p>
              </div>
              <button 
                onClick={() => {
                  setSelectedConsultation(null);
                  setShowModal(true);
                }}
                className="btn-primary flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Consultation
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="glass-card p-6 mb-6 animate-slideUp" style={{animationDelay: '0.1s'}}>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by patient name, diagnosis, or complaint..."
                className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-purple-600">{filteredConsultations.length}</span> of <span className="font-semibold">{consultations.length}</span> consultations
              </p>
            </div>
          </div>

          {/* Consultations List */}
          {filteredConsultations.length === 0 ? (
            <div className="glass-card p-12 text-center animate-fadeIn">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Consultations Found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'Try adjusting your search criteria' : 'Start by creating your first consultation'}
              </p>
              <button 
                onClick={() => {
                  setSelectedConsultation(null);
                  setShowModal(true);
                }}
                className="btn-primary"
              >
                Create Consultation
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredConsultations.map((consultation, index) => (
                <div
                  key={consultation.id}
                  className="glass-card p-6 hover-lift cursor-pointer animate-slideUp"
                  style={{animationDelay: `${0.1 + index * 0.05}s`}}
                  onClick={() => {
                    setSelectedConsultation(consultation);
                    setShowModal(true);
                  }}
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Patient Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {consultation.patient?.firstName?.[0]}{consultation.patient?.lastName?.[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {consultation.patient 
                            ? `${consultation.patient.firstName} ${consultation.patient.lastName}`
                            : 'Unknown Patient'
                          }
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(consultation.createdAt)} at {formatTime(consultation.createdAt)}
                        </p>
                        {consultation.doctor && (
                          <p className="text-sm text-gray-600 mt-1">
                            Dr. {consultation.doctor.name}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Consultation Details */}
                    <div className="flex-1 space-y-2">
                      {consultation.chiefComplaint && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase">Chief Complaint</p>
                          <p className="text-sm text-gray-800 line-clamp-2">{consultation.chiefComplaint}</p>
                        </div>
                      )}
                      {consultation.diagnosis && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase">Diagnosis</p>
                          <p className="text-sm text-gray-800 font-medium">{consultation.diagnosis}</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 md:flex-col">
                      <button 
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedConsultation(consultation);
                          setShowModal(true);
                        }}
                      >
                        View
                      </button>
                      {consultation._count?.prescriptions > 0 && (
                        <button 
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle prescription view
                          }}
                        >
                          Rx ({consultation._count.prescriptions})
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex gap-2 mt-4 flex-wrap">
                    {consultation.symptoms && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                        Symptoms Recorded
                      </span>
                    )}
                    {consultation.treatment && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        Treatment Plan
                      </span>
                    )}
                    {consultation.vitalSigns && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        Vitals
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Consultation Detail Modal */}
          {showModal && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowModal(false)}
            >
              <div 
                className="glass-card max-w-4xl w-full max-h-[90vh] overflow-auto animate-scaleIn"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-white bg-opacity-95 backdrop-blur-lg p-6 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-2xl font-bold gradient-text">
                    {selectedConsultation ? 'Consultation Details' : 'New Consultation'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {selectedConsultation ? (
                  <div className="p-6 space-y-6">
                    {/* Patient and Doctor Info */}
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                        {selectedConsultation.patient?.firstName?.[0]}{selectedConsultation.patient?.lastName?.[0]}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">
                          {selectedConsultation.patient 
                            ? `${selectedConsultation.patient.firstName} ${selectedConsultation.patient.lastName}`
                            : 'Unknown Patient'
                          }
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {formatDate(selectedConsultation.createdAt)} at {formatTime(selectedConsultation.createdAt)}
                        </p>
                        {selectedConsultation.doctor && (
                          <p className="text-gray-700 mt-2">
                            <span className="font-semibold">Doctor:</span> {selectedConsultation.doctor.name}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Vital Signs */}
                    {selectedConsultation.vitalSigns && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Vital Signs</h4>
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <pre className="text-sm text-gray-700 whitespace-pre-wrap">{JSON.stringify(selectedConsultation.vitalSigns, null, 2)}</pre>
                        </div>
                      </div>
                    )}

                    {/* Chief Complaint */}
                    {selectedConsultation.chiefComplaint && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Chief Complaint</h4>
                        <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                          <p className="text-gray-700">{selectedConsultation.chiefComplaint}</p>
                        </div>
                      </div>
                    )}

                    {/* Symptoms */}
                    {selectedConsultation.symptoms && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Symptoms</h4>
                        <div className="p-4 bg-orange-50 rounded-lg">
                          <p className="text-gray-700">{selectedConsultation.symptoms}</p>
                        </div>
                      </div>
                    )}

                    {/* Diagnosis */}
                    {selectedConsultation.diagnosis && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Diagnosis</h4>
                        <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                          <p className="text-gray-700 font-medium">{selectedConsultation.diagnosis}</p>
                        </div>
                      </div>
                    )}

                    {/* Treatment */}
                    {selectedConsultation.treatment && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Treatment Plan</h4>
                        <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                          <p className="text-gray-700">{selectedConsultation.treatment}</p>
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {selectedConsultation.notes && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Additional Notes</h4>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-gray-700">{selectedConsultation.notes}</p>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                      <button className="flex-1 btn-primary">
                        Edit Consultation
                      </button>
                      <button className="flex-1 py-3 px-6 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all font-medium">
                        Create Prescription
                      </button>
                      <button className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-all font-medium">
                        Print
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500 py-8">
                    <p>Consultation form will be implemented here</p>
                  </div>
                )}
              </div>
            </div>
          )}
    </>
  );
}
