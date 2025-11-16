'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import RoleGuard from '@/components/RoleGuard';
import UserFilters from '@/components/UserFilters';
import { fetchRoles, fetchUsers } from '@/lib/api';
import { useSession } from 'next-auth/react';
import StaffCard from '@/components/StaffCard';
import StaffDetails from '@/components/StaffDetails';

export default function UsersManagement() {
  const { data: session } = useSession();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [roles, setRoles] = useState([]);


  useEffect(() => {
    loadUsers();
    fetchRolesData();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
       setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      loadUsers();
    }
  }, [session]);


  const fetchRolesData = async () => {
    const data = await fetchRoles();
    setRoles(data);
  };
  const filteredUsers = users.filter(member => {
    const matchesSearch = member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'ALL' || 
                        member.role?.toLowerCase() === filterRole.toLowerCase();

    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
      </div>
    );
  }
  const handleViewDetails = (user) => {
    setSelectedStaff(user);
    setShowDetailsModal(true);
  };

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 mb-6 shadow-lg shadow-emerald-500/30">
        <h1 className="text-3xl font-bold text-white mb-2">
          User Management
        </h1>
        <p className="text-white/90">
          Manage all system users, patients, doctors, and staff
        </p>
      </div>

      {/* Filters */}
      <UserFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterRole={filterRole}
        setFilterRole={setFilterRole}
        usersCount={users.length}
        filteredCount={filteredUsers.length}
        listOptions={roles}
      />

      {/* Users List */}
      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-1 gap-4">
          {filteredUsers.map((user, index) => (
            <StaffCard
              key={user.id}
              member={user}
              onViewDetails={handleViewDetails}
              index={index}
            />

          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-slate-200">
          <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">No Users Found</h3>
          <p className="text-slate-500">
            Try adjusting your search criteria
          </p>
        </div>
      )}
      {showDetailsModal && selectedStaff && (
        <StaffDetails
          staff={selectedStaff}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

    </RoleGuard>
  );
}
