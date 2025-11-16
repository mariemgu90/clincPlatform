'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as staffApi from '@/lib/api/staffApi';
import { showToast } from '@/lib/toastUtils';
import { clinicKeys } from './useClinicQueries';

/**
 * Staff Query Hooks
 * Manages all staff-related queries and mutations
 */

// Query Keys
export const staffKeys = {
  all: ['staff'],
  lists: () => [...staffKeys.all, 'list'],
  list: (filters) => [...staffKeys.lists(), { filters }],
  details: () => [...staffKeys.all, 'detail'],
  detail: (id) => [...staffKeys.details(), id],
  byClinic: (clinicId) => [...staffKeys.all, 'byClinic', clinicId],
  schedules: () => [...staffKeys.all, 'schedules'],
  schedule: (doctorId, date) => [...staffKeys.schedules(), doctorId, date],
};

// GET Queries

/**
 * Fetch all staff members with optional filters
 */
export const useStaff = (filterOptions = {}, options = {}) => {
  return useQuery({
    queryKey: staffKeys.list(filterOptions),
    queryFn: () => staffApi.fetchStaff(filterOptions),
    ...options,
  });
};

/**
 * Fetch single staff member by ID
 */
export const useStaffMember = (id, options = {}) => {
  return useQuery({
    queryKey: staffKeys.detail(id),
    queryFn: () => staffApi.fetchStaffById(id),
    enabled: !!id,
    ...options,
  });
};

/**
 * Fetch staff members for a specific clinic
 */
export const useStaffByClinic = (clinicId, options = {}) => {
  return useQuery({
    queryKey: staffKeys.byClinic(clinicId),
    queryFn: () => staffApi.fetchStaff({ clinicId }),
    enabled: !!clinicId,
    ...options,
  });
};

/**
 * Fetch doctor schedule
 */
export const useDoctorSchedule = (doctorId, date, options = {}) => {
  return useQuery({
    queryKey: staffKeys.schedule(doctorId, date),
    queryFn: () => staffApi.fetchDoctorSchedule(doctorId, date),
    enabled: !!doctorId && !!date,
    ...options,
  });
};

// POST/PUT/DELETE Mutations

/**
 * Create a new staff member
 */
export const useCreateStaff = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => staffApi.createStaff(data),
    onSuccess: async (newStaff, variables) => {
      // Invalider les queries pour refetch automatiquement
      queryClient.invalidateQueries({
        queryKey: staffKeys.lists(),
      });
      if (variables?.clinicId) {
        queryClient.invalidateQueries({
          queryKey: staffKeys.byClinic(variables.clinicId),
        });
        queryClient.invalidateQueries({
          queryKey: clinicKeys.all,
        });
      }

      showToast.success(`✓ Staff member "${newStaff.name}" added successfully!`);

      // Executer le onSuccess local passé depuis le composant
      options?.onSuccess?.(newStaff);
    },
    onError: (error) => {
      showToast.error(error.message || 'Failed to create staff member');

      // OnError local du composant
      options?.onError?.(error);
    },
  });
};

/**
 * Update an existing staff member
 */
export const useUpdateStaff = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => staffApi.updateStaff(id, data),
    onSuccess: async (updatedStaff, variables) => {
      // Invalider les queries pour refetch automatiquement
      queryClient.invalidateQueries({
        queryKey: staffKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: staffKeys.detail(variables.id),
      });

      showToast.success(`✓ Staff member "${updatedStaff.name}" updated successfully!`);

      // Executer le onSuccess local passé depuis le composant
      options?.onSuccess?.(updatedStaff);
    },
    onError: (error) => {
      showToast.error(error.message || 'Failed to update staff member');

      // OnError local du composant
      options?.onError?.(error);
    },
  });
};

/**
 * Delete a staff member
 */
export const useDeleteStaff = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => staffApi.deleteStaff(id),
    onSuccess: async (_, deletedId) => {
      // Invalider les queries pour refetch automatiquement
      queryClient.invalidateQueries({
        queryKey: staffKeys.lists(),
      });
      queryClient.removeQueries({
        queryKey: staffKeys.detail(deletedId),
      });

      showToast.success('✓ Staff member deleted successfully!');

      // Executer le onSuccess local passé depuis le composant
      options?.onSuccess?.();
    },
    onError: (error) => {
      showToast.error(error.message || 'Failed to delete staff member');

      // OnError local du composant
      options?.onError?.(error);
    },
  });
};

/**
 * Assign role to staff member
 */
export const useAssignStaffRole = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, role }) => staffApi.assignStaffRole(id, role),
    onSuccess: async (updatedStaff, variables) => {
      // Invalider les queries pour refetch automatiquement
      queryClient.invalidateQueries({
        queryKey: staffKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: staffKeys.detail(variables.id),
      });

      showToast.success(`✓ Role "${variables.role}" assigned successfully!`);

      // Executer le onSuccess local passé depuis le composant
      options?.onSuccess?.(updatedStaff);
    },
    onError: (error) => {
      showToast.error(error.message || 'Failed to assign role');

      // OnError local du composant
      options?.onError?.(error);
    },
  });
};

/**
 * Link staff member to clinic
 */
export const useLinkStaffToClinic = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ staffId, clinicId }) => staffApi.linkStaffToClinic(staffId, clinicId),
    onSuccess: async (updatedStaff, variables) => {
      // Invalider les queries pour refetch automatiquement
      queryClient.invalidateQueries({
        queryKey: staffKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: staffKeys.byClinic(variables.clinicId),
      });
      queryClient.invalidateQueries({
        queryKey: clinicKeys.all,
      });

      showToast.success(`✓ Staff member linked to clinic successfully!`);

      // Executer le onSuccess local passé depuis le composant
      options?.onSuccess?.(updatedStaff);
    },
    onError: (error) => {
      showToast.error(error.message || 'Failed to link staff to clinic');

      // OnError local du composant
      options?.onError?.(error);
    },
  });
};

/**
 * Unlink staff member from clinic
 */
export const useUnlinkStaffFromClinic = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (staffId) => staffApi.unlinkStaffFromClinic(staffId),
    onSuccess: async (updatedStaff, staffId) => {
      // Invalider les queries pour refetch automatiquement
      queryClient.invalidateQueries({
        queryKey: staffKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: clinicKeys.all,
      });

      showToast.success('✓ Staff member unlinked from clinic successfully!');

      // Executer le onSuccess local passé depuis le composant
      options?.onSuccess?.(updatedStaff);
    },
    onError: (error) => {
      showToast.error(error.message || 'Failed to unlink staff from clinic');

      // OnError local du composant
      options?.onError?.(error);
    },
  });
};
