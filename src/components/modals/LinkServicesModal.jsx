'use client';

import CheckboxListModal from './CheckboxListModal';

/**
 * Link Services Modal Component
 * Used to link available services to a clinic
 */
export default function LinkServicesModal({
  isOpen,
  onClose,
  availableServices = [],
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

  return (
    <CheckboxListModal
      isOpen={isOpen}
      onClose={onClose}
      title="Link Available Services"
      icon="🏢"
      borderColor="border-emerald-500"
      items={availableServices}
      selectedIds={selectedIds}
      onToggleItem={onToggleItem}
      onSubmit={onSubmit}
      submitLabel="Link Services"
      cancelLabel="Cancel"
      selectedBgColor="bg-emerald-50"
      selectedBorderColor="border-emerald-500"
      submitButtonColor="bg-emerald-500 hover:bg-emerald-600"
      renderItem={renderServiceItem}
      isLarge={false}
      isLoading={isLoading}
    />
  );
}
