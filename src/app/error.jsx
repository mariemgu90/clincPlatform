'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 via-pink-500 to-purple-600">
      <div className="text-center">
        <div className="glass-card p-12 rounded-2xl max-w-md mx-auto">
          <div className="text-8xl mb-6">⚠️</div>
          <h1 className="text-4xl font-bold text-white mb-4">Something went wrong!</h1>
          <p className="text-white/80 mb-8">
            We're sorry, but something unexpected happened. Please try again.
          </p>
          <div className="space-y-3">
            <button
              onClick={reset}
              className="w-full px-6 py-3 bg-white text-red-600 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Try Again
            </button>
            <a
              href="/"
              className="block w-full px-6 py-3 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition-all border border-white/30"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
