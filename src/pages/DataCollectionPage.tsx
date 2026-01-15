import { useState } from 'react';
import axios from 'axios';
import { 
  Upload, 
  Database, 
  Globe, 
  FileSpreadsheet, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Loader2,
  BarChart3,
  FileText,
  Search
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Table from '@/components/ui/Table';

interface DataSource {
  id: string;
  name: string;
  type: 'csv' | 'excel' | 'api' | 'web-scrape' | 'database';
  status: 'active' | 'pending' | 'failed';
  lastUpdated: string;
  recordCount: number;
  category: string;
}

interface ImportJob {
  id: string;
  source: string;
  status: 'processing' | 'completed' | 'failed';
  progress: number;
  startedAt: string;
  recordsProcessed: number;
}

interface ImportedFile {
  id: string;
  fileName: string;
  uploadedAt: string;
  fileSize: string;
  status: 'imported' | 'importing' | 'failed';
  analysed: boolean;
  recordCount: number;
  category: string;
}

interface AnalysisResult {
  category: string;
  insights: string[];
  dataPoints: number;
  recommendations: string[];
}

interface ScrapeResult {
  url: string;
  pdf_file: string;
  method: string;
  content_length: number;
  document_id: string;
}

interface ScrapeResponse {
  results: ScrapeResult[];
}

type ToastType = 'success' | 'error' | null;

export default function DataCollectionPage() {
  const { currentProject } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'import' | 'scrape' | 'analysis'>('import');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isScrapeModalOpen, setIsScrapeModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [scrapeUrl, setScrapeUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>(null);
  const [scrapedFiles, setScrapedFiles] = useState<ScrapeResult[]>([]);
  const [importJobs] = useState<ImportJob[]>([
    {
      id: '1',
      source: 'Rwanda_Education_Statistics_2025.xlsx',
      status: 'completed',
      progress: 100,
      startedAt: '2025-01-07 09:30',
      recordsProcessed: 15420
    },
    {
      id: '2',
      source: 'Health_Sector_Data.csv',
      status: 'processing',
      progress: 67,
      startedAt: '2025-01-07 10:15',
      recordsProcessed: 8934
    }
  ]);

  const [importedFiles] = useState<ImportedFile[]>([
    {
      id: '1',
      fileName: 'Rwanda_Education_Statistics_2025.xlsx',
      uploadedAt: '2025-01-07 09:30',
      fileSize: '2.4 MB',
      status: 'imported',
      analysed: true,
      recordCount: 15420,
      category: 'Education'
    },
    {
      id: '2',
      fileName: 'Health_Sector_Data.csv',
      uploadedAt: '2025-01-07 10:15',
      fileSize: '1.8 MB',
      status: 'imported',
      analysed: true,
      recordCount: 8934,
      category: 'Healthcare'
    },
    {
      id: '3',
      fileName: 'Economic_Indicators_2024.xlsx',
      uploadedAt: '2025-01-06 14:22',
      fileSize: '3.2 MB',
      status: 'imported',
      analysed: false,
      recordCount: 12560,
      category: 'Economic'
    },
    {
      id: '4',
      fileName: 'Population_Census_Data.csv',
      uploadedAt: '2025-01-05 11:45',
      fileSize: '5.1 MB',
      status: 'imported',
      analysed: true,
      recordCount: 25340,
      category: 'Demographics'
    },
    {
      id: '5',
      fileName: 'Infrastructure_Projects.xlsx',
      uploadedAt: '2025-01-05 09:20',
      fileSize: '1.5 MB',
      status: 'importing',
      analysed: false,
      recordCount: 4230,
      category: 'Infrastructure'
    }
  ]);

  const [dataSources] = useState<DataSource[]>([
    {
      id: '1',
      name: 'Rwanda National Statistics',
      type: 'api',
      status: 'active',
      lastUpdated: '2 hours ago',
      recordCount: 125000,
      category: 'Demographics'
    },
    {
      id: '2',
      name: 'Ministry of Health Database',
      type: 'database',
      status: 'active',
      lastUpdated: '1 day ago',
      recordCount: 89000,
      category: 'Healthcare'
    },
    {
      id: '3',
      name: 'Education Sector Data',
      type: 'excel',
      status: 'active',
      lastUpdated: '3 hours ago',
      recordCount: 45000,
      category: 'Education'
    },
    {
      id: '4',
      name: 'World Bank Open Data',
      type: 'web-scrape',
      status: 'pending',
      lastUpdated: '5 days ago',
      recordCount: 23400,
      category: 'Economic'
    }
  ]);

  const [analysisResults] = useState<AnalysisResult[]>([
    {
      category: 'Healthcare Access',
      dataPoints: 89000,
      insights: [
        'Rural healthcare facility coverage increased by 15% in 2024',
        'Average patient wait time reduced from 45min to 28min',
        'District hospitals operating at 78% capacity',
        'Maternal mortality rate decreased by 12% year-over-year'
      ],
      recommendations: [
        'Policy: Expand telemedicine services to remote sectors',
        'Policy: Increase healthcare workforce training programs',
        'Action: Deploy 50 additional ambulances to underserved districts'
      ]
    },
    {
      category: 'Education Performance',
      dataPoints: 45000,
      insights: [
        'Primary school enrollment rate at 98.7% nationally',
        'Student-teacher ratio improved to 32:1 from 38:1',
        'STEM program participation increased by 34%',
        'Digital literacy rate among students: 67%'
      ],
      recommendations: [
        'Policy: Mandate ICT integration in all secondary schools by 2027',
        'Policy: Expand scholarship programs for underrepresented groups',
        'Action: Distribute 10,000 tablets to rural schools'
      ]
    }
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const showToast = (msg: string, type: ToastType = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastType(null);
      setToastMessage('');
    }, 4000);
  };

  const handleImport = async () => {
    if (!selectedFile) {
      showToast('Please select a file to upload', 'error');
      return;
    }

    if (!currentProject?.project_id) {
      showToast('No project selected. Please create or select a project first.', 'error');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('project_id', currentProject.project_id);

      const response = await axios.post('https://policy-files.onrender.com/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.document_id) {
        showToast(`File uploaded successfully`, 'success');
        setIsImportModalOpen(false);
        setSelectedFile(null);
      } else {
        showToast('Upload failed: ' + (response.data.message || 'Unknown error'), 'error');
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || error.message || 'Failed to upload file';
      showToast(message, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleScrape = async () => {
    if (!scrapeUrl) {
      showToast('Please enter a URL to scrape', 'error');
      return;
    }

    if (!currentProject?.project_id) {
      showToast('No project selected. Please create or select a project first.', 'error');
      return;
    }

    setIsScraping(true);
    try {
      const requestData = {
        urls: [scrapeUrl],
        project_id: currentProject.project_id
      };

      const response = await axios.post<ScrapeResponse>(
        'https://policy-scraper.onrender.com/scrape',
        requestData,
        {
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.results && response.data.results.length > 0) {
        setScrapedFiles(prev => [...prev, ...response.data.results]);
        showToast(
          `Successfully scraped ${response.data.results.length} URL(s). PDFs generated and saved.`,
          'success'
        );
        setIsScrapeModalOpen(false);
        setScrapeUrl('');
      } else {
        showToast('No data could be scraped from the provided URL', 'error');
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || error.message || 'Failed to scrape URL';
      showToast(message, 'error');
    } finally {
      setIsScraping(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-success-600" />;
      case 'processing':
        return <Loader2 className="h-5 w-5 text-primary-600 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: DataSource['type']) => {
    switch (type) {
      case 'csv':
      case 'excel':
        return <FileSpreadsheet className="h-5 w-5" />;
      case 'api':
        return <Database className="h-5 w-5" />;
      case 'web-scrape':
        return <Globe className="h-5 w-5" />;
      case 'database':
        return <Database className="h-5 w-5" />;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
          <h1 className="text-3xl font-bold text-gray-900">Data Collection & Analysis</h1>
        </div>
        <div className="flex gap-3">
          <Button
            variant="primary"
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Import Data
          </Button>
          <Button
            variant="success"
            onClick={() => setIsScrapeModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Globe className="h-4 w-4" />
            Web Scrape
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Data Sources</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
            </div>
            <Database className="h-8 w-8 text-primary-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Records Collected</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">282K</p>
            </div>
            <BarChart3 className="h-8 w-8 text-success-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Imports</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">3</p>
            </div>
            <TrendingUp className="h-8 w-8 text-warning-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Insights Generated</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">47</p>
            </div>
            <FileText className="h-8 w-8 text-primary-600" />
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b-2 border-gray-200">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab('import')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'import'
                ? 'border-primary-600 text-primary-700'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
            }`}
          >
            Data Import
          </button>
          <button
            onClick={() => setActiveTab('scrape')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'scrape'
                ? 'border-primary-600 text-primary-700'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
            }`}
          >
            Web Scraping
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'analysis'
                ? 'border-primary-600 text-primary-700'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
            }`}
          >
            Analysis & Insights
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'import' && (
        <div className="space-y-6">
          {/* Imported Files Table */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Imported Files</h3>
              <Table<ImportedFile>
                data={importedFiles}
                columns={[
                  {
                    header: 'File Name',
                    accessor: (row: ImportedFile) => (
                      <div>
                        <div className="font-medium text-gray-900">{row.fileName}</div>
                        <p className="text-sm text-gray-500">{row.fileSize}</p>
                      </div>
                    ),
                  },
                  {
                    header: 'Category',
                    accessor: (row: ImportedFile) => (
                      <Badge variant="primary">{row.category}</Badge>
                    ),
                  },
                  {
                    header: 'Uploaded',
                    accessor: 'uploadedAt' as keyof ImportedFile,
                  },
                  {
                    header: 'Analysed',
                    accessor: (row: ImportedFile) => (
                      <div className="flex items-center gap-2">
                        {row.analysed ? (
                          <>
                            <CheckCircle className="h-5 w-5 text-success-600" />
                            <span className="text-sm text-success-700 font-medium">Yes</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-5 w-5 text-warning-600" />
                            <span className="text-sm text-warning-700 font-medium">Pending</span>
                          </>
                        )}
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          </Card>

          
        </div>
      )}

      {activeTab === 'scrape' && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Scraped Data</h3>
            {scrapedFiles.length > 0 ? (
              <Table<ScrapeResult>
                data={scrapedFiles}
                columns={[
                  {
                    header: 'Source URL',
                    accessor: (row: ScrapeResult) => (
                      <div>
                        <div className="font-medium text-gray-900 max-w-xs truncate">
                          {new URL(row.url).hostname}
                        </div>
                        <p className="text-sm text-gray-500 max-w-xs truncate">{row.url}</p>
                      </div>
                    ),
                  },
                  {
                    header: 'Method',
                    accessor: (row: ScrapeResult) => (
                      <Badge variant="primary">{row.method}</Badge>
                    ),
                  },
                  {
                    header: 'Content Size',
                    accessor: (row: ScrapeResult) => (
                      <span className="text-sm text-gray-600">
                        {(row.content_length / 1024).toFixed(2)} KB
                      </span>
                    ),
                  },
                  {
                    header: 'PDF File',
                    accessor: (row: ScrapeResult) => (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-success-600" />
                        <a 
                          href={row.pdf_file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary-600 hover:text-primary-800 font-medium"
                        >
                          Download PDF
                        </a>
                      </div>
                    ),
                  },
                  {
                    header: 'Document ID',
                    accessor: (row: ScrapeResult) => (
                      <span className="text-xs text-gray-500 font-mono">
                        {row.document_id.slice(0, 8)}...
                      </span>
                    ),
                  },
                ]}
              />
            ) : (
              <div className="text-center py-12">
                <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No scraped data yet</h3>
                <p className="text-gray-600 mb-4">
                  Start web scraping to collect data from external sources
                </p>
                <Button
                  variant="primary"
                  onClick={() => setIsScrapeModalOpen(true)}
                  className="inline-flex items-center gap-2"
                >
                  <Globe className="h-4 w-4" />
                  Start Web Scraping
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}

      {activeTab === 'analysis' && (
        <div className="space-y-6">
          {analysisResults.map((analysis, index) => (
            <Card key={index}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{analysis.category}</h3>
                  <Badge variant="primary">{analysis.dataPoints.toLocaleString()} data points</Badge>
                </div>

                <div className="space-y-6">
                  {/* Insights */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary-600" />
                      Key Insights
                    </h4>
                    <div className="space-y-2">
                      {analysis.insights.map((insight, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-blue-50 border-2 border-blue-200 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-blue-900">{insight}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-success-600" />
                      Policy Recommendations
                    </h4>
                    <div className="space-y-2">
                      {analysis.recommendations.map((recommendation, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-success-50 border-2 border-success-200 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-success-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-success-900">{recommendation}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button variant="primary" className="w-full sm:w-auto">
                    Generate Policy Draft from Analysis
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Import Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Data"
      >
        <div className="space-y-4">
          

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload File
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
              <input
                type="file"
                accept=".csv,.xlsx,.xls,.json,.pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-gray-500 mt-1">PDF, Excel, CSV, Word, JSON (max 50MB)</p>
              </label>
            </div>
          </div>

          {selectedFile && (
            <div className="p-4 bg-success-50 border-2 border-success-200 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success-600" />
                <p className="text-sm text-success-900">
                  File ready: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsImportModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleImport}
              disabled={!selectedFile || isUploading}
              isLoading={isUploading}
              className="flex-1"
            >
              {isUploading ? 'Uploading...' : 'Import Data'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Scrape Modal */}
      <Modal
        isOpen={isScrapeModalOpen}
        onClose={() => !isScraping && setIsScrapeModalOpen(false)}
        title="Web Scraping Setup"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target URL
            </label>
            <Input
              type="url"
              value={scrapeUrl}
              onChange={(e) => setScrapeUrl(e.target.value)}
              placeholder="https://alliancebioversityciat.org/stories/..."
              disabled={isScraping}
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter a URL to scrape. The system will generate a PDF and extract content.
            </p>
          </div>

          <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <div className="flex gap-2">
              <Search className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900">How it works</p>
                <p className="text-sm text-blue-800 mt-1">
                  Our scraper uses Selenium to capture website content, generates a PDF version, 
                  and provides you with a downloadable document for analysis.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-warning-50 border-2 border-warning-200 rounded-lg">
            <div className="flex gap-2">
              <AlertCircle className="h-5 w-5 text-warning-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-warning-900">Important</p>
                <p className="text-sm text-warning-800 mt-1">
                  Ensure you have permission to scrape data from the target website.
                  Respect robots.txt and terms of service.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsScrapeModalOpen(false)} 
              className="flex-1"
              disabled={isScraping}
            >
              Cancel
            </Button>
            <Button
              variant="success"
              onClick={handleScrape}
              disabled={!scrapeUrl || isScraping}
              isLoading={isScraping}
              className="flex-1"
            >
              {isScraping ? 'Scraping...' : 'Start Scraping'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Toast Notification */}
      {toastType && (
        <div className={`fixed right-4 bottom-4 w-80 p-4 rounded-lg shadow-lg border-2 z-50 ${
          toastType === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {toastMessage}
        </div>
      )}
      </div>
    </Layout>
  );
}
