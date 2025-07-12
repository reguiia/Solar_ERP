'use client';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Filter, 
  FileCheck,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  Eye,
  Edit,
  FileText,
  Shield,
  Building,
  Home,
  Sprout
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { supabase, fetchComplianceRecords } from '@/lib/supabase';
import { z } from 'zod';

// Types based on database schema
interface ComplianceRecord {
  id: string;
  project_id: string;
  regulation_name: string;
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'expired';
  progress: number;
  submission_date: string;
  approval_date: string | null;
  expiry_date?: string | null;
  documents?: string[];
  notes: string | null;
  assigned_to: string;
  created_at: string;
  updated_at?: string;
  project?: {
    name: string;
  };
  assigned_user?: {
    full_name: string;
  };
}

const ComplianceRecordSchema = z.object({
  id: z.string(),
  project_id: z.string(),
  regulation_name: z.string(),
  status: z.enum(['pending', 'in_review', 'approved', 'rejected', 'expired']),
  progress: z.number(),
  submission_date: z.string(),
  approval_date: z.string().nullable(),
  expiry_date: z.string().nullable().optional(),
  documents: z.array(z.string()).optional(),
  notes: z.string().nullable(),
  assigned_to: z.string(),
  created_at: z.string(),
  updated_at: z.string().optional(),
});
const mockRegulations = [
  {
    id: '1',
    name: 'PROSOL Residential',
    description: 'Government program for residential solar installations',
    type: 'residential',
    authority: 'Ministry of Energy, Mines and Renewable Energy',
    requirements: [
      'System capacity between 1-10 kW',
      'Grid-tied installation only',
      'Certified installer required',
      'Technical inspection mandatory'
    ],
    documents: [
      'Installation permit',
      'Technical specifications',
      'Installer certification',
      'Grid connection agreement'
    ],
    timeline: '30-45 days',
    status: 'active'
  },
  {
    id: '2',
    name: 'Industrial Solar Permit',
    description: 'Permit for industrial solar installations > 50kW',
    type: 'industrial',
    authority: 'STEG (Tunisian Electricity and Gas Company)',
    requirements: [
      'Environmental impact assessment',
      'Grid stability study',
      'Fire safety compliance',
      'Structural engineering report'
    ],
    documents: [
      'EIA report',
      'Grid study',
      'Fire safety certificate',
      'Structural report',
      'Insurance certificate'
    ],
    timeline: '60-90 days',
    status: 'active'
  },
  {
    id: '3',
    name: 'Agricultural Off-Grid',
    description: 'Regulations for agricultural off-grid solar systems',
    type: 'agricultural',
    authority: 'Ministry of Agriculture',
    requirements: [
      'Agricultural land certification',
      'Water usage permit (if applicable)',
      'Environmental compliance',
      'Local authority approval'
    ],
    documents: [
      'Land ownership certificate',
      'Agricultural permit',
      'Environmental clearance',
      'Local approval letter'
    ],
    timeline: '45-60 days',
    status: 'active'
  }
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_review: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  expired: 'bg-gray-100 text-gray-800',
  active: 'bg-green-100 text-green-800',
  draft: 'bg-gray-100 text-gray-800',
  archived: 'bg-red-100 text-red-800'
};

const typeIcons: Record<string, React.ReactNode> = {
  residential: <Home className="h-4 w-4" />,
  industrial: <Building className="h-4 w-4" />,
  agricultural: <Sprout className="h-4 w-4" />
};

function CompliancePage() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [complianceRecords, setComplianceRecords] = useState<ComplianceRecord[]>([]);
  const [loading, setLoading] = useState(false);

const loadComplianceData = useCallback(async () => {
  try {
    setLoading(true);
    const data = await fetchComplianceRecords();
    // Normalize project and assigned_user fields
    const normalized = (data || []).map((record: any) => ({
      ...record,
      project: Array.isArray(record.project) ? record.project[0] : record.project,
      assigned_user: Array.isArray(record.assigned_user) ? record.assigned_user[0] : record.assigned_user,
    }));
    setComplianceRecords(normalized);
  } catch (error) {
    console.error('Error loading compliance data:', error);
  } finally {
    setLoading(false);
  }
}, []);

useEffect(() => {
  setMounted(true);
}, []);

useEffect(() => {
  if (mounted) {
    loadComplianceData();
  }
}, [mounted, loadComplianceData]);

  // Avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredRecords = complianceRecords.filter(record => {
    const matchesSearch = (record.project?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.regulation_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalSubmissions: complianceRecords.length,
    approved: complianceRecords.filter(r => r.status === 'approved').length,
    pending: complianceRecords.filter(r => r.status === 'pending').length,
    inReview: complianceRecords.filter(r => r.status === 'in_review').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="mr-4">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                {t('nav.compliance')} - Regulatory Compliance
              </h1>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Submission
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="regulations">Regulations</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                  <FileCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
                  <p className="text-xs text-muted-foreground">+2 from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Approved</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.totalSubmissions > 0 ? Math.round((stats.approved / stats.totalSubmissions) * 100) : 0}% approval rate
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Review</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats.inReview}</div>
                  <p className="text-xs text-muted-foreground">Average 15 days</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                  <p className="text-xs text-muted-foreground">Require attention</p>
                </CardContent>
              </Card>
            </div>
            {/* Recent Submissions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Compliance Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceRecords.slice(0, 5).map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {typeIcons['residential']}
                          <div>
                            <p className="font-medium">{record.project?.name || 'Unknown Project'}</p>
                            <p className="text-sm text-gray-600">{record.regulation_name}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <Badge className={statusColors[record.status]}>
                            {record.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <p className="text-sm text-gray-600 mt-1">{record.progress}% complete</p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="submissions" className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search submissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_review">In Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="expired">Expired</option>
                </select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {/* Submissions Table */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Project</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Regulation</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Progress</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Submission Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Assigned To</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRecords.map((record) => (
                        <tr key={record.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div>
                              <div className="font-medium">{record.project?.name || 'Unknown Project'}</div>
                              <div className="text-sm text-gray-500">ID: {record.project_id}</div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              {typeIcons['residential']}
                              <span>{record.regulation_name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge className={statusColors[record.status]}>
                              {record.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>{record.progress}%</span>
                              </div>
                              <Progress value={record.progress} className="h-2" />
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm">{new Date(record.submission_date).toLocaleDateString()}</div>
                            {record.approval_date && (
                              <div className="text-xs text-green-600">
                                Approved: {new Date(record.approval_date).toLocaleDateString()}
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm">{record.assigned_user?.full_name || 'Unassigned'}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="regulations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tunisian Solar Regulations</CardTitle>
                <p className="text-sm text-gray-600">
                  Current regulations and requirements for solar installations in Tunisia
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {mockRegulations.map((regulation) => (
                    <Card key={regulation.id} className="border-l-4 border-l-blue-500">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            {typeIcons[regulation.type]}
                            <div>
                              <CardTitle className="text-lg">{regulation.name}</CardTitle>
                              <p className="text-sm text-gray-600 mt-1">{regulation.description}</p>
                            </div>
                          </div>
                          <Badge className={statusColors[regulation.status]}>
                            {regulation.status.toUpperCase()}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Authority</p>
                            <p className="text-sm text-gray-600">{regulation.authority}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Timeline</p>
                            <p className="text-sm text-gray-600">{regulation.timeline}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Key Requirements</p>
                            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                              {regulation.requirements.slice(0, 3).map((req, index) => (
                                <li key={index}>{req}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex space-x-2 pt-2">
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            <Button size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download Template
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Document Templates</CardTitle>
                <p className="text-sm text-gray-600">
                  Pre-filled templates for compliance documentation
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="border-dashed border-2 border-gray-300 hover:border-blue-500 transition-colors cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Home className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <h3 className="font-medium">PROSOL Application</h3>
                      <p className="text-sm text-gray-600">Residential solar permit</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </CardContent>
                  </Card>
                  <Card className="border-dashed border-2 border-gray-300 hover:border-blue-500 transition-colors cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Building className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <h3 className="font-medium">Industrial Permit</h3>
                      <p className="text-sm text-gray-600">Large-scale installation</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </CardContent>
                  </Card>
                  <Card className="border-dashed border-2 border-gray-300 hover:border-blue-500 transition-colors cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Sprout className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <h3 className="font-medium">Agricultural Permit</h3>
                      <p className="text-sm text-gray-600">Off-grid agricultural systems</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </CardContent>
                  </Card>
                  <Card className="border-dashed border-2 border-gray-300 hover:border-blue-500 transition-colors cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Shield className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <h3 className="font-medium">Safety Certificate</h3>
                      <p className="text-sm text-gray-600">Installation safety compliance</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </CardContent>
                  </Card>
                  <Card className="border-dashed border-2 border-gray-300 hover:border-blue-500 transition-colors cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <FileCheck className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <h3 className="font-medium">Inspection Report</h3>
                      <p className="text-sm text-gray-600">Technical inspection form</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </CardContent>
                  </Card>
                  <Card className="border-dashed border-2 border-gray-300 hover:border-blue-500 transition-colors cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <h3 className="font-medium">Grid Connection</h3>
                      <p className="text-sm text-gray-600">STEG connection agreement</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default CompliancePage;
