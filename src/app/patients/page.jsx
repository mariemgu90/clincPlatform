'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import PatientForm from '@/components/PatientForm';

export default function PatientsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await fetch('/api/patients');
      const data = await res.json();
      setPatients(data.patients || []);
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone?.includes(searchTerm);
    
    const matchesGender = filterGender === 'all' || patient.gender === filterGender;
    
    return matchesSearch && matchesGender;
  });

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setShowModal(true);
  };

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto bg-gradient-to-br from-slate-50 to-slate-100">
          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-slideUp border border-slate-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">Patients Directory</h1>
                <p className="text-slate-600">Manage and view all patient records</p>
              </div>
              <button 
                onClick={() => {
                  setSelectedPatient(null);
                  setShowModal(true);
                }}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Patient
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-slideUp border border-slate-200" style={{animationDelay: '0.1s'}}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Search Patients
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, email, or phone..."
                    className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all outline-none text-base font-semibold text-slate-900"
                  />
                  <svg className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Gender Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Filter by Gender
                </label>
                <select
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all outline-none bg-white"
                >
                  <option value="all">All Genders</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-slate-600">
                Showing <span className="font-semibold text-emerald-600">{filteredPatients.length}</span> of <span className="font-semibold">{patients.length}</span> patients
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>

          {/* Patients Grid */}
          {filteredPatients.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center animate-fadeIn border border-slate-200">
              <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No Patients Found</h3>
              <p className="text-slate-500 mb-4">
                {searchTerm ? 'Try adjusting your search criteria' : 'Get started by adding your first patient'}
              </p>
              <button 
                onClick={() => {
                  setSelectedPatient(null);
                  setShowModal(true);
                }}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all"
              >
                Add New Patient
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPatients.map((patient, index) => (
                <div
                  key={patient.id}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all animate-slideUp border border-slate-200"
                  style={{animationDelay: `${0.1 + index * 0.05}s`}}
                  onClick={() => handleViewPatient(patient)}
                >
                  {/* Avatar and Basic Info */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-lg shadow-emerald-500/30">
                      {patient.firstName?.[0]}{patient.lastName?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-slate-800 truncate">
                        {patient.firstName} {patient.lastName}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {calculateAge(patient.dateOfBirth)} years • {patient.gender || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    {patient.email && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="truncate">{patient.email}</span>
                      </div>
                    )}
                    {patient.phone && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{patient.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{patient._count?.appointments || 0}</p>
                      <p className="text-xs text-gray-500">Appointments</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{patient._count?.invoices || 0}</p>
                      <p className="text-xs text-slate-500">Invoices</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-slate-700">
                        {patient.bloodType || 'N/A'}
                      </p>
                      <p className="text-xs text-slate-500">Blood Type</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    <button 
                      className="flex-1 py-2 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-105 transition-all text-sm font-semibold"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewPatient(patient);
                      }}
                    >
                      View Details
                    </button>
                    <button 
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/calendar?patient=${patient.id}`);
                      }}
                    >
                      <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Patient Detail Modal */}
          {showModal && (
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowModal(false)}
            >
              <div 
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto animate-scaleIn border border-slate-200"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-teal-500 p-6 border-b border-emerald-600 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">
                    {selectedPatient ? 'Patient Details' : 'Add New Patient'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {selectedPatient ? (
                  <div className="p-6 space-y-6">
                    {/* Patient Info */}
                    <div className="flex items-start gap-6">
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0 shadow-lg shadow-emerald-500/30">
                        {selectedPatient.firstName?.[0]}{selectedPatient.lastName?.[0]}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800">
                          {selectedPatient.firstName} {selectedPatient.lastName}
                        </h3>
                        <p className="text-slate-600 mt-1">
                          {calculateAge(selectedPatient.dateOfBirth)} years old • {selectedPatient.gender || 'N/A'}
                        </p>
                        <div className="flex gap-4 mt-3">
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                            Blood Type: {selectedPatient.bloodType || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                      <h4 className="text-lg font-semibold text-slate-800 mb-3">Contact Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                          <p className="text-sm text-slate-500 mb-1">Email</p>
                          <p className="font-medium text-slate-800">{selectedPatient.email || 'N/A'}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                          <p className="text-sm text-slate-500 mb-1">Phone</p>
                          <p className="font-medium text-slate-800">{selectedPatient.phone || 'N/A'}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 md:col-span-2">
                          <p className="text-sm text-slate-500 mb-1">Address</p>
                          <p className="font-medium text-slate-800">{selectedPatient.address || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Emergency Contact */}
                    <div>
                      <h4 className="text-lg font-semibold text-slate-800 mb-3">Emergency Contact</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                          <p className="text-sm text-red-600 mb-1">Contact Name</p>
                          <p className="font-medium text-slate-800">{selectedPatient.emergencyContact || 'N/A'}</p>
                        </div>
                        <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                          <p className="text-sm text-red-600 mb-1">Contact Phone</p>
                          <p className="font-medium text-slate-800">{selectedPatient.emergencyPhone || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Medical Information */}
                    {(selectedPatient.allergies || selectedPatient.currentMedications || selectedPatient.medicalHistory) && (
                      <div>
                        <h4 className="text-lg font-semibold text-slate-800 mb-3">Medical Information</h4>
                        <div className="space-y-3">
                          {selectedPatient.allergies && (
                            <div className="p-4 bg-amber-50 rounded-xl border-l-4 border-amber-400">
                              <p className="text-sm font-semibold text-amber-800 mb-1">Allergies</p>
                              <p className="text-slate-700">{selectedPatient.allergies}</p>
                            </div>
                          )}
                          {selectedPatient.currentMedications && (
                            <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-400">
                              <p className="text-sm font-semibold text-blue-800 mb-1">Current Medications</p>
                              <p className="text-slate-700">{selectedPatient.currentMedications}</p>
                            </div>
                          )}
                          {selectedPatient.medicalHistory && (
                            <div className="p-4 bg-emerald-50 rounded-xl border-l-4 border-emerald-400">
                              <p className="text-sm font-semibold text-emerald-800 mb-1">Medical History</p>
                              <p className="text-slate-700">{selectedPatient.medicalHistory}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                      <button className="flex-1 py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-105 transition-all font-semibold">
                        Edit Patient
                      </button>
                      <button 
                        className="flex-1 py-3 px-6 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl hover:shadow-lg hover:shadow-teal-500/30 hover:scale-105 transition-all font-semibold"
                        onClick={() => router.push(`/calendar?patient=${selectedPatient.id}`)}
                      >
                        Book Appointment
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <PatientForm
                      patient={null}
                      onSuccess={(newPatient) => {
                        setPatients([...patients, newPatient]);
                        setShowModal(false);
                      }}
                      onCancel={() => setShowModal(false)}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
