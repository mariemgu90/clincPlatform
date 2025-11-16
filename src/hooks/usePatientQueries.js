'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as patientApi from '@/lib/api/patientApi';
import { showToast } from '@/lib/toastUtils';
import { refetch, refetchConfig } from '@/lib/refetchUtils';

/**
 * Patient Query Hooks
 * Manages all patient-related queries and mutations
 */

// Query Keys
export const patientKeys = {
  all: ['patients'],
  lists: () => [...patientKeys.all, 'list'],
  list: (filters) => [...patientKeys.lists(), { filters }],
  details: () => [...patientKeys.all, 'detail'],
  detail: (id) => [...patientKeys.details(), id],
  byClinic: (clinicId) => [...patientKeys.all, 'byClinic', clinicId],
};

// GET Queries

/**
 * Fetch patients with optional filters
 */
export const usePatients = (filterOptions = {}, options = {}) => {
  return useQuery({
    queryKey: patientKeys.list(filterOptions),
    queryFn: () => patientApi.fetchPatients(filterOptions),
    ...options,
  });
};

/**
 * Fetch single patient by ID
 */
export const usePatient = (id, options = {}) => {
  return useQuery({
    queryKey: patientKeys.detail(id),
    queryFn: () => patientApi.fetchPatientById(id),
    enabled: !!id,
    ...options,
  });
};

/**
 * Fetch patients for a specific clinic
 */
export const usePatientsByClinic = (clinicId, options = {}) => {
  return useQuery({
    queryKey: patientKeys.byClinic(clinicId),
    queryFn: () => patientApi.fetchPatients({ clinicId }),
    enabled: !!clinicId,
    ...options,
  });
};

// POST/PUT/DELETE Mutations

/**
 * Create a new patient
 */
export const useCreatePatient = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => patientApi.createPatient(data),
    onSuccess: async (newPatient, variables) => {
      // Invalider les queries pour refetch automatiquement
      queryClient.invalidateQueries({
        queryKey: patientKeys.lists(),
      });
      if (variables?.clinicId) {
        queryClient.invalidateQueries({
          queryKey: patientKeys.byClinic(variables.clinicId),
        });
      }

      showToast.success(`✓ Patient "${newPatient.firstName} ${newPatient.lastName}" added successfully!`);

      // Executer le onSuccess local passé depuis le composant
      options?.onSuccess?.(newPatient);
    },
    onError: (error) => {
      showToast.error(error.message || 'Failed to create patient');

      // OnError local du composant
      options?.onError?.(error);
    },
  });
};

/**
 * Update an existing patient
 */
export const useUpdatePatient = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => patientApi.updatePatient(id, data),
    onSuccess: async (updatedPatient, variables) => {
      // Invalider les queries pour refetch automatiquement
      queryClient.invalidateQueries({
        queryKey: patientKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: patientKeys.detail(variables.id),
      });

      showToast.success('✓ Patient updated successfully!');

      // Executer le onSuccess local passé depuis le composant
      options?.onSuccess?.(updatedPatient);
    },
    onError: (error) => {
      showToast.error(error.message || 'Failed to update patient');

      // OnError local du composant
      options?.onError?.(error);
    },
  });
};

/**
 * Delete a patient
 */
export const useDeletePatient = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => patientApi.deletePatient(id),
    onSuccess: async (_, deletedId) => {
      // Invalider la query pour refetch automatiquement
      queryClient.invalidateQueries({
        queryKey: patientKeys.lists(),
      });
      queryClient.removeQueries({
        queryKey: patientKeys.detail(deletedId),
      });

      showToast.success('✓ Patient deleted successfully!');

      // Executer le onSuccess local passé depuis le composant
      options?.onSuccess?.();
    },
    onError: (error) => {
      showToast.error(error.message || 'Failed to delete patient');

      // OnError local du composant
      options?.onError?.(error);
    },
  });
};
