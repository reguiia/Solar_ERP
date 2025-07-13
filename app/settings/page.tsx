'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Filter, 
  Settings,
  Users,
  Shield,
  Globe,
  Bell,
  Database,
  Workflow,
  Palette,
  Key,
  Mail,
  Save,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Check,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';


interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'manager' | 'technician' | 'sales_rep';
  phone?: string;
  avatarUrl?: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin?: string;
  createdAt: string;
  permissions: string[];
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isSystem: boolean;
}

interface SystemSetting {
  id: string;
  category: 'general' | 'security' | 'notifications' | 'integrations' | 'appearance';
  key: string;
  name: string;
  description: string;
  type: 'boolean' | 'string' | 'number' | 'select';
  value: any;
  options?: string[];
  required: boolean;
}

const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@solarproerp.tn',
    fullName: 'Ahmed Administrator',
    role: 'admin',
    phone: '+216 20 123 456',
    status: 'active',
    lastLogin: '2024-01-20 14:30',
    createdAt: '2024-01-01',
    permissions: ['all']
  },
  {
    id: '2',
    email: 'sarah.hadj@solarproerp.tn',
    fullName: 'Sarah Hadj',
    role: 'manager',
    phone: '+216 20 234 567',
    status: 'active',
    lastLogin: '2024-01-20 09:15',
    createdAt: '2024-01-05',
    permissions: ['projects.manage', 'crm.manage', 'reports.view']
  },
  {
    id: '3',
    email: 'mohamed.ali@solarproerp.tn',
    fullName: 'Mohamed Ali',
    role: 'technician',
    phone: '+216 20 345 678',
    status: 'active',
    lastLogin: '2024-01-19 16:45',
    createdAt: '2024-01-10',
    permissions: ['projects.view', 'design.manage', 'compliance.view']
  },
  {
    id: '4',
    email: 'amina.tounsi@solarproerp.tn',
    fullName: 'Amina Tounsi',
    role: 'sales_rep',
    phone: '+216 20 456 789',
    status: 'active',
    lastLogin: '2024-01-20 11:20',
    createdAt: '2024-01-15',
    permissions: ['crm.manage', 'finance.view', 'reports.view']
  }
];

const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Administrator',
    description: 'Full system access and configuration',
    permissions: ['all'],
    userCount: 1,
    isSystem: true
  },
  {
    id: '2',
    name: 'Project Manager',
    description: 'Manage projects, teams, and resources',
    permissions: ['projects.manage', 'crm.manage', 'reports.view', 'procurement.view'],
    userCount: 2,
    isSystem: false
  },
  {
    id: '3',
    name: 'Technician',
    description: 'Technical design and installation tasks',
    permissions: ['projects.view', 'design.manage', 'compliance.view', 'procurement.view'],
    userCount: 5,
    isSystem: false
  },
  {
    id: '4',
    name: 'Sales Representative',
    description: 'Customer relations and sales activities',
    permissions: ['crm.manage', 'finance.view', 'reports.view'],
    userCount: 4,
    isSystem: false
  }
];

const mockSettings: SystemSetting[] = [
  {
    id: '1',
    category: 'general',
    key: 'company_name',
    name: 'Company Name',
    description: 'Your company name as it appears in the system',
    type: 'string',
    value: 'SolarPro Tunisia',
    required: true
  },
  {
    id: '2',
    category: 'general',
    key: 'default_currency',
    name: 'Default Currency',
    description: 'Default currency for financial transactions',
    type: 'select',
    value: 'TND',
    options: ['TND', 'EUR', 'USD'],
    required: true
  },
  {
    id: '3',
    category: 'security',
    key: 'password_expiry',
    name: 'Password Expiry (days)',
    description: 'Number of days before passwords expire',
    type: 'number',
    value: 90,
    required: true
  },
  {
    id: '4',
    category: 'security',
    key: 'two_factor_auth',
    name: 'Two-Factor Authentication',
    description: 'Require 2FA for all users',
    type: 'boolean',
    value: false,
    required: false
  },
  {
    id: '5',
    category: 'notifications',
    key: 'email_notifications',
    name: 'Email Notifications',
    description: 'Send email notifications for important events',
    type: 'boolean',
    value: true,
    required: false
  },
  {
    id: '6',
    category: 'notifications',
    key: 'notification_frequency',
    name: 'Notification Frequency',
    description: 'How often to send digest notifications',
    type: 'select',
    value: 'daily',
    options: ['immediate', 'hourly', 'daily', 'weekly'],
    required: false
  }
];

const roleColors = {
  admin: 'bg-red-100 text-red-800',
  manager: 'bg-blue-100 text-blue-800',
  technician: 'bg-green-100 text-green-800',
  sales_rep: 'bg-purple-100 text-purple-800'
};

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800'
};

const categoryIcons = {
  general: <Settings className="h-4 w-4" />,
  security: <Shield className="h-4 w-4" />,
  notifications: <Bell className="h-4 w-4" />,
  integrations: <Database className="h-4 w-4" />,
  appearance: <Palette className="h-4 w-4" />
};

export default function SettingsPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [settings, setSettings] = useState<SystemSetting[]>(mockSettings);
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const updateSetting = (settingId: string, newValue: any) => {
    setSettings(prev => prev.map(setting => 
      setting.id === settingId ? { ...setting, value: newValue } : setting
    ));
  };

  const saveSettings = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Show success message
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
              <h1 className="text-xl font-semibold text-gray-900">{t('nav.settings')} & Configuration</h1>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={saveSettings} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
            <TabsTrigger value="system">System Settings</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Administrator</option>
                  <option value="manager">Manager</option>
                  <option value="technician">Technician</option>
                  <option value="sales_rep">Sales Rep</option>
                </select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Last Login</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Created</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                  {user.fullName.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium">{user.fullName}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                                {user.phone && (
                                  <div className="text-xs text-gray-400">{user.phone}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge className={roleColors[user.role]}>
                              {user.role.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <Badge className={statusColors[user.status]}>
                              {user.status.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm">
                              {user.lastLogin || 'Never'}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm">{user.createdAt}</div>
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
                                <Trash2 className="h-4 w-4" />
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

          <TabsContent value="roles" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Roles & Permissions</CardTitle>
                <p className="text-sm text-gray-600">
                  Manage user roles and their permissions
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {roles.map((role) => (
                    <Card key={role.id} className="border-l-4 border-l-blue-500">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{role.name}</CardTitle>
                            <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {role.isSystem && (
                              <Badge variant="secondary">System</Badge>
                            )}
                            <Badge variant="outline">
                              {role.userCount} users
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Permissions</p>
                            <div className="flex flex-wrap gap-1">
                              {role.permissions.map((permission, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {permission}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex space-x-2 pt-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            {!role.isSystem && (
                              <Button variant="outline" size="sm" className="flex-1">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            {/* Settings by Category */}
            {['general', 'security', 'notifications', 'integrations', 'appearance'].map((category) => {
              const categorySettings = settings.filter(s => s.category === category);
              if (categorySettings.length === 0) return null;

              return (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      {categoryIcons[category as keyof typeof categoryIcons]}
                      <span>{category.charAt(0).toUpperCase() + category.slice(1)} Settings</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {categorySettings.map((setting) => (
                        <div key={setting.id} className="flex items-center justify-between py-4 border-b last:border-b-0">
                          <div className="flex-1">
                            <Label className="text-sm font-medium">{setting.name}</Label>
                            <p className="text-sm text-gray-600 mt-1">{setting.description}</p>
                          </div>
                          <div className="ml-4">
                            {setting.type === 'boolean' && (
                              <Switch
                                checked={setting.value}
                                onCheckedChange={(checked) => updateSetting(setting.id, checked)}
                              />
                            )}
                            {setting.type === 'string' && (
                              <Input
                                value={setting.value}
                                onChange={(e) => updateSetting(setting.id, e.target.value)}
                                className="w-48"
                              />
                            )}
                            {setting.type === 'number' && (
                              <Input
                                type="number"
                                value={setting.value}
                                onChange={(e) => updateSetting(setting.id, parseInt(e.target.value))}
                                className="w-24"
                              />
                            )}
                            {setting.type === 'select' && (
                              <select
                                value={setting.value}
                                onChange={(e) => updateSetting(setting.id, e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm w-32"
                              >
                                {setting.options?.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="workflows" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Configuration</CardTitle>
                <p className="text-sm text-gray-600">
                  Configure automated workflows and business rules
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="border-dashed border-2 border-gray-300 hover:border-blue-500 transition-colors cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Workflow className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <h3 className="font-medium">Lead to Customer</h3>
                      <p className="text-sm text-gray-600">Automate lead conversion</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Configure
                      </Button>
                    </CardContent>
                  </Card>
                  <Card className="border-dashed border-2 border-gray-300 hover:border-blue-500 transition-colors cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <h3 className="font-medium">Project Notifications</h3>
                      <p className="text-sm text-gray-600">Automated project alerts</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Configure
                      </Button>
                    </CardContent>
                  </Card>
                  <Card className="border-dashed border-2 border-gray-300 hover:border-blue-500 transition-colors cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Mail className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <h3 className="font-medium">Email Templates</h3>
                      <p className="text-sm text-gray-600">Customize email templates</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Configure
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Integrations</CardTitle>
                <p className="text-sm text-gray-600">
                  Connect with external systems and services
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Database className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Supabase Database</h3>
                        <p className="text-sm text-gray-600">Primary database connection</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-800">Connected</Badge>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Mail className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Email Service</h3>
                        <p className="text-sm text-gray-600">SMTP email configuration</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                      <Button variant="outline" size="sm">
                        Setup
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Key className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">API Keys</h3>
                        <p className="text-sm text-gray-600">External API integrations</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-gray-100 text-gray-800">Not Configured</Badge>
                      <Button variant="outline" size="sm">
                        Setup
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
