'use client';

/**
 * Generic Time Input Modal Component
 * Reusable modal for editing operating hours with day-based time management
 * 
 * @component
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls visibility of modal
 * @param {function} props.onClose - Callback when modal closes
 * @param {string} props.title - Modal title
 * @param {string} props.icon - Emoji icon for the header
 * @param {Object} props.timeData - Object with day keys and {open, close, enabled} values
 * @param {function} props.onTimeChange - Callback when time is changed (receives day, field, value)
 * @param {function} props.onToggleDay - Callback when day is toggled (receives day, enabled)
 * @param {function} props.onSubmit - Form submission handler
 * @param {string} props.submitLabel - Submit button label
 * @param {string} props.cancelLabel - Cancel button label
 * @param {string} props.submitColor - Tailwind button color classes
 * @param {boolean} props.isLoading - Show loading state
 */
export default function TimeInputModal({
  isOpen,
  onClose,
  title = 'Edit Operating Hours',
  icon = '🕐',
  timeData = {},
  onTimeChange,
  onToggleDay,
  onSubmit,
  submitLabel = 'Save Changes',
  cancelLabel = 'Cancel',
  submitColor = 'bg-blue-600 hover:bg-blue-700',
  isLoading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            {icon && <span>{icon}</span>}
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-all"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Time Inputs */}
          <div className="space-y-3">
            {Object.entries(timeData).map(([day, hours]) => (
              <div key={day} className="p-4 bg-slate-50 rounded-xl border-2 border-slate-200">
                <label className="flex items-center gap-4 mb-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hours.enabled}
                    onChange={(e) =>
                      onToggleDay(day, e.target.checked)
                    }
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="font-semibold capitalize text-slate-900 text-lg">
                    {day}
                  </span>
                </label>
                {hours.enabled && (
                  <div className="flex items-center gap-3 pl-9">
                    <input
                      type="time"
                      value={hours.open}
                      onChange={(e) =>
                        onTimeChange(day, 'open', e.target.value)
                      }
                      className="px-4 py-2 rounded-lg border-2 border-slate-200 focus:border-blue-500 outline-none transition-all"
                      required
                    />
                    <span className="text-slate-600">to</span>
                    <input
                      type="time"
                      value={hours.close}
                      onChange={(e) =>
                        onTimeChange(day, 'close', e.target.value)
                      }
                      className="px-4 py-2 rounded-lg border-2 border-slate-200 focus:border-blue-500 outline-none transition-all"
                      required
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold transition-all"
            >
              {cancelLabel}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 px-6 py-3 ${submitColor} text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? 'Loading...' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
