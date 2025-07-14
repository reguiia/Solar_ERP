'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  Search,
  FileCheck,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Edit,
  FileText,
  Shield,
  Building,
  Home,
  Sprout,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';

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
  project?: { name: string };
  assigned_user?: { full_name: string };
}

const mockComplianceRecords: ComplianceRecord[] = [
  {
    id: '1',
    project_id: 'proj-1',
    regulation_name: 'Building Permit',
    status: 'approved',
    progress: 100,
    submission_date: '2024-01-15',
    approval_date: '2024-01-20',
    notes: 'All requirements met',
    assigned_to: 'user-1',
    created_at: '2024-01-15T10:00:00Z',
    project: { name: 'Residential Solar Installation' },
    assigned_user: { full_name: 'John Smith' },
  },
  // Add other mock records as needed...
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_review: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  expired: 'bg-gray-100 text-gray-800',
};

function CompliancePage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [complianceRecords, setComplianceRecords] = useState<ComplianceRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchComplianceRecords = async () => {
    if (typeof window === 'undefined') return [];
    try {
      return mockComplianceRecords;
    } catch (error) {
      console.error('Error fetching compliance records:', error);
      return mockComplianceRecords;
    }
  };

  const loadComplianceData = useCallback(async () => {
    setLoading(true);
    const data = await fetchComplianceRecords();
    setComplianceRecords(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadComplianceData();
    setMounted(true);
  }, [loadComplianceData]);

  if (!mounted) return <div>Loading...</div>;

  const filteredRecords = complianceRecords.filter((record) => {
    const matchesSearch =
      (record.project?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.regulation_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: complianceRecords.length,
    approved: complianceRecords.filter((r) => r.status === 'approved').length,
    pending: complianceRecords.filter((r) => r.status === 'pending').length,
    inReview: complianceRecords.filter((r) => r.status === 'in_review').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Compliance Management</h1>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Record
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="records">Records</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Stat Cards */}
            </div>
            {/* Recent Records */}
          </TabsContent>

          <TabsContent value="records" className="space-y-6">
            {/* Filters and Table */}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Analytics Placeholder */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default CompliancePage;
