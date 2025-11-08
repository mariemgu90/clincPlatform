'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PrescriptionsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [prescriptions, setPrescrip tions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  useEffect(() => {
    filterPrescriptions();
  }, [prescriptions, searchTerm, statusFilter]);

  const fetchPrescriptions = async () => {
    try {
      const response = await fetch('/api/prescriptions');
      const data = await response.json();
      setPrescrip tions(data.prescriptions || []);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPrescriptions = () => {
    let filtered = prescriptions;

    if (searchTerm) {
      filtered = filtered.filter(
        (rx) =>
          rx.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rx.medications?.some(med => med.name?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((rx) => rx.status === statusFilter);
    }

    setFilteredPrescriptions(filtered);
  };

  const handleDownloadPDF = async (prescriptionId) => {
    try {
      const response = await fetch(`/api/prescriptions/${prescriptionId}/pdf`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prescription-${prescriptionId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download prescription PDF');
    }
  };

  const handlePrint = (prescription) => {
    setSelectedPrescription(prescription);
    setTimeout(() => window.print(), 100);
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-emerald-100 text-emerald-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return styles[status] || styles.active;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Prescriptions</h1>
              <p className="text-slate-600 mt-1">Manage and generate patient prescriptions</p>
            </div>
            <Link
              href="/prescriptions/new"
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Prescription
            </Link>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by patient name or medication..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status Filter</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-lg p-6 text-white">
            <div className="text-3xl font-bold mb-2">{prescriptions.length}</div>
            <div className="text-emerald-50">Total Prescriptions</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg p-6 text-white">
            <div className="text-3xl font-bold mb-2">
              {prescriptions.filter((rx) => rx.status === 'active').length}
            </div>
            <div className="text-blue-50">Active</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
            <div className="text-3xl font-bold mb-2">
              {prescriptions.filter((rx) => rx.status === 'completed').length}
            </div>
            <div className="text-purple-50">Completed</div>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-lg p-6 text-white">
            <div className="text-3xl font-bold mb-2">
              {prescriptions.filter((rx) => new Date(rx.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
            </div>
            <div className="text-amber-50">This Week</div>
          </div>
        </div>

        {/* Prescriptions List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">All Prescriptions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Patient</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Medications</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Duration</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredPrescriptions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                      No prescriptions found
                    </td>
                  </tr>
                ) : (
                  filteredPrescriptions.map((prescription) => (
                    <tr key={prescription.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {new Date(prescription.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{prescription.patient?.name || 'N/A'}</div>
                        <div className="text-sm text-slate-500">{prescription.patient?.email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {prescription.medications?.length || 0} medication(s)
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {prescription.duration || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(prescription.status)}`}>
                          {prescription.status || 'active'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedPrescription(prescription);
                              setShowModal(true);
                            }}
                            className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors text-sm"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDownloadPDF(prescription.id)}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                          >
                            PDF
                          </button>
                          <button
                            onClick={() => handlePrint(prescription)}
                            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
                          >
                            Print
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Prescription Detail Modal */}
      {showModal && selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">Prescription Details</h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedPrescription(null);
                  }}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Patient Info */}
              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="font-semibold text-slate-900 mb-2">Patient Information</h3>
                <p className="text-slate-700"><strong>Name:</strong> {selectedPrescription.patient?.name}</p>
                <p className="text-slate-700"><strong>Email:</strong> {selectedPrescription.patient?.email}</p>
                <p className="text-slate-700"><strong>Date:</strong> {new Date(selectedPrescription.createdAt).toLocaleDateString()}</p>
              </div>

              {/* Medications */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Prescribed Medications</h3>
                <div className="space-y-3">
                  {selectedPrescription.medications?.map((med, index) => (
                    <div key={index} className="border border-slate-200 rounded-xl p-4">
                      <div className="font-medium text-slate-900">{med.name}</div>
                      <div className="text-sm text-slate-600 mt-1">
                        <p><strong>Dosage:</strong> {med.dosage}</p>
                        <p><strong>Frequency:</strong> {med.frequency}</p>
                        <p><strong>Duration:</strong> {med.duration}</p>
                        {med.instructions && <p><strong>Instructions:</strong> {med.instructions}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Notes */}
              {selectedPrescription.notes && (
                <div className="bg-amber-50 rounded-xl p-4">
                  <h3 className="font-semibold text-slate-900 mb-2">Additional Notes</h3>
                  <p className="text-slate-700">{selectedPrescription.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => handleDownloadPDF(selectedPrescription.id)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg"
                >
                  Download PDF
                </button>
                <button
                  onClick={() => handlePrint(selectedPrescription)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg"
                >
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
