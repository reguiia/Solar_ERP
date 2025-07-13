'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Filter, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  FileText,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';

interface Invoice {
  id: string;
  projectName: string;
  clientName: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  issueDate: string;
  dueDate: string;
  type: 'quote' | 'invoice' | 'payment';
}

interface Subsidy {
  id: string;
  name: string;
  description: string;
  amount: number;
  eligibility: string;
  status: 'pending' | 'approved' | 'rejected';
  projectId: string;
}

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  sent: 'bg-blue-100 text-blue-800',
  paid: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800'
};

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*, project:projects(name), customer:customers(name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      // Transform data to Invoice interface
      const transformed = (data || []).map((inv: any): Invoice => ({
        id: inv.id,
        projectName: inv.project?.name || '',
        clientName: inv.customer?.name || '',
        amount: inv.total_amount,
        status: inv.status,
        issueDate: inv.issue_date,
        dueDate: inv.due_date,
        type: 'invoice', // or infer from data if available
      }));
      setInvoices(transformed);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const totalRevenue = invoices.reduce((sum: number, inv: Invoice) => sum + inv.amount, 0);
  const paidInvoices = invoices.filter((inv: Invoice) => inv.status === 'paid');
  const overdueInvoices = invoices.filter((inv: Invoice) => inv.status === 'overdue');

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
              <h1 className="text-xl font-semibold text-gray-900">Finance Management</h1>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Invoice
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="subsidies">Subsidies</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalRevenue.toLocaleString()} TND</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12.5% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{paidInvoices.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {paidInvoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()} TND
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{overdueInvoices.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()} TND
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Subsidies</CardTitle>
                  <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {/* mockSubsidies.reduce((sum, sub) => sum + sub.amount, 0).toLocaleString() */}
                    Subsidies data not yet implemented
                  </div>
                  <p className="text-xs text-muted-foreground">Available incentives</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Financial Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Payment Received</p>
                        <p className="text-sm text-gray-600">INV-001 - Ahmed Ben Salem</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">+15,000 TND</p>
                      <p className="text-sm text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Send className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Quote Sent</p>
                        <p className="text-sm text-gray-600">QUO-002 - Fatima Manufacturing</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">120,000 TND</p>
                      <p className="text-sm text-gray-500">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Invoice
                </Button>
              </div>
            </div>

            {/* Invoices Table */}
            <Card>
              <CardHeader>
                <CardTitle>Invoices & Quotes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Invoice ID</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Project</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Client</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Due Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((invoice) => (
                        <tr key={invoice.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="font-medium">{invoice.id}</div>
                            <div className="text-sm text-gray-500 capitalize">{invoice.type}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-medium">{invoice.projectName}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div>{invoice.clientName}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-medium">{invoice.amount.toLocaleString()} TND</div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge className={statusColors[invoice.status]}>
                              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm">{invoice.dueDate}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Send className="h-4 w-4" />
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

          <TabsContent value="subsidies" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Subsidies & Incentives</CardTitle>
                <p className="text-sm text-gray-600">
                  Government and local incentives for solar installations in Tunisia
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* mockSubsidies.map((subsidy) => ( */}
                  <Card className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">Subsidy Example</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">
                            Description for Subsidy Example
                          </p>
                        </div>
                        <Badge className={statusColors['pending']}>Pending</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Subsidy Amount</p>
                          <p className="text-xl font-bold text-green-600">
                            1,000 TND
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Eligibility</p>
                          <p className="text-sm text-gray-600">
                            Residential customers with roof area more than 20m²
                          </p>
                        </div>
                        <div className="flex space-x-2 pt-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button size="sm">
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  {/* ))} */}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Reports</CardTitle>
                <p className="text-sm text-gray-600">
                  Generate and download comprehensive financial reports
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="border-dashed border-2 border-gray-300 hover:border-blue-500 transition-colors cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <h3 className="font-medium">Revenue Report</h3>
                      <p className="text-sm text-gray-600">Monthly revenue analysis</p>
                    </CardContent>
                  </Card>
                  <Card className="border-dashed border-2 border-gray-300 hover:border-blue-500 transition-colors cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <h3 className="font-medium">Cash Flow</h3>
                      <p className="text-sm text-gray-600">Cash flow projections</p>
                    </CardContent>
                  </Card>
                  <Card className="border-dashed border-2 border-gray-300 hover:border-blue-500 transition-colors cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <CreditCard className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <h3 className="font-medium">Payment Analysis</h3>
                      <p className="text-sm text-gray-600">Payment trends and patterns</p>
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
