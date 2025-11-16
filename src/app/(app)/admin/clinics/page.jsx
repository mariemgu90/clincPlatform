'use client';

import { useState } from 'react';
import RoleGuard from '@/components/RoleGuard';
import StatCard from '@/components/StatCard';
import CardClinicInfo from '@/components/CardClinicInfo';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

import {
  useClinics,
  useCreateClinic,
  useDeleteClinic,
  usePatients,
  useStaff,
  useServices,
} from '@/hooks';

const getInitialFormData = () => ({
  name: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  phone: '',
  email: '',
  website: '',
  logo: '🏥',
  description: '',
  openingHours: '',
});

export default function ClinicsManagement() {
  const router = useRouter();
  // const { data: session, status } = useSession();

  // ============ React Query Hooks ============
  const clinicsQuery = useClinics();
  const patientsQuery = usePatients();
  const staffQuery = useStaff();
  const servicesQuery = useServices();

  // ============ Mutations ============
  const createClinicMutation = useCreateClinic({
    onSuccess: () => {
      toast.success('Clinic created successfully');
      setShowAddModal(false);
      setFormData(getInitialFormData()); 
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create clinic');
    },
  });

  const deleteClinicMutation = useDeleteClinic({
    onSuccess: () => {
      toast.success('Clinic deleted successfully');
      setShowDeleteConfirm(false);
      setClinicToDelete(null);
      if (selectedClinic?.id === clinicToDelete?.id) {
        handleBackToList();
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete clinic');
    },
  });

  // ============ State Management - All useState in One Block ============
  const [viewMode, setViewMode] = useState('list');
  const [selectedClinic, setSelectedClinic] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [clinicToDelete, setClinicToDelete] = useState(null);
  const [formData, setFormData] = useState(getInitialFormData());



  const clinics = clinicsQuery.data || [];
  const allPatients = patientsQuery.data || [];
  const allStaff = staffQuery.data || [];
  const allServices = servicesQuery.data || [];

  
  const statsTotal = [
    {
      icon: '🏥',
      title: 'Total Clinics',
      value: clinics.length,
      valueColor: 'text-slate-900',
    },
    {
      icon: '✅',
      title: 'Active Clinics',
      value: clinics.filter((c) => c.status === 'Active').length,
      valueColor: 'text-emerald-600',
    },
    {
      icon: '👥',
      title: 'Total Staff',
      value: allStaff.length,
      valueColor: 'text-blue-600',
    },
    {
      icon: '🩺',
      title: 'Total Patients',
      value: allPatients.length,
      valueColor: 'text-teal-600',
    },
  ];

  const handleViewClinic = (clinic) => {
    router.push(`/admin/clinics/${clinic.id}`);
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedClinic(null);

  };


  const handleAddClinic = async (e) => {
    e.preventDefault();
    await createClinicMutation.mutateAsync(formData);
  };


  const handleDeleteClinic = async () => {
    if (!clinicToDelete?.id) {
      toast.error('No clinic selected for deletion');
      return;
    }
    await deleteClinicMutation.mutateAsync(clinicToDelete.id);
  };



  if (clinicsQuery.isLoading || patientsQuery.isLoading || staffQuery.isLoading || servicesQuery.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <RoleGuard allowedRoles={['ADMIN']}>
        <div className="mb-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-8 shadow-lg shadow-emerald-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">🏥 Clinic Management</h1>
              <p className="text-white/90">Create, configure, and manage all clinic operations</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all font-semibold backdrop-blur-sm flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Register New Clinic
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {statsTotal.map((item, index) => (
            <StatCard
              key={index}
              icon={item.icon}
              title={item.title}
              value={item.value}
              valueColor={item.valueColor}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clinics.map((clinic) => (
            <CardClinicInfo
              key={clinic.id}
              clinic={clinic}
              allStaff={allStaff}
              patients={allPatients}
              allServices={allServices}
              onView={() => handleViewClinic(clinic)}
              onDelete={() => {
                setClinicToDelete(clinic);
                setShowDeleteConfirm(true);
              }}
            />
          ))}
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">🏥 Register New Clinic</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleAddClinic} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Clinic Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 outline-none"
                      placeholder="Enter clinic name"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 outline-none"
                      placeholder="Brief description of the clinic"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Address *</label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 outline-none"
                      placeholder="Street address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">City *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">State/Province *</label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Zip Code</label>
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Country *</label>
                    <input
                      type="text"
                      required
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 outline-none"
                      placeholder="+216 XX XXX XXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 outline-none"
                      placeholder="clinic@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Website</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 outline-none"
                      placeholder="www.clinic.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Opening Hours</label>
                    <input
                      type="text"
                      value={formData.openingHours}
                      onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 outline-none"
                      placeholder="9:00 AM - 6:00 PM"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Logo (Emoji)</label>
                    <input
                      type="text"
                      value={formData.logo}
                      onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 outline-none"
                      placeholder="🏥"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createClinicMutation.isPending}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold disabled:opacity-50"
                  >
                    {createClinicMutation.isPending ? 'Creating...' : 'Register Clinic'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Delete Clinic?</h2>
              <p className="text-slate-600 mb-6">
                Are you sure you want to delete <strong>{clinicToDelete?.name}</strong>? This action cannot be undone and
                will remove all associated data.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setClinicToDelete(null);
                  }}
                  className="flex-1 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteClinic}
                  disabled={deleteClinicMutation.isPending}
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold disabled:opacity-50"
                >
                  {deleteClinicMutation.isPending ? 'Deleting...' : 'Delete Clinic'}
                </button>
              </div>
            </div>
          </div>
        )}
      </RoleGuard>
    );
  }
}
