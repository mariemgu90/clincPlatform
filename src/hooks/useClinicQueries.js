'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as clinicApi from '@/lib/api/clinicApi';
import { showToast } from '@/lib/toastUtils';
import { refetch, refetchConfig } from '@/lib/refetchUtils';

/**
 * Clinic Query Hooks
 * Manages all clinic-related queries and mutations
 */

// Query Keys
export const clinicKeys = {
  all: ['clinics'],
  lists: () => [...clinicKeys.all, 'list'],
  list: (filters) => [...clinicKeys.lists(), { filters }],
  details: () => [...clinicKeys.all, 'detail'],
  detail: (id) => [...clinicKeys.details(), id],
  counts: () => [...clinicKeys.all, 'counts'],
  staff: () => [...clinicKeys.all, 'staff'],
  staffByClinic: (clinicId) => [...clinicKeys.staff(), clinicId],
  services: () => [...clinicKeys.all, 'services'],
  servicesByClinic: (clinicId) => [...clinicKeys.services(), clinicId],
  patients: () => [...clinicKeys.all, 'patients'],
  patientsByClinic: (clinicId) => [...clinicKeys.patients(), clinicId],
};

// GET Queries

/**
 * Fetch all clinics
 */
export const useClinics = (options = {}) => {
  return useQuery({
    queryKey: clinicKeys.list({}),
    queryFn: () => clinicApi.fetchClinics(),
    
    ...options,
  });
};

/**
 * Fetch single clinic by ID
 */
export const useClinic = (id, options = {}) => {
  return useQuery({
    queryKey: clinicKeys.detail(id),
    queryFn: () => clinicApi.fetchClinicById(id),
    enabled: !!id,
    ...options,
  });
};

/**
 * Fetch patients (optionally filtered by clinic)
 */
export const usePatients = (filterOptions = {}, options = {}) => {
  return useQuery({
    queryKey: clinicKeys.list({ ...filterOptions }),
    queryFn: () => clinicApi.fetchPatients(filterOptions),
    ...options,
  });
};

/**
 * Fetch all staff members
 */
export const useStaff = (filterOptions = {}, options = {}) => {
  return useQuery({
    queryKey: clinicKeys.staff(),
    queryFn: () => clinicApi.fetchAllStaff(),
    ...options,
  });
};

/**
 * Fetch staff members for a specific clinic
 */
export const useStaffByClinic = (clinicId, options = {}) => {
  return useQuery({
    queryKey: clinicKeys.staffByClinic(clinicId),
    queryFn: () => clinicApi.fetchStaffByClinic(clinicId),
    enabled: !!clinicId,
    ...options,
  });
};

/**
 * Fetch all services
 */
export const useServices = (options = {}) => {
  return useQuery({
    queryKey: clinicKeys.services(),
    queryFn: () => clinicApi.fetchServices(),
    ...options,
  });
};

/**
 * Fetch services for a specific clinic
 */
export const useServicesByClinic = (clinicId, options = {}) => {
  return useQuery({
    queryKey: clinicKeys.servicesByClinic(clinicId),
    queryFn: () => clinicApi.fetchServicesByClinic(clinicId),
    enabled: !!clinicId,
    ...options,
  });
};

/**
 * Fetch patients for a specific clinic
 */
export const usePatientsByClinic = (clinicId, options = {}) => {
  return useQuery({
    queryKey: clinicKeys.patientsByClinic(clinicId),
    queryFn: () => clinicApi.fetchPatientsByClinic(clinicId),
    enabled: !!clinicId,
    ...options,
  });
};

/**
 * Fetch integrations for a specific clinic
 */
export const useIntegrationsByClinic = (clinicId, options = {}) => {
  return useQuery({
    queryKey: [...clinicKeys.all, 'integrations', clinicId],
    queryFn: () => clinicApi.fetchIntegrationsByClinic(clinicId),
    enabled: !!clinicId,
    ...options,
  });
};

/**
 * Fetch counts for all clinics
 */
export const useClinicCounts = (clinicList = [], options = {}) => {
  return useQuery({
    queryKey: clinicKeys.counts(),
    queryFn: () => clinicApi.fetchCountsForClinics(clinicList),
    enabled: Array.isArray(clinicList) && clinicList.length > 0,
    ...options,
  });
};

// POST/PUT/DELETE Mutations

/**
 * Create a new clinic
 */
export const useCreateClinic = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => clinicApi.createClinic(data),
    onSuccess: async (newClinic) => {

      // 👉 Invalider la query pour refetch automatiquement
      queryClient.invalidateQueries({
        queryKey: clinicKeys.list({}),
      });

      showToast.success(`✓ Clinic "${newClinic.name}" created successfully!`);

      // Executer le onSuccess local passé depuis le composant
      options?.onSuccess?.(newClinic);
    },
    onError: (error) => {
      showToast.error(error.message || 'Failed to create clinic');

      // OnError local du composant
      options?.onError?.(error);
    },
  });
};


/**
 * Update an existing clinic
 */
export const useUpdateClinic = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => clinicApi.updateClinic(id, data),
    onSuccess: async (updatedClinic, variables) => {
      // Invalider les queries pour refetch automatiquement
      queryClient.invalidateQueries({
        queryKey: clinicKeys.list({}),
      });
      queryClient.invalidateQueries({
        queryKey: clinicKeys.detail(variables.id),
      });

      showToast.success(`✓ Clinic "${updatedClinic.name}" updated successfully!`);

      // Executer le onSuccess local passé depuis le composant
      options?.onSuccess?.(updatedClinic);
    },
    onError: (error) => {
      showToast.error(error.message || 'Failed to update clinic');

      // OnError local du composant
      options?.onError?.(error);
    },
  });
};

/**
 * Delete a clinic
 */
export const useDeleteClinic = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => clinicApi.deleteClinic(id),
    onSuccess: async (_, deletedId) => {
      // Invalider la query pour refetch automatiquement
      queryClient.invalidateQueries({
        queryKey: clinicKeys.list({}),
      });
      queryClient.removeQueries({
        queryKey: clinicKeys.detail(deletedId),
      });

      showToast.success('✓ Clinic deleted successfully!');

      // Executer le onSuccess local passé depuis le composant
      options?.onSuccess?.();
    },
    onError: (error) => {
      showToast.error(error.message || 'Failed to delete clinic');

      // OnError local du composant
      options?.onError?.(error);
    },
  });
};
