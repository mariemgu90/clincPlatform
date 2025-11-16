'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import RoleGuard from '@/components/RoleGuard';
import ClinicOverview from '@/components/ClinicOverview';
import ClinicStaffManagement from '@/components/ClinicStaffManagement';
import ClinicPatientManagement from '@/components/ClinicPatientManagement';
import ClinicServices from '@/components/ClinicServices';
import ClinicOperatingHours from '@/components/ClinicOperatingHours';
import ClinicIntegrations from '@/components/ClinicIntegrations';
import ClinicActivityLogs from '@/components/ClinicActivityLogs';
import StatCard from '@/components/StatCard';
import StaffDetails from '@/components/StaffDetails';
import ServiceDetails from '@/components/ServiceDetails';
import {
  fetchServices,
  fetchServicesByClinic,
  fetchPatientsByClinic,
  fetchStaffByClinic,
  updateClinic,
  fetchClinicById,
  fetchIntegrationsByClinic,
  fetchAllStaff,
  fetchStaff,
  unlinkStaffFromClinic,
  linkStaffToClinic,
  linkServiceToClinic,
  unlinkServiceFromClinic,
} from '@/lib/api';

export default function ClinicDetailPage() {
  const params = useParams();
  const clinicId = params.id;
  const router = useRouter();
  const { data: session, status } = useSession();

  const [clinic, setClinic] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showEditStaffListModal, setShowEditStaffListModal] = useState(false);
  const [showEditServiceListModal, setShowEditServiceListModal] = useState(false);
  const [showEditIntegrationModal, setShowEditIntegrationModal] = useState(false);
  const [showEditOverviewModal, setShowEditOverviewModal] = useState(false);
  const [showStaffDetailsModal, setShowStaffDetailsModal] = useState(false);
  const [showPatientDetailsModal, setShowPatientDetailsModal] = useState(false);
  const [showServiceDetailsModal, setShowServiceDetailsModal] = useState(false);
  const [showEditOperatingHoursModal, setShowEditOperatingHoursModal] = useState(false);

  const [selectedStaffForDetails, setSelectedStaffForDetails] = useState(null);
  const [selectedPatientForDetails, setSelectedPatientForDetails] = useState(null);
  const [selectedServiceForDetails, setSelectedServiceForDetails] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
    email: '',
    website: '',
    logo: '🏥',
    description: '',
    openingHours: '',
  });

  const [operatingHours, setOperatingHours] = useState({
    monday: { open: '09:00', close: '17:00', enabled: true },
    tuesday: { open: '09:00', close: '17:00', enabled: true },
    wednesday: { open: '09:00', close: '17:00', enabled: true },
    thursday: { open: '09:00', close: '17:00', enabled: true },
    friday: { open: '09:00', close: '17:00', enabled: true },
    saturday: { open: '10:00', close: '14:00', enabled: true },
    sunday: { open: '10:00', close: '14:00', enabled: false }
  });

  const [staffMembers, setStaffMembers] = useState([]);
  const [allStaff, setAllStaff] = useState([]);
  const [services, setServices] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [patients, setPatients] = useState([]);
  const [integrations, setIntegrations] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);

  const [selectedStaffIds, setSelectedStaffIds] = useState([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [tempOperatingHours, setTempOperatingHours] = useState({});
  const [overviewFormData, setOverviewFormData] = useState({ email: '', phone: '', website: '', address: '', city: '', state: '', zipCode: '', country: '' });

  const [error, setError] = useState(null);

  const getStaffByClinic = async (clinicId) => {
    // if (!clinicId) return setStaffMembers(allStaff || []);
    try {
      const staffArray = await fetchStaff({ clinicId });
     
      setStaffMembers(staffArray || []);
      return;
    } catch (e) {
      // fallback to client-side filtering
    }

    // setStaffMembers((allStaff || []).filter(s => s.clinic === clinicId || s.clinicId === clinicId));
  };

  const getServicesByClinic = async (clinicId) => {
    // if (!clinicId) return setClinicService(allServices || []);
    try {
      const servicesArray = await fetchServicesByClinic(clinicId);
      setClinicService(servicesArray || []);
      return;
    } catch (e) {
      // fallback to client-side filtering
    }
  };

  const getPatientsByClinic = async (clinicId) => {
    // if (!clinicId) return setClinicService(allServices || []);
    try {
      const servicesArray = await fetchServicesByClinic(clinicId);
      setClinicService(servicesArray || []);
      return;
    } catch (e) {
      // fallback to client-side filtering
    }
  };

  // Fetch  data byclinicId from the database
  useEffect(() => {
    if (activeTab === 'staff') (getStaffByClinic());
    if (activeTab === 'services') (getServicesByClinic());
    if (activeTab === 'patients') (getPatientsByClinic());
  }, [activeTab]);

  // Fetch clinic data from the database
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchClinicData = async () => {
      // Don't fetch if not authenticated or no clinic ID
      if (!clinicId || status !== 'authenticated') {
        return;
      }

      try {
        setLoading(true);

        // Fetch clinic details using the API helper
        const clinicData = await fetchClinicById(clinicId);

        setClinic(clinicData);

        // Extract settings from JSON if available
        const settings = clinicData.settings || {};

        setFormData({
          name: clinicData.name,
          address: clinicData.address || '',
          city: settings.city || '',
          state: settings.state || '',
          zipCode: settings.zipCode || '',
          country: settings.country || '',
          phone: clinicData.phone || '',
          email: clinicData.email || '',
          website: settings.website || '',
          logo: clinicData.logo || '🏥',
          description: settings.description || '',
          openingHours: settings.openingHours || '',
        });

        // Parse operating hours if available
        if (settings.openingHours) {
          try {
            const parsedHours = JSON.parse(settings.openingHours);
            setOperatingHours(parsedHours);
          } catch (e) {
            console.error('Failed to parse operating hours');
          }
        }

        // Fetch related data
        await Promise.all([
          // fetchStaffByClinic(clinicId).then(data => setStaffMembers(data || [])),
          fetchServicesByClinic(clinicId).then(data => setServices(data || [])),
          fetchPatientsByClinic(clinicId).then(data => setPatients(data || [])),
          fetchIntegrationsByClinic(clinicId).then(data => setIntegrations(data || [])),
        ]);

        // Fetch all staff and services for linking
        const allStaffData = await fetchAllStaff();
        setAllStaff(allStaffData);

        const allServicesData = await fetchServices();
        setAllServices(Array.isArray(allServicesData) ? allServicesData : allServicesData.services || []);

      } catch (err) {
        setError(err.message);
        console.error('Error fetching clinic data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClinicData();
  }, [clinicId, status]);

  const statsCurrentClinic = [
    {
      icon: '👥',
      title: 'Staff',
      value: staffMembers.length,
      valueColor: 'text-emerald-600',
    },
    {
      icon: '🏢',
      title: 'Services',
      value: services.length,
      valueColor: 'text-blue-600',
    },
    {
      icon: '🩺',
      title: 'Patients',
      value: patients.length,
      valueColor: 'text-teal-600',
    },
    {
      icon: '🔗',
      title: 'Integrations',
      value: integrations.length,
      valueColor: 'text-purple-600',
    },
  ];

  const handleBackToList = () => {
    router.push('/admin/clinics');
  };

  const handleUpdateClinic = async (e) => {
    e.preventDefault();
    try {
      await updateClinic(clinicId, formData);
      setClinic({ ...clinic, ...formData });
      setShowEditModal(false);
      alert('Clinic updated successfully!');
    } catch (err) {
      alert('Failed to update clinic: ' + err.message);
    }
  };

  const handleEditOverview = () => {
    setOverviewFormData({
      email: clinic?.email || '',
      phone: clinic?.phone || '',
      website: clinic?.website || '',
      address: clinic?.address || '',
      city: clinic?.city || '',
      state: clinic?.state || '',
      zipCode: clinic?.zipCode || '',
      country: clinic?.country || '',
    });
    setShowEditOverviewModal(true);
  };

  const handleUpdateOverview = async (e) => {
    e.preventDefault();
    try {
      await updateClinic(clinicId, overviewFormData);
      setClinic({ ...clinic, ...overviewFormData });
      setShowEditOverviewModal(false);
      alert('Overview updated successfully!');
    } catch (err) {
      alert('Failed to update overview: ' + err.message);
    }
  };

  const handleShowStaffDetails = (staff) => {
    setSelectedStaffForDetails(staff);
    setShowStaffDetailsModal(true);
  };

  const handleShowServiceDetails = (service) => {
    setSelectedServiceForDetails(service);
    setShowServiceDetailsModal(true);
  };

  const handleEditStaffList = () => {
    setSelectedStaffIds(staffMembers.map(s => s.id));
    setShowEditStaffListModal(true);
  };

  const handleEditServiceList = () => {
    setSelectedServiceIds(services.map(s => s.id));
    setShowEditServiceListModal(true);
  };

  const handleEditOperatingHours = () => {
    setTempOperatingHours({ ...operatingHours });
    setShowEditOperatingHoursModal(true);
  };

  const handleSaveOperatingHours = async (e) => {
    e.preventDefault();
    try {
      const openingHoursJson = JSON.stringify(tempOperatingHours);
      await updateClinic(clinicId, { openingHours: openingHoursJson });
      setOperatingHours(tempOperatingHours);
      setShowEditOperatingHoursModal(false);
      alert('Operating hours updated successfully!');
    } catch (err) {
      alert('Failed to update operating hours: ' + err.message);
    }
  };

  const toggleStaffSelection = (staffId) => {
    setSelectedStaffIds(prev =>
      prev.includes(staffId) ? prev.filter(id => id !== staffId) : [...prev, staffId]
    );
  };

  const toggleServiceSelection = (serviceId) => {
    setSelectedServiceIds(prev =>
      prev.includes(serviceId) ? prev.filter(id => id !== serviceId) : [...prev, serviceId]
    );
  };

  const handleLinkStaff = async (e) => {
    e.preventDefault();
    try {
      await Promise.all(
        selectedStaffIds.map(staffId =>
          linkStaffToClinic(staffId, clinicId)
        )
      );

      const updatedStaff = await fetchStaffByClinic(clinicId);
      setStaffMembers(updatedStaff || []);
      setShowStaffModal(false);
      setSelectedStaffIds([]);
      alert('Staff linked successfully!');
    } catch (err) {
      alert('Failed to link staff: ' + err.message);
    }
  };

  const handleSaveStaffList = async (e) => {
    e.preventDefault();
    try {
      // Get current staff IDs
      const currentStaffIds = staffMembers.map(s => s.id);

      // Staff to unlink (in current but not in selected)
      const toUnlink = currentStaffIds.filter(id => !selectedStaffIds.includes(id));

      // Staff to link (in selected but not in current)
      const toLink = selectedStaffIds.filter(id => !currentStaffIds.includes(id));

      await Promise.all([
        ...toUnlink.map(staffId => unlinkStaffFromClinic(staffId)),
        ...toLink.map(staffId => linkStaffToClinic(staffId, clinicId)),
      ]);

      const updatedStaff = await fetchStaffByClinic(clinicId);
      setStaffMembers(updatedStaff || []);
      setShowEditStaffListModal(false);
      setSelectedStaffIds([]);
      alert('Staff list updated successfully!');
    } catch (err) {
      alert('Failed to update staff list: ' + err.message);
    }
  };

  const handleLinkServices = async (e) => {
    e.preventDefault();
    try {
      await Promise.all(
        selectedServiceIds.map(serviceId =>
          linkServiceToClinic(serviceId, clinicId)
        )
      );

      const updatedServices = await fetchServicesByClinic(clinicId);
      setServices(updatedServices || []);
      setShowServiceModal(false);
      setSelectedServiceIds([]);
      alert('Services linked successfully!');
    } catch (err) {
      alert('Failed to link services: ' + err.message);
    }
  };

  const handleSaveServiceList = async (e) => {
    e.preventDefault();
    try {
      const currentServiceIds = services.map(s => s.id);
      const toUnlink = currentServiceIds.filter(id => !selectedServiceIds.includes(id));
      const toLink = selectedServiceIds.filter(id => !currentServiceIds.includes(id));

      await Promise.all([
        ...toUnlink.map(serviceId => unlinkServiceFromClinic(serviceId)),
        ...toLink.map(serviceId => linkServiceToClinic(serviceId, clinicId)),
      ]);

      const updatedServices = await fetchServicesByClinic(clinicId);
      setServices(updatedServices || []);
      setShowEditServiceListModal(false);
      setSelectedServiceIds([]);
      alert('Service list updated successfully!');
    } catch (err) {
      alert('Failed to update service list: ' + err.message);
    }
  };

  const handleUnlinkStaffFromClinic = async (staffId) => {
    if (!confirm('Are you sure you want to unlink this staff member from the clinic?')) {
      return;
    }

    try {
      await unlinkStaffFromClinic(staffId);
      
      // Refresh staff list
      const updatedStaff = await fetchStaffByClinic(clinicId);
      setStaffMembers(updatedStaff || []);
      
      // Close the staff details modal
      setShowStaffDetailsModal(false);
      setSelectedStaffForDetails(null);
      
      alert('Staff member unlinked successfully!');
    } catch (err) {
      alert('Failed to unlink staff: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <RoleGuard allowedRoles={['ADMIN']}>
        <div className="mx-auto">
          <button onClick={handleBackToList} className="mb-6 flex items-center gap-2 text-emerald-600 hover:text-emerald-700">
            ← Back to Clinics List
          </button>
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Clinic Not Found</h2>
            <p className="text-slate-600">The clinic you're looking for doesn't exist or has been deleted.</p>
          </div>
        </div>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      <button onClick={handleBackToList} className="mb-6 flex items-center gap-2 text-emerald-600 hover:text-emerald-700">
        ← Back to Clinics List
      </button>

      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-8 mb-6 shadow-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-white/20 flex items-center justify-center text-4xl">
                    {clinic?.logo}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{clinic?.name}</h1>
                    <p className="text-white/90">{clinic?.settings?.description || 'No description available'}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowEditModal(true)} className="px-6 py-2 bg-white/20 text-white rounded-xl font-medium">✏️ Edit</button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-6 mb-6">
              {statsCurrentClinic.map((item, index) => (
                <StatCard
                  key={index}
                  icon={item.icon}
                  title={item.title}
                  value={item.value}
                  valueColor={item.valueColor}
                />
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-lg">
              <div className="bg-gradient-to-r from-slate-50 via-slate-100 to-slate-50 border-b border-slate-200 shadow-sm">
                <nav className="flex px-4 gap-1 overflow-x-auto">
                  {[
                    { id: 'overview', label: 'Overview', icon: '📋', activeColor: 'bg-blue-600', hoverColor: 'hover:bg-blue-50', textColor: 'text-blue-600', borderColor: 'border-blue-500' },
                    { id: 'staff', label: 'Staff Management', icon: '👥', activeColor: 'bg-emerald-600', hoverColor: 'hover:bg-emerald-50', textColor: 'text-emerald-600', borderColor: 'border-emerald-500' },
                    { id: 'patients', label: 'Patients', icon: '🏥', activeColor: 'bg-teal-600', hoverColor: 'hover:bg-teal-50', textColor: 'text-teal-600', borderColor: 'border-teal-500' },
                    { id: 'services', label: 'Services', icon: '🏢', activeColor: 'bg-purple-600', hoverColor: 'hover:bg-purple-50', textColor: 'text-purple-600', borderColor: 'border-purple-500' },
                    { id: 'hours', label: 'Operating Hours', icon: '🕐', activeColor: 'bg-amber-600', hoverColor: 'hover:bg-amber-50', textColor: 'text-amber-600', borderColor: 'border-amber-500' },
                    { id: 'integrations', label: 'Integrations', icon: '🔗', activeColor: 'bg-cyan-600', hoverColor: 'hover:bg-cyan-50', textColor: 'text-cyan-600', borderColor: 'border-cyan-500' },
                    { id: 'logs', label: 'Activity Logs', icon: '📊', activeColor: 'bg-rose-600', hoverColor: 'hover:bg-rose-50', textColor: 'text-rose-600', borderColor: 'border-rose-500' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        relative py-4 px-6 font-bold text-sm transition-all duration-300 rounded-t-2xl min-w-fit
                        ${activeTab === tab.id
                          ? `bg-white ${tab.textColor} shadow-xl scale-105 border-t-4 ${tab.borderColor} -mb-px`
                          : `text-slate-600 ${tab.hoverColor} hover:scale-102 hover:text-slate-900`
                        }
                      `}
                    >
                      <span className="flex items-center gap-2.5 whitespace-nowrap">
                        <span className={`text-2xl ${activeTab === tab.id ? 'drop-shadow-lg' : 'opacity-70'}`}>
                          {tab.icon}
                        </span>
                        <span className="tracking-wide">{tab.label}</span>
                      </span>
                      {activeTab === tab.id && (
                        <>
                          <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 ${tab.activeColor} rounded-t-full`}></div>
                          <div className={`absolute inset-0 ${tab.activeColor} opacity-5 rounded-t-2xl`}></div>
                        </>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-8 bg-gradient-to-br from-slate-50 to-white min-h-[600px]">
                {activeTab === 'overview' && (
                  <ClinicOverview
                    clinic={clinic}
                    onEditOverview={handleEditOverview}
                  />
                )}

                {activeTab === 'staff' && (
                  <ClinicStaffManagement
                    allStaff={allStaff}
                    clinicId={clinicId}
                    onEditStaffList={handleEditStaffList}
                    onAddStaff={() => { setSelectedStaffIds([]); setShowStaffModal(true); }}
                    onViewStaffDetails={handleShowStaffDetails}
                    clinicStaff={staffMembers}
                  />
                )}

                {activeTab === 'patients' && (
                  <ClinicPatientManagement
                    patients={patients}
                    clinicId={clinicId}
                    onViewPatientDetails={(patient) => {
                      setSelectedPatientForDetails(patient);
                      setShowPatientDetailsModal(true);
                    }}
                  />
                )}

                {activeTab === 'services' && (
                  <ClinicServices
                    allServices={allServices}
                    clinicId={clinicId}
                    onEditServiceList={handleEditServiceList}
                    onAddServices={() => { setSelectedServiceIds([]); setShowServiceModal(true); }}
                    onViewServiceDetails={handleShowServiceDetails}
                    clinicServices={services}
                  />
                )}

                {activeTab === 'hours' && (
                  <ClinicOperatingHours
                    operatingHours={operatingHours}
                    onEditHours={handleEditOperatingHours}
                  />
                )}

                {activeTab === 'integrations' && (
                  <ClinicIntegrations
                    integrations={integrations}
                    clinicId={clinicId}
                    onEditIntegrationList={() => { }}
                    onAddIntegrations={() => { }}
                  />
                )}

                {activeTab === 'logs' && (
                  <ClinicActivityLogs
                    activityLogs={activityLogs}
                    clinicId={clinicId}
                  />
                )}
              </div>
            </div>

            {/* Edit Clinic Modal */}
            {showEditModal && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-3xl p-10 max-w-3xl w-full shadow-2xl border-4 border-emerald-500">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                        <span className="text-4xl">✏️</span>
                        Edit Clinic Profile
                      </h2>
                      <p className="text-slate-600 mt-2">Update clinic information and details</p>
                    </div>
                    <button
                      onClick={() => setShowEditModal(false)}
                      className="p-3 hover:bg-slate-100 rounded-xl transition-all group"
                    >
                      <svg className="w-7 h-7 text-slate-600 group-hover:text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <form onSubmit={handleUpdateClinic} className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Clinic Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-5 py-4 rounded-xl border-2 border-slate-300 focus:border-emerald-500 outline-none text-lg font-medium text-slate-900 transition-all"
                        placeholder="Enter clinic name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full px-5 py-4 rounded-xl border-2 border-slate-300 focus:border-emerald-500 outline-none text-lg font-medium text-slate-900 transition-all resize-none"
                        placeholder="Describe your clinic"
                      />
                    </div>
                    <div className="flex gap-4 pt-6">
                      <button
                        type="button"
                        onClick={() => setShowEditModal(false)}
                        className="flex-1 px-8 py-4 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-lg transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Staff Details Modal */}
            {showStaffDetailsModal && selectedStaffForDetails && (
              <StaffDetails
                staff={selectedStaffForDetails}
                onClose={() => setShowStaffDetailsModal(false)}
                onDelete={() => handleUnlinkStaffFromClinic(selectedStaffForDetails.id)}
              />
            )}

            {/* Service Details Modal */}
            {showServiceDetailsModal && selectedServiceForDetails && (
              <ServiceDetails
                service={selectedServiceForDetails}
                onClose={() => setShowServiceDetailsModal(false)}
              />
            )}

            {/* Edit Staff List Modal */}
            {showEditStaffListModal && (
              <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">✏️ Edit Staff List</h2>
                    <button onClick={() => { setShowEditStaffListModal(false); setSelectedStaffIds([]); }} className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <form onSubmit={handleSaveStaffList} className="space-y-4">
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {allStaff
                        //   .filter(s => s.clinicId === null || s.clinicId === undefined || s.clinicId === clinicId)
                        .map((staff) => (
                          <label
                            key={staff.id}
                            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedStaffIds.includes(staff.id)
                              ? 'bg-blue-50 border-blue-500'
                              : 'bg-slate-50 border-slate-200 hover:border-blue-300'
                              }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedStaffIds.includes(staff.id)}
                              onChange={() => toggleStaffSelection(staff.id)}
                              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {staff.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-slate-900">{staff.name}</p>
                              <p className="text-sm text-slate-600">{staff.role}</p>
                            </div>
                          </label>
                        ))}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => { setShowEditStaffListModal(false); setSelectedStaffIds([]); }}
                        className="flex-1 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Edit Service List Modal */}
            {showEditServiceListModal && (
              <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">✏️ Edit Service List</h2>
                    <button onClick={() => { setShowEditServiceListModal(false); setSelectedServiceIds([]); }} className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <form onSubmit={handleSaveServiceList} className="space-y-4">
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {allServices
                        .filter(s => s.clinic === null || s.clinic === undefined || s.clinic === clinicId)
                        .map((service) => (
                          <label
                            key={service.id}
                            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedServiceIds.includes(service.id)
                              ? 'bg-purple-50 border-purple-500'
                              : 'bg-slate-50 border-slate-200 hover:border-purple-300'
                              }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedServiceIds.includes(service.id)}
                              onChange={() => toggleServiceSelection(service.id)}
                              className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                            />
                            <div className="flex-1">
                              <p className="font-semibold text-slate-900">{service.name}</p>
                              <p className="text-sm text-slate-600">{service.category} • ${service.price}</p>
                            </div>
                          </label>
                        ))}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => { setShowEditServiceListModal(false); setSelectedServiceIds([]); }}
                        className="flex-1 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Link Staff Modal */}
            {showStaffModal && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-3xl p-10 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-emerald-500">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                        <span className="text-4xl">👥</span>
                        Link Available Staff
                      </h2>
                    </div>
                    <button onClick={() => { setShowStaffModal(false); setSelectedStaffIds([]); }} className="p-3 hover:bg-slate-100 rounded-xl transition-all group">
                      <svg className="w-7 h-7 text-slate-600 group-hover:text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <form onSubmit={handleLinkStaff} className="space-y-6">
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                      {allStaff
                        .filter(s => s.clinicId === null || s.clinicId === undefined)
                        .map((staff) => (
                          <label
                            key={staff.id}
                            className={`flex items-center gap-5 p-5 rounded-2xl border-3 cursor-pointer transition-all ${selectedStaffIds.includes(staff.id)
                              ? 'bg-emerald-50 border-emerald-500 shadow-lg scale-105'
                              : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-md'
                              }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedStaffIds.includes(staff.id)}
                              onChange={() => toggleStaffSelection(staff.id)}
                              className="w-6 h-6 text-emerald-600 rounded-lg focus:ring-2 focus:ring-emerald-500"
                            />
                            <div className="flex-1">
                              <p className="font-bold text-lg text-slate-900">{staff.name}</p>
                              <p className="text-sm text-slate-600 font-medium">{staff.role}</p>
                            </div>
                          </label>
                        ))}
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => { setShowStaffModal(false); setSelectedStaffIds([]); }}
                        className="flex-1 px-8 py-4 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-lg transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl"
                      >
                        Link Staff
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Link Services Modal */}
            {showServiceModal && (
              <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">🏢 Link Available Services</h2>
                    <button onClick={() => { setShowServiceModal(false); setSelectedServiceIds([]); }} className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <form onSubmit={handleLinkServices} className="space-y-4">
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {allServices
                        .filter(s => s.clinic === null || s.clinic === undefined)
                        .map((service) => (
                          <label
                            key={service.id}
                            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedServiceIds.includes(service.id)
                              ? 'bg-emerald-50 border-emerald-500'
                              : 'bg-slate-50 border-slate-200 hover:border-emerald-300'
                              }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedServiceIds.includes(service.id)}
                              onChange={() => toggleServiceSelection(service.id)}
                              className="w-5 h-5 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                            />
                            <div className="flex-1">
                              <p className="font-semibold text-slate-900">{service.name}</p>
                              <p className="text-sm text-slate-600">{service.category} • ${service.price}</p>
                            </div>
                          </label>
                        ))}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => { setShowServiceModal(false); setSelectedServiceIds([]); }}
                        className="flex-1 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-all"
                      >
                        Link Services
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Edit Operating Hours Modal */}
            {showEditOperatingHoursModal && (
              <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">🕐 Edit Operating Hours</h2>
                    <button onClick={() => setShowEditOperatingHoursModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <form onSubmit={handleSaveOperatingHours} className="space-y-4">
                    <div className="space-y-3">
                      {Object.entries(tempOperatingHours).map(([day, hours]) => (
                        <div key={day} className="p-4 bg-slate-50 rounded-xl border-2 border-slate-200">
                          <label className="flex items-center gap-4 mb-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={hours.enabled}
                              onChange={(e) => setTempOperatingHours({
                                ...tempOperatingHours,
                                [day]: { ...hours, enabled: e.target.checked }
                              })}
                              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="font-semibold capitalize text-slate-900 text-lg">{day}</span>
                          </label>
                          {hours.enabled && (
                            <div className="flex items-center gap-3 pl-9">
                              <input
                                type="time"
                                value={hours.open}
                                onChange={(e) => setTempOperatingHours({
                                  ...tempOperatingHours,
                                  [day]: { ...hours, open: e.target.value }
                                })}
                                className="px-4 py-2 rounded-lg border-2 border-slate-200 focus:border-blue-500 outline-none transition-all"
                                required
                              />
                              <span className="text-slate-600">to</span>
                              <input
                                type="time"
                                value={hours.close}
                                onChange={(e) => setTempOperatingHours({
                                  ...tempOperatingHours,
                                  [day]: { ...hours, close: e.target.value }
                                })}
                                className="px-4 py-2 rounded-lg border-2 border-slate-200 focus:border-blue-500 outline-none transition-all"
                                required
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowEditOperatingHoursModal(false)}
                        className="flex-1 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Edit Overview Modal */}
            {showEditOverviewModal && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-3xl p-10 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-blue-500">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-slate-800">✏️ Edit Overview Information</h2>
                    <button onClick={() => setShowEditOverviewModal(false)} className="p-3 hover:bg-slate-100 rounded-xl transition-all group">
                      <svg className="w-7 h-7 text-slate-600 group-hover:text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <form onSubmit={handleUpdateOverview} className="space-y-6">
                    <div className="grid grid-cols-2 gap-5">
                      <div className="col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-3">Email</label>
                        <input
                          type="email"
                          value={overviewFormData.email}
                          onChange={(e) => setOverviewFormData({ ...overviewFormData, email: e.target.value })}
                          className="w-full px-5 py-4 border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3">Phone</label>
                        <input
                          type="tel"
                          value={overviewFormData.phone}
                          onChange={(e) => setOverviewFormData({ ...overviewFormData, phone: e.target.value })}
                          className="w-full px-5 py-4 border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3">Website</label>
                        <input
                          type="url"
                          value={overviewFormData.website}
                          onChange={(e) => setOverviewFormData({ ...overviewFormData, website: e.target.value })}
                          className="w-full px-5 py-4 border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                      <button
                        type="button"
                        onClick={() => setShowEditOverviewModal(false)}
                        className="flex-1 px-8 py-4 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-lg transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
    </RoleGuard>
  );
}
