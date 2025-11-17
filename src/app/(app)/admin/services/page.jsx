'use client';

import { useState } from 'react';
import RoleGuard from '@/components/RoleGuard';
import ServiceItemCard from '@/components/ServiceItemCard';
import { useServices, useCreateService, useUpdateService, useDeleteService } from '@/hooks';
import toast from 'react-hot-toast';

export default function ServicesManagement() {
  // React Query hooks
  const servicesQuery = useServices();
  
  const createServiceMutation = useCreateService({
    onSuccess: () => {
      toast.success('Service created successfully');
      handleModalClose();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create service');
    },
  });

  const updateServiceMutation = useUpdateService({
    onSuccess: () => {
      handleModalClose();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update service');
    },
  });

  const deleteServiceMutation = useDeleteService({
    onSuccess: () => {
      toast.success('Service deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete service');
    },
  });

  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    active: true,
  });

  const services = servicesQuery.data || [];
  const loading = servicesQuery.isLoading;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingService) {
      await updateServiceMutation.mutateAsync({
        id: editingService.id,
        data: formData,
      });
    } else {
      await createServiceMutation.mutateAsync(formData);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      active: service.active,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    await deleteServiceMutation.mutateAsync(id);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingService(null);
    setFormData({ name: '', description: '', active: true });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      <div className="mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-8 mb-8 shadow-xl shadow-emerald-500/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Services Management
              </h1>
              <p className="text-white/90">
                Configure medical services
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-white text-emerald-600 rounded-xl hover:scale-105 transition-transform font-semibold shadow-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Service
            </button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceItemCard
              key={service.id}
              service={service}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {services.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-slate-200">
            <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="text-slate-600 text-lg mb-4 font-semibold">No services configured yet</p>
            <p className="text-slate-500 mb-6">Add your first service to get started</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:scale-105 transition-transform font-semibold shadow-lg shadow-emerald-500/30"
            >
              Add Your First Service
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {editingService ? 'Edit Service' : 'Add Service'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-2">Service Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all outline-none"
                  placeholder="e.g., General Consultation"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all outline-none"
                  placeholder="Service description..."
                />
              </div>
            
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500"
                />
                <label htmlFor="active" className="text-slate-700 font-medium">Service is active</label>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:scale-105 transition-transform font-semibold shadow-lg shadow-emerald-500/30"
                >
                  {editingService ? 'Update' : 'Add'} Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </RoleGuard>
  );
}
