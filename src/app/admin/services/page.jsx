'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export default function ServicesManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 30,
    price: 0,
    active: true,
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
      fetchServices();
    }
  }, [session]);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      if (response.ok) {
        const data = await response.json();
        setServices(data.services || []);
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingService 
        ? `/api/services/${editingService.id}`
        : '/api/services';
      
      const method = editingService ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowModal(false);
        setEditingService(null);
        setFormData({ name: '', description: '', duration: 30, price: 0, active: true });
        fetchServices();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save service');
      }
    } catch (error) {
      console.error('Failed to save service:', error);
      alert('Failed to save service');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      duration: service.duration,
      price: service.price,
      active: service.active,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchServices();
      } else {
        alert('Failed to delete service');
      }
    } catch (error) {
      console.error('Failed to delete service:', error);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingService(null);
    setFormData({ name: '', description: '', duration: 30, price: 0, active: true });
  };

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
        <main className="flex-1 p-8 bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-8 mb-8 shadow-xl shadow-emerald-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    Services Management
                  </h1>
                  <p className="text-white/90">
                    Configure medical services and pricing
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
                <ServiceCard
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
        </main>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-2">Duration (min) *</label>
                  <input
                    type="number"
                    required
                    min="5"
                    step="5"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-2">Price ($) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all outline-none"
                  />
                </div>
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
    </div>
  );
}

function ServiceCard({ service, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:scale-105 hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="text-4xl">🏥</div>
        <div className="flex items-center space-x-2">
          {service.active ? (
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
              Active
            </span>
          ) : (
            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">
              Inactive
            </span>
          )}
        </div>
      </div>
      
      <h3 className="text-slate-900 font-bold text-xl mb-2">{service.name}</h3>
      {service.description && (
        <p className="text-slate-600 text-sm mb-4">{service.description}</p>
      )}
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
          <p className="text-emerald-600 text-xs mb-1 font-semibold">Duration</p>
          <p className="text-slate-900 font-bold">{service.duration} min</p>
        </div>
        <div className="p-3 rounded-xl bg-teal-50 border border-teal-100">
          <p className="text-teal-600 text-xs mb-1 font-semibold">Price</p>
          <p className="text-slate-900 font-bold">${service.price}</p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(service)}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:scale-105 transition-all font-semibold shadow-lg shadow-emerald-500/20"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(service.id)}
          className="flex-1 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition-all font-semibold"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
