'use client';

import CheckboxListModal from './CheckboxListModal';

/**
 * Edit Service List Modal Component
 * Used to edit/modify services linked to a clinic
 */
export default function EditServiceListModal({
  isOpen,
  onClose,
  // allServices = [],
  linkedServices = [],
  // clinicId,
  selectedIds = [],
  onToggleItem,
  onSubmit,
  isLoading = false,
}) {
  const renderServiceItem = (service) => (
    <div className="flex-1">
      <p className="font-semibold text-slate-900">{service.name}</p>
      <p className="text-sm text-slate-600">{service.category}</p>
    </div>
  );

  // Filter services that are either unassigned or belong to this clinic
  const filteredServices = linkedServices;

  return (
    <CheckboxListModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Service List"
      icon="✏️"
      borderColor="border-purple-500"
      items={filteredServices}
      selectedIds={selectedIds}
      onToggleItem={onToggleItem}
      onSubmit={onSubmit}
      submitLabel="Save Changes"
      cancelLabel="Cancel"
      selectedBgColor="bg-purple-50"
      selectedBorderColor="border-purple-500"
      submitButtonColor="bg-purple-600 hover:bg-purple-700"
      renderItem={renderServiceItem}
      isLarge={false}
      isLoading={isLoading}
    />
  );
}
