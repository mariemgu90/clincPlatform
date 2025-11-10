'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirect authenticated users to their specific dashboard
    if (status === 'authenticated' && session?.user?.role) {
      const role = session.user.role;
      let dashboardPath = '/dashboard';
      
      if (role === 'ADMIN') {
        dashboardPath = '/admin/dashboard';
      } else if (role === 'PATIENT') {
        dashboardPath = '/portal/dashboard';
      } else if (role === 'DOCTOR' || role === 'RECEPTIONIST') {
        dashboardPath = '/dashboard';
      }
      
      router.push(dashboardPath);
    }
  }, [status, session, router]);

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
      </div>
    );
  }

  // Only show landing page for unauthenticated users
  if (status === 'authenticated') {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 glass-dark border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-white">MedFlow</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/login"
                className="px-6 py-2 text-white hover:bg-white/10 rounded-xl transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="px-6 py-2 bg-white text-purple-600 font-semibold rounded-xl hover:shadow-lg transition-all hover-scale"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 glass-dark text-white px-4 py-2 rounded-full text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span>Now in Beta • Join 1000+ Clinics</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Modern Healthcare
              <br />
              <span className="bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
                Management Platform
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Streamline your clinic operations with our all-in-one solution. 
              Manage patients, appointments, consultations, and billing effortlessly.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link
                href="/auth/register"
                className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-2xl hover:shadow-2xl transition-all hover-lift text-lg"
              >
                Start Free Trial
              </Link>
              <Link
                href="/auth/login"
                className="px-8 py-4 glass-dark text-white font-semibold rounded-2xl hover:bg-white/20 transition-all text-lg border border-white/30"
              >
                View Demo
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-16">
              <div className="text-center animate-slide-up">
                <div className="text-4xl font-bold text-white">1000+</div>
                <div className="text-white/70 mt-2">Clinics</div>
              </div>
              <div className="text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="text-4xl font-bold text-white">50K+</div>
                <div className="text-white/70 mt-2">Patients</div>
              </div>
              <div className="text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="text-4xl font-bold text-white">99.9%</div>
                <div className="text-white/70 mt-2">Uptime</div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-24 animate-fade-in">
            {[
              {
                title: 'Patient Management',
                description: 'Complete patient records with medical history and documents',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
              },
              {
                title: 'Smart Scheduling',
                description: 'Intelligent appointment booking with automated reminders',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
              },
              {
                title: 'Billing & Payments',
                description: 'Integrated payment processing with invoice generation',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="glass-dark p-8 rounded-2xl hover-lift border border-white/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
