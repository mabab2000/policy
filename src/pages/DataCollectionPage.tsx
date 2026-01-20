import { useState, useEffect } from 'react';
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
  Search,
  Download
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Table from '@/components/ui/Table';
import { formatDate, formatDateTime } from '@/lib/utils';

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

interface DocumentItem {
  id: string;
  project_id: string;
  filename: string;
  file_path: string;
  source: string;
  status: string;
  document_content: any;
  created_at: string;
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

interface ScrapedDocument {
  id: string;
  file_name: string;
  created_at: string;
  status: string;
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

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [docsLoading, setDocsLoading] = useState<boolean>(false);
  const [docsError, setDocsError] = useState<string | null>(null);
  const [docSearch, setDocSearch] = useState<string>('');
  const [docStatusFilter, setDocStatusFilter] = useState<string>('');
  const [docPage, setDocPage] = useState<number>(1);
  const [docPerPage, setDocPerPage] = useState<number>(10);
  const [processingDocId, setProcessingDocId] = useState<string | null>(null);
  const [analysingDocId, setAnalysingDocId] = useState<string | null>(null);
  const [summaryModalOpen, setSummaryModalOpen] = useState<boolean>(false);
  const [summaryContent, setSummaryContent] = useState<string>('');
  const [summaryDocId, setSummaryDocId] = useState<string | null>(null);
  const [summaryPanelLoading, setSummaryPanelLoading] = useState<boolean>(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!currentProject?.project_id) return;
      setDocsLoading(true);
      setDocsError(null);
      try {
        const url = `https://policy-files.onrender.com/documents/project/${currentProject.project_id}/upload-or-other`;
        const resp = await axios.get(url, { headers: { accept: 'application/json' } });
        setDocuments(resp.data.documents || []);
      } catch (err: any) {
        console.error('Failed to fetch documents', err);
        setDocsError(err?.message || 'Failed to fetch documents');
      } finally {
        setDocsLoading(false);
      }
    };

    fetchDocuments();
  }, [currentProject?.project_id]);
  const [scrapedDocs, setScrapedDocs] = useState<ScrapedDocument[]>([]);
  const [scrapedLoading, setScrapedLoading] = useState<boolean>(false);
  const [scrapedError, setScrapedError] = useState<string | null>(null);
  const [scrapedSearch, setScrapedSearch] = useState<string>('');
  const [scrapedStatusFilter, setScrapedStatusFilter] = useState<string>('');
  const [scrapedPage, setScrapedPage] = useState<number>(1);
  const [scrapedPerPage, setScrapedPerPage] = useState<number>(10);

  useEffect(() => {
    const fetchScrapedDocs = async () => {
      if (!currentProject?.project_id) return;
      setScrapedLoading(true);
      setScrapedError(null);
      try {
        const url = `https://policy-files.onrender.com/documents/project/${currentProject.project_id}/scraped`;
        const resp = await axios.get(url, { headers: { accept: 'application/json' } });
        setScrapedDocs(resp.data.documents || []);
      } catch (err: any) {
        console.error('Failed to fetch scraped documents', err);
        setScrapedError(err?.message || 'Failed to fetch scraped documents');
      } finally {
        setScrapedLoading(false);
      }
    };

    fetchScrapedDocs();
  }, [currentProject?.project_id]);
  const [summary, setSummary] = useState<any | null>(null);
  const [summaryLoading, setSummaryLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!currentProject?.project_id) {
        setSummary(null);
        setSummaryLoading(false);
        return;
      }

      setSummaryLoading(true);
      try {
        const url = `https://policy-files.onrender.com/documents/project/${currentProject.project_id}/summary`;
        const resp = await axios.get(url, { headers: { accept: 'application/json' } });
        setSummary(resp.data);
      } catch (err) {
        console.error('Failed to fetch project summary', err);
        setSummary(null);
      } finally {
        setSummaryLoading(false);
      }
    };

    fetchSummary();
  }, [currentProject?.project_id]);

  const totalDocuments = summary?.total ?? null;
  const totalSources = summary
    ? Object.values(summary.sources || {}).reduce((acc: number, s: any) => acc + (s.total || 0), 0)
    : null;
  const totalProcessed = summary?.total_processed ?? null;
  const totalAnalysed = summary?.total_analysed ?? null;
  const totalPending = summary
    ? Object.values(summary.sources || {}).reduce((acc: number, s: any) => acc + ((s.status && s.status.pending) || 0), 0)
    : null;

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

  const handleProcessDocument = async (documentId: string) => {
    setProcessingDocId(documentId);
    try {
      const response = await axios.post('https://policy-scraper.onrender.com/process_document', {
        document_id: documentId,
      }, {
        headers: { 
          accept: 'application/json',
          'Content-Type': 'application/json'
        },
      });
      
      if (response.data.status === 'processed') {
        showToast('Document processed successfully', 'success');
        // Refresh both documents lists
        if (currentProject?.project_id) {
          // Refresh import documents
          const uploadUrl = `https://policy-files.onrender.com/documents/project/${currentProject.project_id}/upload-or-other`;
          const uploadResp = await axios.get(uploadUrl, { headers: { accept: 'application/json' } });
          setDocuments(uploadResp.data.documents || []);
          
          // Refresh scraped documents
          const scrapedUrl = `https://policy-files.onrender.com/documents/project/${currentProject.project_id}/scraped`;
          const scrapedResp = await axios.get(scrapedUrl, { headers: { accept: 'application/json' } });
          setScrapedDocs(scrapedResp.data.documents || []);
        }
      } else {
        showToast('Failed to process document', 'error');
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || error.message || 'Failed to process document';
      showToast(message, 'error');
    } finally {
      setProcessingDocId(null);
    }
  };

  const handleAnalyseDocument = async (documentId: string) => {
    setAnalysingDocId(documentId);
    try {
      const response = await axios.post('https://policy-pre-processor.onrender.com/document', {
        document_id: documentId,
      }, {
        headers: { 
          accept: 'application/json',
          'Content-Type': 'application/json'
        },
      });
      
      if (response.data) {
        showToast('Document analysed successfully', 'success');
        // Refresh both documents lists to get updated status
        if (currentProject?.project_id) {
          const uploadUrl = `https://policy-files.onrender.com/documents/project/${currentProject.project_id}/upload-or-other`;
          const uploadResp = await axios.get(uploadUrl, { headers: { accept: 'application/json' } });
          setDocuments(uploadResp.data.documents || []);
          
          const scrapedUrl = `https://policy-files.onrender.com/documents/project/${currentProject.project_id}/scraped`;
          const scrapedResp = await axios.get(scrapedUrl, { headers: { accept: 'application/json' } });
          setScrapedDocs(scrapedResp.data.documents || []);
        }
      } else {
        showToast('Failed to analyse document', 'error');
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || error.message || 'Failed to analyse document';
      showToast(message, 'error');
    } finally {
      setAnalysingDocId(null);
    }
  };

  const handleViewSummary = async (documentId: string) => {
    setSummaryDocId(documentId);
    setSummaryPanelLoading(true);
    setSummaryError(null);
    try {
      const response = await axios.post('https://policy-pre-processor.onrender.com/summary', {
        document_id: documentId,
      }, {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json'
        },
      });

      if (response.data?.summary) {
        setSummaryContent(response.data.summary);
        setSummaryModalOpen(true);
      } else {
        setSummaryError('No summary returned for this document');
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || error.message || 'Failed to load summary';
      setSummaryError(message);
    } finally {
      setSummaryPanelLoading(false);
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
            <p className="text-gray-600 mt-1">Import, scrape, and analyze data for policy insights</p>
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

    
      {/* Detailed Source Breakdown */}
      {summary && !summaryLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {/* Scrape Sources */}
          <div className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg border-2 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-center mb-4">
              <h3 className="text-base font-semibold text-gray-700 mb-1">Web Scraping</h3>
              <div className="text-3xl font-bold text-success-600">
                {summary.sources?.scrape?.total || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Curated from {summary.sources?.scrape?.total || 0} original sources
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2 border border-gray-200 rounded">
                <div className="text-xl font-bold text-gray-700">
                  {summary.sources?.scrape?.status?.pending || 0}
                </div>
                <p className="text-xs text-gray-500 mt-1">Pending</p>
              </div>
              <div className="text-center p-2 border border-red-200 rounded bg-red-50">
                <div className="text-xl font-bold text-red-600">
                  {summary.sources?.scrape?.status?.processed || 0}
                </div>
                <p className="text-xs text-gray-500 mt-1">Processed</p>
              </div>
              <div className="text-center p-2 border border-gray-200 rounded">
                <div className="text-xl font-bold text-gray-700">
                  {summary.sources?.scrape?.total || 0}
                </div>
                <p className="text-xs text-gray-500 mt-1">All</p>
              </div>
            </div>
          </div>

          {/* Upload Sources */}
          <div className="bg-gradient-to-br from-white to-green-50 p-4 rounded-lg border-2 border-green-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-center mb-4">
              <h3 className="text-base font-semibold text-gray-700 mb-1">File Uploads</h3>
              <div className="text-3xl font-bold text-success-600">
                {summary.sources?.Upload?.total || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Curated from {summary.sources?.Upload?.total || 0} original files
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2 border border-gray-200 rounded">
                <div className="text-xl font-bold text-gray-700">
                  {(summary.sources?.Upload?.total || 0) - (summary.sources?.Upload?.status?.pending || 0)}
                </div>
                <p className="text-xs text-gray-500 mt-1">Processed</p>
              </div>
              <div className="text-center p-2 border border-red-200 rounded bg-red-50">
                <div className="text-xl font-bold text-red-600">
                  {summary.sources?.Upload?.status?.pending || 0}
                </div>
                <p className="text-xs text-gray-500 mt-1">Pending</p>
              </div>
              <div className="text-center p-2 border border-gray-200 rounded">
                <div className="text-xl font-bold text-gray-700">
                  {summary.sources?.Upload?.total || 0}
                </div>
                <p className="text-xs text-gray-500 mt-1">All</p>
              </div>
            </div>
          </div>
        </div>
      )}

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
            Analyse
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'import' && (
        <div className="space-y-6">
          {/* Imported Files Table (fetched from API) */}
          <Card>
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Imported Files</h3>
                <div className="flex items-center gap-3">
                  <Input
                    placeholder="Search files..."
                    value={docSearch}
                    onChange={(e) => { setDocSearch(e.target.value); setDocPage(1); }}
                    className="w-80"
                  />
                  <select
                    value={docStatusFilter}
                    onChange={(e) => { setDocStatusFilter(e.target.value); setDocPage(1); }}
                    className="border border-gray-300 rounded-lg py-2 px-3 bg-white"
                  >
                    <option value="">All statuses</option>
                    <option value="pending">Pending</option>
                    <option value="processed">Processed</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                  <select
                    value={docPerPage}
                    onChange={(e) => { setDocPerPage(Number(e.target.value)); setDocPage(1); }}
                    className="border border-gray-300 rounded-lg py-2 px-3 bg-white"
                  >
                    <option value={5}>5 / page</option>
                    <option value={10}>10 / page</option>
                    <option value={25}>25 / page</option>
                  </select>
                </div>
              </div>

              {docsLoading ? (
                <div className="py-12 flex justify-center"><Loader2 className="h-8 w-8 text-gray-400 animate-spin" /></div>
              ) : docsError ? (
                <div className="py-6 text-center text-red-600">{docsError}</div>
              ) : (
                <>
                  {/* compute filtered & paginated data client-side */}
                  {(() => {
                    const lower = docSearch.trim().toLowerCase();
                    const filtered = documents.filter(d => {
                      const matchesSearch = !lower || d.filename.toLowerCase().includes(lower) || d.file_path.toLowerCase().includes(lower);
                      const matchesStatus = !docStatusFilter || d.status === docStatusFilter;
                      return matchesSearch && matchesStatus;
                    });
                    const total = filtered.length;
                    const totalPages = Math.max(1, Math.ceil(total / docPerPage));
                    const currentPage = Math.min(docPage, totalPages);
                    const start = (currentPage - 1) * docPerPage;
                    const pageItems = filtered.slice(start, start + docPerPage);

                    return (
                      <>
                        <div className="w-full overflow-x-auto">
                          <Table<DocumentItem>
                          data={pageItems}
                          columns={[
                            {
                              header: 'File Name',
                              accessor: (row: DocumentItem) => (
                                <div className="max-w-[150px]">
                                  <div className="font-medium text-gray-900 truncate">{row.filename}</div>
                                </div>
                              ),
                            },
                            {
                              header: 'Status',
                              accessor: (row: DocumentItem) => (
                                  <Badge variant={row.status === 'pending' ? 'warning' : row.status === 'failed' ? 'danger' : 'primary'}>
                                  {row.status}
                                </Badge>
                              ),
                            },
                            {
                              header: 'Uploaded',
                              accessor: (row: DocumentItem) => (
                                <span className="text-sm text-gray-600">{formatDate(row.created_at)}</span>
                              ),
                            },
                            {
                              header: 'Download',
                              accessor: (row: DocumentItem) => {
                                const handleDownload = async () => {
                                  try {
                                    const resp = await axios.get(`https://policy-files.onrender.com/documents/scrape/${row.id}`);
                                    if (resp.data.preview_url) {
                                      window.open(resp.data.preview_url, '_blank');
                                    }
                                  } catch (err) {
                                    console.error('Failed to get download URL', err);
                                  }
                                };
                                return (
                                  <button onClick={handleDownload} className="inline-flex items-center gap-2 px-3 py-2 rounded bg-primary-50 text-primary-600 hover:bg-primary-100 font-medium" title="Download PDF">
                                    <Download className="h-4 w-4" />
                                  </button>
                                );
                              },
                            },
                            {
                              header: 'Process',
                              accessor: (row: DocumentItem) => (
                                <button
                                  onClick={() => handleProcessDocument(row.id)}
                                  disabled={row.status === 'processed' || processingDocId === row.id}
                                  className={`text-sm px-3 py-1 rounded flex items-center gap-2 ${row.status === 'processed' || processingDocId === row.id ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-primary-600 text-white hover:bg-primary-700'}`}
                                >
                                  {processingDocId === row.id && <Loader2 className="h-4 w-4 animate-spin" />}
                                  {row.status === 'processed' ? 'Processed' : processingDocId === row.id ? 'Processing...' : 'Process'}
                                </button>
                              ),
                            },
                          ]}
                        />
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="text-sm text-gray-600">Showing {start + 1} - {Math.min(start + pageItems.length, total)} of {total}</div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setDocPage(p => Math.max(1, p - 1))}
                              disabled={currentPage <= 1}
                              className="px-3 py-1 border rounded bg-white disabled:opacity-50"
                            >Prev</button>
                            <div className="px-3 py-1 border rounded bg-white">{currentPage} / {totalPages}</div>
                            <button
                              onClick={() => setDocPage(p => Math.min(totalPages, p + 1))}
                              disabled={currentPage >= totalPages}
                              className="px-3 py-1 border rounded bg-white disabled:opacity-50"
                            >Next</button>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </>
              )}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'scrape' && (
        <Card>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Scraped Data</h3>
              <div className="flex items-center gap-3">
                <Input
                  placeholder="Search files..."
                  value={scrapedSearch}
                  onChange={(e) => { setScrapedSearch(e.target.value); setScrapedPage(1); }}
                  className="w-80"
                />
                <select
                  value={scrapedStatusFilter}
                  onChange={(e) => { setScrapedStatusFilter(e.target.value); setScrapedPage(1); }}
                  className="border border-gray-300 rounded-lg py-2 px-3 bg-white"
                >
                  <option value="">All statuses</option>
                  <option value="pending">Pending</option>
                  <option value="processed">Processed</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
                <select
                  value={scrapedPerPage}
                  onChange={(e) => { setScrapedPerPage(Number(e.target.value)); setScrapedPage(1); }}
                  className="border border-gray-300 rounded-lg py-2 px-3 bg-white"
                >
                  <option value={5}>5 / page</option>
                  <option value={10}>10 / page</option>
                  <option value={25}>25 / page</option>
                </select>
              </div>
            </div>

            {scrapedLoading ? (
              <div className="py-12 flex justify-center"><Loader2 className="h-8 w-8 text-gray-400 animate-spin" /></div>
            ) : scrapedError ? (
              <div className="py-6 text-center text-red-600">{scrapedError}</div>
            ) : scrapedDocs.length === 0 ? (
              <div className="text-center py-12">
                <Globe className="h-12 w-8 text-gray-400 mx-auto mb-4" />
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
            ) : (
              <>
                {/* compute filtered & paginated data client-side */}
                {(() => {
                  const lower = scrapedSearch.trim().toLowerCase();
                  const filtered = scrapedDocs.filter(d => {
                    const matchesSearch = !lower || d.file_name.toLowerCase().includes(lower);
                    const matchesStatus = !scrapedStatusFilter || d.status === scrapedStatusFilter;
                    return matchesSearch && matchesStatus;
                  });
                  const total = filtered.length;
                  const totalPages = Math.max(1, Math.ceil(total / scrapedPerPage));
                  const currentPage = Math.min(scrapedPage, totalPages);
                  const start = (currentPage - 1) * scrapedPerPage;
                  const pageItems = filtered.slice(start, start + scrapedPerPage);

                  return (
                    <>
                      <div className="w-full overflow-x-auto">
                        <Table<ScrapedDocument>
                        data={pageItems}
                        columns={[
                          {
                            header: 'File Name',
                            accessor: (row: ScrapedDocument) => (
                              <div className="max-w-[150px]">
                                <div className="font-medium text-gray-900 truncate">{row.file_name}</div>
                              </div>
                            ),
                          },
                          {
                            header: 'Status',
                            accessor: (row: ScrapedDocument) => (
                              <Badge variant={row.status === 'pending' ? 'warning' : row.status === 'failed' ? 'danger' : 'primary'}>
                                {row.status}
                              </Badge>
                            ),
                          },
                          {
                            header: 'Scraped Date',
                            accessor: (row: ScrapedDocument) => (
                              <span className="text-sm text-gray-600">{formatDate(row.created_at)}</span>
                            ),
                          },
                          {
                            header: 'Download',
                            accessor: (row: ScrapedDocument) => {
                              const handleDownload = async () => {
                                try {
                                  const resp = await axios.get(`https://policy-files.onrender.com/documents/scrape/${row.id}`);
                                  if (resp.data.preview_url) {
                                    window.open(resp.data.preview_url, '_blank');
                                  }
                                } catch (err) {
                                  console.error('Failed to get download URL', err);
                                }
                              };
                              return (
                                <button onClick={handleDownload} className="inline-flex items-center gap-2 px-3 py-2 rounded bg-primary-50 text-primary-600 hover:bg-primary-100 font-medium" title="Download PDF">
                                  <Download className="h-4 w-4" />
                                </button>
                              );
                            },
                          },
                          {
                            header: 'Process',
                            accessor: (row: ScrapedDocument) => (
                              <button
                                onClick={() => handleProcessDocument(row.id)}
                                disabled={row.status === 'processed' || processingDocId === row.id}
                                className={`text-sm px-3 py-1 rounded flex items-center gap-2 ${row.status === 'processed' || processingDocId === row.id ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-primary-600 text-white hover:bg-primary-700'}`}
                              >
                                {processingDocId === row.id && <Loader2 className="h-4 w-4 animate-spin" />}
                                {row.status === 'processed' ? 'Processed' : processingDocId === row.id ? 'Processing...' : 'Process'}
                              </button>
                            ),
                          },
                        ]}
                      />
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-gray-600">Showing {start + 1} - {Math.min(start + pageItems.length, total)} of {total}</div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setScrapedPage(p => Math.max(1, p - 1))}
                            disabled={currentPage <= 1}
                            className="px-3 py-1 border rounded bg-white disabled:opacity-50"
                          >Prev</button>
                          <div className="px-3 py-1 border rounded bg-white">{currentPage} / {totalPages}</div>
                          <button
                            onClick={() => setScrapedPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage >= totalPages}
                            className="px-3 py-1 border rounded bg-white disabled:opacity-50"
                          >Next</button>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </>
            )}
          </div>
        </Card>
      )}

      {activeTab === 'analysis' && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Processed Documents Ready for Analysis</h3>
            
            {(() => {
              // Combine both documents and scrapedDocs, filter for processed status only
              const allProcessedDocs = [
                ...documents.filter(d => d.status === 'processed').map(d => ({
                  id: d.id,
                  filename: d.filename,
                  created_at: d.created_at,
                  source: 'Upload'
                })),
                ...scrapedDocs.filter(d => d.status === 'processed').map(d => ({
                  id: d.id,
                  filename: d.file_name,
                  created_at: d.created_at,
                  source: 'Scrape'
                }))
              ];

              if (docsLoading || scrapedLoading) {
                return <div className="py-12 flex justify-center"><Loader2 className="h-8 w-8 text-gray-400 animate-spin" /></div>;
              }

              if (allProcessedDocs.length === 0) {
                return (
                  <div className="text-center py-12">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No documents ready for analysis</h3>
                    <p className="text-gray-600">
                      Process documents first before analysing them
                    </p>
                  </div>
                );
              }

              return (
                <div className="w-full overflow-x-auto">
                  <Table<{id: string; filename: string; created_at: string; source: string}>
                    data={allProcessedDocs}
                    columns={[
                      {
                        header: 'File Name',
                        accessor: (row) => (
                          <div className="max-w-[200px]">
                            <div className="font-medium text-gray-900 truncate">{row.filename}</div>
                          </div>
                        ),
                      },
                      {
                        header: 'Source',
                        accessor: (row) => (
                          <Badge variant="primary">{row.source}</Badge>
                        ),
                      },
                      {
                        header: 'Date',
                        accessor: (row) => (
                          <span className="text-sm text-gray-600">{formatDate(row.created_at)}</span>
                        ),
                      },
                      {
                        header: 'Download',
                        accessor: (row) => {
                          const handleDownload = async () => {
                            try {
                              const resp = await axios.get(`https://policy-files.onrender.com/documents/scrape/${row.id}`);
                              if (resp.data.preview_url) {
                                window.open(resp.data.preview_url, '_blank');
                              }
                            } catch (err) {
                              console.error('Failed to get download URL', err);
                            }
                          };
                          return (
                            <button onClick={handleDownload} className="inline-flex items-center gap-2 px-3 py-2 rounded bg-primary-50 text-primary-600 hover:bg-primary-100 font-medium" title="Download PDF">
                              <Download className="h-4 w-4" />
                            </button>
                          );
                        },
                      },
                      {
                        header: 'Analyse',
                        accessor: (row) => (
                          <button
                            onClick={() => handleAnalyseDocument(row.id)}
                            disabled={analysingDocId === row.id}
                            className={`text-sm px-3 py-1 rounded flex items-center gap-2 ${analysingDocId === row.id ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-success-600 text-white hover:bg-success-700'}`}
                          >
                            {analysingDocId === row.id && <Loader2 className="h-4 w-4 animate-spin" />}
                            {analysingDocId === row.id ? 'Analysing...' : 'Analyse'}
                          </button>
                        ),
                      },
                      {
                        header: 'Summary',
                        accessor: (row) => (
                          <button
                            onClick={() => handleViewSummary(row.id)}
                            disabled={summaryPanelLoading && summaryDocId === row.id}
                            className={`text-sm px-3 py-1 rounded flex items-center gap-2 ${summaryPanelLoading && summaryDocId === row.id ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-secondary-600 text-white hover:bg-secondary-700'}`}
                          >
                            {summaryPanelLoading && summaryDocId === row.id && <Loader2 className="h-4 w-4 animate-spin" />}
                            {summaryPanelLoading && summaryDocId === row.id ? 'Loading...' : 'View'}
                          </button>
                        ),
                      },
                    ]}
                  />
                </div>
              );
            })()}
          </div>
        </Card>
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

      {summaryModalOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/30"
            onClick={() => setSummaryModalOpen(false)}
          />
          <div className="w-full sm:w-1/2 lg:w-5/12 xl:w-4/12 h-full bg-white border-l border-gray-200 shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <div>
                <h4 className="text-base font-semibold text-gray-900">Document Summary</h4>
                {summaryDocId && (
                  <p className="text-xs text-gray-500 mt-0.5">Document ID: {summaryDocId}</p>
                )}
              </div>
              <button
                onClick={() => setSummaryModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {summaryPanelLoading && summaryDocId && (
                <div className="py-12 flex justify-center"><Loader2 className="h-8 w-8 text-gray-400 animate-spin" /></div>
              )}

              {!summaryPanelLoading && summaryError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  {summaryError}
                </div>
              )}

              {!summaryPanelLoading && !summaryError && summaryContent && (
                <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                  {summaryContent}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </Layout>
  );
}
