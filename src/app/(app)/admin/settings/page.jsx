'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SystemSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  
  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    platformName: 'MedFlow Platform',
    platformUrl: 'https://platform.medflow.com',
    supportEmail: 'support@medflow.com',
    adminEmail: 'admin@medflow.com',
    timezone: 'UTC-5',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    language: 'en',
  });

  // Email Settings
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: '',
    smtpPort: '587',
    smtpUsername: '',
    smtpPassword: '',
    fromEmail: 'noreply@medflow.com',
    fromName: 'MedFlow Healthcare',
  });

  // Appointment Settings
  const [appointmentSettings, setAppointmentSettings] = useState({
    slotDuration: '30',
    workingDaysStart: '1',
    workingDaysEnd: '5',
    workingHoursStart: '09:00',
    workingHoursEnd: '17:00',
    allowBookingDaysAdvance: '30',
    sendRemindersBefore: '24',
    autoConfirmAppointments: false,
  });

  // Billing Settings
  const [billingSettings, setBillingSettings] = useState({
    taxRate: '0',
    paymentMethods: {
      cash: true,
      card: true,
      insurance: true,
    },
    invoicePrefix: 'INV-',
    invoiceStartNumber: '1000',
    paymentTerms: '30',
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: '30',
    passwordMinLength: '8',
    requireStrongPassword: true,
    twoFactorAuth: false,
    loginAttempts: '5',
    lockoutDuration: '30',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (session?.user?.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  const handleSaveSettings = async (settingsType) => {
    setLoading(true);
    try {
      // TODO: Implement API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (session?.user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/dashboard"
            className="flex items-center text-slate-600 hover:text-slate-900 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Platform Settings</h1>
              <p className="text-slate-600 mt-1">Configure platform-wide system settings</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-6 p-2">
          <div className="flex flex-wrap gap-2">
            <TabButton
              label="General"
              icon="⚙️"
              active={activeTab === 'general'}
              onClick={() => setActiveTab('general')}
            />
            <TabButton
              label="Email"
              icon="📧"
              active={activeTab === 'email'}
              onClick={() => setActiveTab('email')}
            />
            <TabButton
              label="Features"
              icon="🎯"
              active={activeTab === 'features'}
              onClick={() => setActiveTab('features')}
            />
            <TabButton
              label="Integrations"
              icon="�"
              active={activeTab === 'integrations'}
              onClick={() => setActiveTab('integrations')}
            />
            <TabButton
              label="Security"
              icon="🔒"
              active={activeTab === 'security'}
              onClick={() => setActiveTab('security')}
            />
          </div>
        </div>

        {/* Settings Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {activeTab === 'general' && (
            <GeneralSettings
              settings={generalSettings}
              setSettings={setGeneralSettings}
              onSave={() => handleSaveSettings('general')}
              loading={loading}
            />
          )}
          {activeTab === 'email' && (
            <EmailSettings
              settings={emailSettings}
              setSettings={setEmailSettings}
              onSave={() => handleSaveSettings('email')}
              loading={loading}
            />
          )}
          {activeTab === 'features' && (
            <FeatureSettings
              settings={appointmentSettings}
              setSettings={setAppointmentSettings}
              onSave={() => handleSaveSettings('features')}
              loading={loading}
            />
          )}
          {activeTab === 'integrations' && (
            <IntegrationSettings
              settings={billingSettings}
              setSettings={setBillingSettings}
              onSave={() => handleSaveSettings('integrations')}
              loading={loading}
            />
          )}
          {activeTab === 'security' && (
            <SecuritySettings
              settings={securitySettings}
              setSettings={setSecuritySettings}
              onSave={() => handleSaveSettings('security')}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
        active
          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function GeneralSettings({ settings, setSettings, onSave, loading }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">General Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Platform Name"
          value={settings.platformName}
          onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
          placeholder="MedFlow Platform"
        />
        <InputField
          label="Platform URL"
          value={settings.platformUrl}
          onChange={(e) => setSettings({ ...settings, platformUrl: e.target.value })}
          placeholder="https://platform.medflow.com"
        />
        <InputField
          label="Support Email"
          type="email"
          value={settings.supportEmail}
          onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
          placeholder="support@medflow.com"
        />
        <InputField
          label="Admin Email"
          type="email"
          value={settings.adminEmail}
          onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
          placeholder="admin@medflow.com"
        />
        <SelectField
          label="Timezone"
          value={settings.timezone}
          onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
          options={[
            { value: 'UTC-5', label: 'Eastern Time (UTC-5)' },
            { value: 'UTC-6', label: 'Central Time (UTC-6)' },
            { value: 'UTC-7', label: 'Mountain Time (UTC-7)' },
            { value: 'UTC-8', label: 'Pacific Time (UTC-8)' },
          ]}
        />
        <SelectField
          label="Currency"
          value={settings.currency}
          onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
          options={[
            { value: 'USD', label: 'US Dollar (USD)' },
            { value: 'EUR', label: 'Euro (EUR)' },
            { value: 'GBP', label: 'British Pound (GBP)' },
            { value: 'TND', label: 'Tunisian Dinar (TND)' },
          ]}
        />
        <SelectField
          label="Date Format"
          value={settings.dateFormat}
          onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
          options={[
            { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
            { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
            { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
          ]}
        />
        <SelectField
          label="Language"
          value={settings.language}
          onChange={(e) => setSettings({ ...settings, language: e.target.value })}
          options={[
            { value: 'en', label: 'English' },
            { value: 'fr', label: 'French' },
            { value: 'es', label: 'Spanish' },
          ]}
        />
      </div>
      <SaveButton onClick={onSave} loading={loading} />
    </div>
  );
}

function EmailSettings({ settings, setSettings, onSave, loading }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Email Configuration</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="SMTP Host"
          value={settings.smtpHost}
          onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
          placeholder="smtp.gmail.com"
        />
        <InputField
          label="SMTP Port"
          value={settings.smtpPort}
          onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })}
          placeholder="587"
        />
        <InputField
          label="SMTP Username"
          value={settings.smtpUsername}
          onChange={(e) => setSettings({ ...settings, smtpUsername: e.target.value })}
          placeholder="your-email@gmail.com"
        />
        <InputField
          label="SMTP Password"
          type="password"
          value={settings.smtpPassword}
          onChange={(e) => setSettings({ ...settings, smtpPassword: e.target.value })}
          placeholder="••••••••"
        />
        <InputField
          label="From Email"
          type="email"
          value={settings.fromEmail}
          onChange={(e) => setSettings({ ...settings, fromEmail: e.target.value })}
        />
        <InputField
          label="From Name"
          value={settings.fromName}
          onChange={(e) => setSettings({ ...settings, fromName: e.target.value })}
        />
      </div>
      <SaveButton onClick={onSave} loading={loading} />
    </div>
  );
}

function FeatureSettings({ settings, setSettings, onSave, loading }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Platform Features</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Enabled Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CheckboxField
              label="Multi-Clinic Support"
              checked={settings.autoConfirmAppointments}
              onChange={(e) => setSettings({ ...settings, autoConfirmAppointments: e.target.checked })}
            />
            <CheckboxField
              label="Patient Portal"
              checked={true}
              onChange={() => {}}
            />
            <CheckboxField
              label="Appointment Management"
              checked={true}
              onChange={() => {}}
            />
            <CheckboxField
              label="Billing & Invoicing"
              checked={true}
              onChange={() => {}}
            />
            <CheckboxField
              label="Electronic Health Records"
              checked={true}
              onChange={() => {}}
            />
            <CheckboxField
              label="Telemedicine"
              checked={false}
              onChange={() => {}}
            />
            <CheckboxField
              label="Analytics & Reporting"
              checked={true}
              onChange={() => {}}
            />
            <CheckboxField
              label="SMS Notifications"
              checked={false}
              onChange={() => {}}
            />
          </div>
        </div>
        
        <div className="pt-6 border-t border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">System Defaults</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField
              label="Default Appointment Duration"
              value={settings.slotDuration}
              onChange={(e) => setSettings({ ...settings, slotDuration: e.target.value })}
              options={[
                { value: '15', label: '15 minutes' },
                { value: '30', label: '30 minutes' },
                { value: '45', label: '45 minutes' },
                { value: '60', label: '60 minutes' },
              ]}
            />
            <InputField
              label="Max Booking Days in Advance"
              type="number"
              value={settings.allowBookingDaysAdvance}
              onChange={(e) => setSettings({ ...settings, allowBookingDaysAdvance: e.target.value })}
            />
          </div>
        </div>
      </div>
      <SaveButton onClick={onSave} loading={loading} />
    </div>
  );
}

function IntegrationSettings({ settings, setSettings, onSave, loading }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Third-Party Integrations</h2>
      
      <div className="space-y-6">
        {/* Payment Gateways */}
        <div className="border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Payment Gateways</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">S</div>
                <div>
                  <p className="font-semibold text-slate-900">Stripe</p>
                  <p className="text-sm text-slate-600">Payment processing</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold">P</div>
                <div>
                  <p className="font-semibold text-slate-900">PayPal</p>
                  <p className="text-sm text-slate-600">Payment processing</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Communication */}
        <div className="border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Communication Services</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold">T</div>
                <div>
                  <p className="font-semibold text-slate-900">Twilio</p>
                  <p className="text-sm text-slate-600">SMS & Voice</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">S</div>
                <div>
                  <p className="font-semibold text-slate-900">SendGrid</p>
                  <p className="text-sm text-slate-600">Email delivery</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Storage */}
        <div className="border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Cloud Storage</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">A</div>
                <div>
                  <p className="font-semibold text-slate-900">AWS S3</p>
                  <p className="text-sm text-slate-600">File storage</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <SaveButton onClick={onSave} loading={loading} />
    </div>
  );
}

function SecuritySettings({ settings, setSettings, onSave, loading }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Security Configuration</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Session Timeout (minutes)"
          type="number"
          value={settings.sessionTimeout}
          onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
        />
        <InputField
          label="Password Minimum Length"
          type="number"
          value={settings.passwordMinLength}
          onChange={(e) => setSettings({ ...settings, passwordMinLength: e.target.value })}
        />
        <InputField
          label="Max Login Attempts"
          type="number"
          value={settings.loginAttempts}
          onChange={(e) => setSettings({ ...settings, loginAttempts: e.target.value })}
        />
        <InputField
          label="Lockout Duration (minutes)"
          type="number"
          value={settings.lockoutDuration}
          onChange={(e) => setSettings({ ...settings, lockoutDuration: e.target.value })}
        />
        <CheckboxField
          label="Require Strong Password"
          checked={settings.requireStrongPassword}
          onChange={(e) => setSettings({ ...settings, requireStrongPassword: e.target.checked })}
        />
        <CheckboxField
          label="Enable Two-Factor Authentication"
          checked={settings.twoFactorAuth}
          onChange={(e) => setSettings({ ...settings, twoFactorAuth: e.target.checked })}
        />
      </div>
      <SaveButton onClick={onSave} loading={loading} />
    </div>
  );
}

function InputField({ label, value, onChange, type = 'text', placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function CheckboxField({ label, checked, onChange }) {
  return (
    <label className="flex items-center space-x-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-5 h-5 text-emerald-500 border-slate-300 rounded focus:ring-emerald-500"
      />
      <span className="text-slate-700">{label}</span>
    </label>
  );
}

function SaveButton({ onClick, loading }) {
  return (
    <div className="mt-8 flex justify-end">
      <button
        onClick={onClick}
        disabled={loading}
        className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  );
}
