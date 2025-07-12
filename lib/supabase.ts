import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Only throw error in production or when actually using Supabase
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database types
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'admin' | 'manager' | 'technician' | 'sales_rep'
          phone: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          role?: 'admin' | 'manager' | 'technician' | 'sales_rep'
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: 'admin' | 'manager' | 'technician' | 'sales_rep'
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          address: string
          city: string
          postal_code: string | null
          company: string | null
          tax_id: string | null
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          address: string
          city: string
          postal_code?: string | null
          company?: string | null
          tax_id?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          address?: string
          city?: string
          postal_code?: string | null
          company?: string | null
          tax_id?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
      leads: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          location: string
          source: string
          status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed'
          type: 'residential' | 'industrial' | 'agricultural'
          estimated_value: number
          last_contact: string
          tags: string[]
          notes: string | null
          assigned_to: string | null
          customer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          location: string
          source: string
          status?: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed'
          type: 'residential' | 'industrial' | 'agricultural'
          estimated_value?: number
          last_contact?: string
          tags?: string[]
          notes?: string | null
          assigned_to?: string | null
          customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          location?: string
          source?: string
          status?: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed'
          type?: 'residential' | 'industrial' | 'agricultural'
          estimated_value?: number
          last_contact?: string
          tags?: string[]
          notes?: string | null
          assigned_to?: string | null
          customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          customer_id: string
          project_type: 'residential' | 'industrial' | 'agricultural'
          status: 'planning' | 'design' | 'approval' | 'procurement' | 'installation' | 'testing' | 'completed' | 'on_hold'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          progress: number
          start_date: string
          end_date: string
          estimated_end_date: string | null
          budget: number
          spent: number
          location: string
          project_manager: string
          system_size: string | null
          panel_count: number
          inverter_type: string | null
          mounting_type: string | null
          estimated_production: number
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          customer_id: string
          project_type: 'residential' | 'industrial' | 'agricultural'
          status?: 'planning' | 'design' | 'approval' | 'procurement' | 'installation' | 'testing' | 'completed' | 'on_hold'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          progress?: number
          start_date: string
          end_date: string
          estimated_end_date?: string | null
          budget: number
          spent?: number
          location: string
          project_manager: string
          system_size?: string | null
          panel_count?: number
          inverter_type?: string | null
          mounting_type?: string | null
          estimated_production?: number
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          customer_id?: string
          project_type?: 'residential' | 'industrial' | 'agricultural'
          status?: 'planning' | 'design' | 'approval' | 'procurement' | 'installation' | 'testing' | 'completed' | 'on_hold'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          progress?: number
          start_date?: string
          end_date?: string
          estimated_end_date?: string | null
          budget?: number
          spent?: number
          location?: string
          project_manager?: string
          system_size?: string | null
          panel_count?: number
          inverter_type?: string | null
          mounting_type?: string | null
          estimated_production?: number
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      suppliers: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          address: string
          city: string
          country: string
          category: 'panels' | 'inverters' | 'mounting' | 'electrical' | 'other'
          rating: number
          status: string
          payment_terms: string | null
          delivery_time: string | null
          certifications: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          address: string
          city: string
          country?: string
          category: 'panels' | 'inverters' | 'mounting' | 'electrical' | 'other'
          rating?: number
          status?: string
          payment_terms?: string | null
          delivery_time?: string | null
          certifications?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          address?: string
          city?: string
          country?: string
          category?: 'panels' | 'inverters' | 'mounting' | 'electrical' | 'other'
          rating?: number
          status?: string
          payment_terms?: string | null
          delivery_time?: string | null
          certifications?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          category: 'panels' | 'inverters' | 'mounting' | 'electrical' | 'other'
          brand: string
          model: string
          specifications: any
          unit_price: number
          currency: string
          supplier_id: string
          stock_level: number
          min_stock: number
          max_stock: number
          unit: string
          warranty: string | null
          certifications: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: 'panels' | 'inverters' | 'mounting' | 'electrical' | 'other'
          brand: string
          model: string
          specifications?: any
          unit_price: number
          currency?: string
          supplier_id: string
          stock_level?: number
          min_stock?: number
          max_stock?: number
          unit?: string
          warranty?: string | null
          certifications?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: 'panels' | 'inverters' | 'mounting' | 'electrical' | 'other'
          brand?: string
          model?: string
          specifications?: any
          unit_price?: number
          currency?: string
          supplier_id?: string
          stock_level?: number
          min_stock?: number
          max_stock?: number
          unit?: string
          warranty?: string | null
          certifications?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      purchase_orders: {
        Row: {
          id: string
          order_number: string
          supplier_id: string
          project_id: string | null
          status: 'draft' | 'sent' | 'confirmed' | 'delivered' | 'cancelled'
          order_date: string
          expected_delivery: string | null
          actual_delivery: string | null
          total_amount: number
          currency: string
          notes: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          supplier_id: string
          project_id?: string | null
          status?: 'draft' | 'sent' | 'confirmed' | 'delivered' | 'cancelled'
          order_date?: string
          expected_delivery?: string | null
          actual_delivery?: string | null
          total_amount?: number
          currency?: string
          notes?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          supplier_id?: string
          project_id?: string | null
          status?: 'draft' | 'sent' | 'confirmed' | 'delivered' | 'cancelled'
          order_date?: string
          expected_delivery?: string | null
          actual_delivery?: string | null
          total_amount?: number
          currency?: string
          notes?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      purchase_order_items: {
        Row: {
          id: string
          purchase_order_id: string
          product_id: string
          quantity: number
          unit_price: number
          total_price: number
        }
        Insert: {
          id?: string
          purchase_order_id: string
          product_id: string
          quantity: number
          unit_price: number
        }
        Update: {
          id?: string
          purchase_order_id?: string
          product_id?: string
          quantity?: number
          unit_price?: number
        }
      }
      invoices: {
        Row: {
          id: string
          invoice_number: string
          project_id: string
          customer_id: string
          status: 'draft' | 'sent' | 'paid' | 'overdue'
          issue_date: string
          due_date: string
          paid_date: string | null
          subtotal: number
          tax_amount: number
          total_amount: number
          currency: string
          notes: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          invoice_number: string
          project_id: string
          customer_id: string
          status?: 'draft' | 'sent' | 'paid' | 'overdue'
          issue_date?: string
          due_date: string
          paid_date?: string | null
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          currency?: string
          notes?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          invoice_number?: string
          project_id?: string
          customer_id?: string
          status?: 'draft' | 'sent' | 'paid' | 'overdue'
          issue_date?: string
          due_date?: string
          paid_date?: string | null
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          currency?: string
          notes?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      compliance_records: {
        Row: {
          id: string
          project_id: string
          regulation_name: string
          status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'expired'
          progress: number
          submission_date: string
          approval_date: string | null
          expiry_date: string | null
          documents: string[]
          notes: string | null
          assigned_to: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          project_id: string
          regulation_name: string
          status?: 'pending' | 'in_review' | 'approved' | 'rejected' | 'expired'
          progress?: number
          submission_date?: string
          approval_date?: string | null
          expiry_date?: string | null
          documents?: string[]
          notes?: string | null
          assigned_to: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          regulation_name?: string
          status?: 'pending' | 'in_review' | 'approved' | 'rejected' | 'expired'
          progress?: number
          submission_date?: string
          approval_date?: string | null
          expiry_date?: string | null
          documents?: string[]
          notes?: string | null
          assigned_to?: string
          created_at?: string
          updated_at?: string
        }
      }
      project_tasks: {
        Row: {
          id: string
          project_id: string
          name: string
          description: string | null
          status: string
          priority: 'low' | 'medium' | 'high' | 'urgent'
          assigned_to: string | null
          start_date: string | null
          due_date: string | null
          completed_date: string | null
          estimated_hours: number
          actual_hours: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          description?: string | null
          status?: string
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          assigned_to?: string | null
          start_date?: string | null
          due_date?: string | null
          completed_date?: string | null
          estimated_hours?: number
          actual_hours?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          description?: string | null
          status?: string
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          assigned_to?: string | null
          start_date?: string | null
          due_date?: string | null
          completed_date?: string | null
          estimated_hours?: number
          actual_hours?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      communications: {
        Row: {
          id: string
          lead_id: string | null
          customer_id: string | null
          project_id: string | null
          type: string
          subject: string | null
          content: string
          direction: string | null
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          lead_id?: string | null
          customer_id?: string | null
          project_id?: string | null
          type: string
          subject?: string | null
          content: string
          direction?: string | null
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string | null
          customer_id?: string | null
          project_id?: string | null
          type?: string
          subject?: string | null
          content?: string
          direction?: string | null
          created_by?: string
          created_at?: string
        }
      }
      system_settings: {
        Row: {
          id: string
          category: string
          key: string
          value: any
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category: string
          key: string
          value: any
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category?: string
          key?: string
          value?: any
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'manager' | 'technician' | 'sales_rep'
      lead_status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed'
      project_type: 'residential' | 'industrial' | 'agricultural'
      project_status: 'planning' | 'design' | 'approval' | 'procurement' | 'installation' | 'testing' | 'completed' | 'on_hold'
      priority_level: 'low' | 'medium' | 'high' | 'urgent'
      product_category: 'panels' | 'inverters' | 'mounting' | 'electrical' | 'other'
      order_status: 'draft' | 'sent' | 'confirmed' | 'delivered' | 'cancelled'
      invoice_status: 'draft' | 'sent' | 'paid' | 'overdue'
      compliance_status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'expired'
    }
  }
}

// Helper functions for data fetching
export const fetchLeads = async () => {
  if (!supabase) throw new Error('Supabase is not configured');
  const { data, error } = await supabase
    .from('leads')
    .select(`*, assigned_user:users(full_name)`)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const fetchProjects = async () => {
  if (!supabase) throw new Error('Supabase is not configured');
  const { data, error } = await supabase
    .from('projects')
    .select(`*, customer:customers(name, email, phone), manager:users!projects_project_manager_fkey(full_name)`)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const fetchCustomers = async () => {
  if (!supabase) throw new Error('Supabase is not configured');
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const fetchSuppliers = async () => {
  if (!supabase) throw new Error('Supabase is not configured');
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data;
};

export const fetchProducts = async () => {
  if (!supabase) throw new Error('Supabase is not configured');
  const { data, error } = await supabase
    .from('products')
    .select(`*, supplier:suppliers(name)`)
    .order('name');
  
  if (error) throw error;
  return data;
};

export const fetchPurchaseOrders = async () => {
  if (!supabase) throw new Error('Supabase is not configured');
  const { data, error } = await supabase
    .from('purchase_orders')
    .select(`*, supplier:suppliers(name), project:projects(name), items:purchase_order_items(*), product:products(name)`)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const fetchInvoices = async () => {
  if (!supabase) throw new Error('Supabase is not configured');
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      project:projects(name),
      customer:customers(name)
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const fetchComplianceRecords = async () => {
  if (!supabase) throw new Error('Supabase is not configured');
  const { data, error } = await supabase
    .from('compliance_records')
    .select(`
      id, 
      regulation_name, 
      status, 
      progress, 
      submission_date, 
      approval_date, 
      project_id, 
      notes, 
      assigned_to, 
      created_at,
      project:projects(name),
      assigned_user:users!compliance_records_assigned_to_fkey(full_name)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data || [];
};

export const fetchDashboardStats = async () => {
  if (!supabase) {
    return {
      totalRevenue: 145230,
      activeProjects: 42,
      conversionRate: 68,
      totalLeads: 127,
      qualifiedLeads: 42,
      completedProjects: 12,
      totalCustomers: 85
    };
  }
  try {
    // Fetch all data in parallel
    const [
      { data: leads },
      { data: projects },
      { data: invoices },
      { data: customers }
    ] = await Promise.all([
      supabase.from('leads').select('*'),
      supabase.from('projects').select('*'),
      supabase.from('invoices').select('*'),
      supabase.from('customers').select('*')
    ]);

    // Calculate stats
    const totalLeads = leads?.length || 0;
    const qualifiedLeads = leads?.filter((lead: any) => lead.status === 'qualified').length || 0;
    const activeProjects = projects?.filter((project: any) => project.status !== 'completed').length || 0;
    const completedProjects = projects?.filter((project: any) => project.status === 'completed').length || 0;
    const totalRevenue = invoices?.filter((inv: any) => inv.status === 'paid').reduce((sum: number, inv: any) => sum + inv.total_amount, 0) || 0;
    const conversionRate = totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0;

    return {
      totalRevenue,
      activeProjects,
      conversionRate,
      totalLeads,
      qualifiedLeads,
      completedProjects,
      totalCustomers: customers?.length || 0
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    // Return fallback data
    return {
      totalRevenue: 145230,
      activeProjects: 42,
      conversionRate: 68,
      totalLeads: 127,
      qualifiedLeads: 42,
      completedProjects: 12,
      totalCustomers: 85
    };
  }
};
