import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { AuditLogTable } from '../components/AuditLogTable';
import { AuditLogFilters } from '../components/AuditLogFilters';
import { auditLogService } from '../services';
import { AuditLogQueryRequest, AuditLogPagedResponse } from '../types';

export const AuditLogsPage = () => {
  const [auditData, setAuditData] = useState<AuditLogPagedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<AuditLogQueryRequest>({
    pageNumber: 1,
    pageSize: 20,
  });

  const fetchAuditLogs = async (filters: AuditLogQueryRequest) => {
    setLoading(true);
    setError(null);
    try {
      const data = await auditLogService.getAuditLogs(filters);
      setAuditData(data);
    } catch (err) {
      setError('Failed to load audit logs. Please try again.');
      console.error('Error fetching audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs(currentFilters);
  }, []);

  const handleFilter = (filters: AuditLogQueryRequest) => {
    const newFilters = {
      ...filters,
      pageNumber: 1,
      pageSize: currentFilters.pageSize,
    };
    setCurrentFilters(newFilters);
    fetchAuditLogs(newFilters);
  };

  const handlePageChange = (newPage: number) => {
    const newFilters = {
      ...currentFilters,
      pageNumber: newPage,
    };
    setCurrentFilters(newFilters);
    fetchAuditLogs(newFilters);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    const newFilters = {
      ...currentFilters,
      pageNumber: 1,
      pageSize: newPageSize,
    };
    setCurrentFilters(newFilters);
    fetchAuditLogs(newFilters);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
          <p className="mt-2 text-sm text-gray-600">
            View and track all system activities and changes
          </p>
        </div>

        <AuditLogFilters onFilter={handleFilter} loading={loading} />

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {auditData && (
          <div className="mb-6 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {((currentFilters.pageNumber || 1) - 1) * (currentFilters.pageSize || 20) + 1} to{' '}
              {Math.min(
                (currentFilters.pageNumber || 1) * (currentFilters.pageSize || 20),
                auditData.totalCount
              )}{' '}
              of {auditData.totalCount} logs
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="pageSize" className="text-sm text-gray-600">
                Per page:
              </label>
              <select
                id="pageSize"
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={currentFilters.pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                disabled={loading}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        )}

        <AuditLogTable logs={auditData?.logs || []} loading={loading} />

        {auditData && auditData.totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => handlePageChange((currentFilters.pageNumber || 1) - 1)}
                disabled={currentFilters.pageNumber === 1 || loading}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {Array.from({ length: Math.min(5, auditData.totalPages) }, (_, i) => {
                let pageNum;
                if (auditData.totalPages <= 5) {
                  pageNum = i + 1;
                } else if ((currentFilters.pageNumber || 1) <= 3) {
                  pageNum = i + 1;
                } else if ((currentFilters.pageNumber || 1) >= auditData.totalPages - 2) {
                  pageNum = auditData.totalPages - 4 + i;
                } else {
                  pageNum = (currentFilters.pageNumber || 1) - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    disabled={loading}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentFilters.pageNumber === pageNum
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange((currentFilters.pageNumber || 1) + 1)}
                disabled={currentFilters.pageNumber === auditData.totalPages || loading}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </nav>
          </div>
        )}
      </div>
    </Layout>
  );
};
