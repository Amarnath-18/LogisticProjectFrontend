import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Report, ReportType } from '../types';
import { reportService } from '../services/report.service';
import { Download, FileText } from 'lucide-react';

export const ReportsPage = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState({
    reportType: 'Weekly' as ReportType,
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const data = await reportService.getAllReports();
      setReports(data);
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);

    try {
      await reportService.generateReport(formData);
      loadReports();
      setFormData({
        reportType: 'Weekly',
        startDate: '',
        endDate: '',
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.title || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to generate report';
      toast.error(errorMessage);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async (reportId: string, reportType: string) => {
    try {
      const blob = await reportService.downloadReport(reportId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}_Report_${new Date().toISOString()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast.error('Failed to download report');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-2">Generate and download shipment reports</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card title="Generate Report">
              <form onSubmit={handleGenerateReport} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Report Type
                  </label>
                  <select
                    value={formData.reportType}
                    onChange={(e) =>
                      setFormData({ ...formData, reportType: e.target.value as ReportType })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>

                <Input
                  label="Start Date"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />

                <Input
                  label="End Date"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />

                <Button type="submit" className="w-full" disabled={generating}>
                  {generating ? 'Generating...' : 'Generate Report'}
                </Button>
              </form>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card title="Generated Reports">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {report.reportType} Report
                          </h4>
                          <p className="text-sm text-gray-600">
                            {new Date(report.startDate).toLocaleDateString()} -{' '}
                            {new Date(report.endDate).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            Generated on {new Date(report.generatedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleDownload(report.id, report.reportType)}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  ))}
                  {reports.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No reports generated yet
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};
