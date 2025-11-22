'use client';

import FormModal from './FormModal';

/**
 * Edit Overview Modal Component
 * Used to edit clinic overview information (email, phone, website, address)
 */
export default function EditOverviewModal({
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
      title="Edit Overview Information"
      icon="✏️"
      borderColor="border-blue-500"
      submitColor="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
      submitLabel="Save Changes"
      onSubmit={onSubmit}
      isLoading={isLoading}
    >
      <div className="grid grid-cols-2 gap-5">
        <div className="col-span-2">
          <label className="block text-sm font-bold text-slate-700 mb-3">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              onFormChange({ ...formData, email: e.target.value })
            }
            className="w-full px-5 py-4 border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-3">
            Phone
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              onFormChange({ ...formData, phone: e.target.value })
            }
            className="w-full px-5 py-4 border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-3">
            Website
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) =>
              onFormChange({ ...formData, website: e.target.value })
            }
            className="w-full px-5 py-4 border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
          />
        </div>
      </div>
    </FormModal>
  );
}
