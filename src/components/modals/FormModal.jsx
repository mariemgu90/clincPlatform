'use client';

/**
 * Generic Form Modal Component
 * Reusable modal for displaying forms with flexible content
 * 
 * @component
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls visibility of modal
 * @param {function} props.onClose - Callback when modal closes
 * @param {string} props.title - Modal title
 * @param {string} props.subtitle - Optional subtitle/description
 * @param {string} props.icon - Emoji icon for the header
 * @param {string} props.borderColor - Tailwind border color (default: border-emerald-500)
 * @param {React.ReactNode} props.children - Form content
 * @param {function} props.onSubmit - Form submission handler
 * @param {string} props.submitLabel - Submit button label (default: Save Changes)
 * @param {string} props.cancelLabel - Cancel button label (default: Cancel)
 * @param {string} props.submitColor - Tailwind button color classes
 * @param {boolean} props.isLoading - Show loading state on submit button
 */
export default function FormModal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon = '✏️',
  borderColor = 'border-emerald-500',
  children,
  onSubmit,
  submitLabel = 'Save Changes',
  cancelLabel = 'Cancel',
  submitColor = 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700',
  isLoading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className={`bg-white rounded-3xl p-10 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-4 ${borderColor}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              {icon && <span className="text-4xl">{icon}</span>}
              {title}
            </h2>
            {subtitle && <p className="text-slate-600 mt-2">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-slate-100 rounded-xl transition-all group"
            aria-label="Close modal"
          >
            <svg
              className="w-7 h-7 text-slate-600 group-hover:text-slate-900"
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
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Content */}
          {children}

          {/* Actions */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-8 py-4 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-lg transition-all"
            >
              {cancelLabel}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 px-8 py-4 ${submitColor} text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? 'Loading...' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
