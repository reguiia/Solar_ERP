'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Filter, 
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Users,
  DollarSign,
  Package,
  FileText,
  Eye,
  Settings,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/lib/supabase';


interface Report {
  id: string;
  name: string;
  description: string;
  category: 'sales' | 'financial' | 'operational' | 'compliance' | 'custom';
  type: 'chart' | 'table' | 'dashboard' | 'document';
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'on-demand';
  lastGenerated: string;
  status: 'active' | 'scheduled' | 'draft';
  createdBy: string;
  recipients: string[];
}

interface KPI {
  id: string;
  name: string;
  value: number;
  unit: string;
  target: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
  period: string;
  category: 'sales' | 'financial' | 'operational' | 'customer';
}

interface DashboardWidget {
  id: string;
  title: string;
  type: 'metric' | 'chart' | 'table' | 'progress';
  size: 'small' | 'medium' | 'large';
  data: any;
  position: { x: number; y: number };
}

const mockReports: Report[] = [
  {
    id: '1',
    name: 'Monthly Sales Report',
    description: 'Comprehensive sales performance analysis',
    category: 'sales',
    type: 'dashboard',
    frequency: 'monthly',
    lastGenerated: '2024-01-15',
    status: 'active',
    createdBy: 'Sarah Hadj',
    recipients: ['manager@company.tn', 'sales@company.tn']
  },
  {
    id: '2',
    name: 'Financial Performance Dashboard',
    description: 'Revenue, costs, and profitability metrics',
    category: 'financial',
    type: 'dashboard',
    frequency: 'weekly',
    lastGenerated: '2024-01-20',
    status: 'active',
    createdBy: 'Mohamed Ali',
    recipients: ['finance@company.tn', 'ceo@company.tn']
  },
  {
    id: '3',
    name: 'Project Status Report',
    description: 'Current project progress and timelines',
    category: 'operational',
    type: 'table',
    frequency: 'weekly',
    lastGenerated: '2024-01-18',
    status: 'active',
    createdBy: 'Amina Tounsi',
    recipients: ['projects@company.tn']
  },
  {
    id: '4',
    name: 'Compliance Audit Report',
    description: 'Regulatory compliance status and issues',
    category: 'compliance',
    type: 'document',
    frequency: 'quarterly',
    lastGenerated: '2024-01-01',
    status: 'scheduled',
    createdBy: 'Legal Team',
    recipients: ['compliance@company.tn', 'legal@company.tn']
  }
];

const mockKPIs: KPI[] = [
  {
    id: '1',
    name: 'Monthly Revenue',
    value: 145230,
    unit: 'TND',
    target: 150000,
    trend: 'up',
    change: 12.5,
    period: 'January 2024',
    category: 'financial'
  },
  {
    id: '2',
    name: 'Lead Conversion Rate',
    value: 68,
    unit: '%',
    target: 70,
    trend: 'up',
    change: 4.2,
    period: 'January 2024',
    category: 'sales'
  },
  {
    id: '3',
    name: 'Project Completion Rate',
    value: 85,
    unit: '%',
    target: 90,
    trend: 'stable',
    change: 0.5,
    period: 'January 2024',
    category: 'operational'
  },
  {
    id: '4',
    name: 'Customer Satisfaction',
    value: 4.6,
    unit: '/5',
    target: 4.5,
    trend: 'up',
    change: 8.2,
    period: 'January 2024',
    category: 'customer'
  },
  {
    id: '5',
    name: 'Average Project Value',
    value: 35000,
    unit: 'TND',
    target: 40000,
    trend: 'down',
    change: -2.1,
    period: 'January 2024',
    category: 'financial'
  },
  {
    id: '6',
    name: 'Inventory Turnover',
    value: 2.3,
    unit: 'x',
    target: 2.5,
    trend: 'up',
    change: 15.0,
    period: 'January 2024',
    category: 'operational'
  }
];

const categoryColors = {
  sales: 'bg-blue-100 text-blue-800',
  financial: 'bg-green-100 text-green-800',
  operational: 'bg-purple-100 text-purple-800',
  compliance: 'bg-orange-100 text-orange-800',
  custom: 'bg-gray-100 text-gray-800',
  customer: 'bg-pink-100 text-pink-800'
};

const statusColors = {
  active: 'bg-green-100 text-green-800',
  scheduled: 'bg-blue-100 text-blue-800',
  draft: 'bg-gray-100 text-gray-800'
};

const typeIcons = {
  chart: <BarChart3 className="h-4 w-4" />,
  table: <FileText className="h-4 w-4" />,
  dashboard: <PieChart className="h-4 w-4" />,
  document: <FileText className="h-4 w-4" />
};

export default function ReportingPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [projects, setProjects] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [kpis, setKPIs] = useState<KPI[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReportingData();
  }, []);

  const fetchReportingData = async () => {
    try {
      const [projectsRes, invoicesRes, customersRes] = await Promise.all([
        supabase.from('projects').select('*'),
        supabase.from('invoices').select('*'),
        supabase.from('customers').select('*'),
      ]);
      if (projectsRes.error) throw projectsRes.error;
      if (invoicesRes.error) throw invoicesRes.error;
      if (customersRes.error) throw customersRes.error;
      setProjects(projectsRes.data || []);
      setInvoices(invoicesRes.data || []);
      setCustomers(customersRes.data || []);
      // Calculate KPIs
      const totalRevenue = (invoicesRes.data || []).filter((inv: any) => inv.status === 'paid').reduce((sum: number, inv: any) => sum + inv.total_amount, 0);
      const totalLeads = 0; // If you want to fetch leads, add here
      const qualifiedLeads = 0;
      const activeProjects = (projectsRes.data || []).filter((p: any) => p.status !== 'completed').length;
      const completedProjects = (projectsRes.data || []).filter((p: any) => p.status === 'completed').length;
      const conversionRate = totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0;
      const avgProjectValue = (projectsRes.data || []).length > 0 ? Math.round((projectsRes.data || []).reduce((sum: number, p: any) => sum + p.budget, 0) / (projectsRes.data || []).length) : 0;
      setKPIs([
        { id: '1', name: 'Total Revenue', value: totalRevenue, unit: 'TND', target: 0, trend: 'up', change: 0, period: '', category: 'financial' },
        { id: '2', name: 'Active Projects', value: activeProjects, unit: '', target: 0, trend: 'up', change: 0, period: '', category: 'operational' },
        { id: '3', name: 'Completed Projects', value: completedProjects, unit: '', target: 0, trend: 'up', change: 0, period: '', category: 'operational' },
        { id: '4', name: 'Average Project Value', value: avgProjectValue, unit: 'TND', target: 0, trend: 'stable', change: 0, period: '', category: 'financial' },
      ]);
    } catch (error) {
      console.error('Error fetching reporting data:', error);
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || report.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const refreshData = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
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
              <h1 className="text-xl font-semibold text-gray-900">{t('nav.reporting')} & Analytics</h1>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={refreshData} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="kpis">KPIs</TabsTrigger>
            <TabsTrigger value="builder">Report Builder</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Executive Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">145,230 TND</div>
                  <div className="flex items-center text-xs text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12.5% from last month
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">42</div>
                  <div className="flex items-center text-xs text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +8 new this month
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">68%</div>
                  <div className="flex items-center text-xs text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +4% from last month
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.6/5</div>
                  <div className="flex items-center text-xs text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +8.2% from last month
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Revenue chart would be displayed here</p>
                      <p className="text-sm text-gray-500">Integration with charting library needed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Project Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Project status pie chart would be displayed here</p>
                      <p className="text-sm text-gray-500">Integration with charting library needed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Reports */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.slice(0, 5).map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {typeIcons[report.type]}
                        </div>
                        <div>
                          <p className="font-medium">{report.name}</p>
                          <p className="text-sm text-gray-600">{report.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={categoryColors[report.category]}>
                              {report.category}
                            </Badge>
                            <Badge className={statusColors[report.status]}>
                              {report.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right text-sm text-gray-600">
                          <p>Last generated</p>
                          <p>{report.lastGenerated}</p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="sales">Sales</option>
                  <option value="financial">Financial</option>
                  <option value="operational">Operational</option>
                  <option value="compliance">Compliance</option>
                  <option value="custom">Custom</option>
                </select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredReports.map((report) => (
                <Card key={report.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {typeIcons[report.type]}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{report.name}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                        </div>
                      </div>
                      <Badge className={statusColors[report.status]}>
                        {report.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge className={categoryColors[report.category]}>
                          {report.category}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          {report.frequency}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Created by</p>
                          <p className="font-medium">{report.createdBy}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Last generated</p>
                          <p className="font-medium">{report.lastGenerated}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 mb-1">Recipients</p>
                        <div className="flex flex-wrap gap-1">
                          {report.recipients.map((recipient, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {recipient}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="kpis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
                <p className="text-sm text-gray-600">
                  Track your business performance with real-time KPIs
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {kpis.map((kpi) => (
                    <Card key={kpi.id} className="border-l-4 border-l-blue-500">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{kpi.name}</CardTitle>
                          <Badge className={categoryColors[kpi.category]}>
                            {kpi.category}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-end space-x-2">
                            <span className="text-2xl font-bold">
                              {kpi.value.toLocaleString()}
                            </span>
                            <span className="text-gray-600">{kpi.unit}</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Target: {kpi.target.toLocaleString()}</span>
                            <div className={`flex items-center space-x-1 ${
                              kpi.trend === 'up' ? 'text-green-600' : 
                              kpi.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              {kpi.trend === 'up' && <TrendingUp className="h-3 w-3" />}
                              {kpi.trend === 'down' && <TrendingDown className="h-3 w-3" />}
                              <span>{Math.abs(kpi.change)}%</span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Progress to target</span>
                              <span>{Math.round((kpi.value / kpi.target) * 100)}%</span>
                            </div>
                            <Progress 
                              value={Math.min((kpi.value / kpi.target) * 100, 100)} 
                              className="h-2" 
                            />
                          </div>

                          <p className="text-xs text-gray-500">{kpi.period}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="builder" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Report Builder</CardTitle>
                <p className="text-sm text-gray-600">
                  Create custom reports and dashboards
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="border-dashed border-2 border-gray-300 hover:border-blue-500 transition-colors cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <BarChart3 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <h3 className="font-medium">Sales Dashboard</h3>
                      <p className="text-sm text-gray-600">Track sales performance</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Create
                      </Button>
                    </CardContent>
                  </Card>
                  <Card className="border-dashed border-2 border-gray-300 hover:border-blue-500 transition-colors cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <PieChart className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <h3 className="font-medium">Financial Report</h3>
                      <p className="text-sm text-gray-600">Revenue and cost analysis</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Create
                      </Button>
                    </CardContent>
                  </Card>
                  <Card className="border-dashed border-2 border-gray-300 hover:border-blue-500 transition-colors cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <h3 className="font-medium">Project Report</h3>
                      <p className="text-sm text-gray-600">Project status and progress</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Create
                      </Button>
                    </CardContent>
                  </Card>
                  <Card className="border-dashed border-2 border-gray-300 hover:border-blue-500 transition-colors cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <h3 className="font-medium">Customer Report</h3>
                      <p className="text-sm text-gray-600">Customer insights</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Create
                      </Button>
                    </CardContent>
                  </Card>
                  <Card className="border-dashed border-2 border-gray-300 hover:border-blue-500 transition-colors cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <h3 className="font-medium">Inventory Report</h3>
                      <p className="text-sm text-gray-600">Stock levels and turnover</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Create
                      </Button>
                    </CardContent>
                  </Card>
                  <Card className="border-dashed border-2 border-gray-300 hover:border-blue-500 transition-colors cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <h3 className="font-medium">Custom Report</h3>
                      <p className="text-sm text-gray-600">Build from scratch</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Create
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
