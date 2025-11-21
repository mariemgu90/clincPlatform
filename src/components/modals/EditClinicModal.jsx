'use client';

import FormModal from './FormModal';

/**
 * Edit Clinic Modal Component
 * Used to edit clinic basic information (name and description)
 */
export default function EditClinicModal({
  isOpen,
  onClose,
  formData,
  onFormChange,
  onSubmit,
  isLoading = false,
}) {
  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Clinic Profile"
      subtitle="Update clinic information and details"
      icon="✏️"
      borderColor="border-emerald-500"
      submitColor="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
      submitLabel="Save Changes"
      onSubmit={onSubmit}
      isLoading={isLoading}
    >
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
          Clinic Name
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
          className="w-full px-5 py-4 rounded-xl border-2 border-slate-300 focus:border-emerald-500 outline-none text-lg font-medium text-slate-900 transition-all"
          placeholder="Enter clinic name"
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            onFormChange({ ...formData, description: e.target.value })
          }
          rows={3}
          className="w-full px-5 py-4 rounded-xl border-2 border-slate-300 focus:border-emerald-500 outline-none text-lg font-medium text-slate-900 transition-all resize-none"
          placeholder="Describe your clinic"
        />
      </div>
    </FormModal>
  );
}
