'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  Calendar,
  User,
  MapPin,
  Tag,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  MessageSquare,
  Clock,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  DollarSign,
  FileText,
  Send,
  UserPlus,
  Star,
  AlertCircle,
  CheckCircle,
  Home,
  Building,
  Sprout,
  Download,
  Upload,
  Settings,
  X,
  Bell,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  location: {
    address: string;
    city: string;
    coordinates?: { lat: number; lng: number };
  };
  source: 'website' | 'referral' | 'social_media' | 'cold_call' | 'trade_show' | 'advertisement' | 'other';
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  type: 'residential' | 'industrial' | 'agricultural';
  estimatedValue: number;
  probability: number;
  lastContact: string;
  nextFollowUp?: string;
  tags: string[];
  assignedTo: {
    id: string;
    name: string;
    email: string;
  };
  leadScore: number;
  notes: LeadNote[];
  activities: Activity[];
  documents: Document[];
  createdAt: string;
  updatedAt: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address: string;
  city: string;
  postalCode: string;
  taxId?: string;
  customerSince: string;
  totalProjects: number;
  totalValue: number;
  status: 'active' | 'inactive' | 'prospect';
  preferredContact: 'email' | 'phone' | 'sms';
  leadId?: string;
  projects: string[];
  notes: CustomerNote[];
  createdAt: string;
  updatedAt: string;
}

interface LeadNote {
  id: string;
  leadId: string;
  author: {
    id: string;
    name: string;
  };
  content: string;
  type: 'call' | 'email' | 'meeting' | 'general';
  createdAt: string;
  attachments?: string[];
}

interface CustomerNote {
  id: string;
  customerId: string;
  author: {
    id: string;
    name: string;
  };
  content: string;
  type: 'support' | 'sales' | 'technical' | 'general';
  createdAt: string;
  attachments?: string[];
}

interface Activity {
  id: string;
  leadId?: string;
  customerId?: string;
  type: 'call' | 'email' | 'meeting' | 'proposal_sent' | 'quote_sent' | 'contract_signed' | 'payment_received';
  description: string;
  outcome?: string;
  scheduledDate?: string;
  completedDate?: string;
  duration?: number;
  createdBy: {
    id: string;
    name: string;
  };
  createdAt: string;
}

interface FollowUpTask {
  id: string;
  leadId?: string;
  customerId?: string;
  title: string;
  description: string;
  type: 'call' | 'email' | 'meeting' | 'proposal' | 'quote' | 'demo';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'completed' | 'cancelled';
  dueDate: string;
  assignedTo: {
    id: string;
    name: string;
  };
  createdAt: string;
  completedAt?: string;
}

const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Ahmed Ben Salem',
    email: 'ahmed.salem@email.com',
    phone: '+216 20 123 456',
    company: 'Salem Trading',
    location: {
      address: 'Villa 15, Sidi Bou Said',
      city: 'Tunis',
      coordinates: { lat: 36.8685, lng: 10.3470 }
    },
    source: 'website',
    status: 'qualified',
    type: 'residential',
    estimatedValue: 15000,
    probability: 75,
    lastContact: '2024-01-15',
    nextFollowUp: '2024-01-22',
    tags: ['Hot Lead', 'Referral', 'High Value'],
    assignedTo: {
      id: 'u1',
      name: 'Sarah Hadj',
      email: 'sarah.hadj@company.tn'
    },
    leadScore: 85,
    notes: [],
    activities: [],
    documents: [],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Fatima Manufacturing SARL',
    email: 'contact@fatima-mfg.tn',
    phone: '+216 71 234 567',
    company: 'Fatima Manufacturing',
    location: {
      address: 'Zone Industrielle',
      city: 'Sfax',
      coordinates: { lat: 34.7406, lng: 10.7603 }
    },
    source: 'referral',
    status: 'proposal',
    type: 'industrial',
    estimatedValue: 120000,
    probability: 60,
    lastContact: '2024-01-14',
    nextFollowUp: '2024-01-21',
    tags: ['Large Project', 'Manufacturing', 'Energy Savings'],
    assignedTo: {
      id: 'u2',
      name: 'Mohamed Ali',
      email: 'mohamed.ali@company.tn'
    },
    leadScore: 78,
    notes: [],
    activities: [],
    documents: [],
    createdAt: '2024-01-08',
    updatedAt: '2024-01-14'
  },
  {
    id: '3',
    name: 'Mohamed Agri Farm',
    email: 'mohamed.agri@email.com',
    phone: '+216 25 345 678',
    location: {
      address: 'Route de Sousse, Km 15',
      city: 'Kairouan',
      coordinates: { lat: 35.6781, lng: 10.0963 }
    },
    source: 'social_media',
    status: 'contacted',
    type: 'agricultural',
    estimatedValue: 25000,
    probability: 40,
    lastContact: '2024-01-13',
    nextFollowUp: '2024-01-20',
    tags: ['Agriculture', 'Off-Grid', 'Government Subsidy'],
    assignedTo: {
      id: 'u3',
      name: 'Amina Tounsi',
      email: 'amina.tounsi@company.tn'
    },
    leadScore: 65,
    notes: [],
    activities: [],
    documents: [],
    createdAt: '2024-01-05',
    updatedAt: '2024-01-13'
  },
  {
    id: '4',
    name: 'Nour Hotel Group',
    email: 'sustainability@nourhotels.tn',
    phone: '+216 71 456 789',
    company: 'Nour Hotel Group',
    location: {
      address: 'Avenue Habib Bourguiba',
      city: 'Sousse',
      coordinates: { lat: 35.8256, lng: 10.6369 }
    },
    source: 'trade_show',
    status: 'new',
    type: 'industrial',
    estimatedValue: 80000,
    probability: 20,
    lastContact: '2024-01-18',
    tags: ['Hospitality', 'Sustainability', 'Multiple Locations'],
    assignedTo: {
      id: 'u1',
      name: 'Sarah Hadj',
      email: 'sarah.hadj@company.tn'
    },
    leadScore: 45,
    notes: [],
    activities: [],
    documents: [],
    createdAt: '2024-01-18',
    updatedAt: '2024-01-18'
  }
];

const mockCustomers: Customer[] = [
  {
    id: 'c1',
    name: 'Karim Mansouri',
    email: 'karim.mansouri@email.com',
    phone: '+216 20 987 654',
    company: 'Mansouri Enterprises',
    address: 'Rue de la République 45',
    city: 'Tunis',
    postalCode: '1001',
    taxId: 'TN123456789',
    customerSince: '2023-06-15',
    totalProjects: 2,
    totalValue: 35000,
    status: 'active',
    preferredContact: 'email',
    leadId: 'old_lead_1',
    projects: ['proj_1', 'proj_2'],
    notes: [],
    createdAt: '2023-06-15',
    updatedAt: '2024-01-10'
  },
  {
    id: 'c2',
    name: 'Textile Industries SA',
    email: 'procurement@textile-sa.tn',
    phone: '+216 73 123 456',
    company: 'Textile Industries SA',
    address: 'Zone Industrielle Monastir',
    city: 'Monastir',
    postalCode: '5000',
    taxId: 'TN987654321',
    customerSince: '2023-09-20',
    totalProjects: 1,
    totalValue: 150000,
    status: 'active',
    preferredContact: 'phone',
    projects: ['proj_3'],
    notes: [],
    createdAt: '2023-09-20',
    updatedAt: '2024-01-05'
  }
];

const statusColors = {
  new: 'bg-gray-100 text-gray-800',
  contacted: 'bg-blue-100 text-blue-800',
  qualified: 'bg-green-100 text-green-800',
  proposal: 'bg-yellow-100 text-yellow-800',
  negotiation: 'bg-orange-100 text-orange-800',
  closed_won: 'bg-emerald-100 text-emerald-800',
  closed_lost: 'bg-red-100 text-red-800',
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-red-100 text-red-800',
  prospect: 'bg-blue-100 text-blue-800'
};

const typeColors = {
  residential: 'bg-blue-100 text-blue-800',
  industrial: 'bg-red-100 text-red-800',
  agricultural: 'bg-green-100 text-green-800'
};

const typeIcons = {
  residential: <Home className="h-4 w-4" />,
  industrial: <Building className="h-4 w-4" />,
  agricultural: <Sprout className="h-4 w-4" />
};

const sourceColors = {
  website: 'bg-blue-100 text-blue-800',
  referral: 'bg-green-100 text-green-800',
  social_media: 'bg-purple-100 text-purple-800',
  cold_call: 'bg-orange-100 text-orange-800',
  trade_show: 'bg-indigo-100 text-indigo-800',
  advertisement: 'bg-pink-100 text-pink-800',
  other: 'bg-gray-100 text-gray-800'
};

export default function CRMPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = selectedStatus === 'all' || lead.status === selectedStatus;
    const matchesType = selectedType === 'all' || lead.type === selectedType;
    const matchesSource = selectedSource === 'all' || lead.source === selectedSource;
    return matchesSearch && matchesStatus && matchesType && matchesSource;
  });

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (customer.company && customer.company.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const stats = {
    totalLeads: leads.length,
    qualifiedLeads: leads.filter(l => l.status === 'qualified').length,
    conversionRate: leads.length > 0 ? Math.round((leads.filter(l => l.status === 'closed_won').length / leads.length) * 100) : 0,
    pipelineValue: leads.reduce((sum, l) => sum + (l.estimatedValue * l.probability / 100), 0),
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.status === 'active').length,
    avgDealSize: leads.length > 0 ? Math.round(leads.reduce((sum, l) => sum + l.estimatedValue, 0) / leads.length) : 0,
    avgLeadScore: leads.length > 0 ? Math.round(leads.reduce((sum, l) => sum + l.leadScore, 0) / leads.length) : 0
  };

  useEffect(() => {
    fetchCRMData();
  }, []);

  const fetchCRMData = async () => {
    try {
      setLoading(true);
      // In a real app, fetch from Supabase
      // const { data: leadsData, error: leadsError } = await supabase.from('leads').select('*');
      // const { data: customersData, error: customersError } = await supabase.from('customers').select('*');
      // if (leadsError) throw leadsError;
      // if (customersError) throw customersError;
      // setLeads(leadsData || []);
      // setCustomers(customersData || []);
    } catch (error) {
      console.error('Error fetching CRM data:', error);
    } finally {
      setLoading(false);
    }
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
              <h1 className="text-xl font-semibold text-gray-900">{t('nav.crm')} - Customer Relationship Management</h1>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import Leads
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Lead
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalLeads}</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +15% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Qualified Leads</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.qualifiedLeads}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.totalLeads > 0 ? Math.round((stats.qualifiedLeads / stats.totalLeads) * 100) : 0}% qualification rate
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pipelineValue.toLocaleString()} TND</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +22% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.conversionRate}%</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +4% from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Sales Funnel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Funnel</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(statusColors).filter(([status]) => 
                      ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed_won'].includes(status)
                    ).map(([status, colorClass]) => {
                      const count = leads.filter(l => l.status === status).length;
                      const percentage = leads.length > 0 ? (count / leads.length) * 100 : 0;
                      const value = leads.filter(l => l.status === status).reduce((sum, l) => sum + l.estimatedValue, 0);
                      
                      return (
                        <div key={status} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Badge className={colorClass}>
                                {status.replace('_', ' ').toUpperCase()}
                              </Badge>
                              <span className="text-sm text-gray-600">{count} leads</span>
                            </div>
                            <span className="text-sm font-medium">{value.toLocaleString()} TND</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Lead Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(sourceColors).map(([source, colorClass]) => {
                      const count = leads.filter(l => l.source === source).length;
                      const percentage = leads.length > 0 ? (count / leads.length) * 100 : 0;
                      
                      if (count === 0) return null;
                      
                      return (
                        <div key={source} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge className={colorClass}>
                              {source.replace('_', ' ').toUpperCase()}
                            </Badge>
                            <span className="text-sm text-gray-600">{count} leads</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{percentage.toFixed(0)}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent CRM Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <UserPlus className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New lead qualified</p>
                      <p className="text-xs text-gray-500">Ahmed Ben Salem - Residential solar inquiry</p>
                      <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">+15,000 TND</Badge>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Send className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Proposal sent</p>
                      <p className="text-xs text-gray-500">Fatima Manufacturing - Industrial solar proposal</p>
                      <p className="text-xs text-gray-400 mt-1">4 hours ago</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">120,000 TND</Badge>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-orange-100 p-2 rounded-full">
                      <Phone className="h-4 w-4 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Follow-up call scheduled</p>
                      <p className="text-xs text-gray-500">Mohamed Agri Farm - Agricultural system discussion</p>
                      <p className="text-xs text-gray-400 mt-1">6 hours ago</p>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800">Tomorrow 10:00</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leads" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search leads..."
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
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="proposal">Proposal</option>
                  <option value="negotiation">Negotiation</option>
                  <option value="closed_won">Closed Won</option>
                  <option value="closed_lost">Closed Lost</option>
                </select>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="residential">Residential</option>
                  <option value="industrial">Industrial</option>
                  <option value="agricultural">Agricultural</option>
                </select>
                <select
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Sources</option>
                  <option value="website">Website</option>
                  <option value="referral">Referral</option>
                  <option value="social_media">Social Media</option>
                  <option value="cold_call">Cold Call</option>
                  <option value="trade_show">Trade Show</option>
                  <option value="advertisement">Advertisement</option>
                  <option value="other">Other</option>
                </select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Leads Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredLeads.map((lead) => (
                <Card key={lead.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {typeIcons[lead.type]}
                          <CardTitle className="text-lg">{lead.name}</CardTitle>
                        </div>
                        {lead.company && (
                          <p className="text-sm text-gray-600">{lead.company}</p>
                        )}
                        <div className="flex items-center space-x-1 mt-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{lead.location.city}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <Badge className={statusColors[lead.status]}>
                          {lead.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="text-xs font-medium">{lead.leadScore}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Badge className={typeColors[lead.type]}>
                          {lead.type.charAt(0).toUpperCase() + lead.type.slice(1)}
                        </Badge>
                        <Badge className={sourceColors[lead.source]} variant="outline">
                          {lead.source.replace('_', ' ')}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Estimated Value</span>
                          <span className="font-medium">{lead.estimatedValue.toLocaleString()} TND</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Probability</span>
                          <span className="font-medium">{lead.probability}%</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Expected Value</span>
                            <span className="font-medium text-green-600">
                              {Math.round(lead.estimatedValue * lead.probability / 100).toLocaleString()} TND
                            </span>
                          </div>
                          <Progress value={lead.probability} className="h-2" />
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-600">{lead.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-600">{lead.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-600">{lead.assignedTo.name}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <p className="text-gray-600">Last Contact</p>
                          <p className="font-medium">{lead.lastContact}</p>
                        </div>
                        {lead.nextFollowUp && (
                          <div className="text-right">
                            <p className="text-gray-600">Next Follow-up</p>
                            <p className="font-medium text-orange-600">{lead.nextFollowUp}</p>
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {lead.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {lead.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{lead.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex space-x-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => setSelectedLead(lead)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            {/* Customer Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Customers Table */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Directory</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Customer</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Contact</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Projects</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Total Value</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Customer Since</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.map((customer) => (
                        <tr key={customer.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div>
                              <div className="font-medium text-gray-900">{customer.name}</div>
                              {customer.company && (
                                <div className="text-sm text-gray-500">{customer.company}</div>
                              )}
                              <div className="text-xs text-gray-400 flex items-center mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                {customer.city}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-gray-600">
                                <Mail className="h-3 w-3 mr-2" />
                                {customer.email}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <Phone className="h-3 w-3 mr-2" />
                                {customer.phone}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge className={statusColors[customer.status]}>
                              {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-center">
                              <div className="text-lg font-bold">{customer.totalProjects}</div>
                              <div className="text-xs text-gray-500">projects</div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-medium">
                              {customer.totalValue.toLocaleString()} TND
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm">{customer.customerSince}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => setSelectedCustomer(customer)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Phone className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Mail className="h-4 w-4" />
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

          <TabsContent value="pipeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Pipeline</CardTitle>
                <p className="text-sm text-gray-600">
                  Visual representation of your sales pipeline and deal progression
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed_won'].map((status) => {
                    const statusLeads = leads.filter(l => l.status === status);
                    const statusValue = statusLeads.reduce((sum, l) => sum + l.estimatedValue, 0);
                    
                    return (
                      <div key={status} className="bg-gray-50 rounded-lg p-4">
                        <div className="text-center mb-3">
                          <h3 className="font-medium text-sm">
                            {status.replace('_', ' ').toUpperCase()}
                          </h3>
                          <p className="text-xs text-gray-600">
                            {statusLeads.length} leads • {statusValue.toLocaleString()} TND
                          </p>
                        </div>
                        <div className="space-y-2">
                          {statusLeads.slice(0, 3).map((lead) => (
                            <div key={lead.id} className="bg-white p-2 rounded border text-xs">
                              <p className="font-medium truncate">{lead.name}</p>
                              <p className="text-gray-600">{lead.estimatedValue.toLocaleString()} TND</p>
                            </div>
                          ))}
                          {statusLeads.length > 3 && (
                            <div className="text-center text-xs text-gray-500">
                              +{statusLeads.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
                <p className="text-sm text-gray-600">
                  Track all customer interactions and follow-up activities
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Phone className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Phone call with Ahmed Ben Salem</p>
                      <p className="text-xs text-gray-500">Discussed system requirements and site conditions</p>
                      <p className="text-xs text-gray-400 mt-1">Today, 2:30 PM • Duration: 25 minutes</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Completed</Badge>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Mail className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Proposal sent to Fatima Manufacturing</p>
                      <p className="text-xs text-gray-500">150kW industrial solar system proposal with ROI analysis</p>
                      <p className="text-xs text-gray-400 mt-1">Yesterday, 4:15 PM</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Sent</Badge>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Calendar className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Site visit scheduled</p>
                      <p className="text-xs text-gray-500">Mohamed Agri Farm - Technical assessment and measurements</p>
                      <p className="text-xs text-gray-400 mt-1">Tomorrow, 10:00 AM</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Scheduled</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>CRM Reports</CardTitle>
                <p className="text-sm text-gray-600">
                  Generate comprehensive sales and customer reports
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="border-dashed border-2 border-gray-300 hover:border-blue-500 transition-colors cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <h3 className="font-medium">Lead Performance</h3>
                      <p className="text-sm text-gray-600">Lead sources and conversion rates</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Generate
                      </Button>
                    </CardContent>
                  </Card>
                  <Card className="border-dashed border-2 border-gray-300 hover:border-blue-500 transition-colors cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Target className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <h3 className="font-medium">Sales Pipeline</h3>
                      <p className="text-sm text-gray-600">Pipeline analysis and forecasting</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Generate
                      </Button>
                    </CardContent>
                  </Card>
                  <Card className="border-dashed border-2 border-gray-300 hover:border-blue-500 transition-colors cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Activity className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <h3 className="font-medium">Sales Activity</h3>
                      <p className="text-sm text-gray-600">Team performance and activities</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Generate
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Lead Details Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{selectedLead.name}</h2>
                <Button variant="ghost" size="icon" onClick={() => setSelectedLead(null)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Lead Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span>{selectedLead.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span>{selectedLead.phone}</span>
                    </div>
                    {selectedLead.company && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Company:</span>
                        <span>{selectedLead.company}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span>{selectedLead.location.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Source:</span>
                      <Badge className={sourceColors[selectedLead.source]}>
                        {selectedLead.source.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <Badge className={typeColors[selectedLead.type]}>
                        {selectedLead.type}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className={statusColors[selectedLead.status]}>
                        {selectedLead.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-3">Sales Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Value:</span>
                      <span className="font-medium">{selectedLead.estimatedValue.toLocaleString()} TND</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Probability:</span>
                      <span className="font-medium">{selectedLead.probability}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expected Value:</span>
                      <span className="font-medium text-green-600">
                        {Math.round(selectedLead.estimatedValue * selectedLead.probability / 100).toLocaleString()} TND
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lead Score:</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="font-medium">{selectedLead.leadScore}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Assigned To:</span>
                      <span>{selectedLead.assignedTo.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Contact:</span>
                      <span>{selectedLead.lastContact}</span>
                    </div>
                    {selectedLead.nextFollowUp && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Next Follow-up:</span>
                        <span className="text-orange-600">{selectedLead.nextFollowUp}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="font-medium mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedLead.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex space-x-2">
                <Button className="flex-1">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Lead
                </Button>
                <Button variant="outline" className="flex-1">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" className="flex-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
                <Button variant="outline" className="flex-1">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Convert to Customer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{selectedCustomer.name}</h2>
                <Button variant="ghost" size="icon" onClick={() => setSelectedCustomer(null)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span>{selectedCustomer.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span>{selectedCustomer.phone}</span>
                    </div>
                    {selectedCustomer.company && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Company:</span>
                        <span>{selectedCustomer.company}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Address:</span>
                      <span>{selectedCustomer.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">City:</span>
                      <span>{selectedCustomer.city}</span>
                    </div>
                    {selectedCustomer.taxId && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax ID:</span>
                        <span>{selectedCustomer.taxId}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className={statusColors[selectedCustomer.status]}>
                        {selectedCustomer.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-3">Business Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Customer Since:</span>
                      <span>{selectedCustomer.customerSince}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Projects:</span>
                      <span className="font-medium">{selectedCustomer.totalProjects}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Value:</span>
                      <span className="font-medium text-green-600">
                        {selectedCustomer.totalValue.toLocaleString()} TND
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Preferred Contact:</span>
                      <span>{selectedCustomer.preferredContact}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex space-x-2">
                <Button className="flex-1">
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
                <Button variant="outline" className="flex-1">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Customer
                </Button>
                <Button variant="outline" className="flex-1">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  View Projects
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
