/**
 * Query Refetch Utilities
 * Centralized refetch logic for mutations
 * 
 * Use this to specify which queries should be refetched after a mutation
 */

import { queryClient } from '@/lib/queryClient';

/**
 * Define which queries to refetch for different operations
 */
export const refetchConfig = {
  // Clinic operations
  clinic: {
    onCreate: () => [
      { queryKey: ['clinics', 'list'] },
      { queryKey: ['clinics', 'counts'] },
    ],
    onUpdate: (clinicId) => [
      { queryKey: ['clinics', 'list'] },
      { queryKey: ['clinics', 'detail', clinicId] },
      { queryKey: ['clinics', 'counts'] },
    ],
    onDelete: () => [
      { queryKey: ['clinics', 'list'] },
      { queryKey: ['clinics', 'counts'] },
    ],
  },

  // Patient operations
  patient: {
    onCreate: (clinicId) => [
      { queryKey: ['patients', 'list'] },
      clinicId && { queryKey: ['patients', 'byClinic', clinicId] },
    ].filter(Boolean),
    onUpdate: () => [
      { queryKey: ['patients', 'list'] },
    ],
    onDelete: () => [
      { queryKey: ['patients', 'list'] },
    ],
  },

  // Staff operations
  staff: {
    onCreate: (clinicId) => [
      { queryKey: ['staff', 'list'] },
      clinicId && { queryKey: ['staff', 'byClinic', clinicId] },
    ].filter(Boolean),
    onUpdate: () => [
      { queryKey: ['staff', 'list'] },
    ],
    onDelete: () => [
      { queryKey: ['staff', 'list'] },
    ],
    onLink: (clinicId) => [
      { queryKey: ['staff', 'list'] },
      { queryKey: ['staff', 'byClinic', clinicId] },
      { queryKey: ['clinics', 'counts'] },
    ],
    onUnlink: () => [
      { queryKey: ['staff', 'list'] },
    ],
  },

  // Service operations
  service: {
    onCreate: (clinicId) => [
      { queryKey: ['services', 'list'] },
      clinicId && { queryKey: ['services', 'byClinic', clinicId] },
    ].filter(Boolean),
    onUpdate: () => [
      { queryKey: ['services', 'list'] },
    ],
    onDelete: () => [
      { queryKey: ['services', 'list'] },
    ],
    onLink: (clinicId) => [
      { queryKey: ['services', 'list'] },
      { queryKey: ['services', 'byClinic', clinicId] },
      { queryKey: ['clinics', 'counts'] },
    ],
    onUnlink: () => [
      { queryKey: ['services', 'list'] },
    ],
  },
};

/**
 * Refetch utility - invalidates specified queries
 * @param {Array} queries - Array of query objects with queryKey
 * @example
 * refetch(refetchConfig.clinic.onCreate())
 */
export const refetch = async (queries = []) => {
  for (const query of queries) {
    if (query?.queryKey) {
      await queryClient.invalidateQueries({ queryKey: query.queryKey });
    }
  }
};

/**
 * Refetch all related queries - comprehensive refetch
 * @example
 * refetchAll()
 */
export const refetchAll = async () => {
  await queryClient.invalidateQueries({ queryKey: ['clinics'] });
  await queryClient.invalidateQueries({ queryKey: ['patients'] });
  await queryClient.invalidateQueries({ queryKey: ['staff'] });
  await queryClient.invalidateQueries({ queryKey: ['services'] });
};

/**
 * Refetch specific resource type
 * @param {string} resource - 'clinics', 'patients', 'staff', or 'services'
 * @example
 * refetchResource('clinics')
 */
export const refetchResource = async (resource) => {
  await queryClient.invalidateQueries({ queryKey: [resource] });
};

/**
 * Batch refetch multiple resources
 * @param {Array<string>} resources - Array of resource names
 * @example
 * refetchBatch(['clinics', 'patients', 'staff'])
 */
export const refetchBatch = async (resources = []) => {
  for (const resource of resources) {
    await queryClient.invalidateQueries({ queryKey: [resource] });
  }
};

/**
 * Advanced refetch for complex scenarios
 * @param {Object} options - Refetch options
 * @example
 * refetchAdvanced({
 *   resources: ['clinics', 'staff'],
 *   clinicId: '123',
 *   pattern: 'list'
 * })
 */
export const refetchAdvanced = async (options = {}) => {
  const { resources = [], clinicId = null, pattern = null } = options;

  if (resources.length === 0) {
    // If no resources specified, refetch all
    await refetchAll();
    return;
  }

  for (const resource of resources) {
    if (pattern) {
      // Pattern-based refetch (e.g., 'list', 'detail', 'byClinic')
      await queryClient.invalidateQueries({
        queryKey: [resource, pattern],
      });
    } else if (clinicId) {
      // Resource + clinicId refetch
      await queryClient.invalidateQueries({
        queryKey: [resource, 'byClinic', clinicId],
      });
      // Also refetch the main resource
      await queryClient.invalidateQueries({
        queryKey: [resource],
      });
    } else {
      // Simple resource refetch
      await queryClient.invalidateQueries({
        queryKey: [resource],
      });
    }
  }
};
