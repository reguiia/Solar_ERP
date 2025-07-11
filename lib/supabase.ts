import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
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
          created_at: string
          updated_at: string
          assigned_to: string | null
          notes: string | null
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
          estimated_value: number
          last_contact?: string
          tags?: string[]
          created_at?: string
          updated_at?: string
          assigned_to?: string | null
          notes?: string | null
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
          created_at?: string
          updated_at?: string
          assigned_to?: string | null
          notes?: string | null
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
          postal_code: string
          company: string | null
          tax_id: string | null
          created_at: string
          updated_at: string
          lead_id: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          address: string
          city: string
          postal_code: string
          company?: string | null
          tax_id?: string | null
          created_at?: string
          updated_at?: string
          lead_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          address?: string
          city?: string
          postal_code?: string
          company?: string | null
          tax_id?: string | null
          created_at?: string
          updated_at?: string
          lead_id?: string | null
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          customer_id: string
          project_type: 'residential' | 'industrial' | 'agricultural'
          status: 'planning' | 'design' | 'approval' | 'procurement' | 'installation' | 'testing' | 'completed'
          progress: number
          start_date: string
          end_date: string
          budget: number
          spent: number
          location: string
          project_manager: string
          system_size: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          customer_id: string
          project_type: 'residential' | 'industrial' | 'agricultural'
          status?: 'planning' | 'design' | 'approval' | 'procurement' | 'installation' | 'testing' | 'completed'
          progress?: number
          start_date: string
          end_date: string
          budget: number
          spent?: number
          location: string
          project_manager: string
          system_size: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          customer_id?: string
          project_type?: 'residential' | 'industrial' | 'agricultural'
          status?: 'planning' | 'design' | 'approval' | 'procurement' | 'installation' | 'testing' | 'completed'
          progress?: number
          start_date?: string
          end_date?: string
          budget?: number
          spent?: number
          location?: string
          project_manager?: string
          system_size?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
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
    }
  }
}
