'use client';

import CheckboxListModal from './CheckboxListModal';

/**
 * Link Staff Modal Component
 * Used to link available staff members to a clinic
 */
export default function LinkStaffModal({
  isOpen,
  onClose,
  availableStaff = [],
  selectedIds = [],
  onToggleItem,
  onSubmit,
  isLoading = false,
}) {
  const renderStaffItem = (staff) => (
    <div className="flex-1">
      <p className="font-bold text-lg text-slate-900">{staff.name}</p>
      <p className="text-sm text-slate-600 font-medium">{staff.role}</p>
    </div>
  );

  return (
    <CheckboxListModal
      isOpen={isOpen}
      onClose={onClose}
      title="Link Available Staff"
      subtitle=""
      icon="👥"
      borderColor="border-emerald-500"
      items={availableStaff.filter(
        (s) => s.clinicId === null || s.clinicId === undefined
      )}
      selectedIds={selectedIds}
      onToggleItem={onToggleItem}
      onSubmit={onSubmit}
      submitLabel="Link Staff"
      cancelLabel="Cancel"
      selectedBgColor="bg-emerald-50"
      selectedBorderColor="border-emerald-500"
      submitButtonColor="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
      renderItem={renderStaffItem}
      isLarge={true}
      isLoading={isLoading}
    />
  );
}
