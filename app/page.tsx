'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { 
  Sun, 
  Users, 
  FolderOpen, 
  Calculator, 
  FileCheck, 
  Package, 
  DollarSign, 
  BarChart3,
  Settings,
  Menu,
  X,
  Bell,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { supabase } from '@/lib/supabase';

interface Module {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  href: string;
  stats?: {
    label: string;
    value: string;
    trend?: 'up' | 'down' | 'stable';
  };
}

interface DashboardStats {
  totalRevenue: number;
  activeProjects: number;
  conversionRate: number;
  totalLeads: number;
  qualifiedLeads: number;
  completedProjects: number;
}

export default function Dashboard() {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    activeProjects: 0,
    conversionRate: 0,
    totalLeads: 0,
    qualifiedLeads: 0,
    completedProjects: 0
  });
  const [loading, setLoading] = useState(true);

  const modules: Module[] = [
    {
      id: 'crm',
      title: t('nav.crm'),
      description: 'Customer Relationship Management',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-blue-500',
      href: '/crm',
      stats: { label: 'Active Leads', value: stats.totalLeads.toString(), trend: 'up' }
    },
    {
      id: 'projects',
      title: t('nav.projects'),
      description: 'Project lifecycle management',
      icon: <FolderOpen className="w-6 h-6" />,
      color: 'bg-green-500',
      href: '/projects',
      stats: { label: 'Active Projects', value: stats.activeProjects.toString(), trend: 'up' }
    },
    {
      id: 'design',
      title: t('nav.design'),
      description: 'System sizing and energy calculations',
      icon: <Calculator className="w-6 h-6" />,
      color: 'bg-purple-500',
      href: '/design',
      stats: { label: 'Simulations', value: '89', trend: 'stable' }
    },
    {
      id: 'compliance',
      title: t('nav.compliance'),
      description: 'Tunisian regulations and compliance',
      icon: <FileCheck className="w-6 h-6" />,
      color: 'bg-orange-500',
      href: '/compliance',
      stats: { label: 'Pending Reviews', value: '15', trend: 'down' }
    },
    {
      id: 'procurement',
      title: t('nav.procurement'),
      description: 'Supplier and inventory management',
      icon: <Package className="w-6 h-6" />,
      color: 'bg-indigo-500',
      href: '/procurement',
      stats: { label: 'Stock Items', value: '234', trend: 'stable' }
    },
    {
      id: 'finance',
      title: t('nav.finance'),
      description: 'Quotes, invoices, and payments',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'bg-emerald-500',
      href: '/finance',
      stats: { label: 'Revenue (TND)', value: stats.totalRevenue.toLocaleString(), trend: 'up' }
    },
    {
      id: 'reporting',
      title: t('nav.reporting'),
      description: 'Dashboards and insights',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'bg-red-500',
      href: '/reporting',
      stats: { label: 'Reports Generated', value: '67', trend: 'up' }
    },
    {
      id: 'settings',
      title: t('nav.settings'),
      description: 'System configuration and roles',
      icon: <Settings className="w-6 h-6" />,
      color: 'bg-gray-500',
      href: '/settings',
      stats: { label: 'Active Users', value: '12', trend: 'stable' }
    }
  ];

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch leads data
      const { data: leads, error: leadsError } = await supabase
        .from('leads')
        .select('*');
      
      if (leadsError) {
        console.error('Error fetching leads:', leadsError);
      }

      // Fetch projects data
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*');
      
      if (projectsError) {
        console.error('Error fetching projects:', projectsError);
      }

      // Calculate stats
      const totalLeads = leads?.length || 127; // Fallback to mock data
      const qualifiedLeads = leads?.filter(lead => lead.status === 'qualified').length || 42;
      const activeProjects = projects?.filter(project => project.status !== 'completed').length || 42;
      const completedProjects = projects?.filter(project => project.status === 'completed').length || 12;
      const totalRevenue = projects?.reduce((sum, project) => sum + (project.budget || 0), 0) || 145230;
      const conversionRate = totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 68;

      setStats({
        totalRevenue,
        activeProjects,
        conversionRate,
        totalLeads,
        qualifiedLeads,
        completedProjects
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Use fallback mock data
      setStats({
        totalRevenue: 145230,
        activeProjects: 42,
        conversionRate: 68,
        totalLeads: 127,
        qualifiedLeads: 42,
        completedProjects: 12
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <div className="flex-shrink-0 flex items-center ml-4 lg:ml-0">
                <Sun className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">SolarPro ERP</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={t('common.search')}
                  className="pl-10 w-64"
                />
              </div>
              
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>

              <LanguageSwitcher />

              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">JD</span>
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-700">John Doe</div>
                  <div className="text-xs text-gray-500">Administrator</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t('dashboard.welcome')}
          </h1>
          <p className="text-gray-600">
            {t('dashboard.subtitle')}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.totalRevenue')}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? t('common.loading') : `${stats.totalRevenue.toLocaleString()} TND`}
              </div>
              <p className="text-xs text-muted-foreground">
                +12.5% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.activeProjects')}</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? t('common.loading') : stats.activeProjects}
              </div>
              <p className="text-xs text-muted-foreground">
                +8 new this month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.conversionRate')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? t('common.loading') : `${stats.conversionRate}%`}
              </div>
              <p className="text-xs text-muted-foreground">
                +4% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {modules.map((module) => (
            <Link key={module.id} href={module.href}>
              <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer group">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className={`${module.color} p-3 rounded-lg text-white group-hover:scale-110 transition-transform duration-200`}>
                      {module.icon}
                    </div>
                    {module.stats && (
                      <Badge variant="secondary" className="text-xs">
                        {module.stats.trend === 'up' && '↗'}
                        {module.stats.trend === 'down' && '↘'}
                        {module.stats.trend === 'stable' && '→'}
                        {module.stats.value}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg font-semibold group-hover:text-blue-600 transition-colors">
                    {module.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    {module.description}
                  </CardDescription>
                </CardHeader>
                {module.stats && (
                  <CardContent className="pt-0">
                    <div className="text-sm text-gray-500">
                      {module.stats.label}: <span className="font-medium">{module.stats.value}</span>
                    </div>
                  </CardContent>
                )}
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.recentActivity')}</CardTitle>
              <CardDescription>Latest updates across all modules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <FolderOpen className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New project created</p>
                    <p className="text-xs text-gray-500">Industrial solar installation for ABC Manufacturing</p>
                    <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Lead converted to customer</p>
                    <p className="text-xs text-gray-500">Mohamed Ben Ali - Residential solar inquiry</p>
                    <p className="text-xs text-gray-400 mt-1">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-orange-100 p-2 rounded-full">
                    <Package className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Inventory restocked</p>
                    <p className="text-xs text-gray-500">500W Solar panels - 50 units received</p>
                    <p className="text-xs text-gray-400 mt-1">6 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}