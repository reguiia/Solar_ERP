'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Filter, 
  Package,
  Truck,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  Download,
  Upload,
  ShoppingCart,
  Building,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/lib/supabase';

interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  category: 'panels' | 'inverters' | 'mounting' | 'electrical' | 'other';
  rating: number;
  status: 'active' | 'inactive' | 'pending';
  paymentTerms: string;
  deliveryTime: string;
  certifications: string[];
}

interface Product {
  id: string;
  name: string;
  category: 'panels' | 'inverters' | 'mounting' | 'electrical' | 'other';
  brand: string;
  model: string;
  specifications: Record<string, string>;
  unitPrice: number;
  currency: string;
  supplierId: string;
  supplierName: string;
  stockLevel: number;
  minStock: number;
  maxStock: number;
  unit: string;
  warranty: string;
  certifications: string[];
}

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  projectId: string;
  projectName: string;
  status: 'draft' | 'sent' | 'confirmed' | 'delivered' | 'cancelled';
  orderDate: string;
  expectedDelivery: string;
  actualDelivery?: string;
  totalAmount: number;
  currency: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  notes: string;
  createdBy: string;
}

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  sent: 'bg-blue-100 text-blue-800',
  confirmed: 'bg-yellow-100 text-yellow-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800'
};

const categoryColors = {
  panels: 'bg-blue-100 text-blue-800',
  inverters: 'bg-purple-100 text-purple-800',
  mounting: 'bg-green-100 text-green-800',
  electrical: 'bg-orange-100 text-orange-800',
  other: 'bg-gray-100 text-gray-800'
};

export default function ProcurementPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProcurementData();
  }, []);

  const fetchProcurementData = async () => {
    try {
      const [suppliersRes, productsRes, ordersRes] = await Promise.all([
        supabase.from('suppliers').select('*'),
        supabase.from('products').select('*, supplier:suppliers(name)'),
        supabase.from('purchase_orders').select('*, supplier:suppliers(name), project:projects(name), items:purchase_order_items(*), product:products(name)').order('created_at', { ascending: false }),
      ]);
      if (suppliersRes.error) throw suppliersRes.error;
      if (productsRes.error) throw productsRes.error;
      if (ordersRes.error) throw ordersRes.error;
      setSuppliers((suppliersRes.data || []).map((s: any): Supplier => ({
        id: s.id,
        name: s.name,
        email: s.email,
        phone: s.phone,
        address: s.address,
        city: s.city,
        country: s.country,
        category: s.category,
        rating: s.rating,
        status: s.status as 'active' | 'inactive' | 'pending',
        paymentTerms: s.payment_terms || '',
        deliveryTime: s.delivery_time || '',
        certifications: s.certifications || [],
      })));
      setProducts((productsRes.data || []).map((p: any): Product => ({
        id: p.id,
        name: p.name,
        category: p.category,
        brand: p.brand,
        model: p.model,
        specifications: p.specifications || {},
        unitPrice: p.unit_price,
        currency: p.currency,
        supplierId: p.supplier_id,
        supplierName: p.supplier?.name || '',
        stockLevel: p.stock_level,
        minStock: p.min_stock,
        maxStock: p.max_stock,
        unit: p.unit,
        warranty: p.warranty,
        certifications: p.certifications || [],
      })));
      setPurchaseOrders((ordersRes.data || []).map((o: any): PurchaseOrder => ({
        id: o.id,
        orderNumber: o.order_number,
        supplierId: o.supplier_id,
        supplierName: o.supplier?.name || '',
        projectId: o.project_id,
        projectName: o.project?.name || '',
        status: o.status,
        orderDate: o.order_date,
        expectedDelivery: o.expected_delivery,
        actualDelivery: o.actual_delivery,
        totalAmount: o.total_amount,
        currency: o.currency,
        items: (o.items || []).map((item: any) => ({
          productId: item.product_id,
          productName: item.product?.name || '',
          quantity: item.quantity,
          unitPrice: item.unit_price,
          totalPrice: item.total_price,
        })),
        notes: o.notes,
        createdBy: o.created_by,
      })));
    } catch (error) {
      console.error('Error fetching procurement data:', error);
    }
  };

  const lowStockProducts = products.filter(product => product.stockLevel <= product.minStock);
  const totalInventoryValue = products.reduce((sum, product) => sum + (product.stockLevel * product.unitPrice), 0);
  const pendingOrders = purchaseOrders.filter(order => ['sent', 'confirmed'].includes(order.status));

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
              <h1 className="text-xl font-semibold text-gray-900">{t('nav.procurement')} & Inventory</h1>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Purchase Order
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalInventoryValue.toLocaleString()} TND</div>
                  <p className="text-xs text-muted-foreground">+5.2% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{lowStockProducts.length}</div>
                  <p className="text-xs text-muted-foreground">Require restocking</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingOrders.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {pendingOrders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()} TND
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {suppliers.filter(s => s.status === 'active').length}
                  </div>
                  <p className="text-xs text-muted-foreground">Verified partners</p>
                </CardContent>
              </Card>
            </div>

            {/* Low Stock Alert */}
            {lowStockProducts.length > 0 && (
              <Card className="border-l-4 border-l-orange-500">
                <CardHeader>
                  <CardTitle className="flex items-center text-orange-700">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Low Stock Alert
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {lowStockProducts.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-600">
                            Current: {product.stockLevel} {product.unit} | Min: {product.minStock} {product.unit}
                          </p>
                        </div>
                        <Button size="sm">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Reorder
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Purchase Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {purchaseOrders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">{order.orderNumber}</p>
                          <p className="text-sm text-gray-600">{order.supplierName}</p>
                          <p className="text-xs text-gray-500">{order.projectName}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-medium">{order.totalAmount.toLocaleString()} {order.currency}</p>
                          <Badge className={statusColors[order.status]}>
                            {order.status.toUpperCase()}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="panels">Solar Panels</option>
                  <option value="inverters">Inverters</option>
                  <option value="mounting">Mounting</option>
                  <option value="electrical">Electrical</option>
                  <option value="other">Other</option>
                </select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Inventory Table */}
            <Card>
              <CardHeader>
                <CardTitle>Inventory Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Supplier</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Stock Level</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Unit Price</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Total Value</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-gray-500">{product.brand} - {product.model}</div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge className={categoryColors[product.category]}>
                              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm">{product.supplierName}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className={`font-medium ${
                                  product.stockLevel <= product.minStock ? 'text-red-600' : 'text-green-600'
                                }`}>
                                  {product.stockLevel} {product.unit}
                                </span>
                                {product.stockLevel <= product.minStock && (
                                  <AlertTriangle className="h-4 w-4 text-red-500" />
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                Min: {product.minStock} | Max: {product.maxStock}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-medium">
                              {product.unitPrice.toLocaleString()} {product.currency}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-medium">
                              {(product.stockLevel * product.unitPrice).toLocaleString()} {product.currency}
                            </div>
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
                                <ShoppingCart className="h-4 w-4" />
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

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Purchase Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Order #</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Supplier</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Project</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Order Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Expected Delivery</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchaseOrders.map((order) => (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="font-medium">{order.orderNumber}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div>{order.supplierName}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm">{order.projectName}</div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge className={statusColors[order.status]}>
                              {order.status.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-medium">
                              {order.totalAmount.toLocaleString()} {order.currency}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm">{order.orderDate}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm">{order.expectedDelivery}</div>
                            {order.actualDelivery && (
                              <div className="text-xs text-green-600">
                                Delivered: {order.actualDelivery}
                              </div>
                            )}
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
                                <Download className="h-4 w-4" />
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

          <TabsContent value="suppliers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Supplier Directory</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {suppliers.map((supplier) => (
                    <Card key={supplier.id} className="border-l-4 border-l-blue-500">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{supplier.name}</CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={categoryColors[supplier.category]}>
                                {supplier.category.charAt(0).toUpperCase() + supplier.category.slice(1)}
                              </Badge>
                              <Badge className={statusColors[supplier.status]}>
                                {supplier.status.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-1">
                              <span className="text-yellow-500">★</span>
                              <span className="font-medium">{supplier.rating}</span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Mail className="h-4 w-4" />
                            <span>{supplier.email}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4" />
                            <span>{supplier.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>{supplier.city}, {supplier.country}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Payment Terms</p>
                              <p className="font-medium">{supplier.paymentTerms}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Delivery Time</p>
                              <p className="font-medium">{supplier.deliveryTime}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Certifications</p>
                            <div className="flex flex-wrap gap-1">
                              {supplier.certifications.map((cert, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {cert}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex space-x-2 pt-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            <Button size="sm" className="flex-1">
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Create Order
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Turnover</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.slice(0, 5).map((product) => (
                      <div key={product.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.category}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium">2.3x</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Supplier Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {suppliers.map((supplier) => (
                      <div key={supplier.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{supplier.name}</p>
                          <p className="text-sm text-gray-600">{supplier.category}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-yellow-500">★</span>
                          <span className="text-sm font-medium">{supplier.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
