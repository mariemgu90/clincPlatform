'use client';

import TimeInputModal from './TimeInputModal';

/**
 * Edit Operating Hours Modal Component
 * Used to edit clinic operating hours for each day of the week
 */
export default function EditOperatingHoursModal({
  isOpen,
  onClose,
  operatingHours = {},
  onTimeChange,
  onToggleDay,
  onSubmit,
  isLoading = false,
}) {
  return (
    <TimeInputModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Operating Hours"
      icon="🕐"
      timeData={operatingHours}
      onTimeChange={onTimeChange}
      onToggleDay={onToggleDay}
      onSubmit={onSubmit}
      submitLabel="Save Changes"
      cancelLabel="Cancel"
      submitColor="bg-blue-600 hover:bg-blue-700"
      isLoading={isLoading}
    />
  );
}
