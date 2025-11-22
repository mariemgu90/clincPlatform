'use client';

import CheckboxListModal from './CheckboxListModal';

/**
 * Edit Staff List Modal Component
 * Used to edit/modify staff members linked to a clinic
 */
export default function EditStaffListModal({
  isOpen,
  onClose,
  allStaff = [],
  selectedIds = [],
  onToggleItem,
  onSubmit,
  isLoading = false,
}) {
  const renderStaffItem = (staff) => (
    <div className="flex items-center gap-4 w-full">
      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
        {staff.name
          .split(' ')
          .map((n) => n[0])
          .join('')}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-slate-900">{staff.name}</p>
        <p className="text-sm text-slate-600">{staff.role}</p>
      </div>
    </div>
  );

  return (
    <CheckboxListModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Staff List"
      icon="✏️"
      borderColor="border-blue-500"
      items={allStaff}
      selectedIds={selectedIds}
      onToggleItem={onToggleItem}
      onSubmit={onSubmit}
      submitLabel="Save Changes"
      cancelLabel="Cancel"
      selectedBgColor="bg-blue-50"
      selectedBorderColor="border-blue-500"
      submitButtonColor="bg-blue-600 hover:bg-blue-700"
      renderItem={renderStaffItem}
      isLarge={false}
      isLoading={isLoading}
    />
  );
}
