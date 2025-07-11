/*
  # Initial SolarPro ERP Database Schema

  1. Core Tables
    - users (authentication and user management)
    - customers (converted leads and direct customers)
    - leads (potential customers)
    - projects (solar installation projects)
    - suppliers (equipment suppliers)
    - products (solar equipment inventory)
    - purchase_orders (procurement orders)
    - invoices (billing and payments)
    - compliance_records (regulatory compliance tracking)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add role-based access control
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'technician', 'sales_rep');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed');
CREATE TYPE project_type AS ENUM ('residential', 'industrial', 'agricultural');
CREATE TYPE project_status AS ENUM ('planning', 'design', 'approval', 'procurement', 'installation', 'testing', 'completed', 'on_hold');
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE product_category AS ENUM ('panels', 'inverters', 'mounting', 'electrical', 'other');
CREATE TYPE order_status AS ENUM ('draft', 'sent', 'confirmed', 'delivered', 'cancelled');
CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue');
CREATE TYPE compliance_status AS ENUM ('pending', 'in_review', 'approved', 'rejected', 'expired');

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role user_role DEFAULT 'technician',
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT,
  company TEXT,
  tax_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  source TEXT NOT NULL,
  status lead_status DEFAULT 'new',
  type project_type NOT NULL,
  estimated_value DECIMAL(12,2) DEFAULT 0,
  last_contact TIMESTAMPTZ DEFAULT NOW(),
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  assigned_to UUID REFERENCES users(id),
  customer_id UUID REFERENCES customers(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  customer_id UUID NOT NULL REFERENCES customers(id),
  project_type project_type NOT NULL,
  status project_status DEFAULT 'planning',
  priority priority_level DEFAULT 'medium',
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  estimated_end_date DATE,
  budget DECIMAL(12,2) NOT NULL,
  spent DECIMAL(12,2) DEFAULT 0,
  location TEXT NOT NULL,
  project_manager UUID NOT NULL REFERENCES users(id),
  system_size TEXT,
  panel_count INTEGER DEFAULT 0,
  inverter_type TEXT,
  mounting_type TEXT,
  estimated_production INTEGER DEFAULT 0,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Suppliers table
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT DEFAULT 'Tunisia',
  category product_category NOT NULL,
  rating DECIMAL(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  payment_terms TEXT,
  delivery_time TEXT,
  certifications TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category product_category NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  specifications JSONB DEFAULT '{}',
  unit_price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'TND',
  supplier_id UUID NOT NULL REFERENCES suppliers(id),
  stock_level INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 0,
  max_stock INTEGER DEFAULT 0,
  unit TEXT DEFAULT 'piece',
  warranty TEXT,
  certifications TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Purchase Orders table
CREATE TABLE purchase_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  supplier_id UUID NOT NULL REFERENCES suppliers(id),
  project_id UUID REFERENCES projects(id),
  status order_status DEFAULT 'draft',
  order_date DATE DEFAULT CURRENT_DATE,
  expected_delivery DATE,
  actual_delivery DATE,
  total_amount DECIMAL(12,2) DEFAULT 0,
  currency TEXT DEFAULT 'TND',
  notes TEXT,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Purchase Order Items table
CREATE TABLE purchase_order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED
);

-- Invoices table
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT UNIQUE NOT NULL,
  project_id UUID NOT NULL REFERENCES projects(id),
  customer_id UUID NOT NULL REFERENCES customers(id),
  status invoice_status DEFAULT 'draft',
  issue_date DATE DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  paid_date DATE,
  subtotal DECIMAL(12,2) DEFAULT 0,
  tax_amount DECIMAL(12,2) DEFAULT 0,
  total_amount DECIMAL(12,2) DEFAULT 0,
  currency TEXT DEFAULT 'TND',
  notes TEXT,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance Records table
CREATE TABLE compliance_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id),
  regulation_name TEXT NOT NULL,
  status compliance_status DEFAULT 'pending',
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  submission_date DATE DEFAULT CURRENT_DATE,
  approval_date DATE,
  expiry_date DATE,
  documents TEXT[] DEFAULT '{}',
  notes TEXT,
  assigned_to UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Tasks table
CREATE TABLE project_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'blocked')),
  priority priority_level DEFAULT 'medium',
  assigned_to UUID REFERENCES users(id),
  start_date DATE,
  due_date DATE,
  completed_date DATE,
  estimated_hours INTEGER DEFAULT 0,
  actual_hours INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Communications table
CREATE TABLE communications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id),
  customer_id UUID REFERENCES customers(id),
  project_id UUID REFERENCES projects(id),
  type TEXT NOT NULL CHECK (type IN ('email', 'phone', 'meeting', 'note')),
  subject TEXT,
  content TEXT NOT NULL,
  direction TEXT CHECK (direction IN ('inbound', 'outbound')),
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- System Settings table
CREATE TABLE system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  key TEXT NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category, key)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Users can read their own data and admins can read all
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- Customers policies
CREATE POLICY "Authenticated users can read customers" ON customers
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert customers" ON customers
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update customers" ON customers
  FOR UPDATE TO authenticated
  USING (true);

-- Leads policies
CREATE POLICY "Authenticated users can read leads" ON leads
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert leads" ON leads
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update leads" ON leads
  FOR UPDATE TO authenticated
  USING (true);

-- Projects policies
CREATE POLICY "Authenticated users can read projects" ON projects
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert projects" ON projects
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update projects" ON projects
  FOR UPDATE TO authenticated
  USING (true);

-- Suppliers policies
CREATE POLICY "Authenticated users can read suppliers" ON suppliers
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert suppliers" ON suppliers
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update suppliers" ON suppliers
  FOR UPDATE TO authenticated
  USING (true);

-- Products policies
CREATE POLICY "Authenticated users can read products" ON products
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert products" ON products
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products" ON products
  FOR UPDATE TO authenticated
  USING (true);

-- Purchase Orders policies
CREATE POLICY "Authenticated users can read purchase orders" ON purchase_orders
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert purchase orders" ON purchase_orders
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update purchase orders" ON purchase_orders
  FOR UPDATE TO authenticated
  USING (true);

-- Purchase Order Items policies
CREATE POLICY "Authenticated users can read purchase order items" ON purchase_order_items
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert purchase order items" ON purchase_order_items
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update purchase order items" ON purchase_order_items
  FOR UPDATE TO authenticated
  USING (true);

-- Invoices policies
CREATE POLICY "Authenticated users can read invoices" ON invoices
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert invoices" ON invoices
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update invoices" ON invoices
  FOR UPDATE TO authenticated
  USING (true);

-- Compliance Records policies
CREATE POLICY "Authenticated users can read compliance records" ON compliance_records
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert compliance records" ON compliance_records
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update compliance records" ON compliance_records
  FOR UPDATE TO authenticated
  USING (true);

-- Project Tasks policies
CREATE POLICY "Authenticated users can read project tasks" ON project_tasks
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert project tasks" ON project_tasks
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update project tasks" ON project_tasks
  FOR UPDATE TO authenticated
  USING (true);

-- Communications policies
CREATE POLICY "Authenticated users can read communications" ON communications
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert communications" ON communications
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- System Settings policies (admin only)
CREATE POLICY "Admins can read system settings" ON system_settings
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can insert system settings" ON system_settings
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can update system settings" ON system_settings
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Create indexes for better performance
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_customer_id ON projects(customer_id);
CREATE INDEX idx_projects_project_manager ON projects(project_manager);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_supplier_id ON products(supplier_id);
CREATE INDEX idx_purchase_orders_supplier_id ON purchase_orders(supplier_id);
CREATE INDEX idx_purchase_orders_project_id ON purchase_orders(project_id);
CREATE INDEX idx_invoices_project_id ON invoices(project_id);
CREATE INDEX idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX idx_compliance_records_project_id ON compliance_records(project_id);
CREATE INDEX idx_project_tasks_project_id ON project_tasks(project_id);
CREATE INDEX idx_project_tasks_assigned_to ON project_tasks(assigned_to);
CREATE INDEX idx_communications_lead_id ON communications(lead_id);
CREATE INDEX idx_communications_customer_id ON communications(customer_id);
CREATE INDEX idx_communications_project_id ON communications(project_id);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchase_orders_updated_at BEFORE UPDATE ON purchase_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_compliance_records_updated_at BEFORE UPDATE ON compliance_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_tasks_updated_at BEFORE UPDATE ON project_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
