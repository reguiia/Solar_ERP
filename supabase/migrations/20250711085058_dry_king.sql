/*
  # Sample Data for SolarPro ERP

  This migration adds sample data for development and testing purposes.
*/

-- Insert sample users (these would normally be created through Supabase Auth)
-- Note: In production, users are created through authentication, this is just for demo
INSERT INTO users (id, email, full_name, role, phone) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'admin@solarproerp.tn', 'Ahmed Administrator', 'admin', '+216 20 123 456'),
  ('550e8400-e29b-41d4-a716-446655440002', 'sarah.hadj@solarproerp.tn', 'Sarah Hadj', 'manager', '+216 20 234 567'),
  ('550e8400-e29b-41d4-a716-446655440003', 'mohamed.ali@solarproerp.tn', 'Mohamed Ali', 'technician', '+216 20 345 678'),
  ('550e8400-e29b-41d4-a716-446655440004', 'amina.tounsi@solarproerp.tn', 'Amina Tounsi', 'sales_rep', '+216 20 456 789');

-- Insert sample customers
INSERT INTO customers (id, name, email, phone, address, city, postal_code, created_by) VALUES
  ('650e8400-e29b-41d4-a716-446655440001', 'Ahmed Ben Salem', 'ahmed.salem@email.com', '+216 20 123 456', 'Villa 15, Sidi Bou Said', 'Tunis', '2026', '550e8400-e29b-41d4-a716-446655440002'),
  ('650e8400-e29b-41d4-a716-446655440002', 'Fatima Manufacturing SARL', 'contact@fatima-mfg.tn', '+216 71 234 567', 'Zone Industrielle', 'Sfax', '3000', '550e8400-e29b-41d4-a716-446655440002'),
  ('650e8400-e29b-41d4-a716-446655440003', 'Mohamed Agri Farm', 'mohamed.agri@email.com', '+216 25 345 678', 'Route de Sousse, Km 15', 'Kairouan', '3100', '550e8400-e29b-41d4-a716-446655440004');

-- Insert sample leads
INSERT INTO leads (id, name, email, phone, location, source, status, type, estimated_value, assigned_to, notes) VALUES
  ('750e8400-e29b-41d4-a716-446655440001', 'Leila Mansouri', 'leila.mansouri@email.com', '+216 22 111 222', 'La Marsa, Tunis', 'Website', 'qualified', 'residential', 12000, '550e8400-e29b-41d4-a716-446655440004', 'Interested in 6kW system'),
  ('750e8400-e29b-41d4-a716-446655440002', 'TechCorp Industries', 'info@techcorp.tn', '+216 71 333 444', 'Sousse', 'Referral', 'proposal', 'industrial', 85000, '550e8400-e29b-41d4-a716-446655440002', 'Large industrial facility'),
  ('750e8400-e29b-41d4-a716-446655440003', 'Olive Grove Cooperative', 'coop@olivegrove.tn', '+216 26 555 666', 'Monastir', 'Trade Show', 'contacted', 'agricultural', 35000, '550e8400-e29b-41d4-a716-446655440004', 'Off-grid irrigation system');

-- Insert sample projects
INSERT INTO projects (id, name, customer_id, project_type, status, priority, progress, start_date, end_date, budget, spent, location, project_manager, system_size, panel_count, inverter_type, mounting_type, estimated_production) VALUES
  ('850e8400-e29b-41d4-a716-446655440001', 'Residential Solar Installation - Villa Sidi Bou Said', '650e8400-e29b-41d4-a716-446655440001', 'residential', 'installation', 'high', 75, '2024-01-10', '2024-02-15', 15000, 11250, 'Villa 15, Sidi Bou Said, Tunis', '550e8400-e29b-41d4-a716-446655440002', '8 kW', 16, 'String Inverter 8kW', 'Roof Mount', 12000),
  ('850e8400-e29b-41d4-a716-446655440002', 'Industrial Solar Array - Fatima Manufacturing', '650e8400-e29b-41d4-a716-446655440002', 'industrial', 'design', 'medium', 35, '2024-01-15', '2024-04-30', 120000, 42000, 'Zone Industrielle Sfax', '550e8400-e29b-41d4-a716-446655440003', '150 kW', 300, 'Central Inverter 150kW', 'Ground Mount', 225000),
  ('850e8400-e29b-41d4-a716-446655440003', 'Agricultural Off-Grid System - Olive Farm Kairouan', '650e8400-e29b-41d4-a716-446655440003', 'agricultural', 'approval', 'low', 20, '2024-01-20', '2024-03-20', 25000, 5000, 'Route de Sousse, Km 15, Kairouan', '550e8400-e29b-41d4-a716-446655440004', '20 kW', 40, 'Hybrid Inverter 20kW', 'Ground Mount', 30000);

-- Insert sample suppliers
INSERT INTO suppliers (id, name, email, phone, address, city, category, rating, payment_terms, delivery_time, certifications) VALUES
  ('950e8400-e29b-41d4-a716-446655440001', 'SolarTech Tunisia', 'contact@solartech.tn', '+216 71 123 456', 'Zone Industrielle Ariana', 'Ariana', 'panels', 4.8, '30 days', '7-10 days', '{"ISO 9001", "IEC 61215", "CE"}'),
  ('950e8400-e29b-41d4-a716-446655440002', 'Inverter Solutions SARL', 'sales@invertersol.tn', '+216 71 234 567', 'Rue de la Technologie', 'Sfax', 'inverters', 4.6, '45 days', '5-7 days', '{"ISO 9001", "IEC 62109", "UL"}'),
  ('950e8400-e29b-41d4-a716-446655440003', 'MountPro Systems', 'info@mountpro.tn', '+216 71 345 678', 'Industrial Zone', 'Ben Arous', 'mounting', 4.4, '15 days', '3-5 days', '{"ISO 9001", "TUV"}');

-- Insert sample products
INSERT INTO products (id, name, category, brand, model, specifications, unit_price, supplier_id, stock_level, min_stock, max_stock, warranty, certifications) VALUES
  ('a50e8400-e29b-41d4-a716-446655440001', 'Monocrystalline Solar Panel 500W', 'panels', 'SolarMax', 'SM-500M', '{"Power": "500W", "Efficiency": "21.5%", "Voltage": "41.2V", "Current": "12.14A", "Dimensions": "2108x1048x35mm"}', 450, '950e8400-e29b-41d4-a716-446655440001', 150, 50, 300, '25 years', '{"IEC 61215", "IEC 61730", "CE"}'),
  ('a50e8400-e29b-41d4-a716-446655440002', 'String Inverter 10kW', 'inverters', 'PowerTech', 'PT-10K-S', '{"Power": "10kW", "Efficiency": "98.2%", "Input Voltage": "200-1000V", "Output Voltage": "230V", "Phases": "Single"}', 2800, '950e8400-e29b-41d4-a716-446655440002', 25, 10, 50, '10 years', '{"IEC 62109", "UL 1741", "CE"}'),
  ('a50e8400-e29b-41d4-a716-446655440003', 'Aluminum Mounting Rail 4m', 'mounting', 'MountPro', 'MP-AL-4M', '{"Length": "4000mm", "Material": "Aluminum 6005-T5", "Load Capacity": "2400N/m", "Color": "Silver Anodized"}', 85, '950e8400-e29b-41d4-a716-446655440003', 200, 100, 500, '20 years', '{"ISO 9001", "TUV"}');

-- Insert sample purchase orders
INSERT INTO purchase_orders (id, order_number, supplier_id, project_id, status, order_date, expected_delivery, actual_delivery, total_amount, notes, created_by) VALUES
  ('b50e8400-e29b-41d4-a716-446655440001', 'PO-2024-001', '950e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440001', 'delivered', '2024-01-10', '2024-01-20', '2024-01-18', 9000, 'Urgent delivery required for project timeline', '550e8400-e29b-41d4-a716-446655440002'),
  ('b50e8400-e29b-41d4-a716-446655440002', 'PO-2024-002', '950e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440002', 'confirmed', '2024-01-15', '2024-01-25', NULL, 42000, 'Coordinate delivery with installation team', '550e8400-e29b-41d4-a716-446655440003');

-- Insert sample purchase order items
INSERT INTO purchase_order_items (purchase_order_id, product_id, quantity, unit_price) VALUES
  ('b50e8400-e29b-41d4-a716-446655440001', 'a50e8400-e29b-41d4-a716-446655440001', 20, 450),
  ('b50e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440002', 15, 2800);

-- Insert sample invoices
INSERT INTO invoices (id, invoice_number, project_id, customer_id, status, issue_date, due_date, subtotal, tax_amount, total_amount, created_by) VALUES
  ('c50e8400-e29b-41d4-a716-446655440001', 'INV-2024-001', '850e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 'paid', '2024-01-25', '2024-02-25', 12500, 2500, 15000, '550e8400-e29b-41d4-a716-446655440002'),
  ('c50e8400-e29b-41d4-a716-446655440002', 'INV-2024-002', '850e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', 'sent', '2024-01-30', '2024-02-28', 100000, 20000, 120000, '550e8400-e29b-41d4-a716-446655440003');

-- Insert sample compliance records
INSERT INTO compliance_records (id, project_id, regulation_name, status, progress, submission_date, approval_date, assigned_to, notes) VALUES
  ('d50e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440001', 'PROSOL Residential', 'approved', 100, '2024-01-10', '2024-01-25', '550e8400-e29b-41d4-a716-446655440002', 'All requirements met. Approved for installation.'),
  ('d50e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440002', 'Industrial Solar Permit', 'in_review', 75, '2024-01-15', NULL, '550e8400-e29b-41d4-a716-446655440003', 'Pending fire safety certificate submission.'),
  ('d50e8400-e29b-41d4-a716-446655440003', '850e8400-e29b-41d4-a716-446655440003', 'Agricultural Off-Grid', 'pending', 40, '2024-01-20', NULL, '550e8400-e29b-41d4-a716-446655440004', 'Waiting for environmental clearance.');

-- Insert sample project tasks
INSERT INTO project_tasks (project_id, name, description, status, priority, assigned_to, start_date, due_date, estimated_hours) VALUES
  ('850e8400-e29b-41d4-a716-446655440001', 'Site Survey', 'Conduct detailed site assessment', 'completed', 'high', '550e8400-e29b-41d4-a716-446655440003', '2024-01-10', '2024-01-12', 8),
  ('850e8400-e29b-41d4-a716-446655440001', 'System Design', 'Create detailed system design', 'completed', 'high', '550e8400-e29b-41d4-a716-446655440003', '2024-01-13', '2024-01-15', 16),
  ('850e8400-e29b-41d4-a716-446655440001', 'Installation', 'Install solar panels and inverter', 'in_progress', 'high', '550e8400-e29b-41d4-a716-446655440003', '2024-01-20', '2024-02-10', 40),
  ('850e8400-e29b-41d4-a716-446655440002', 'Design Review', 'Review and approve system design', 'pending', 'medium', '550e8400-e29b-41d4-a716-446655440003', '2024-02-01', '2024-02-15', 24);

-- Insert sample communications
INSERT INTO communications (lead_id, customer_id, project_id, type, subject, content, direction, created_by) VALUES
  ('750e8400-e29b-41d4-a716-446655440001', NULL, NULL, 'email', 'Solar Installation Inquiry', 'Customer interested in residential solar installation', 'inbound', '550e8400-e29b-41d4-a716-446655440004'),
  (NULL, '650e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440001', 'phone', 'Project Update', 'Discussed installation timeline with customer', 'outbound', '550e8400-e29b-41d4-a716-446655440002'),
  (NULL, '650e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440002', 'meeting', 'Design Presentation', 'Presented system design to client management team', 'outbound', '550e8400-e29b-41d4-a716-446655440003');

-- Insert sample system settings
INSERT INTO system_settings (category, key, value, description) VALUES
  ('general', 'company_name', '"SolarPro Tunisia"', 'Company name displayed in the system'),
  ('general', 'default_currency', '"TND"', 'Default currency for financial transactions'),
  ('general', 'default_language', '"en"', 'Default system language'),
  ('security', 'password_expiry_days', '90', 'Number of days before passwords expire'),
  ('security', 'two_factor_auth_required', 'false', 'Whether 2FA is required for all users'),
  ('notifications', 'email_notifications_enabled', 'true', 'Whether email notifications are enabled'),
  ('notifications', 'notification_frequency', '"daily"', 'Frequency of digest notifications'),
  ('finance', 'default_tax_rate', '0.19', 'Default tax rate for invoices'),
  ('finance', 'payment_terms_days', '30', 'Default payment terms in days');
