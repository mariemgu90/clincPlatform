import React from 'react';

/**
 * Reusable UserFilters component
 *
 * Props:
 * - searchTerm: string
 * - setSearchTerm: function
 * - filterRole: string
 * - setFilterRole: function
 * - usersCount: number
 * - filteredCount: number
 * - listOptions: array of { value, label } (optional)
 * - placeholder: string (optional)
 * - showCounts: boolean (optional)
 * - className: string (optional)
 * - searchLabel: string (optional) - label text for the search input
 * - roleLabel: string (optional) - label text for the role select
 */
export default function UserFilters({
  searchTerm,
  setSearchTerm,
  filterRole,
  setFilterRole,
  usersCount = 0,
  filteredCount = 0,
  listOptions,
  placeholder = 'Search by name or email...',
  showCounts = true,
  className = '',
  // custom labels
  searchLabel = 'Search Users',
  roleLabel = 'Filter by Role',
  // show a clear button to reset search+role (helps debugging / UX)
  showClear = true,
}) {
  const defaultRoles = [
    { value: 'ALL', label: 'All Roles' },
    { value: 'ADMIN', label: 'Admin' },
    { value: 'DOCTOR', label: 'Doctors' },
    { value: 'RECEPTIONIST', label: 'Receptionists' },
    { value: 'PATIENT', label: 'Patients' },
  ];

  const roles = listOptions?.length > 0 ? listOptions : defaultRoles;

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 mb-6 border border-slate-200 ${className}`}>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-base font-semibold text-slate-800 mb-2">{searchLabel}</label>
          <div className="relative">
            <input
              type="text"
              placeholder={placeholder}
              aria-label={searchLabel}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <svg className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-3">
            <label className="block text-base font-semibold text-slate-800 mb-2">{roleLabel}</label>
            {showClear && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setFilterRole('ALL');
                }}
                className="ml-2 text-sm text-emerald-700 hover:underline font-medium"
              >
                Clear
              </button>
            )}
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all outline-none bg-white text-base text-slate-800"
            aria-label={roleLabel}
          >
                        <option  value='ALL' className="text-base">All Roles</option>

            {roles.map((r, key) => (
              <option key={key} value={r.name} className="text-base">{r.name}</option>
            ))}
          </select>
        </div>
      </div>
      {showCounts && (
        <div className="mt-4">
          <p className="text-sm text-slate-700">
            Showing <span className="font-semibold text-emerald-600">{filteredCount}</span> of <span className="font-semibold">{usersCount}</span> users
          </p>
        </div>
      )}
    </div>
  );
}
