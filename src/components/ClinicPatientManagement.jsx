'use client';

import { useState } from 'react';
import PatientCard from './PatientCard';

export default function ClinicPatientManagement({ 
  patients, 
  onViewPatientDetails 
}) {
  const [searchPatientTerm, setSearchPatientTerm] = useState('');
  const [filterPatientGender, setFilterPatientGender] = useState('all');

  const clinicPatients = patients;
   const statspatients = [
    {
      icon: '👥',
      title: 'Total Patients',
      value: clinicPatients.length,
      gradient: 'from-teal-500 to-teal-600',
      svg: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      ),
    },
    {
      icon: '✅',
      title: 'Active Patients',
      value: clinicPatients.filter((p) => p.status === 'Active').length,
      gradient: 'from-emerald-500 to-emerald-600',
      svg: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
    },
    {
      icon: '👨',
      title: 'Male Patients',
      value: clinicPatients.filter((p) => p.gender === 'Male').length,
      gradient: 'from-blue-500 to-blue-600',
      svg: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      ),
    },
    {
      icon: '👩',
      title: 'Female Patients',
      value: clinicPatients.filter((p) => p.gender === 'Female').length,
      gradient: 'from-pink-500 to-pink-600',
      svg: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      ),
    },
  ];
  const filteredPatients = clinicPatients.filter(patient => {
    const matchesSearch = searchPatientTerm === '' || 
      patient.firstName?.toLowerCase().includes(searchPatientTerm.toLowerCase()) ||
      patient.lastName?.toLowerCase().includes(searchPatientTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchPatientTerm.toLowerCase()) ||
      patient.phone?.includes(searchPatientTerm);
    
    const matchesGender = filterPatientGender === 'all' || patient.gender === filterPatientGender;
    
    return matchesSearch && matchesGender;
  });
  return (
    <div>
      <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-teal-200">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <span className="text-4xl">🏥</span>
            Patient Management
          </h2>
          <p className="text-slate-600 mt-1">View patient records registered at this clinic</p>
        </div>
      </div>
  {/* Patient Statistics */}
      <div className="grid grid-cols-4 gap-6 mb-8">
       {statspatients.map((item, index) => (
        <div
          key={index}
          className={`bg-gradient-to-r ${item.gradient} rounded-2xl p-4 shadow-lg text-white flex items-center justify-between transition-transform transform hover:scale-105 hover:shadow-xl`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {item.svg}
              </svg>
            </div>        
                <h3 className="text-white font-semibold text-base">
              {item.title}
            </h3>
          </div>
          <p className="text-4xl font-bold">{item.value}</p>
        </div>
      ))}
      </div>
      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Search Patients
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchPatientTerm}
                onChange={(e) => setSearchPatientTerm(e.target.value)}
                placeholder="Search by name, email, or phone..."
                className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all outline-none text-base font-semibold text-slate-900"
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
              value={filterPatientGender}
              onChange={(e) => setFilterPatientGender(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all outline-none bg-white text-base font-semibold text-slate-900"
            >
              <option value="all">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Showing <span className="font-semibold text-teal-600">{filteredPatients.length}</span> of <span className="font-semibold">{clinicPatients.length}</span> patients
          </p>
          {searchPatientTerm && (
            <button
              onClick={() => setSearchPatientTerm('')}
              className="text-sm text-teal-600 hover:text-teal-700 font-semibold"
            >
              Clear Search
            </button>
          )}
        </div>
      </div>

    

      {/* Patient List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredPatients.length === 0 ? (
          <div className="col-span-2 text-center py-16 bg-white rounded-2xl shadow-lg border-2 border-dashed border-slate-300">
            <div className="text-6xl mb-4 animate-pulse">🏥</div>
            <p className="text-xl font-bold text-slate-700">
              {searchPatientTerm || filterPatientGender !== 'all' ? 'No patients match your filters' : 'No patients registered yet'}
            </p>
            <p className="text-slate-500 mt-2">
              {searchPatientTerm || filterPatientGender !== 'all' ? 'Try adjusting your search criteria' : 'Patient records will appear here once they are registered'}
            </p>
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <PatientCard 
              key={patient.id}
              patient={patient}
              onViewDetails={() => { onViewPatientDetails(patient.id); }}
            />
          ))
        )}
      </div>
    </div>
  );
}
