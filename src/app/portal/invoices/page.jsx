'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { fetchPortalInvoices } from '@/lib/api';

export default function PatientInvoicesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [filter, setFilter] = useState('ALL'); // ALL, PENDING, PAID, CANCELLED
  const [dateRange, setDateRange] = useState('all'); // all, thisMonth, lastMonth, thisYear
  const [amountFilter, setAmountFilter] = useState('all'); // all, 0-100, 100-500, 500+
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      if (session?.user?.role !== 'PATIENT') {
        router.push('/dashboard');
      } else {
        loadInvoices();
      }
    }
  }, [status, session, router]);

  const loadInvoices = async () => {
    try {
      const data = await fetchPortalInvoices(session?.user?.patientId);
      setInvoices(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setLoading(false);
    }
  };

  const getFilteredInvoices = () => {
    return invoices.filter((invoice) => {
      // Status filter
      if (filter !== 'ALL' && invoice.status !== filter) return false;
      
      // Date range filter
      if (dateRange !== 'all') {
        const invoiceDate = new Date(invoice.createdAt);
        const now = new Date();
        
        if (dateRange === 'thisMonth') {
          if (invoiceDate.getMonth() !== now.getMonth() || invoiceDate.getFullYear() !== now.getFullYear()) {
            return false;
          }
        } else if (dateRange === 'lastMonth') {
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
          if (invoiceDate.getMonth() !== lastMonth.getMonth() || invoiceDate.getFullYear() !== lastMonth.getFullYear()) {
            return false;
          }
        } else if (dateRange === 'thisYear') {
          if (invoiceDate.getFullYear() !== now.getFullYear()) {
            return false;
          }
        }
      }
      
      // Amount filter
      if (amountFilter !== 'all') {
        const amount = invoice.totalAmount || invoice.amount || 0;
        if (amountFilter === '0-100' && (amount < 0 || amount > 100)) return false;
        if (amountFilter === '100-500' && (amount < 100 || amount > 500)) return false;
        if (amountFilter === '500+' && amount < 500) return false;
      }
      
      return true;
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'PAID':
        return 'bg-green-100 text-green-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handlePayInvoice = (invoice) => {
    // TODO: Implement Stripe payment integration
    alert(`Payment integration will be implemented soon.\n\nInvoice: ${invoice.invoiceNumber}\nAmount: $${invoice.amount}`);
  };

  const handleDownloadInvoice = (invoice) => {
    // TODO: Implement PDF download
    alert(`PDF download will be implemented soon.\n\nInvoice: ${invoice.invoiceNumber}`);
  };

  const openDetailModal = (invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailModal(true);
  };

  const getTotalAmount = (status) => {
    return invoices
      .filter((inv) => status === 'ALL' || inv.status === status)
      .reduce((sum, inv) => sum + inv.amount, 0);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const filteredInvoices = getFilteredInvoices();
  const pendingAmount = getTotalAmount('PENDING');
  const paidAmount = getTotalAmount('PAID');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                My Invoices
              </h1>
              <p className="text-gray-600">View and pay your medical invoices</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-2xl p-6 shadow-xl">
                <div className="text-sm font-medium mb-1 opacity-90">Pending Balance</div>
                <div className="text-3xl font-bold">${pendingAmount.toFixed(2)}</div>
                <div className="text-sm mt-2 opacity-90">
                  {invoices.filter((i) => i.status === 'PENDING').length} unpaid invoice(s)
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-teal-500 text-white rounded-2xl p-6 shadow-xl">
                <div className="text-sm font-medium mb-1 opacity-90">Total Paid</div>
                <div className="text-3xl font-bold">${paidAmount.toFixed(2)}</div>
                <div className="text-sm mt-2 opacity-90">
                  {invoices.filter((i) => i.status === 'PAID').length} paid invoice(s)
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-2xl p-6 shadow-xl">
                <div className="text-sm font-medium mb-1 opacity-90">Total Invoices</div>
                <div className="text-3xl font-bold">{invoices.length}</div>
                <div className="text-sm mt-2 opacity-90">All time</div>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-3 mb-4">
                {['ALL', 'PENDING', 'PAID', 'CANCELLED'].map((filterOption) => (
                  <button
                    key={filterOption}
                    onClick={() => setFilter(filterOption)}
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${
                      filter === filterOption
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                        : 'bg-white/70 backdrop-blur-xl text-gray-700 hover:shadow-lg'
                    }`}
                  >
                    {filterOption.charAt(0) + filterOption.slice(1).toLowerCase()}
                    {filterOption !== 'ALL' && (
                      <span className="ml-2 px-2 py-0.5 bg-white/30 rounded-full text-xs">
                        {invoices.filter((i) => i.status === filterOption).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Advanced Filters Toggle */}
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700"
              >
                <svg className={`w-4 h-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
              </button>

              {/* Advanced Filters */}
              {showAdvancedFilters && (
                <div className="mt-4 bg-white/70 backdrop-blur-xl rounded-xl p-4 border border-white/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Date Range Filter */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Date Range
                      </label>
                      <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none bg-white"
                      >
                        <option value="all">All Time</option>
                        <option value="thisMonth">This Month</option>
                        <option value="lastMonth">Last Month</option>
                        <option value="thisYear">This Year</option>
                      </select>
                    </div>

                    {/* Amount Filter */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Amount Range
                      </label>
                      <select
                        value={amountFilter}
                        onChange={(e) => setAmountFilter(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none bg-white"
                      >
                        <option value="all">All Amounts</option>
                        <option value="0-100">$0 - $100</option>
                        <option value="100-500">$100 - $500</option>
                        <option value="500+">$500+</option>
                      </select>
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {(dateRange !== 'all' || amountFilter !== 'all') && (
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => {
                          setDateRange('all');
                          setAmountFilter('all');
                        }}
                        className="text-sm text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Clear Advanced Filters
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Results Count */}
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold text-purple-600">{filteredInvoices.length}</span> of <span className="font-semibold">{invoices.length}</span> invoices
                </p>
              </div>
            </div>

            {/* Invoices List */}
            {filteredInvoices.length === 0 ? (
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-12 text-center">
                <div className="text-6xl mb-4">💳</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No Invoices Found</h3>
                <p className="text-gray-600">
                  {filter === 'ALL'
                    ? "You don't have any invoices yet."
                    : `You don't have any ${filter.toLowerCase()} invoices.`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInvoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      {/* Invoice Details */}
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="text-3xl">📄</div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-800">
                              Invoice #{invoice.invoiceNumber}
                            </h3>
                            <p className="text-sm text-gray-600">Issued: {formatDate(invoice.createdAt)}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm">
                          <div>
                            <span className="text-gray-500 font-medium">Amount:</span>
                            <span className="ml-2 text-gray-800 font-bold text-lg">${invoice.amount.toFixed(2)}</span>
                          </div>
                          {invoice.paymentDate && (
                            <div>
                              <span className="text-gray-500 font-medium">Paid on:</span>
                              <span className="ml-2 text-gray-800">{formatDate(invoice.paymentDate)}</span>
                            </div>
                          )}
                          {invoice.paymentMethod && (
                            <div>
                              <span className="text-gray-500 font-medium">Method:</span>
                              <span className="ml-2 text-gray-800">{invoice.paymentMethod}</span>
                            </div>
                          )}
                        </div>

                        <div className="mt-3">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                            {invoice.status}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-3 w-full md:w-auto">
                        <button
                          onClick={() => openDetailModal(invoice)}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all font-medium"
                        >
                          View Details
                        </button>

                        {invoice.status === 'PENDING' && (
                          <button
                            onClick={() => handlePayInvoice(invoice)}
                            className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                          >
                            💳 Pay Now
                          </button>
                        )}

                        {invoice.status === 'PAID' && (
                          <button
                            onClick={() => handleDownloadInvoice(invoice)}
                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                          >
                            📄 Download PDF
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Invoice Details</h2>
                  <p className="text-purple-100">#{selectedInvoice.invoiceNumber}</p>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-all"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600 font-medium">Invoice Number:</span>
                <span className="text-gray-800 font-bold">{selectedInvoice.invoiceNumber}</span>
              </div>

              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600 font-medium">Issue Date:</span>
                <span className="text-gray-800">{formatDate(selectedInvoice.createdAt)}</span>
              </div>

              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600 font-medium">Status:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedInvoice.status)}`}>
                  {selectedInvoice.status}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600 font-medium">Amount:</span>
                <span className="text-gray-800 font-bold text-xl">${selectedInvoice.amount.toFixed(2)}</span>
              </div>

              {selectedInvoice.paymentDate && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600 font-medium">Payment Date:</span>
                  <span className="text-gray-800">{formatDate(selectedInvoice.paymentDate)}</span>
                </div>
              )}

              {selectedInvoice.paymentMethod && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600 font-medium">Payment Method:</span>
                  <span className="text-gray-800">{selectedInvoice.paymentMethod}</span>
                </div>
              )}

              {selectedInvoice.patient && (
                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-bold text-gray-800 mb-2">Patient Information</h3>
                  <p className="text-gray-700">{selectedInvoice.patient.name}</p>
                  {selectedInvoice.patient.email && (
                    <p className="text-sm text-gray-600">{selectedInvoice.patient.email}</p>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 p-6 rounded-b-2xl flex justify-end gap-3">
              {selectedInvoice.status === 'PENDING' && (
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handlePayInvoice(selectedInvoice);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  💳 Pay Now
                </button>
              )}
              {selectedInvoice.status === 'PAID' && (
                <button
                  onClick={() => handleDownloadInvoice(selectedInvoice)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  📄 Download PDF
                </button>
              )}
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
