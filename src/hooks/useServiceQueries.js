'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as serviceApi from '@/lib/api/serviceApi';
import { showToast } from '@/lib/toastUtils';
import { clinicKeys } from './useClinicQueries';

/**
 * Service Query Hooks
 * Manages all service-related queries and mutations
 */

// Query Keys
export const serviceKeys = {
  all: ['services'],
  lists: () => [...serviceKeys.all, 'list'],
  list: (filters) => [...serviceKeys.lists(), { filters }],
  details: () => [...serviceKeys.all, 'detail'],
  detail: (id) => [...serviceKeys.details(), id],
  byClinic: (clinicId) => [...serviceKeys.all, 'byClinic', clinicId],
};

// GET Queries

/**
 * Fetch all services with optional filters
 */
export const useServices = (filterOptions = {}, options = {}) => {
  return useQuery({
    queryKey: serviceKeys.list(filterOptions),
    queryFn: () => serviceApi.fetchServices(filterOptions),
    ...options,
  });
};

/**
 * Fetch single service by ID
 */
export const useService = (id, options = {}) => {
  return useQuery({
    queryKey: serviceKeys.detail(id),
    queryFn: () => serviceApi.fetchServiceById(id),
    enabled: !!id,
    ...options,
  });
};

/**
 * Fetch services for a specific clinic
 */
export const useServicesByClinic = (clinicId, options = {}) => {
  return useQuery({
    queryKey: serviceKeys.byClinic(clinicId),
    queryFn: () => serviceApi.fetchServices({ clinicId }),
    enabled: !!clinicId,
    ...options,
  });
};

// POST/PUT/DELETE Mutations

/**
 * Create a new service
 */
export const useCreateService = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => serviceApi.createService(data),
    onSuccess: async (newService, variables) => {
      // Invalider les queries pour refetch automatiquement
      queryClient.invalidateQueries({
        queryKey: serviceKeys.lists(),
      });
      if (variables?.clinicId) {
        queryClient.invalidateQueries({
          queryKey: serviceKeys.byClinic(variables.clinicId),
        });
        queryClient.invalidateQueries({
          queryKey: clinicKeys.all,
        });
      }

      showToast.success(`✓ Service "${newService.name}" created successfully!`);

      // Executer le onSuccess local passé depuis le composant
      options?.onSuccess?.(newService);
    },
    onError: (error) => {
      showToast.error(error.message || 'Failed to create service');

      // OnError local du composant
      options?.onError?.(error);
    },
  });
};

/**
 * Update an existing service
 */
export const useUpdateService = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => serviceApi.updateService(id, data),
    onSuccess: async (updatedService, variables) => {
      // Invalider les queries pour refetch automatiquement
      queryClient.invalidateQueries({
        queryKey: serviceKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: serviceKeys.detail(variables.id),
      });

      showToast.success(`✓ Service "${updatedService.name}" updated successfully!`);

      // Executer le onSuccess local passé depuis le composant
      options?.onSuccess?.(updatedService);
    },
    onError: (error) => {
      showToast.error(error.message || 'Failed to update service');

      // OnError local du composant
      options?.onError?.(error);
    },
  });
};

/**
 * Delete a service
 */
export const useDeleteService = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => serviceApi.deleteService(id),
    onSuccess: async (_, deletedId) => {
      // Invalider les queries pour refetch automatiquement
      queryClient.invalidateQueries({
        queryKey: serviceKeys.lists(),
      });
      queryClient.removeQueries({
        queryKey: serviceKeys.detail(deletedId),
      });

      showToast.success('✓ Service deleted successfully!');

      // Executer le onSuccess local passé depuis le composant
      options?.onSuccess?.();
    },
    onError: (error) => {
      showToast.error(error.message || 'Failed to delete service');

      // OnError local du composant
      options?.onError?.(error);
    },
  });
};

/**
 * Link service to clinic
 */
export const useLinkServiceToClinic = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ serviceId, clinicId }) => 
      serviceApi.linkServiceToClinic(serviceId, clinicId),
    onSuccess: async (updatedService, variables) => {
      // Invalider les queries pour refetch automatiquement
      queryClient.invalidateQueries({
        queryKey: serviceKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: serviceKeys.byClinic(variables.clinicId),
      });
      queryClient.invalidateQueries({
        queryKey: clinicKeys.all,
      });

      showToast.success('✓ Service linked to clinic successfully!');

      // Executer le onSuccess local passé depuis le composant
      options?.onSuccess?.(updatedService);
    },
    onError: (error) => {
      showToast.error(error.message || 'Failed to link service to clinic');

      // OnError local du composant
      options?.onError?.(error);
    },
  });
};

/**
 * Unlink service from clinic
 */
export const useUnlinkServiceFromClinic = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (serviceId) => serviceApi.unlinkServiceFromClinic(serviceId),
    onSuccess: async (updatedService, serviceId) => {
      // Invalider les queries pour refetch automatiquement
      queryClient.invalidateQueries({
        queryKey: serviceKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: clinicKeys.all,
      });

      showToast.success('✓ Service unlinked from clinic successfully!');

      // Executer le onSuccess local passé depuis le composant
      options?.onSuccess?.(updatedService);
    },
    onError: (error) => {
      showToast.error(error.message || 'Failed to unlink service from clinic');

      // OnError local du composant
      options?.onError?.(error);
    },
  });
};
