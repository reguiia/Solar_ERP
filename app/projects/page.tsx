'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Filter, 
  X,
  Calendar,
  User,
  MapPin,
  Clock,
  CheckCircle,
  FolderOpen,
  AlertCircle,
  MoreHorizontal,
  Eye,
  Edit,
  FileText,
  Wrench,
  Zap,
  Home,
  Building,
  Sprout,
  Play,
  Pause,
  Square,
  Download,
  Upload,
  MessageSquare,
  Phone,
  Mail,
  Camera,
  ClipboardList,
  DollarSign,
  Package,
  Settings,
  Users,
  Target,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';

interface Project {
  id: string;
  name: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  type: 'residential' | 'industrial' | 'agricultural';
  status: 'planning' | 'design' | 'approval' | 'procurement' | 'installation' | 'testing' | 'completed' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  progress: number;
  startDate: string;
  endDate: string;
  estimatedEndDate: string;
  budget: number;
  spent: number;
  location: {
    address: string;
    city: string;
    coordinates?: { lat: number; lng: number };
  };
  projectManager: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  team: {
    id: string;
    name: string;
    role: string;
  }[];
  systemSpecs: {
    capacity: string;
    panelCount: number;
    inverterType: string;
    mountingType: string;
    estimatedProduction: number;
  };
  tasks: Task[];
  milestones: Milestone[];
  documents: Document[];
  notes: ProjectNote[];
  risks: Risk[];
  createdAt: string;
  updatedAt: string;
}

interface Task {
  id: string;
  projectId: string;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high';
  assignedTo: {
    id: string;
    name: string;
  };
  startDate: string;
  dueDate: string;
  completedDate?: string;
  estimatedHours: number;
  actualHours?: number;
  dependencies: string[];
  category: 'design' | 'procurement' | 'installation' | 'testing' | 'documentation' | 'compliance';
}

interface Milestone {
  id: string;
  projectId: string;
  name: string;
  description: string;
  targetDate: string;
  completedDate?: string;
  status: 'pending' | 'completed' | 'overdue';
  criteria: string[];
}

interface ProjectNote {
  id: string;
  projectId: string;
  author: {
    id: string;
    name: string;
  };
  content: string;
  type: 'general' | 'technical' | 'client' | 'issue';
  createdAt: string;
  attachments?: string[];
}

interface Risk {
  id: string;
  projectId: string;
  title: string;
  description: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  status: 'identified' | 'mitigating' | 'resolved' | 'occurred';
  mitigation: string;
  owner: string;
  identifiedDate: string;
}

interface SiteSurvey {
  id: string;
  projectId: string;
  surveyDate: string;
  surveyor: {
    id: string;
    name: string;
  };
  roofCondition: 'excellent' | 'good' | 'fair' | 'poor';
  roofType: 'tile' | 'metal' | 'flat' | 'shingle' | 'other';
  roofArea: number;
  shading: 'none' | 'minimal' | 'moderate' | 'significant';
  electricalPanel: {
    type: string;
    capacity: number;
    condition: string;
  };
  accessibilty: 'easy' | 'moderate' | 'difficult';
  photos: string[];
  notes: string;
  recommendations: string[];
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Residential Solar Installation - Villa Sidi Bou Said',
    customer: {
      id: 'c1',
      name: 'Ahmed Ben Salem',
      email: 'ahmed.salem@email.com',
      phone: '+216 20 123 456',
      address: 'Villa 15, Sidi Bou Said, Tunis'
    },
    type: 'residential',
    status: 'installation',
    priority: 'high',
    progress: 75,
    startDate: '2024-01-10',
    endDate: '2024-02-15',
    estimatedEndDate: '2024-02-12',
    budget: 15000,
    spent: 11250,
    location: {
      address: 'Villa 15, Sidi Bou Said',
      city: 'Tunis',
      coordinates: { lat: 36.8685, lng: 10.3470 }
    },
    projectManager: {
      id: 'pm1',
      name: 'Sarah Hadj',
      email: 'sarah.hadj@company.tn',
      phone: '+216 20 234 567'
    },
    team: [
      { id: 't1', name: 'Mohamed Ali', role: 'Lead Technician' },
      { id: 't2', name: 'Fatima Zahra', role: 'Electrician' },
      { id: 't3', name: 'Karim Bouzid', role: 'Assistant' }
    ],
    systemSpecs: {
      capacity: '8 kW',
      panelCount: 16,
      inverterType: 'String Inverter 8kW',
      mountingType: 'Roof Mount',
      estimatedProduction: 12000
    },
    tasks: [],
    milestones: [],
    documents: [],
    notes: [],
    risks: [],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-20'
  },
  {
    id: '2',
    name: 'Industrial Solar Array - Fatima Manufacturing',
    customer: {
      id: 'c2',
      name: 'Fatima Manufacturing SARL',
      email: 'contact@fatima-mfg.tn',
      phone: '+216 71 234 567',
      address: 'Zone Industrielle, Sfax'
    },
    type: 'industrial',
    status: 'design',
    priority: 'medium',
    progress: 35,
    startDate: '2024-01-15',
    endDate: '2024-04-30',
    estimatedEndDate: '2024-05-15',
    budget: 120000,
    spent: 42000,
    location: {
      address: 'Zone Industrielle Sfax',
      city: 'Sfax',
      coordinates: { lat: 34.7406, lng: 10.7603 }
    },
    projectManager: {
      id: 'pm2',
      name: 'Mohamed Ali',
      email: 'mohamed.ali@company.tn',
      phone: '+216 20 345 678'
    },
    team: [
      { id: 't4', name: 'Amina Tounsi', role: 'Design Engineer' },
      { id: 't5', name: 'Youssef Mansouri', role: 'Project Coordinator' }
    ],
    systemSpecs: {
      capacity: '150 kW',
      panelCount: 300,
      inverterType: 'Central Inverter 150kW',
      mountingType: 'Ground Mount',
      estimatedProduction: 225000
    },
    tasks: [],
    milestones: [],
    documents: [],
    notes: [],
    risks: [],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: '3',
    name: 'Agricultural Off-Grid System - Olive Farm Kairouan',
    customer: {
      id: 'c3',
      name: 'Mohamed Agri Farm',
      email: 'mohamed.agri@email.com',
      phone: '+216 25 345 678',
      address: 'Route de Sousse, Kairouan'
    },
    type: 'agricultural',
    status: 'approval',
    priority: 'low',
    progress: 20,
    startDate: '2024-01-20',
    endDate: '2024-03-20',
    estimatedEndDate: '2024-03-25',
    budget: 25000,
    spent: 5000,
    location: {
      address: 'Route de Sousse, Km 15',
      city: 'Kairouan',
      coordinates: { lat: 35.6781, lng: 10.0963 }
    },
    projectManager: {
      id: 'pm3',
      name: 'Amina Tounsi',
      email: 'amina.tounsi@company.tn',
      phone: '+216 20 456 789'
    },
    team: [
      { id: 't6', name: 'Slim Bouaziz', role: 'Agricultural Specialist' },
      { id: 't7', name: 'Nadia Khelifi', role: 'Off-Grid Technician' }
    ],
    systemSpecs: {
      capacity: '20 kW',
      panelCount: 40,
      inverterType: 'Hybrid Inverter 20kW',
      mountingType: 'Ground Mount',
      estimatedProduction: 30000
    },
    tasks: [],
    milestones: [],
    documents: [],
    notes: [],
    risks: [],
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20'
  }
];

const statusColors = {
  planning: 'bg-gray-100 text-gray-800',
  design: 'bg-blue-100 text-blue-800',
  approval: 'bg-yellow-100 text-yellow-800',
  procurement: 'bg-purple-100 text-purple-800',
  installation: 'bg-orange-100 text-orange-800',
  testing: 'bg-indigo-100 text-indigo-800',
  completed: 'bg-green-100 text-green-800',
  on_hold: 'bg-red-100 text-red-800'
};

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
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

export default function ProjectsPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
    const matchesType = selectedType === 'all' || project.type === selectedType;
    const matchesPriority = selectedPriority === 'all' || project.priority === selectedPriority;
    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => !['completed', 'on_hold'].includes(p.status)).length,
    completedThisMonth: projects.filter(p => p.status === 'completed').length,
    overdue: projects.filter(p => new Date(p.estimatedEndDate) < new Date() && p.status !== 'completed').length,
    totalValue: projects.reduce((sum, p) => sum + p.budget, 0),
    avgProgress: Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      // In a real app, fetch from Supabase
      // const { data, error } = await supabase.from('projects').select('*');
      // if (error) throw error;
      // setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
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
              <h1 className="text-xl font-semibold text-gray-900">{t('nav.projects')} - Project Management</h1>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalProjects}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.activeProjects} active
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed This Month</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.completedThisMonth}</div>
                  <p className="text-xs text-muted-foreground">+3 from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalValue.toLocaleString()} TND</div>
                  <p className="text-xs text-muted-foreground">+15% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overdue Projects</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
                  <p className="text-xs text-muted-foreground">Require attention</p>
                </CardContent>
              </Card>
            </div>

            {/* Project Status Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(statusColors).map(([status, colorClass]) => {
                      const count = projects.filter(p => p.status === status).length;
                      const percentage = projects.length > 0 ? (count / projects.length) * 100 : 0;
                      return (
                        <div key={status} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge className={colorClass}>
                              {status.replace('_', ' ').toUpperCase()}
                            </Badge>
                            <span className="text-sm text-gray-600">{count} projects</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
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

              <Card>
                <CardHeader>
                  <CardTitle>Recent Project Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Installation completed</p>
                        <p className="text-xs text-gray-500">Villa Sidi Bou Said - Phase 2 finished</p>
                        <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Design approved</p>
                        <p className="text-xs text-gray-500">Fatima Manufacturing - System design finalized</p>
                        <p className="text-xs text-gray-400 mt-1">4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-orange-100 p-2 rounded-full">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Delay reported</p>
                        <p className="text-xs text-gray-500">Olive Farm Kairouan - Permit approval delayed</p>
                        <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Milestones */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Target className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">System Testing</p>
                        <p className="text-sm text-gray-600">Villa Sidi Bou Said</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Feb 10, 2024</p>
                      <Badge className="bg-orange-100 text-orange-800">Due in 3 days</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FileText className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Design Review</p>
                        <p className="text-sm text-gray-600">Fatima Manufacturing</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Feb 15, 2024</p>
                      <Badge className="bg-yellow-100 text-yellow-800">Due in 8 days</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search projects..."
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
                  <option value="planning">Planning</option>
                  <option value="design">Design</option>
                  <option value="approval">Approval</option>
                  <option value="procurement">Procurement</option>
                  <option value="installation">Installation</option>
                  <option value="testing">Testing</option>
                  <option value="completed">Completed</option>
                  <option value="on_hold">On Hold</option>
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
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {typeIcons[project.type]}
                          <CardTitle className="text-lg line-clamp-2">{project.name}</CardTitle>
                        </div>
                        <p className="text-sm text-gray-600">{project.customer.name}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{project.location.city}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <Badge className={statusColors[project.status]}>
                          {project.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <Badge className={priorityColors[project.priority]} variant="outline">
                          {project.priority.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Badge className={typeColors[project.type]}>
                          {project.type.charAt(0).toUpperCase() + project.type.slice(1)}
                        </Badge>
                        <span className="text-sm font-medium">{project.systemSpecs.capacity}</span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Start Date</p>
                          <p className="font-medium">{project.startDate}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">End Date</p>
                          <p className="font-medium">{project.endDate}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Budget</p>
                          <p className="font-medium">{project.budget.toLocaleString()} TND</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Spent</p>
                          <p className="font-medium">{project.spent.toLocaleString()} TND</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="h-4 w-4 mr-1" />
                          {project.projectManager.name}
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{project.team.length}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => setSelectedProject(project)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Management</CardTitle>
                <p className="text-sm text-gray-600">
                  Track and manage all project tasks across your organization
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Wrench className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Site Survey</p>
                        <p className="text-sm text-gray-600">Villa Sidi Bou Said</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className="bg-orange-100 text-orange-800">In Progress</Badge>
                          <span className="text-xs text-gray-500">Due: Feb 8, 2024</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right text-sm">
                        <p className="font-medium">Mohamed Ali</p>
                        <p className="text-gray-500">Lead Technician</p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <FileText className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Design Review</p>
                        <p className="text-sm text-gray-600">Fatima Manufacturing</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                          <span className="text-xs text-gray-500">Due: Feb 15, 2024</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right text-sm">
                        <p className="font-medium">Amina Tounsi</p>
                        <p className="text-gray-500">Design Engineer</p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Permit Application</p>
                        <p className="text-sm text-gray-600">Olive Farm Kairouan</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className="bg-green-100 text-green-800">Completed</Badge>
                          <span className="text-xs text-gray-500">Completed: Feb 5, 2024</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right text-sm">
                        <p className="font-medium">Sarah Hadj</p>
                        <p className="text-gray-500">Project Manager</p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Calendar</CardTitle>
                <p className="text-sm text-gray-600">
                  View project timelines, milestones, and deadlines
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Calendar view would be displayed here</p>
                    <p className="text-sm text-gray-500">Integration with calendar library needed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Reports</CardTitle>
                <p className="text-sm text-gray-600">
                  Generate comprehensive project performance reports
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="border-dashed border-2 border-gray-300 hover:border-blue-500 transition-colors cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <BarChart3 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <h3 className="font-medium">Project Performance</h3>
                      <p className="text-sm text-gray-600">Progress and timeline analysis</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Generate
                      </Button>
                    </CardContent>
                  </Card>
                  <Card className="border-dashed border-2 border-gray-300 hover:border-blue-500 transition-colors cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <DollarSign className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <h3 className="font-medium">Budget Analysis</h3>
                      <p className="text-sm text-gray-600">Cost tracking and variance</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Generate
                      </Button>
                    </CardContent>
                  </Card>
                  <Card className="border-dashed border-2 border-gray-300 hover:border-blue-500 transition-colors cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <h3 className="font-medium">Resource Utilization</h3>
                      <p className="text-sm text-gray-600">Team productivity metrics</p>
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

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{selectedProject.name}</h2>
                <Button variant="ghost" size="icon" onClick={() => setSelectedProject(null)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Project Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Customer:</span>
                      <span>{selectedProject.customer.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <Badge className={typeColors[selectedProject.type]}>
                        {selectedProject.type}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className={statusColors[selectedProject.status]}>
                        {selectedProject.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Priority:</span>
                      <Badge className={priorityColors[selectedProject.priority]}>
                        {selectedProject.priority}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Progress:</span>
                      <span>{selectedProject.progress}%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-3">System Specifications</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Capacity:</span>
                      <span>{selectedProject.systemSpecs.capacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Panel Count:</span>
                      <span>{selectedProject.systemSpecs.panelCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Inverter:</span>
                      <span>{selectedProject.systemSpecs.inverterType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mounting:</span>
                      <span>{selectedProject.systemSpecs.mountingType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Est. Production:</span>
                      <span>{selectedProject.systemSpecs.estimatedProduction.toLocaleString()} kWh/year</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="font-medium mb-3">Project Team</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {selectedProject.projectManager.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{selectedProject.projectManager.name}</p>
                        <p className="text-sm text-gray-600">Project Manager</p>
                      </div>
                    </div>
                  </div>
                  {selectedProject.team.map((member) => (
                    <div key={member.id} className="p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-gray-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-gray-600">{member.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
