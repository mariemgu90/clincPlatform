'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { fetchInvoices } from '@/lib/api';

export default function BillingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    overdue: 0
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const invoiceList = await fetchInvoices();
      setInvoices(invoiceList);
      
      // Calculate stats
      const total = invoiceList.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
      const paid = invoiceList
        .filter(inv => inv.status === 'PAID')
        .reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
      const pending = invoiceList
        .filter(inv => inv.status === 'PENDING')
        .reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
      const overdue = invoiceList
        .filter(inv => inv.status === 'OVERDUE')
        .reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
      
      setStats({ total, paid, pending, overdue });
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.patient?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.patient?.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'PENDING':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'OVERDUE':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'CANCELLED':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto bg-gradient-to-br from-slate-50 to-slate-100">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-8 mb-6 shadow-xl shadow-emerald-500/20 animate-slideUp">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Billing & Invoices</h1>
                <p className="text-white/90">Manage invoices and payments</p>
              </div>
              <button 
                onClick={() => {
                  setSelectedInvoice(null);
                  setShowModal(true);
                }}
                className="px-6 py-3 bg-white text-emerald-600 rounded-xl hover:scale-105 transition-transform font-semibold shadow-lg flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Invoice
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 animate-slideUp hover:shadow-xl hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{formatCurrency(stats.total)}</h3>
              <p className="text-sm text-slate-600 mt-1">Total Revenue</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 animate-slideUp hover:shadow-xl hover:scale-105 transition-all" style={{animationDelay: '0.1s'}}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{formatCurrency(stats.paid)}</h3>
              <p className="text-sm text-slate-600 mt-1">Paid</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 animate-slideUp hover:shadow-xl hover:scale-105 transition-all" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{formatCurrency(stats.pending)}</h3>
              <p className="text-sm text-slate-600 mt-1">Pending</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 animate-slideUp hover:shadow-xl hover:scale-105 transition-all" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg shadow-red-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{formatCurrency(stats.overdue)}</h3>
              <p className="text-sm text-gray-600 mt-1">Overdue</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-slideUp border border-slate-200" style={{animationDelay: '0.4s'}}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Search Invoices
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by invoice number or patient name..."
                    className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all outline-none"
                  />
                  <svg className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Filter by Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all outline-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="PAID">Paid</option>
                  <option value="PENDING">Pending</option>
                  <option value="OVERDUE">Overdue</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-slate-600">
                Showing <span className="font-semibold text-emerald-600">{filteredInvoices.length}</span> of <span className="font-semibold">{invoices.length}</span> invoices
              </p>
            </div>
          </div>

          {/* Invoices Table */}
          {filteredInvoices.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center animate-fadeIn border border-slate-200">
              <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No Invoices Found</h3>
              <p className="text-slate-500 mb-4">
                {searchTerm ? 'Try adjusting your search criteria' : 'Create your first invoice to get started'}
              </p>
              <button 
                onClick={() => {
                  setSelectedInvoice(null);
                  setShowModal(true);
                }}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
              >
                Create Invoice
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-slideUp border border-slate-200" style={{animationDelay: '0.5s'}}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Invoice #
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {filteredInvoices.map((invoice, index) => (
                      <tr 
                        key={invoice.id}
                        className="hover:bg-slate-50 transition-all cursor-pointer"
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setShowModal(true);
                        }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-mono text-sm font-semibold text-emerald-600">
                            {invoice.invoiceNumber || `INV-${invoice.id.slice(0, 8)}`}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold mr-3 shadow-md shadow-emerald-500/30">
                              {invoice.patient?.firstName?.[0]}{invoice.patient?.lastName?.[0]}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-slate-900">
                                {invoice.patient 
                                  ? `${invoice.patient.firstName} ${invoice.patient.lastName}`
                                  : 'Unknown Patient'
                                }
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {formatDate(invoice.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-slate-900">
                            {formatCurrency(invoice.totalAmount)}
                          </div>
                          {invoice.paidAmount > 0 && invoice.status !== 'PAID' && (
                            <div className="text-xs text-slate-500">
                              Paid: {formatCurrency(invoice.paidAmount)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button 
                              className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg font-medium hover:bg-emerald-200 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedInvoice(invoice);
                                setShowModal(true);
                              }}
                            >
                              View
                            </button>
                            {invoice.status !== 'PAID' && (
                              <button 
                                className="px-3 py-1.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-teal-500/30 transition-all"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Handle payment
                                }}
                              >
                                Pay
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Invoice Detail Modal */}
          {showModal && (
            <div 
              className="fixed inset-0 bg-slate-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowModal(false)}
            >
              <div 
                className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-auto animate-scaleIn border border-slate-200"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-teal-500 p-6 flex items-center justify-between rounded-t-2xl">
                  <h2 className="text-2xl font-bold text-white">
                    {selectedInvoice ? 'Invoice Details' : 'Create Invoice'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {selectedInvoice ? (
                  <div className="p-6 space-y-6">
                    {/* Invoice Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800">
                          {selectedInvoice.invoiceNumber || `INV-${selectedInvoice.id.slice(0, 8)}`}
                        </h3>
                        <p className="text-slate-600 mt-1">
                          Issued: {formatDate(selectedInvoice.createdAt)}
                        </p>
                        {selectedInvoice.dueDate && (
                          <p className="text-slate-600">
                            Due: {formatDate(selectedInvoice.dueDate)}
                          </p>
                        )}
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(selectedInvoice.status)}`}>
                        {selectedInvoice.status}
                      </span>
                    </div>

                    {/* Patient Info */}
                    <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                      <p className="text-sm font-semibold text-slate-600 mb-2">Bill To:</p>
                      <p className="text-lg font-semibold text-slate-800">
                        {selectedInvoice.patient 
                          ? `${selectedInvoice.patient.firstName} ${selectedInvoice.patient.lastName}`
                          : 'Unknown Patient'
                        }
                      </p>
                      {selectedInvoice.patient?.email && (
                        <p className="text-sm text-slate-600">{selectedInvoice.patient.email}</p>
                      )}
                      {selectedInvoice.patient?.phone && (
                        <p className="text-sm text-slate-600">{selectedInvoice.patient.phone}</p>
                      )}
                    </div>

                    {/* Items */}
                    {selectedInvoice.items && (
                      <div>
                        <h4 className="text-lg font-semibold text-slate-800 mb-3">Items</h4>
                        <div className="border-2 border-slate-200 rounded-xl overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Description</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-600">Quantity</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-600">Price</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-600">Total</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                              {Array.isArray(selectedInvoice.items) ? (
                                selectedInvoice.items.map((item, idx) => (
                                  <tr key={idx}>
                                    <td className="px-4 py-3 text-sm text-slate-800">{item.description}</td>
                                    <td className="px-4 py-3 text-sm text-slate-800 text-right">{item.quantity}</td>
                                    <td className="px-4 py-3 text-sm text-slate-800 text-right">{formatCurrency(item.price)}</td>
                                    <td className="px-4 py-3 text-sm font-semibold text-slate-800 text-right">{formatCurrency(item.quantity * item.price)}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="4" className="px-4 py-3 text-sm text-slate-500 text-center">No items</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Totals */}
                    <div className="border-t-2 border-slate-200 pt-4">
                      <div className="flex justify-end">
                        <div className="w-64 space-y-2">
                          <div className="flex justify-between text-slate-700">
                            <span>Subtotal:</span>
                            <span className="font-semibold">{formatCurrency(selectedInvoice.totalAmount)}</span>
                          </div>
                          {selectedInvoice.paidAmount > 0 && (
                            <div className="flex justify-between text-emerald-600">
                              <span>Paid:</span>
                              <span className="font-semibold">-{formatCurrency(selectedInvoice.paidAmount)}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-lg font-bold text-slate-800 pt-2 border-t-2 border-slate-200">
                            <span>Balance Due:</span>
                            <span>{formatCurrency(selectedInvoice.totalAmount - (selectedInvoice.paidAmount || 0))}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    {selectedInvoice.notes && (
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                        <p className="text-sm font-semibold text-amber-800 mb-1">Notes</p>
                        <p className="text-slate-700">{selectedInvoice.notes}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                      {selectedInvoice.status !== 'PAID' && (
                        <button className="flex-1 py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all font-semibold">
                          Record Payment
                        </button>
                      )}
                      <button className="flex-1 py-3 px-6 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl hover:shadow-lg hover:shadow-teal-500/30 transition-all font-semibold">
                        Download PDF
                      </button>
                      <button className="px-6 py-3 bg-slate-500 hover:bg-slate-600 text-white rounded-xl transition-all font-semibold">
                        Send Email
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-slate-500 py-8">
                    <p>Invoice creation form will be implemented here</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
