'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  fetchStaff, 
  createStaff, 
  updateStaff, 
  deleteStaff,
  fetchRoles,
  fetchClinics 
} from '@/lib/api';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import StaffDetails from '@/components/StaffDetails';
import StaffEdit from '@/components/StaffEdit';
import StaffCard from '@/components/StaffCard';

export default function StaffManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [staff, setStaff] = useState([]);
  const [roles, setRoles] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    clinicId: '',
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: '',
    clinicId: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (session?.user?.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchStaffData();
      fetchRolesData();
      fetchClinicsData();
    }
  }, [session]);

  const fetchStaffData = async () => {
    try {
      const data = await fetchStaff();
      setStaff(data || []);
    } catch (error) {
      console.error('Failed to fetch staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRolesData = async () => {
    try {
      const data = await fetchRoles();
      setRoles(data);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    }
  };

  const fetchClinicsData = async () => {
    try {
      const data = await fetchClinics();
      setClinics(data);
    } catch (error) {
      console.error('Failed to fetch clinics:', error);
    }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      await createStaff(formData);
      setShowAddModal(false);
      setFormData({ name: '', email: '', password: '', phone: '', role: '', clinicId: '' });
      fetchStaffData();
    } catch (error) {
      console.error('Failed to add staff:', error);
      alert(error.message || 'Failed to add staff member');
    }
  };

  const handleDeleteStaff = async (id) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return;

    try {
      await deleteStaff(id);
      fetchStaffData();
      setShowDetailsModal(false);
    } catch (error) {
      console.error('Failed to delete staff:', error);
      alert(error.message || 'Failed to delete staff member');
    }
  };

  const handleViewDetails = (member) => {
    setSelectedStaff(member);
    setShowDetailsModal(true);
  };

  const handleEditStaff = (member) => {
    setEditFormData({
      name: member.name,
      email: member.email,
      phone: member.phone || '',
      role: member.role,
      clinicId: member.clinic?.id || '',
    });
    setSelectedStaff(member);
    setShowDetailsModal(false);
    setShowEditModal(true);
  };

  const handleUpdateStaff = async (e) => {
    e.preventDefault();
    
    try {
      await updateStaff(selectedStaff.id, editFormData);
      fetchStaffData();
      setShowEditModal(false);
      setSelectedStaff(null);
    } catch (error) {
      console.error('Failed to update staff:', error);
      alert(error.message || 'Failed to update staff member');
    }
  };

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'ALL' || member.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
      </div>
    );
  }

  if (session?.user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 ml-64">
          <div className="max-w-7xl mx-auto bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 rounded-3xl p-8 shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 mb-6 shadow-lg shadow-emerald-500/30 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Staff Management
                </h1>
                <p className="text-white/90">
                  Manage doctors, receptionists, and staff members
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-white text-emerald-600 rounded-xl hover:shadow-lg transition-all font-semibold flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Staff Member
              </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-slate-200">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Search Staff
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all outline-none"
                    />
                    <svg className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Filter by Role
                  </label>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all outline-none bg-white"
                  >
                    <option value="ALL">All Roles</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.name}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-slate-600">
                  Showing <span className="font-semibold text-emerald-600">{filteredStaff.length}</span> of <span className="font-semibold">{staff.length}</span> staff members
                </p>
              </div>
            </div>

            {/* Staff List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredStaff.length > 0 ? (
                filteredStaff.map((member, index) => (
                  <StaffCard
                    key={member.id}
                    member={member}
                    onViewDetails={handleViewDetails}
                    index={index}
                  />
                ))
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-slate-200">
                  <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">No Staff Members Found</h3>
                  <p className="text-slate-500 mb-4">
                    {searchTerm ? 'Try adjusting your search criteria' : 'Add your first staff member to get started'}
                  </p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
                  >
                    Add Staff Member
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedStaff && (
        <StaffDetails
          staff={selectedStaff}
          onClose={() => setShowDetailsModal(false)}
          onEdit={handleEditStaff}
          onDelete={handleDeleteStaff}
        />
      )}

      {/* Edit Staff Modal */}
      {showEditModal && selectedStaff && (
        <StaffEdit
          editFormData={editFormData}
          setEditFormData={setEditFormData}
          onSubmit={handleUpdateStaff}
          onClose={() => setShowEditModal(false)}
          roles={roles}
          clinics={clinics}
        />
      )}

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-slate-200 animate-scaleIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Add Staff Member</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all outline-none text-base font-bold text-slate-900"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all outline-none text-base font-bold text-slate-900"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all outline-none text-base font-bold text-slate-900"
                  placeholder="Enter password"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all outline-none text-base font-bold text-slate-900"
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Role *</label>
                <select
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all outline-none bg-white text-base font-bold text-slate-900"
                >
                  <option value="" disabled>Select a role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Clinic (Optional)</label>
                <select
                  value={formData.clinicId}
                  onChange={(e) => setFormData({ ...formData, clinicId: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all outline-none bg-white text-base font-bold text-slate-900"
                >
                  <option value="">No clinic assigned</option>
                  {clinics.map((clinic) => (
                    <option key={clinic.id} value={clinic.id}>
                      {clinic.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 mt-6 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl transition-all font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all font-semibold"
                >
                  Add Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// StaffCard component extracted to `src/components/StaffCard.jsx`
