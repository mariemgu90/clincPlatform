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
  EditClinicModal,
  EditOverviewModal,
  EditOperatingHoursModal,
  LinkStaffModal,
  EditStaffListModal,
  LinkServicesModal,
  EditServiceListModal,
} from '@/components/modals';

import {
  fetchServices,
  fetchServicesByClinic,
  fetchStaffByClinic,
  updateClinic,
  fetchClinicById,
  fetchAllStaff,
  unlinkStaffFromClinic,
  linkStaffToClinic,
  linkServiceToClinic,
  unlinkServiceFromClinic,
  fetchPatientById,
  fetchPatientsByClinic,
  // fetchIntegrationsByClinic,
} from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export default function ClinicDetailPage() {
  const params = useParams();
  const clinicId = params.id;
  const router = useRouter();
  const { status } = useSession();

  const [clinic, setClinic] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showEditStaffListModal, setShowEditStaffListModal] = useState(false);
  const [showEditServiceListModal, setShowEditServiceListModal] = useState(false);
  const [showEditOverviewModal, setShowEditOverviewModal] = useState(false);
  const [showServiceDetailsModal, setShowServiceDetailsModal] = useState(false);
  const [showEditOperatingHoursModal, setShowEditOperatingHoursModal] = useState(false);

  const [selectedStaffForDetails, setSelectedStaffForDetails] = useState(null);
  const [selectedServiceForDetails, setSelectedServiceForDetails] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [showPatientDetailsModal, setShowPatientDetailsModal] = useState(false);

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
  const [integrations, setIntegrations] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);

  const [selectedStaffIds, setSelectedStaffIds] = useState([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [tempOperatingHours, setTempOperatingHours] = useState({});
  const [overviewFormData, setOverviewFormData] = useState({ email: '', phone: '', website: '', address: '', city: '', state: '', zipCode: '', country: '' });

  const [error, setError] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [patientLoading, setPatientLoading] = useState(false);

  const showDetailsPatient = async (patientId) => {
    setSelectedPatientId(patientId);
    setPatientLoading(true);
    try {
      const data = await fetchPatientById(patientId);
      setPatientData(data);
      setShowPatientDetailsModal(true);
    } catch (err) {
      console.error('Error fetching patient:', err);
      alert('Failed to load patient details: ' + err.message);
    } finally {
      setPatientLoading(false);
    }
  };
  // Fetch clinic data from the database
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  const fetchClinicData = async () => {
    // Don't fetch if not authenticated or no clinic ID
    if (!clinicId || status !== 'authenticated') {
      return;
    }

    try {

      // Fetch clinic details using the API helper
      const clinicData = await fetchClinicById(clinicId);

      setClinic(clinicData);

      // Fetch all staff and services for linking
      const allStaffData = await fetchAllStaff();
      setAllStaff(allStaffData);

      const allServicesData = await fetchServices();
      setAllServices(Array.isArray(allServicesData) ? allServicesData : allServicesData.services || []);



    } catch (err) {
      setError(err.message);
      console.error('Error fetching clinic data:', err);
    } finally {
      // setLoading(false);
    }
  };
  //  const { data: examDataById, isFetching: fetchSections, refetch, } = useQuery({
  //   queryKey: ['examById', templateId],
  //   queryFn: () => getExamByID({ id_exam: +templateId }),
  // })

 const {data: servicesDataLinkedClinic} = useQuery({
    queryKey: ['clinicById', clinicId],
    queryFn: () => fetchServicesByClinic(clinicId),
  });
  const {data: patientLinkedClinic} = useQuery({
    queryKey: ['patientsByClinic', clinicId],
    queryFn: () => fetchPatientsByClinic(clinicId),
  });
  const {data: staffDataLinkedClinic} = useQuery({
    queryKey: ['staffByClinic', clinicId],
    queryFn: () => fetchStaffByClinic(clinicId),
  });
  // const {data: integrationDataLinkedClinic} = useQuery({
  //   queryKey: ['integrationsByClinic', clinicId],
  //   queryFn: () => fetchIntegrationsByClinic(clinicId),
  // });


  useEffect(() => {
    fetchClinicData();

  }, [clinicId, status, activeTab]);

  const statsCurrentClinic = [
    {
      icon: '👥',
      title: 'Staff',
      value: clinic?.users?.length,
      valueColor: 'text-emerald-600',
    },
    {
      icon: '🏢',
      title: 'Services',
      value: clinic?.services?.length,
      valueColor: 'text-blue-600',
    },
    {
      icon: '🩺',
      title: 'Patients',
      value: clinic?.patients?.length,
      valueColor: 'text-teal-600',
    },
    {
      icon: '🔗',
      title: 'Integrations',
      value: clinic?.integrations?.length,
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
    setSelectedServiceIds(servicesDataLinkedClinic?.map(s => s.id) || []);
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
console.log('aaaaaaa clinic?.services', clinic?.services);

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
              clinicStaff={staffDataLinkedClinic}
            />
          )}

          {activeTab === 'patients' && (
            <ClinicPatientManagement
              patients={patientLinkedClinic}
              onViewPatientDetails={(id) => { showDetailsPatient(id); }}
            />
          )}

          {activeTab === 'services' && (
            <ClinicServices
              allServices={allServices}
              clinicId={clinicId}
              onEditServiceList={handleEditServiceList}
              onAddServices={() => { setSelectedServiceIds([]); setShowServiceModal(true); }}
              onViewServiceDetails={handleShowServiceDetails}
              clinicServices={servicesDataLinkedClinic}
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

      {/* Staff Details Modal */}
      {selectedStaffForDetails && (
        <StaffDetails
          staff={selectedStaffForDetails}
          onClose={() => setSelectedStaffForDetails(null)}
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

      {/* Edit Clinic Modal */}
      <EditClinicModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        formData={formData}
        onFormChange={setFormData}
        onSubmit={handleUpdateClinic}
        isLoading={false}
      />

      {/* Edit Staff List Modal */}
      <EditStaffListModal
        isOpen={showEditStaffListModal}
        onClose={() => setShowEditStaffListModal(false)}
        allStaff={allStaff}
        selectedIds={selectedStaffIds}
        onToggleItem={toggleStaffSelection}
        onSubmit={handleSaveStaffList}
      />

      {/* Edit Service List Modal */}
    {  showEditServiceListModal && (
      <EditServiceListModal
        isOpen={showEditServiceListModal}
        onClose={() => setShowEditServiceListModal(false)}
        allServices={allServices}
        linkedServices={servicesDataLinkedClinic}
        clinicId={clinicId}
        selectedIds={selectedServiceIds}
        onToggleItem={toggleServiceSelection}
        onSubmit={handleSaveServiceList}
      />
      )}

      {/* Link Staff Modal */}
      <LinkStaffModal
        isOpen={showStaffModal}
        onClose={() => setShowStaffModal(false)}
        availableStaff={allStaff}
        selectedIds={selectedStaffIds}
        onToggleItem={toggleStaffSelection}
        onSubmit={handleLinkStaff}
      />

      {/* Link Services Modal */}
      <LinkServicesModal
        isOpen={showServiceModal}
        onClose={() => setShowServiceModal(false)}
        availableServices={allServices?.filter(s => !clinic?.services?.includes(s.id)) || []}
        selectedIds={selectedServiceIds}
        onToggleItem={toggleServiceSelection}
        onSubmit={handleLinkServices}
      />

      {/* Edit Operating Hours Modal */}
      <EditOperatingHoursModal
        isOpen={showEditOperatingHoursModal}
        onClose={() => setShowEditOperatingHoursModal(false)}
        operatingHours={tempOperatingHours}
        onTimeChange={(day, field, value) => setTempOperatingHours({
          ...tempOperatingHours,
          [day]: { ...tempOperatingHours[day], [field]: value }
        })}
        onToggleDay={(day) => setTempOperatingHours({
          ...tempOperatingHours,
          [day]: { ...tempOperatingHours[day], enabled: !tempOperatingHours[day].enabled }
        })}
        onSubmit={handleSaveOperatingHours}
      />

      {/* Edit Overview Modal */}
      <EditOverviewModal
        isOpen={showEditOverviewModal}
        onClose={() => setShowEditOverviewModal(false)}
        formData={overviewFormData}
        onFormChange={setOverviewFormData}
        onSubmit={handleUpdateOverview}
      />

      {/* Patient Details Modal */}
      {showPatientDetailsModal && patientData && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-10 max-w-2xl w-full shadow-2xl border-4 border-teal-500">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-slate-800">🏥 Patient Details</h2>
              <button
                onClick={() => {
                  setShowPatientDetailsModal(false);
                  setSelectedPatientId(null);
                }}
                className="p-3 hover:bg-slate-100 rounded-xl transition-all group"
              >
                <svg className="w-6 h-6 text-slate-600 group-hover:text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-600">First Name</label>
                  <p className="text-lg text-slate-900">{patientData?.firstName || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600">Last Name</label>
                  <p className="text-lg text-slate-900">{patientData?.lastName || 'N/A'}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-600">Email</label>
                <p className="text-lg text-slate-900">{patientData?.email || 'N/A'}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-600">Phone</label>
                <p className="text-lg text-slate-900">{patientData?.phone || 'N/A'}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-600">Date of Birth</label>
                <p className="text-lg text-slate-900">
                  {patientData?.dateOfBirth ? new Date(patientData.dateOfBirth).toLocaleDateString() : 'N/A'}
                </p>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-600">Status</label>
                <p className="text-lg text-slate-900">
                  <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold">
                    {patientData?.status || 'Active'}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-8 border-t border-slate-200 mt-8">
              <button
                onClick={() => {
                  setShowPatientDetailsModal(false);
                  setSelectedPatientId(null);
                }}
                className="flex-1 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </RoleGuard>
  );
}
