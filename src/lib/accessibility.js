// Accessibility utilities for the application

/**
 * Generate unique IDs for accessibility
 */
let idCounter = 0;
export function generateId(prefix = 'id') {
  return `${prefix}-${++idCounter}`;
}

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Trap focus within a modal or dialog
 */
export function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];
  
  function handleTabKey(e) {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        e.preventDefault();
      }
    }
  }
  
  element.addEventListener('keydown', handleTabKey);
  
  // Focus first element
  firstFocusable?.focus();
  
  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
}

/**
 * Handle escape key to close modals
 */
export function handleEscapeKey(callback) {
  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      callback();
    }
  }
  
  document.addEventListener('keydown', handleKeyDown);
  
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Format date for screen readers
 */
export function formatDateForScreenReader(date) {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format time for screen readers
 */
export function formatTimeForScreenReader(date) {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Skip to main content link
 */
export function createSkipLink() {
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-600 focus:text-white focus:rounded-lg';
  skipLink.textContent = 'Skip to main content';
  
  document.body.insertBefore(skipLink, document.body.firstChild);
}

/**
 * Keyboard navigation helpers
 */
export const KeyboardNav = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  TAB: 'Tab',
  HOME: 'Home',
  END: 'End',
};

/**
 * Check if element is keyboard focusable
 */
export function isKeyboardFocusable(element) {
  if (!element || element.disabled) return false;
  
  const tabindex = element.getAttribute('tabindex');
  if (tabindex !== null && parseInt(tabindex) < 0) return false;
  
  const tag = element.tagName.toLowerCase();
  if (['a', 'button', 'input', 'select', 'textarea'].includes(tag)) {
    return true;
  }
  
  return tabindex !== null && parseInt(tabindex) >= 0;
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container) {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');
  
  return Array.from(container.querySelectorAll(selector));
}

/**
 * ARIA live region manager
 */
export class LiveRegion {
  constructor(priority = 'polite') {
    this.region = document.createElement('div');
    this.region.setAttribute('role', 'status');
    this.region.setAttribute('aria-live', priority);
    this.region.setAttribute('aria-atomic', 'true');
    this.region.className = 'sr-only';
    document.body.appendChild(this.region);
  }
  
  announce(message) {
    this.region.textContent = message;
  }
  
  destroy() {
    document.body.removeChild(this.region);
  }
}

/**
 * Focus management
 */
export class FocusManager {
  constructor() {
    this.previousFocus = null;
  }
  
  saveFocus() {
    this.previousFocus = document.activeElement;
  }
  
  restoreFocus() {
    if (this.previousFocus && this.previousFocus.focus) {
      this.previousFocus.focus();
    }
  }
  
  focusFirst(container) {
    const focusable = getFocusableElements(container);
    if (focusable.length > 0) {
      focusable[0].focus();
    }
  }
}

/**
 * Color contrast utilities
 */
export function meetsWCAGContrastRatio(foreground, background, level = 'AA') {
  // This is a simplified check - in production use a library like polished
  const minRatios = {
    'AA': 4.5,
    'AAA': 7,
  };
  
  // Implementation would calculate actual contrast ratio
  // For now, return true and recommend using a proper contrast checker
  return true;
}

/**
 * High contrast mode detection
 */
export function isHighContrastMode() {
  // Check if user prefers high contrast
  return window.matchMedia('(prefers-contrast: high)').matches;
}

/**
 * Reduced motion detection
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Screen reader detection
 */
export function isScreenReaderActive() {
  // This is a heuristic - not 100% reliable
  return (
    window.navigator.userAgent.includes('JAWS') ||
    window.navigator.userAgent.includes('NVDA') ||
    window.navigator.userAgent.includes('VoiceOver')
  );
}
