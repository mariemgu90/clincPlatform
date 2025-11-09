'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import PatientCard from '@/components/PatientCard';
import ClinicOverview from '@/components/ClinicOverview';
import ClinicStaffManagement from '@/components/ClinicStaffManagement';
import ClinicPatientManagement from '@/components/ClinicPatientManagement';
import ClinicServices from '@/components/ClinicServices';
import ClinicOperatingHours from '@/components/ClinicOperatingHours';
import ClinicIntegrations from '@/components/ClinicIntegrations';
import ClinicActivityLogs from '@/components/ClinicActivityLogs';
import StatCard from '@/components/StatCard';
import CardClinicInfo from '@/components/CardClinicInfo';
import {
  fetchClinics,
  fetchPatients,
  fetchStaff,
  fetchServices,
  fetchServicesByClinic,
  fetchPatientsByClinic,
  fetchCountsForClinics,
  fetchStaffByClinic,
  createClinic,
  updateClinic,
  deleteClinic,
} from '@/lib/api';
import StaffDetails from '@/components/StaffDetails';
import ServiceDetails from '@/components/ServiceDetails';

export default function ClinicsManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [clinics, setClinics] = useState([]);

  const [viewMode, setViewMode] = useState('list');
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [showIntegrationsModal, setShowIntegrationsModal] = useState(false);
  const [clinicToDelete, setClinicToDelete] = useState(null);

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
  const [clinicService, setClinicService] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [integrations, setIntegrations] = useState([]);

  const [patients, setPatients] = useState([]);
  // clinicCounts stores server-derived counts per clinic id: { [clinicId]: { staff, services, patients } }
  const [clinicCounts, setClinicCounts] = useState({});
  const [error, setError] = useState(null);

  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showEditStaffListModal, setShowEditStaffListModal] = useState(false);
  const [showEditServiceModal, setShowEditServiceModal] = useState(false);
  const [showEditServiceListModal, setShowEditServiceListModal] = useState(false);
  const [showEditIntegrationModal, setShowEditIntegrationModal] = useState(false);
  const [showEditOverviewModal, setShowEditOverviewModal] = useState(false);
  const [showStaffDetailsModal, setShowStaffDetailsModal] = useState(false);
  const [showPatientDetailsModal, setShowPatientDetailsModal] = useState(false);
  const [showEditOperatingHoursModal, setShowEditOperatingHoursModal] = useState(false);
  const [showServiceDetailsModal, setShowServiceDetailsModal] = useState(false);
  const [selectedStaffForDetails, setSelectedStaffForDetails] = useState(null);
  const [selectedPatientForDetails, setSelectedPatientForDetails] = useState(null);
  const [selectedServiceForDetails, setSelectedServiceForDetails] = useState(null);
  
  const [selectedStaffIds, setSelectedStaffIds] = useState([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [selectedIntegrationIds, setSelectedIntegrationIds] = useState([]);
  const [tempOperatingHours, setTempOperatingHours] = useState({});
  const [staffFormData, setStaffFormData] = useState({ name: '', role: '' });
  const [serviceFormData, setServiceFormData] = useState({ name: '', category: '', duration: '', price: '' });
  const [integrationFormData, setIntegrationFormData] = useState({ name: '', type: '' });
  const [overviewFormData, setOverviewFormData] = useState({ email: '', phone: '', website: '', address: '', city: '', state: '', zipCode: '', country: '' });
  const [editingStaff, setEditingStaff] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [editingIntegration, setEditingIntegration] = useState(null);

  const statsCurrentClinic = [
    {
      icon: "👥",
      title: "Staff",
      value: allStaff.filter((s) => s.clinic === selectedClinic?.id || s.clinicId === selectedClinic?.id).length,
      valueColor: "text-emerald-600",
    },
    {
      icon: "🏢",
      title: "Services",
      value: allServices.filter((s) => s.clinic === selectedClinic?.id || s.clinicId === selectedClinic?.id).length,
      valueColor: "text-blue-600",
    },
    {
      icon: "🩺",
      title: "Patients",
      value: patients.filter((p) => p.clinicId === selectedClinic?.id || p.clinic === selectedClinic?.id).length,
      valueColor: "text-teal-600",
    },
    {
      icon: "🔗",
      title: "Integrations",
      value: integrations.filter((i) => i.clinic === selectedClinic?.id).length,
      valueColor: "text-purple-600",

    },
  ];
  const statstotal = [
    {
      icon: "🏥",
      title: "Total Clinics",
      value: clinics.length,
      valueColor: "text-slate-900",
    },
    {
      icon: "✅",
      title: "Active Clinics",
      value: clinics.filter((c) => c.status === "Active").length,
      valueColor: "text-emerald-600",
    },
    {
      icon: "👥",
      title: "Total Staff",
      value: allStaff.length,
      valueColor: "text-blue-600",
    },
    {
      icon: "🩺",
      title: "Total Patients",
      value: patients.length,
      valueColor: "text-teal-600",
    },
  ];
  const getClinics = async () => {
    try {
      const data = await fetchClinics();
      setClinics(data || []);
      // also fetch counts for each clinic
      try {
        const counts = await fetchCountsForClinics(data || []);
        setClinicCounts(counts || {});
      } catch (err) {
        console.error('Failed to fetch clinic counts', err);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };
  const getPatients = async () => {
    try {
      const data = await fetchPatients();
      setPatients(data || []);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }
   const getStaffs = async () => {
    try {
      const data = await fetchStaff();
      // fetchStaff returns an array (or object) normalized to array
      const staffArray = Array.isArray(data) ? data : data || [];
      setAllStaff(staffArray);
      // setStaffMembers(staffArray);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }
  const getServices = async () => {
    try {
      const data = await fetchServices();
      const svc = Array.isArray(data) ? data : data || [];
      setAllServices(svc);
      // setClinicService(svc);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  const filterStaffByClinic = async (clinicId) => {
    if (!clinicId) return setStaffMembers(allStaff || []);
    try {
      const staffArray = await fetchStaffByClinic(clinicId);
      setStaffMembers(staffArray || []);
      return;
    } catch (e) {
      // fallback to client-side filtering
    }

    // setStaffMembers((allStaff || []).filter(s => s.clinic === clinicId || s.clinicId === clinicId));
  };

  const filterServicesByClinic = async (clinicId) => {
    // if (!clinicId) return setClinicService(allServices || []);
    try {
      const servicesArray = await fetchServicesByClinic(clinicId);
      setClinicService(servicesArray || []);
      return;
    } catch (e) {
      // fallback to client-side filtering
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (session?.user?.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      // use our local getters which set component state and counts
      getClinics();
      getPatients();
      getServices();
      getStaffs();
    }
  }, [session]);

  // When selectedClinic changes, update scoped lists as well
  useEffect(() => {
    if (selectedClinic) {
      filterStaffByClinic(selectedClinic.id);
      filterServicesByClinic(selectedClinic.id);
      fetchPatientsByClinic(selectedClinic.id);
    } else {
      // reset to all
      setStaffMembers(allStaff || []);
      // setClinicService(allServices || []);
      // patients may remain global; keep them as is
    }
  }, [selectedClinic, allStaff, allServices]);

  const handleViewClinic = (clinic) => {
    // Navigate to the clinic detail page using the clinic ID
    router.push(`/admin/clinics/${clinic.id}`);
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedClinic(null);
    setActiveTab('overview');
  };

  const handleAddClinic = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newClinic = await createClinic(formData);

  // Refresh clinics list
  await getClinics();

      // Add activity log
      setActivityLogs([...activityLogs, {
        id: activityLogs.length + 1,
        action: `Clinic "${formData.name}" created`,
        user: session?.user?.name || 'Admin',
        timestamp: new Date().toISOString(),
        clinic: newClinic.id
      }]);

      setShowAddModal(false);
      setFormData({
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
    } catch (error) {
      console.error('Error creating clinic:', error);
      alert('Failed to create clinic. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClinic = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedClinic = await updateClinic(selectedClinic.id, formData);

  // Refresh clinics list
  await getClinics();

      // Update selected clinic
      setSelectedClinic({ ...selectedClinic, ...formData });

      // Add activity log
      setActivityLogs([...activityLogs, {
        id: activityLogs.length + 1,
        action: `Clinic "${formData.name}" updated`,
        user: session?.user?.name || 'Admin',
        timestamp: new Date().toISOString(),
        clinic: selectedClinic.id
      }]);

      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating clinic:', error);
      alert('Failed to update clinic. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClinic = async () => {
    if (!clinicToDelete) {
      console.error("No clinic selected for deletion.");
      return;
    }
    setLoading(true);

    try {
      await deleteClinic(clinicToDelete.id);

      // Add activity log
      setActivityLogs([...activityLogs, {
        id: activityLogs.length + 1,
        action: `Clinic "${clinicToDelete.name}" deleted`,
        user: session?.user?.name || 'Admin',
        timestamp: new Date().toISOString(),
        clinic: clinicToDelete.id
      }]);

  // Refresh clinics list
  await getClinics();

      setShowDeleteConfirm(false);
      setClinicToDelete(null);

      if (selectedClinic?.id === clinicToDelete.id) {
        handleBackToList();
      }
    } catch (error) {
      console.error('Error deleting clinic:', error);
      alert(error.message || 'Failed to delete clinic. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleEditOperatingHours = () => {
    setTempOperatingHours({ ...operatingHours });
    setShowEditOperatingHoursModal(true);
  };

  const handleSaveOperatingHours = (e) => {
    e.preventDefault();
    if (!selectedClinic) {
      console.error("No clinic selected for updating operating hours.");
      return;
    }

    // Update the operating hours with temp values
    setOperatingHours(tempOperatingHours);

    // Update the selected clinic with new operating hours
    setSelectedClinic({ ...selectedClinic, operatingHours: tempOperatingHours });

    // Update the clinic in the clinics list
    const updatedClinics = clinics.map(c =>
      c.id === selectedClinic.id
        ? { ...c, operatingHours: tempOperatingHours }
        : c
    );
    setClinics(updatedClinics);

    setActivityLogs([...activityLogs, {
      id: activityLogs.length + 1,
      action: 'Operating hours updated',
      user: session?.user?.name || 'Admin',
      timestamp: new Date().toISOString(),
      clinic: selectedClinic.id
    }]);

    setShowEditOperatingHoursModal(false);
  };

  const handleLinkStaff = (e) => {
    e.preventDefault();
    if (!selectedClinic || selectedStaffIds.length === 0) {
      alert("Please select at least one staff member to link.");
      return;
    }

    // Update the clinic assignment for selected staff
    const updatedAllStaff = allStaff.map(staff =>
      selectedStaffIds.includes(staff.id)
        ? { ...staff, clinic: selectedClinic.id }
        : staff
    );
    setAllStaff(updatedAllStaff);

    // Update staff members list
    const linkedStaff = updatedAllStaff.filter(s => s.clinic === selectedClinic.id);
    setStaffMembers(linkedStaff);

    setShowStaffModal(false);
    setSelectedStaffIds([]);

    setActivityLogs([...activityLogs, {
      id: activityLogs.length + 1,
      action: `${selectedStaffIds.length} staff member(s) linked to clinic`,
      user: session?.user?.name || 'Admin',
      timestamp: new Date().toISOString(),
      clinic: selectedClinic.id
    }]);
  };

  const handleUnlinkStaff = (staffId) => {
    if (!selectedClinic) {
      console.error("No clinic selected for unlinking staff.");
      return;
    }

    const staff = allStaff.find(s => s.id === staffId);
    if (!staff) {
      console.error("Staff member not found.");
      return;
    }

    if (!confirm(`Are you sure you want to unlink "${staff.name}" from this clinic?`)) {
      return;
    }

    // Set clinic to null to make staff available again
    const updatedAllStaff = allStaff.map(s =>
      s.id === staffId ? { ...s, clinic: null } : s
    );
    setAllStaff(updatedAllStaff);

    // Update staff members list
    setStaffMembers(updatedAllStaff.filter(s => s.clinic === selectedClinic.id));

    setActivityLogs([...activityLogs, {
      id: activityLogs.length + 1,
      action: `Staff member "${staff.name}" unlinked from clinic`,
      user: session?.user?.name || 'Admin',
      timestamp: new Date().toISOString(),
      clinic: selectedClinic.id
    }]);
  };

  const handleEditStaffList = () => {
    // // Get current staff IDs for this clinic
    const currentStaffIds = staffMembers
      .filter(s => s.clinicId === selectedClinic?.id)
      .map(s => s.id);

    setSelectedStaffIds(currentStaffIds);
    setShowEditStaffListModal(true);
  };

  const handleSaveStaffList = (e) => {
    e.preventDefault();
    if (!selectedClinic) return;

    // Unlink staff that were removed
    const updatedAllStaff = allStaff.map(staff => {
      if (staff.clinic === selectedClinic.id && !selectedStaffIds.includes(staff.id)) {
        return { ...staff, clinic: null };
      }
      if (selectedStaffIds.includes(staff.id)) {
        return { ...staff, clinic: selectedClinic.id };
      }
      return staff;
    });

    setAllStaff(updatedAllStaff);
    setStaffMembers(updatedAllStaff.filter(s => s.clinic === selectedClinic.id));

    setActivityLogs([...activityLogs, {
      id: activityLogs.length + 1,
      action: 'Staff list updated',
      user: session?.user?.name || 'Admin',
      timestamp: new Date().toISOString(),
      clinic: selectedClinic.id
    }]);

    setShowEditStaffListModal(false);
    setSelectedStaffIds([]);
  };

  const handleEditOverview = () => {
    setOverviewFormData({
      email: selectedClinic?.email || '',
      phone: selectedClinic?.phone || '',
      website: selectedClinic?.website || '',
      address: selectedClinic?.address || '',
      city: selectedClinic?.city || '',
      state: selectedClinic?.state || '',
      zipCode: selectedClinic?.zipCode || '',
      country: selectedClinic?.country || ''
    });
    setShowEditOverviewModal(true);
  };

  const handleUpdateOverview = (e) => {
    e.preventDefault();
    if (!selectedClinic) return;

    const updatedClinic = { ...selectedClinic, ...overviewFormData };
    setSelectedClinic(updatedClinic);

    const updatedClinics = clinics.map(c =>
      c.id === selectedClinic.id ? updatedClinic : c
    );
    setClinics(updatedClinics);

    setActivityLogs([...activityLogs, {
      id: activityLogs.length + 1,
      action: 'Clinic overview information updated',
      user: session?.user?.name || 'Admin',
      timestamp: new Date().toISOString(),
      clinic: selectedClinic.id
    }]);

    setShowEditOverviewModal(false);
  };

  const handleShowStaffDetails = (staff) => {
    setSelectedStaffForDetails(staff);
    setShowStaffDetailsModal(true);
  };

  const handleShowServiceDetails = (service) => {
    setSelectedServiceForDetails(service);
    setShowServiceDetailsModal(true);
  };

  const handleLinkServices = (e) => {
    e.preventDefault();
    if (!selectedClinic || selectedServiceIds.length === 0) {
      alert("Please select at least one service to link.");
      return;
    }

    // Update the clinic assignment for selected services
    const updatedAllServices = allServices.map(service =>
      selectedServiceIds.includes(service.id)
        ? { ...service, clinic: selectedClinic.id }
        : service
    );
    setAllServices(updatedAllServices);

    // Update services list
    const linkedServices = updatedAllServices.filter(s => s.clinic === selectedClinic.id);
    setClinicService(linkedServices);

    setShowServiceModal(false);
    setSelectedServiceIds([]);

    setActivityLogs([...activityLogs, {
      id: activityLogs.length + 1,
      action: `${selectedServiceIds.length} service(s) linked to clinic`,
      user: session?.user?.name || 'Admin',
      timestamp: new Date().toISOString(),
      clinic: selectedClinic.id
    }]);
  };

  const handleUnlinkService = (serviceId) => {
    if (!selectedClinic) {
      console.error("No clinic selected for unlinking service.");
      return;
    }

    const service = allServices.find(s => s.id === serviceId);
    if (!service) {
      console.error("Service not found.");
      return;
    }

    if (!confirm(`Are you sure you want to unlink "${service.name}" from this clinic?`)) {
      return;
    }

    // Set clinic to null to make service available again
    const updatedAllServices = allServices.map(s =>
      s.id === serviceId ? { ...s, clinic: null } : s
    );
    setAllServices(updatedAllServices);

    // Update services list
    setClinicService(updatedAllServices.filter(s => s.clinic === selectedClinic.id));

    setActivityLogs([...activityLogs, {
      id: activityLogs.length + 1,
      action: `Service "${service.name}" unlinked from clinic`,
      user: session?.user?.name || 'Admin',
      timestamp: new Date().toISOString(),
      clinic: selectedClinic.id
    }]);
  };

  const handleEditServiceList = () => {
    // Get current service IDs for this clinic
    const currentServiceIds = allServices
      .filter(s => s.clinicId === selectedClinic?.id)
      .map(s => s.id);
    setSelectedServiceIds(currentServiceIds);
    setShowEditServiceListModal(true);
  };

  const handleSaveServiceList = (e) => {
    e.preventDefault();
    if (!selectedClinic) return;

    // Unlink services that were removed
    const updatedAllServices = allServices.map(service => {
      if (service.clinic === selectedClinic.id && !selectedServiceIds.includes(service.id)) {
        return { ...service, clinic: null };
      }
      if (selectedServiceIds.includes(service.id)) {
        return { ...service, clinic: selectedClinic.id };
      }
      return service;
    });

    setAllServices(updatedAllServices);
    setClinicService(updatedAllServices.filter(s => s.clinic === selectedClinic.id));

    setActivityLogs([...activityLogs, {
      id: activityLogs.length + 1,
      action: 'Service list updated',
      user: session?.user?.name || 'Admin',
      timestamp: new Date().toISOString(),
      clinic: selectedClinic.id
    }]);

    setShowEditServiceListModal(false);
    setSelectedServiceIds([]);
  };

  const toggleServiceSelection = (serviceId) => {
    setSelectedServiceIds(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setServiceFormData({
      name: service.name,
      category: service.category,
      duration: service.duration,
      price: service.price
    });
    setShowEditServiceModal(true);
  };

  const handleUpdateService = (e) => {
    e.preventDefault();
    if (!editingService) return;

    const updatedAllServices = allServices.map(s =>
      s.id === editingService.id ? { ...s, ...serviceFormData } : s
    );
    setAllServices(updatedAllServices);
    setClinicService(updatedAllServices.filter(s => s.clinic === selectedClinic.id));

    setActivityLogs([...activityLogs, {
      id: activityLogs.length + 1,
      action: `Service "${serviceFormData.name}" updated`,
      user: session?.user?.name || 'Admin',
      timestamp: new Date().toISOString(),
      clinic: selectedClinic.id
    }]);

    setShowEditServiceModal(false);
    setEditingService(null);
    setServiceFormData({ name: '', category: '', duration: '', price: '' });
  };

  const toggleStaffSelection = (staffId) => {
    setSelectedStaffIds(prev =>
      prev.includes(staffId)
        ? prev.filter(id => id !== staffId)
        : [...prev, staffId]
    );
  };

  const handleAddIntegration = (e) => {
    e.preventDefault();
    if (!selectedClinic) {
      console.error("No clinic selected for adding integration.");
      return;
    }

    const newIntegration = {
      id: integrations.length + 1,
      ...integrationFormData,
      status: 'Active',
      clinic: selectedClinic.id
    };
    setIntegrations([...integrations, newIntegration]);
    setShowIntegrationsModal(false);
    setIntegrationFormData({ name: '', type: '' });

    setActivityLogs([...activityLogs, {
      id: activityLogs.length + 1,
      action: `Integration "${newIntegration.name}" added`,
      user: session?.user?.name || 'Admin',
      timestamp: new Date().toISOString(),
      clinic: selectedClinic.id
    }]);
  };

  const handleLinkIntegrations = (e) => {
    e.preventDefault();
    if (!selectedClinic || selectedIntegrationIds.length === 0) {
      alert("Please select at least one integration to link.");
      return;
    }

    // Create new integrations based on selection
    const newIntegrations = selectedIntegrationIds.map(type => ({
      id: integrations.length + Math.random(),
      name: `${type} Integration`,
      type: type,
      status: 'Active',
      clinic: selectedClinic.id
    }));

    setIntegrations([...integrations, ...newIntegrations]);

    setShowIntegrationsModal(false);
    setSelectedIntegrationIds([]);

    setActivityLogs([...activityLogs, {
      id: activityLogs.length + 1,
      action: `${selectedIntegrationIds.length} integration(s) added`,
      user: session?.user?.name || 'Admin',
      timestamp: new Date().toISOString(),
      clinic: selectedClinic.id
    }]);
  };

  const handleEditIntegrationList = () => {
    // Get current integration IDs for this clinic
    const currentIntegrationIds = integrations
      .filter(i => i.clinic === selectedClinic?.id)
      .map(i => i.id);
    setSelectedIntegrationIds(currentIntegrationIds);
    setShowEditIntegrationModal(true);
  };

  const handleSaveIntegrationList = (e) => {
    e.preventDefault();
    if (!selectedClinic) return;

    // Remove integrations that were deselected
    const updatedIntegrations = integrations.filter(integration => {
      // Keep if it belongs to another clinic
      if (integration.clinic !== selectedClinic.id) return true;
      // Keep if it's still selected
      return selectedIntegrationIds.includes(integration.id);
    });

    setIntegrations(updatedIntegrations);

    setActivityLogs([...activityLogs, {
      id: activityLogs.length + 1,
      action: 'Integration list updated',
      user: session?.user?.name || 'Admin',
      timestamp: new Date().toISOString(),
      clinic: selectedClinic.id
    }]);

    setShowEditIntegrationModal(false);
    setSelectedIntegrationIds([]);
  };

  const toggleIntegrationListSelection = (integrationId) => {
    setSelectedIntegrationIds(prev =>
      prev.includes(integrationId)
        ? prev.filter(id => id !== integrationId)
        : [...prev, integrationId]
    );
  };

  const handleRemoveIntegration = (integrationId) => {
    if (!selectedClinic) {
      console.error("No clinic selected for removing integration.");
      return;
    }

    const integration = integrations.find(i => i.id === integrationId);
    if (!integration) {
      console.error("Integration not found.");
      return;
    }

    if (!confirm(`Are you sure you want to remove "${integration.name}"?`)) {
      return;
    }

    setIntegrations(integrations.filter(i => i.id !== integrationId));

    setActivityLogs([...activityLogs, {
      id: activityLogs.length + 1,
      action: `Integration "${integration.name}" removed`,
      user: session?.user?.name || 'Admin',
      timestamp: new Date().toISOString(),
      clinic: selectedClinic.id
    }]);
  };

  const toggleIntegrationSelection = (integrationType) => {
    setSelectedIntegrationIds(prev =>
      prev.includes(integrationType)
        ? prev.filter(type => type !== integrationType)
        : [...prev, integrationType]
    );
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
      </div>
    );
  }

  if (session?.user?.role !== 'ADMIN') {
    return null;
  }

  if (viewMode === 'list') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8 ml-64">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-8 shadow-lg shadow-emerald-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2">🏥 Clinic Management</h1>
                    <p className="text-white/90">Create, configure, and manage all clinic operations</p>
                  </div>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all font-semibold backdrop-blur-sm flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Register New Clinic
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {statstotal.map((item, index) => (
                  <StatCard
                    key={index}
                    icon={item.icon}
                    title={item.title}
                    value={item.value}
                    valueColor={item.valueColor}
                  />
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clinics.map((clinic) => (
                  <CardClinicInfo
                    key={clinic.id}
                    clinic={clinic}
                    allStaff={allStaff}
                    patients={patients}
                    allServices={allServices}
                    // prefer server-provided counts if available
                    staffCountProp={clinicCounts[clinic.id]?.staff}
                    patientCountProp={clinicCounts[clinic.id]?.patients}
                    servicesCountProp={clinicCounts[clinic.id]?.services}
                    onView={() => handleViewClinic(clinic)}
                    onDelete={() => { setClinicToDelete(clinic); setShowDeleteConfirm(true); }}
                  />
                ))}
              </div>
            </div>
          </main>
        </div>

        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">🏥 Register New Clinic</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleAddClinic} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Clinic Name *</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 outline-none" placeholder="Enter clinic name" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                    <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 outline-none" placeholder="Brief description of the clinic" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Address *</label>
                    <input type="text" required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 outline-none" placeholder="Street address" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">City *</label>
                    <input type="text" required value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">State/Province *</label>
                    <input type="text" required value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Zip Code</label>
                    <input type="text" value={formData.zipCode} onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Country *</label>
                    <input type="text" required value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Phone *</label>
                    <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 outline-none" placeholder="+216 XX XXX XXX" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email *</label>
                    <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 outline-none" placeholder="clinic@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Website</label>
                    <input type="url" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 outline-none" placeholder="www.clinic.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Opening Hours</label>
                    <input type="text" value={formData.openingHours} onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 outline-none" placeholder="9:00 AM - 6:00 PM" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Logo (Emoji)</label>
                    <input type="text" value={formData.logo} onChange={(e) => setFormData({ ...formData, logo: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 outline-none" placeholder="🏥" />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold">Cancel</button>
                  <button type="submit" className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold">Register Clinic</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Delete Clinic?</h2>
              <p className="text-slate-600 mb-6">Are you sure you want to delete <strong>{clinicToDelete?.name}</strong>? This action cannot be undone and will remove all associated data.</p>
              <div className="flex gap-3">
                <button onClick={() => { setShowDeleteConfirm(false); setClinicToDelete(null); }} className="flex-1 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold">Cancel</button>
                <button onClick={handleDeleteClinic} className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold">Delete Clinic</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
