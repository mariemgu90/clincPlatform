'use client';

import { useState, useEffect } from 'react';
import RoleGuard from '@/components/RoleGuard';
import { fetchRoles, createRole, updateRole, deleteRole } from '@/lib/api';

export default function RolesManagement() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [],
    color: '#3B82F6', // Default blue color
  });

  const availableColors = [
    { name: 'Blue', value: '#3B82F6', gradient: 'from-blue-500 to-blue-600' },
    { name: 'Emerald', value: '#10B981', gradient: 'from-emerald-500 to-emerald-600' },
    { name: 'Purple', value: '#8B5CF6', gradient: 'from-purple-500 to-purple-600' },
    { name: 'Pink', value: '#EC4899', gradient: 'from-pink-500 to-pink-600' },
    { name: 'Indigo', value: '#6366F1', gradient: 'from-indigo-500 to-indigo-600' },
    { name: 'Red', value: '#EF4444', gradient: 'from-red-500 to-red-600' },
    { name: 'Orange', value: '#F97316', gradient: 'from-orange-500 to-orange-600' },
    { name: 'Teal', value: '#14B8A6', gradient: 'from-teal-500 to-teal-600' },
  ];

  const availablePermissions = [
    { id: 'view_patients', label: 'View Patients', category: 'Patients' },
    { id: 'edit_patients', label: 'Edit Patients', category: 'Patients' },
    { id: 'delete_patients', label: 'Delete Patients', category: 'Patients' },
    { id: 'view_appointments', label: 'View Appointments', category: 'Appointments' },
    { id: 'create_appointments', label: 'Create Appointments', category: 'Appointments' },
    { id: 'edit_appointments', label: 'Edit Appointments', category: 'Appointments' },
    { id: 'delete_appointments', label: 'Delete Appointments', category: 'Appointments' },
    { id: 'view_consultations', label: 'View Consultations', category: 'Consultations' },
    { id: 'create_consultations', label: 'Create Consultations', category: 'Consultations' },
    { id: 'edit_consultations', label: 'Edit Consultations', category: 'Consultations' },
    { id: 'view_prescriptions', label: 'View Prescriptions', category: 'Prescriptions' },
    { id: 'create_prescriptions', label: 'Create Prescriptions', category: 'Prescriptions' },
    { id: 'edit_prescriptions', label: 'Edit Prescriptions', category: 'Prescriptions' },
    { id: 'view_staff', label: 'View Staff', category: 'Staff' },
    { id: 'manage_staff', label: 'Manage Staff', category: 'Staff' },
    { id: 'view_reports', label: 'View Reports', category: 'Reports' },
    { id: 'manage_settings', label: 'Manage Settings', category: 'Settings' },
    { id: 'manage_roles', label: 'Manage Roles', category: 'Settings' },
  ];

  const permissionsByCategory = availablePermissions.reduce((acc, perm) => {
    if (!acc[perm.category]) acc[perm.category] = [];
    acc[perm.category].push(perm);
    return acc;
  }, {});

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const data = await fetchRoles();
      setRoles(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
      setLoading(false);
    }
  };

  const handleAddRole = async (e) => {
    e.preventDefault();
    try {
      const newRole = await createRole(formData);
      setRoles([...roles, newRole]);
      setShowAddModal(false);
      setFormData({ name: '', description: '', permissions: [], color: '#3B82F6' });
    } catch (error) {
      console.error('Failed to add role:', error);
      alert(error.message || 'Failed to add role');
    }
  };

  const handleEditRole = (role) => {
    
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
      color: role.color || '#3B82F6',
    });
    setShowEditModal(true);
  };

  const handleUpdateRole = async (e) => {
    e.preventDefault();
    try {
      const updatedRole = await updateRole(editingRole.id, formData);
      setRoles(roles.map(role =>
        role.id === editingRole.id ? updatedRole : role
      ));
      setShowEditModal(false);
      setEditingRole(null);
      setFormData({ name: '', description: '', permissions: [], color: '#3B82F6' });
    } catch (error) {
      console.error('Failed to update role:', error);
      alert(error.message || 'Failed to update role');
    }
  };

  const handleDeleteRole = async (id) => {
    if (!confirm('Are you sure you want to delete this role? This action cannot be undone.')) return;
    try {
      await deleteRole(id);
      setRoles(roles.filter(role => role.id !== id));
    } catch (error) {
      console.error('Failed to delete role:', error);
      alert(error.message || 'Failed to delete role');
    }
  };

  const togglePermission = (permissionId) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
        </div>
      ) : (
        <>
          <div className="mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-8 mb-8 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Roles Management
                  </h1>
                  <p className="text-white/90">
                    Configure staff roles and permissions
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-6 py-3 bg-white text-emerald-600 rounded-xl hover:shadow-lg transition-all font-semibold flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Role
                </button>
              </div>
            </div>

            {/* Roles Grid */}
            {roles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map((role, index) => (
                  <RoleCard
                    key={role.id}
                    role={role}
                    onEdit={handleEditRole}
                    onDelete={handleDeleteRole}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">No roles configured yet</h3>
                <p className="text-slate-600 mb-6">
                  Add your first role to get started
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all font-semibold inline-flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Your First Role
                </button>
              </div>
            )}
          </div>

          {/* Add Role Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">✨ Add New Role</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({ name: '', description: '', permissions: [], color: '#3B82F6' });
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddRole} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Role Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 outline-none text-base font-bold text-slate-900 transition-all"
                  placeholder="e.g., Nurse, Lab Technician"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 outline-none text-base font-bold text-slate-900 transition-all resize-none"
                  placeholder="Describe the role responsibilities..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">Role Color *</label>
                <div className="grid grid-cols-4 gap-3">
                  {availableColors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: color.value })}
                      className={`relative p-4 rounded-xl transition-all ${
                        formData.color === color.value
                          ? 'ring-4 ring-offset-2 ring-emerald-500 scale-105'
                          : 'hover:scale-105'
                      }`}
                    >
                      <div className={`w-full h-12 rounded-lg bg-gradient-to-r ${color.gradient} shadow-lg`}></div>
                      <p className="text-xs font-semibold text-slate-700 mt-2 text-center">{color.name}</p>
                      {formData.color === color.value && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-4">Permissions</label>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {Object.entries(permissionsByCategory).map(([category, perms]) => (
                    <div key={category} className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200">
                      <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        {category}
                      </h4>
                      <div className="space-y-2">
                        {perms.map(perm => (
                          <label
                            key={perm.id}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-white transition-all cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={formData.permissions.includes(perm.id)}
                              onChange={() => togglePermission(perm.id)}
                              className="w-5 h-5 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                            />
                            <span className="text-slate-700 font-medium">{perm.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({ name: '', description: '', permissions: [] });
                  }}
                  className="flex-1 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-semibold transition-all shadow-lg"
                >
                  Create Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">✏️ Edit Role</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingRole(null);
                  setFormData({ name: '', description: '', permissions: [], color: '#3B82F6' });
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleUpdateRole} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Role Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 outline-none text-base font-bold text-slate-900 transition-all"
                  placeholder="e.g., Nurse, Lab Technician"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 outline-none text-base font-bold text-slate-900 transition-all resize-none"
                  placeholder="Describe the role responsibilities..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">Role Color *</label>
                <div className="grid grid-cols-4 gap-3">
                  {availableColors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: color.value })}
                      className={`relative p-4 rounded-xl transition-all ${
                        formData.color === color.value
                          ? 'ring-4 ring-offset-2 ring-emerald-500 scale-105'
                          : 'hover:scale-105'
                      }`}
                    >
                      <div className={`w-full h-12 rounded-lg bg-gradient-to-r ${color.gradient} shadow-lg`}></div>
                      <p className="text-xs font-semibold text-slate-700 mt-2 text-center">{color.name}</p>
                      {formData.color === color.value && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-4">Permissions</label>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {Object.entries(permissionsByCategory).map(([category, perms]) => (
                    <div key={category} className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200">
                      <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        {category}
                      </h4>
                      <div className="space-y-2">
                        {perms.map(perm => (
                          <label
                            key={perm.id}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-white transition-all cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={formData.permissions.includes(perm.id)}
                              onChange={() => togglePermission(perm.id)}
                              className="w-5 h-5 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                            />
                            <span className="text-slate-700 font-medium">{perm.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingRole(null);
                    setFormData({ name: '', description: '', permissions: [] });
                  }}
                  className="flex-1 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-semibold transition-all shadow-lg"
                >
                  Update Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
        </>
      )}
    </RoleGuard>
  );
}

function RoleCard({ role, onEdit, onDelete, index }) {
  const getGradientFromColor = (color) => {
    const colorMap = {
      '#3B82F6': 'from-blue-500 to-blue-600',
      '#10B981': 'from-emerald-500 to-emerald-600',
      '#8B5CF6': 'from-purple-500 to-purple-600',
      '#EC4899': 'from-pink-500 to-pink-600',
      '#6366F1': 'from-indigo-500 to-indigo-600',
      '#EF4444': 'from-red-500 to-red-600',
      '#F97316': 'from-orange-500 to-orange-600',
      '#14B8A6': 'from-teal-500 to-teal-600',
    };
    return colorMap[color] || 'from-blue-500 to-blue-600';
  };

  const gradient = getGradientFromColor(role.color);

  return (
    <div
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-slate-200 overflow-hidden animate-slideUp"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className={`bg-gradient-to-r ${gradient} p-6 shadow-lg`}>
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className={'text-2xl font-bold text-white mb-1'}>{role.name}</h3>
            <p className="text-white/90 text-sm">{role.staffCount} staff members</p>
          </div>
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="p-6">
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">{role.description}</p>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700">Permissions</span>
            <span className="text-xs font-bold text-emerald-600">{role.permissions.length} granted</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className={`bg-gradient-to-r ${gradient} h-2 rounded-full transition-all`}
              style={{ width: `${(role.permissions.length / 18) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(role)}
            className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            onClick={() => onDelete(role.id)}
            className="flex-1 px-4 py-2.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
