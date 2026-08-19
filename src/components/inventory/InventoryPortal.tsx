import React, { useState } from 'react';
import { 
  Box, 
  Plus, 
  AlertTriangle, 
  RefreshCw, 
  Download, 
  Upload, 
  Search, 
  Trash2, 
  Warehouse, 
  TrendingUp, 
  History, 
  Euro, 
  CheckCircle2, 
  X,
  BarChart3,
  ShoppingBag,
  ShieldCheck,
  Truck,
  FileText,
  Clock,
  ArrowUpRight,
  UserCheck,
  Layers,
  Sparkles,
  Check,
  Eye,
  Edit2
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from 'recharts';
import { useStore } from '../../context/StoreContext';
import { EXPORT_PREFIX } from '../../brand';
import { Product, StockAdjustment, Category, Order } from '../../types';
import { INITIAL_ORDERS, EU_COUNTRIES } from '../../data/mockData';

export const InventoryPortal: React.FC = () => {
  const { 
    products, 
    stockAdjustments, 
    adjustStock, 
    addProduct, 
    deleteProduct, 
    importInventoryItems,
    formatPriceEUR,
    orders,
    consentLogs,
    downloadDSARPackage,
    downloadTaxInvoicePDF
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStockFilter, setSelectedStockFilter] = useState<'all' | 'low' | 'out'>('all');

  // Admin Portal Tab Navigation
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'orders' | 'privacy' | 'audit'>('overview');

  // Orders Ledger state
  const combinedOrdersList = orders && orders.length > 0 ? orders : INITIAL_ORDERS;
  const [orderList, setOrderList] = useState<Order[]>(combinedOrdersList);
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('ALL');

  // Modal States
  const [adjustModalProduct, setAdjustModalProduct] = useState<Product | null>(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<Order | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editOrderName, setEditOrderName] = useState('');
  const [editOrderEmail, setEditOrderEmail] = useState('');
  const [editOrderStatus, setEditOrderStatus] = useState<'COMPLETED' | 'PROCESSING' | 'CANCELLED'>('COMPLETED');
  const [deleteConfirmOrderId, setDeleteConfirmOrderId] = useState<string | null>(null);

  // Quick Adjustment Form state
  const [adjWarehouseId, setAdjWarehouseId] = useState('wh-fra');
  const [adjType, setAdjType] = useState<'RESTOCK' | 'AUDIT_CORRECTION' | 'DAMAGED' | 'RETURN'>('RESTOCK');
  const [adjQty, setAdjQty] = useState<number>(10);
  const [adjNote, setAdjNote] = useState('');

  // Add Product Form state
  const [newSku, setNewSku] = useState('');
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState<Category>('Crafts');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState<number>(99.0);
  const [newOrigin, setNewOrigin] = useState('Germany');
  const [newOriginFlag, setNewOriginFlag] = useState('🇩🇪');
  const [newStock, setNewStock] = useState<number>(25);
  const [newThreshold, setNewThreshold] = useState<number>(10);
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80');
  const [newSupplier, setNewSupplier] = useState('EU Manufactory B.V.');

  // Import JSON text state
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Executive KPI Calculations
  const totalSkus = products.length;
  const totalUnitsInStock = products.reduce((sum, p) => sum + p.totalStock, 0);
  const totalInventoryValueEUR = products.reduce((sum, p) => sum + (p.priceEUR * p.totalStock), 0);
  const lowStockProducts = products.filter(p => p.totalStock > 0 && p.totalStock <= p.lowStockThreshold);
  const outOfStockProducts = products.filter(p => p.totalStock <= 0);

  // Order Metrics
  const totalGrossRevenueEUR = orderList.reduce((sum, o) => sum + o.totalEUR, 0);
  const completedOrdersCount = orderList.length;

  // Recharts Data Prep: Stock by Category
  const categoryChartData = Object.values(
    products.reduce((acc, p) => {
      acc[p.category] = acc[p.category] || { category: p.category, totalStock: 0, totalValue: 0 };
      acc[p.category].totalStock += p.totalStock;
      acc[p.category].totalValue += p.priceEUR * p.totalStock;
      return acc;
    }, {} as Record<string, { category: string; totalStock: number; totalValue: number }>)
  );

  // Recharts Data Prep: Warehouse Distribution
  const warehouseDistribution = products.reduce((acc, p) => {
    p.warehouses.forEach(w => {
      acc[w.warehouseName] = (acc[w.warehouseName] || 0) + w.quantity;
    });
    return acc;
  }, {} as Record<string, number>);

  const warehouseChartData = Object.entries(warehouseDistribution).map(([name, qty]) => ({
    name: name.split(' ')[0], // e.g. Frankfurt
    quantity: qty,
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

  // Filtered Products for Table
  const filteredProducts = products.filter(p => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      if (!matchName && !matchSku) return false;
    }
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    if (selectedStockFilter === 'low' && (p.totalStock === 0 || p.totalStock > p.lowStockThreshold)) return false;
    if (selectedStockFilter === 'out' && p.totalStock > 0) return false;
    return true;
  });

  // Filtered Orders for Orders Table
  const filteredOrders = orderList.filter(o => {
    if (orderSearchTerm) {
      const q = orderSearchTerm.toLowerCase();
      const matchId = o.id.toLowerCase().includes(q);
      const matchCustomer = o.customerName.toLowerCase().includes(q);
      const matchEmail = o.customerEmail.toLowerCase().includes(q);
      if (!matchId && !matchCustomer && !matchEmail) return false;
    }
    if (orderStatusFilter !== 'ALL' && o.status !== orderStatusFilter) return false;
    return true;
  });

  // Handlers
  const handleStockAdjustmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustModalProduct) return;
    const finalQty = (adjType === 'DAMAGED') ? -Math.abs(adjQty) : adjQty;
    await adjustStock(adjustModalProduct.id, adjWarehouseId, finalQty, adjType, adjNote);
    setAdjustModalProduct(null);
    setAdjNote('');
  };

  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addProduct({
      sku: newSku || `EU-SKU-${Date.now().toString().slice(-4)}`,
      name: newName,
      category: newCat,
      description: newDesc || 'Handcrafted European item with certified quality.',
      priceEUR: Number(newPrice),
      originCountry: newOrigin,
      originFlag: newOriginFlag,
      imageUrl: newImage,
      totalStock: Number(newStock),
      lowStockThreshold: Number(newThreshold),
      warehouses: [
        { warehouseId: 'wh-fra', warehouseName: 'Frankfurt Hub (DE-01)', location: 'Frankfurt, Germany', quantity: Number(newStock) }
      ],
      vatRateCategory: 'standard',
      weightKg: 1.0,
      supplierName: newSupplier,
      tags: ['New Inbound', 'EU Warehouse'],
    });
    setIsAddProductModalOpen(false);
    setNewName('');
    setNewSku('');
  };

  const updateOrderStatus = (orderId: string, newStatus: 'COMPLETED' | 'PROCESSING' | 'CANCELLED') => {
    setOrderList(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const openEditOrder = (order: Order) => {
    setEditingOrder(order);
    setEditOrderName(order.customerName);
    setEditOrderEmail(order.customerEmail);
    setEditOrderStatus(order.status);
  };

  const saveEditOrder = () => {
    if (!editingOrder) return;
    setOrderList(prev => prev.map(o => o.id === editingOrder.id ? {
      ...o,
      customerName: editOrderName,
      customerEmail: editOrderEmail,
      status: editOrderStatus,
    } : o));
    setEditingOrder(null);
  };

  const deleteOrder = (orderId: string) => {
    setOrderList(prev => prev.filter(o => o.id !== orderId));
    setDeleteConfirmOrderId(null);
  };

  const exportInventoryCSV = () => {
    const headers = ['SKU', 'Name', 'Category', 'OriginCountry', 'PriceEUR', 'TotalStock', 'LowStockThreshold', 'SupplierName'];
    const rows = products.map(p => [
      p.sku,
      `"${p.name.replace(/"/g, '""')}"`,
      p.category,
      p.originCountry,
      p.priceEUR.toFixed(2),
      p.totalStock,
      p.lowStockThreshold,
      `"${p.supplierName.replace(/"/g, '""')}"`
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${EXPORT_PREFIX}_Inventory_Report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleBatchJsonImport = async () => {
    try {
      const parsed = JSON.parse(importJsonText);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      const count = await importInventoryItems(items);
      setImportStatus(`Successfully updated ${count} products in inventory.`);
      setImportJsonText('');
    } catch (err) {
      setImportStatus('Invalid JSON format. Please ensure valid array of product objects.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Admin Header & Command Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-6">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-[var(--color-text-primary)] flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[var(--color-text-primary)] tracking-tight">Executive Merchant Admin Portal</h1>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                Centralized Single Market Hub: Inventory, Regional Orders, GDPR Privacy Suite &amp; Multi-Hub Warehouse Ops.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          
          <button
            onClick={exportInventoryCSV}
            className="bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-card-hover)] text-[var(--color-text-secondary)] border border-[var(--color-border)] text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition-all shadow-xs"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export CSV Report</span>
          </button>

          <button
            onClick={() => setIsAddProductModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-[var(--color-text-primary)] text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1.5 transition-all shadow-md shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product SKU</span>
          </button>

        </div>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-4 space-y-1.5 relative overflow-hidden group">
          <div className="flex justify-between items-center text-xs text-[var(--color-text-muted)] font-medium">
            <span>Gross Order Revenue</span>
            <Euro className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{formatPriceEUR(totalGrossRevenueEUR)}</div>
          <div className="text-[11px] text-[var(--color-text-muted)] flex items-center space-x-1">
            <TrendingUp className="w-3 h-3 text-emerald-400 inline" />
            <span>{completedOrdersCount} EU Orders Processed</span>
          </div>
        </div>

        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-4 space-y-1.5">
          <div className="flex justify-between items-center text-xs text-[var(--color-text-muted)] font-medium">
            <span>Total Catalog SKUs</span>
            <Box className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-[var(--color-text-primary)]">{totalSkus} SKUs</div>
          <div className="text-[11px] text-[var(--color-text-muted)]">{totalUnitsInStock} total units across hubs</div>
        </div>

        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-4 space-y-1.5">
          <div className="flex justify-between items-center text-xs text-[var(--color-text-muted)] font-medium">
            <span>Inventory Valuation</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-indigo-300">{formatPriceEUR(totalInventoryValueEUR)}</div>
          <div className="text-[11px] text-[var(--color-text-muted)]">Base EUR asset valuation</div>
        </div>

        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-4 space-y-1.5">
          <div className="flex justify-between items-center text-xs text-[var(--color-text-muted)] font-medium">
            <span>Low Stock Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{lowStockProducts.length} Items</div>
          <div className="text-[11px] text-[var(--color-text-muted)]">{outOfStockProducts.length} items out of stock</div>
        </div>

        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-4 space-y-1.5">
          <div className="flex justify-between items-center text-xs text-[var(--color-text-muted)] font-medium">
            <span>GDPR Compliance</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-400">100% Score</div>
          <div className="text-[11px] text-emerald-400 font-semibold">Art. 15/17 Single Market Compliant</div>
        </div>

      </div>

      {/* Admin Portal Main Navigation Tabs */}
      <div className="flex flex-wrap border-b border-[var(--color-border)] bg-[var(--color-bg-card)]/60 rounded-2xl p-1 gap-1">
        
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
            activeTab === 'overview' ? 'bg-blue-600 text-[var(--color-text-primary)] shadow-md' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Dashboard Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
            activeTab === 'inventory' ? 'bg-blue-600 text-[var(--color-text-primary)] shadow-md' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <Box className="w-4 h-4" />
          <span>Inventory Stock Table ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
            activeTab === 'orders' ? 'bg-blue-600 text-[var(--color-text-primary)] shadow-md' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Order Fulfillment Ledger ({orderList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('privacy')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
            activeTab === 'privacy' ? 'bg-blue-600 text-[var(--color-text-primary)] shadow-md' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>GDPR Privacy Suite</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
            activeTab === 'audit' ? 'bg-blue-600 text-[var(--color-text-primary)] shadow-md' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Audit Log &amp; Import</span>
        </button>

      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DASHBOARD OVERVIEW */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Category Stock Distribution Bar Chart */}
            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[var(--color-text-primary)] text-sm flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-blue-400" />
                  <span>Stock Units by Product Category</span>
                </h3>
                <span className="text-[10px] bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)] px-2 py-0.5 rounded font-mono">
                  {categoryChartData.length} Categories
                </span>
              </div>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData}>
                    <XAxis dataKey="category" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)', fontSize: '12px', borderRadius: '8px' }}
                    />
                    <Bar dataKey="totalStock" fill="#3b82f6" radius={[6, 6, 0, 0]}>
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Warehouse Hub Distribution */}
            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[var(--color-text-primary)] text-sm flex items-center space-x-2">
                  <Warehouse className="w-4 h-4 text-emerald-400" />
                  <span>EU Warehouse Fulfillment Capacity</span>
                </h3>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-bold">
                  3 Active Hubs
                </span>
              </div>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={warehouseChartData}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)', fontSize: '12px', borderRadius: '8px' }}
                    />
                    <Bar dataKey="quantity" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Live Orders Feed & Low Stock Alerts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Live Regional Orders Feed (2 columns) */}
            <div className="lg:col-span-2 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-[var(--color-text-primary)] text-sm flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-indigo-400" />
                    <span>Recent Regional Customer Orders</span>
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    Real-time European cross-border settlement &amp; VAT tax breakdown
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-1"
                >
                  <span>View All Ledger</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2.5">
                {orderList.slice(0, 4).map(order => {
                  const countryObj = EU_COUNTRIES.find(c => c.code === order.destinationCountry);
                  return (
                    <div 
                      key={order.id} 
                      className="bg-[var(--color-bg-tertiary)]/60 border border-[var(--color-border)] hover:border-[var(--color-border)] p-3.5 rounded-xl flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-xl">{countryObj?.flag || '🇪🇺'}</div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-bold text-blue-400">{order.id}</span>
                            <span className="text-xs font-bold text-[var(--color-text-primary)]">{order.customerName}</span>
                            <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.2 rounded font-bold">
                              {order.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'} • VAT ({countryObj?.name}): €{order.vatAmountEUR.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-sm text-[var(--color-text-primary)]">{formatPriceEUR(order.totalEUR)}</div>
                        <div className="text-[10px] text-[var(--color-text-muted)]">{new Date(order.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Low Stock Priority Panel (1 column) */}
            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[var(--color-text-primary)] text-sm flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Low Stock Priority Restock</span>
                </h3>
                <span className="text-xs text-amber-400 font-bold">{lowStockProducts.length + outOfStockProducts.length} Items</span>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar">
                {[...outOfStockProducts, ...lowStockProducts].slice(0, 5).map(product => (
                  <div key={product.id} className="bg-[var(--color-bg-tertiary)]/70 border border-[var(--color-border)] p-3 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-[var(--color-text-primary)] line-clamp-1 flex items-center space-x-1.5">
                        <span>{product.originFlag}</span>
                        <span>{product.name}</span>
                      </div>
                      <div className="text-[10px] text-[var(--color-text-muted)] mt-0.5">SKU: {product.sku} • {product.supplierName}</div>
                    </div>

                    <div className="text-right shrink-0 ml-2">
                      <div className={`font-black text-xs ${product.totalStock <= 0 ? 'text-rose-400' : 'text-amber-400'}`}>
                        {product.totalStock <= 0 ? 'Out of Stock' : `${product.totalStock} left`}
                      </div>
                      <button
                        onClick={() => {
                          setActiveTab('inventory');
                          setAdjustModalProduct(product);
                        }}
                        className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold underline mt-0.5 block"
                      >
                        Restock
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: INVENTORY STOCK MANAGER */}
      {/* ========================================================================= */}
      {activeTab === 'inventory' && (
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-lg space-y-4 p-5">
          
          {/* Table Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
              <input
                type="text"
                placeholder="Search by SKU or product name..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-[var(--color-bg-tertiary)] text-xs text-[var(--color-text-secondary)] pl-9 pr-3 py-2 rounded-xl border border-[var(--color-border)] focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border border-[var(--color-border)] px-3 py-2 rounded-xl focus:outline-none"
              >
                <option value="All">All Categories</option>
                {['Crafts', 'Technology', 'Fashion & Leather', 'Home & Living', 'Skincare & Cosmetics', 'Food & Fine Wine'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <button
                onClick={() => setSelectedStockFilter('all')}
                className={`px-3 py-2 rounded-xl border font-medium transition-colors ${selectedStockFilter === 'all' ? 'bg-blue-600 text-[var(--color-text-primary)] border-blue-500' : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border-[var(--color-border)]'}`}
              >
                All
              </button>

              <button
                onClick={() => setSelectedStockFilter('low')}
                className={`px-3 py-2 rounded-xl border font-medium transition-colors ${selectedStockFilter === 'low' ? 'bg-amber-600 text-[var(--color-text-primary)] border-amber-500' : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border-[var(--color-border)]'}`}
              >
                Low Stock ({lowStockProducts.length})
              </button>

              <button
                onClick={() => setSelectedStockFilter('out')}
                className={`px-3 py-2 rounded-xl border font-medium transition-colors ${selectedStockFilter === 'out' ? 'bg-rose-600 text-[var(--color-text-primary)] border-rose-500' : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border-[var(--color-border)]'}`}
              >
                Out of Stock ({outOfStockProducts.length})
              </button>

            </div>

          </div>

          {/* Table */}
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs text-[var(--color-text-secondary)]">
              <thead className="bg-[var(--color-bg-tertiary)]/80 text-[var(--color-text-muted)] font-bold uppercase tracking-wider text-[10px] border-b border-[var(--color-border)]">
                <tr>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price (EUR)</th>
                  <th className="p-3">Stock Units</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Warehouse Hubs</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {filteredProducts.map(p => {
                  const isLow = p.totalStock > 0 && p.totalStock <= p.lowStockThreshold;
                  const isOut = p.totalStock <= 0;

                  return (
                    <tr key={p.id} className="hover:bg-[var(--color-bg-tertiary)]/50 transition-colors">
                      
                      <td className="p-3 font-mono text-blue-400 font-semibold">{p.sku}</td>

                      <td className="p-3 font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
                        <span>{p.originFlag}</span>
                        <span className="truncate max-w-xs">{p.name}</span>
                      </td>

                      <td className="p-3 text-[var(--color-text-muted)]">{p.category}</td>

                      <td className="p-3 font-semibold text-[var(--color-text-primary)]">{formatPriceEUR(p.priceEUR)}</td>

                      <td className="p-3 font-extrabold text-sm text-[var(--color-text-primary)]">{p.totalStock}</td>

                      <td className="p-3">
                        {isOut ? (
                          <span className="bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded text-[10px] font-bold">
                            Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded text-[10px] font-bold">
                            Low Stock ({p.totalStock})
                          </span>
                        ) : (
                          <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                            In Stock
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-[11px] text-[var(--color-text-muted)]">
                        {p.warehouses.map(w => `${w.warehouseName.split(' ')[0]}: ${w.quantity}`).join(' | ')}
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => setAdjustModalProduct(p)}
                            className="bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 border border-indigo-500/40 px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-all"
                            title="Adjust stock quantity"
                          >
                            Adjust Stock
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="text-[var(--color-text-muted)] hover:text-rose-400 p-1 rounded transition-colors"
                            title="Delete SKU"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: ORDER FULFILLMENT LEDGER */}
      {/* ========================================================================= */}
      {activeTab === 'orders' && (
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-lg space-y-4 p-5">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-[var(--color-text-primary)] text-base">European Order Fulfillment Ledger</h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                Cross-border EU VAT invoices, customer settlement logs, and fulfillment tracking.
              </p>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <select
                value={orderStatusFilter}
                onChange={e => setOrderStatusFilter(e.target.value)}
                className="bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border border-[var(--color-border)] px-3 py-2 rounded-xl focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="COMPLETED">Completed</option>
                <option value="PROCESSING">Processing</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs text-[var(--color-text-secondary)]">
              <thead className="bg-[var(--color-bg-tertiary)]/80 text-[var(--color-text-muted)] font-bold uppercase tracking-wider text-[10px] border-b border-[var(--color-border)]">
                <tr>
                  <th className="p-3">Order Ref</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Destination EU Country</th>
                  <th className="p-3">Items Purchased</th>
                  <th className="p-3">Gross Total (EUR)</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {filteredOrders.map(order => {
                  const countryObj = EU_COUNTRIES.find(c => c.code === order.destinationCountry);
                  return (
                    <tr key={order.id} className="hover:bg-[var(--color-bg-tertiary)]/50 transition-colors">
                      <td className="p-3 font-mono text-blue-400 font-bold">{order.id}</td>
                      <td className="p-3">
                        <div className="font-bold text-[var(--color-text-primary)]">{order.customerName}</div>
                        <div className="text-[10px] text-[var(--color-text-muted)]">{order.customerEmail}</div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-1.5 font-medium text-[var(--color-text-primary)]">
                          <span>{countryObj?.flag || '🇪🇺'}</span>
                          <span>{countryObj?.name || order.destinationCountry}</span>
                        </div>
                        <div className="text-[10px] text-[var(--color-text-muted)]">VAT ({(order.vatRate * 100).toFixed(0)}%): €{order.vatAmountEUR.toFixed(2)}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-[var(--color-text-primary)]">{order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</div>
                      </td>
                      <td className="p-3 font-bold text-emerald-400">{formatPriceEUR(order.totalEUR)}</td>
                      <td className="p-3">
                        <select
                          value={order.status}
                          onChange={e => updateOrderStatus(order.id, e.target.value as any)}
                          className={`text-[10px] font-bold px-2 py-1 rounded border focus:outline-none ${
                            order.status === 'COMPLETED' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' :
                            order.status === 'PROCESSING' ? 'bg-blue-950 text-blue-300 border-blue-800' : 'bg-rose-950 text-rose-300 border-rose-800'
                          }`}
                        >
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => setSelectedOrderForDetail(order)}
                            className="bg-blue-600/20 hover:bg-blue-600 text-blue-300 border border-blue-500/40 px-2 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center space-x-1"
                            title="View order details"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => openEditOrder(order)}
                            className="bg-amber-600/20 hover:bg-amber-600 text-amber-300 border border-amber-500/40 px-2 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center space-x-1"
                            title="Edit order"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => setDeleteConfirmOrderId(order.id)}
                            className="text-[var(--color-text-muted)] hover:text-rose-400 p-1 rounded transition-colors"
                            title="Delete order"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: GDPR PRIVACY SUITE */}
      {/* ========================================================================= */}
      {activeTab === 'privacy' && (
        <div className="space-y-6">
          
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4">
              <div>
                <h3 className="text-lg font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                  <span>GDPR Single Market Compliance Suite</span>
                </h3>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                  Full Article 15 (DSAR) &amp; Article 17 (Right to Be Forgotten) ledger management.
                </p>
              </div>

              <button
                onClick={downloadDSARPackage}
                className="bg-blue-600 hover:bg-blue-500 text-[var(--color-text-primary)] font-bold text-xs px-4 py-2 rounded-xl flex items-center space-x-1.5 transition-all shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Export DSAR Audit Bundle</span>
              </button>
            </div>

            {/* Consent Audit Logs */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Active Consent Audit History ({consentLogs.length})</h4>
              
              <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
                {consentLogs.map(log => (
                  <div key={log.id} className="bg-[var(--color-bg-tertiary)]/60 border border-[var(--color-border)] p-3 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
                        <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                        <span>{log.action}</span>
                      </div>
                      <p className="text-[var(--color-text-muted)] text-[11px] mt-0.5">{log.details}</p>
                      <div className="text-[10px] text-[var(--color-text-muted)] mt-0.5">IP Hash: {log.ipAddressHash}</div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-[var(--color-text-muted)] font-mono">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: STOCK AUDIT LOG & BATCH IMPORT */}
      {/* ========================================================================= */}
      {activeTab === 'audit' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Audit History */}
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-[var(--color-text-primary)] text-sm flex items-center space-x-2">
              <History className="w-4 h-4 text-amber-400" />
              <span>Stock Adjustment &amp; Restock Audit Logs</span>
            </h3>

            <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
              {stockAdjustments.map(adj => (
                <div key={adj.id} className="bg-[var(--color-bg-tertiary)]/60 border border-[var(--color-border)] p-3 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                        adj.adjustmentType === 'RESTOCK' ? 'bg-emerald-950 text-emerald-300' :
                        adj.adjustmentType === 'DAMAGED' ? 'bg-rose-950 text-rose-300' : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]'
                      }`}>
                        {adj.adjustmentType}
                      </span>
                      <span className="font-bold text-[var(--color-text-primary)]">{adj.productName}</span>
                    </div>
                    <p className="text-[var(--color-text-muted)] text-[11px] mt-1">{adj.note} • {adj.warehouseName}</p>
                    <div className="text-[10px] text-[var(--color-text-muted)] mt-0.5">By {adj.performedBy} on {adj.timestamp}</div>
                  </div>

                  <div className="text-right shrink-0 ml-3">
                    <div className={`font-extrabold text-sm ${adj.quantityChange > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {adj.quantityChange > 0 ? `+${adj.quantityChange}` : adj.quantityChange}
                    </div>
                    <div className="text-[10px] text-[var(--color-text-muted)]">New Stock: {adj.newStock}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Batch Import */}
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-[var(--color-text-primary)] text-sm flex items-center space-x-2">
              <Upload className="w-4 h-4 text-blue-400" />
              <span>Batch Inventory Import (JSON)</span>
            </h3>
            <p className="text-xs text-[var(--color-text-muted)]">
              Paste a JSON array of product objects to batch update stock levels across all European hubs.
            </p>

            <textarea
              rows={8}
              placeholder={`[\n  { "sku": "DE-AUD-010", "totalStock": 50, "priceEUR": 289.00 }\n]`}
              value={importJsonText}
              onChange={e => setImportJsonText(e.target.value)}
              className="w-full bg-[var(--color-bg-tertiary)] text-xs font-mono text-[var(--color-text-secondary)] p-3 rounded-xl border border-[var(--color-border)] focus:outline-none focus:border-blue-500"
            />

            {importStatus && (
              <div className="text-xs font-semibold text-blue-400 bg-blue-950/40 p-2.5 rounded-xl border border-blue-800">
                {importStatus}
              </div>
            )}

            <button
              onClick={handleBatchJsonImport}
              className="w-full bg-blue-600 hover:bg-blue-500 text-[var(--color-text-primary)] font-bold py-3 rounded-xl text-xs transition-all shadow-md"
            >
              Run Batch Stock Update
            </button>
          </div>

        </div>
      )}

      {/* MODAL 1: QUICK STOCK ADJUSTMENT */}
      {adjustModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-bg-overlay)] backdrop-blur-sm p-4">
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            
            <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-3">
              <h3 className="font-bold text-[var(--color-text-primary)] text-base">Adjust Stock: {adjustModalProduct.name}</h3>
              <button onClick={() => setAdjustModalProduct(null)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStockAdjustmentSubmit} className="space-y-3 text-xs">
              
              <div>
                <label className="text-[var(--color-text-muted)] font-semibold">Warehouse Hub:</label>
                <select
                  value={adjWarehouseId}
                  onChange={e => setAdjWarehouseId(e.target.value)}
                  className="w-full bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border border-[var(--color-border)] rounded-xl px-3 py-2 mt-1"
                >
                  <option value="wh-fra">Frankfurt Hub (DE-01)</option>
                  <option value="wh-ams">Amsterdam Logistics (NL-02)</option>
                  <option value="wh-lyn">Lyon Fulfillment (FR-03)</option>
                </select>
              </div>

              <div>
                <label className="text-[var(--color-text-muted)] font-semibold">Adjustment Reason:</label>
                <select
                  value={adjType}
                  onChange={e => setAdjType(e.target.value as any)}
                  className="w-full bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border border-[var(--color-border)] rounded-xl px-3 py-2 mt-1"
                >
                  <option value="RESTOCK">Inbound Shipment Restock (+)</option>
                  <option value="AUDIT_CORRECTION">Stock Audit Correction (+/-)</option>
                  <option value="DAMAGED">Damaged / Written Off (-)</option>
                  <option value="RETURN">Customer Return (+)</option>
                </select>
              </div>

              <div>
                <label className="text-[var(--color-text-muted)] font-semibold">Quantity Change:</label>
                <input
                  type="number"
                  required
                  value={adjQty}
                  onChange={e => setAdjQty(Number(e.target.value))}
                  className="w-full bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border border-[var(--color-border)] rounded-xl px-3 py-2 mt-1 font-bold"
                />
              </div>

              <div>
                <label className="text-[var(--color-text-muted)] font-semibold">Audit Note:</label>
                <input
                  type="text"
                  placeholder="e.g. Inbound PO #9822 or damaged pallet"
                  value={adjNote}
                  onChange={e => setAdjNote(e.target.value)}
                  className="w-full bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border border-[var(--color-border)] rounded-xl px-3 py-2 mt-1"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-[var(--color-text-primary)] font-bold py-3 rounded-xl transition-all shadow-md mt-2"
              >
                Save Stock Adjustment
              </button>

            </form>

          </div>
        </div>
      )}

      {/* MODAL 2: ADD NEW PRODUCT */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-bg-overlay)] backdrop-blur-sm p-4">
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-3">
              <h3 className="font-bold text-[var(--color-text-primary)] text-base">Add European Product to Inventory</h3>
              <button onClick={() => setIsAddProductModalOpen(false)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-3 text-xs">
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[var(--color-text-muted)] font-semibold">SKU Code</label>
                  <input
                    type="text"
                    required
                    placeholder="DE-AUD-999"
                    value={newSku}
                    onChange={e => setNewSku(e.target.value)}
                    className="w-full bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border border-[var(--color-border)] rounded-xl px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="text-[var(--color-text-muted)] font-semibold">Category</label>
                  <select
                    value={newCat}
                    onChange={e => setNewCat(e.target.value as Category)}
                    className="w-full bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border border-[var(--color-border)] rounded-xl px-3 py-2 mt-1"
                  >
                    {['Crafts', 'Technology', 'Fashion & Leather', 'Home & Living', 'Skincare & Cosmetics', 'Food & Fine Wine'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[var(--color-text-muted)] font-semibold">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bavarian Precision Amplifier"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border border-[var(--color-border)] rounded-xl px-3 py-2 mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[var(--color-text-muted)] font-semibold">EUR Price (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newPrice}
                    onChange={e => setNewPrice(Number(e.target.value))}
                    className="w-full bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border border-[var(--color-border)] rounded-xl px-3 py-2 mt-1 font-bold"
                  />
                </div>
                <div>
                  <label className="text-[var(--color-text-muted)] font-semibold">Initial Stock</label>
                  <input
                    type="number"
                    required
                    value={newStock}
                    onChange={e => setNewStock(Number(e.target.value))}
                    className="w-full bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border border-[var(--color-border)] rounded-xl px-3 py-2 mt-1 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[var(--color-text-muted)] font-semibold">EU Origin Country</label>
                  <input
                    type="text"
                    required
                    value={newOrigin}
                    onChange={e => setNewOrigin(e.target.value)}
                    className="w-full bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border border-[var(--color-border)] rounded-xl px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="text-[var(--color-text-muted)] font-semibold">Flag Emoji</label>
                  <input
                    type="text"
                    required
                    value={newOriginFlag}
                    onChange={e => setNewOriginFlag(e.target.value)}
                    className="w-full bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border border-[var(--color-border)] rounded-xl px-3 py-2 mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-[var(--color-text-muted)] font-semibold">Supplier Name</label>
                <input
                  type="text"
                  required
                  value={newSupplier}
                  onChange={e => setNewSupplier(e.target.value)}
                  className="w-full bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border border-[var(--color-border)] rounded-xl px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="text-[var(--color-text-muted)] font-semibold">Image URL</label>
                <input
                  type="text"
                  required
                  value={newImage}
                  onChange={e => setNewImage(e.target.value)}
                  className="w-full bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border border-[var(--color-border)] rounded-xl px-3 py-2 mt-1"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-[var(--color-text-primary)] font-bold py-3 rounded-xl transition-all shadow-md mt-3"
              >
                Add SKU to European Inventory
              </button>

            </form>

          </div>
        </div>
      )}

      {/* MODAL: ORDER DETAIL VIEW */}
      {selectedOrderForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-bg-overlay)] backdrop-blur-sm p-4">
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-3">
              <h3 className="font-bold text-base">Order Details</h3>
              <button onClick={() => setSelectedOrderForDetail(null)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[var(--color-text-muted)] font-semibold block">Order ID</span>
                  <span className="font-mono text-blue-400 font-bold">{selectedOrderForDetail.id}</span>
                </div>
                <div>
                  <span className="text-[var(--color-text-muted)] font-semibold block">Status</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                    selectedOrderForDetail.status === 'COMPLETED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                    selectedOrderForDetail.status === 'PROCESSING' ? 'bg-blue-950 text-blue-300 border border-blue-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}>{selectedOrderForDetail.status}</span>
                </div>
                <div>
                  <span className="text-[var(--color-text-muted)] font-semibold block">Customer</span>
                  <span className="font-bold text-[var(--color-text-primary)]">{selectedOrderForDetail.customerName}</span>
                </div>
                <div>
                  <span className="text-[var(--color-text-muted)] font-semibold block">Email</span>
                  <span className="text-[var(--color-text-secondary)]">{selectedOrderForDetail.customerEmail}</span>
                </div>
                <div>
                  <span className="text-[var(--color-text-muted)] font-semibold block">Destination</span>
                  <span className="text-[var(--color-text-primary)]">{EU_COUNTRIES.find(c => c.code === selectedOrderForDetail.destinationCountry)?.flag} {EU_COUNTRIES.find(c => c.code === selectedOrderForDetail.destinationCountry)?.name || selectedOrderForDetail.destinationCountry}</span>
                </div>
                <div>
                  <span className="text-[var(--color-text-muted)] font-semibold block">Date</span>
                  <span className="text-[var(--color-text-secondary)]">{new Date(selectedOrderForDetail.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t border-[var(--color-border)] pt-3 space-y-2">
                <span className="text-[var(--color-text-muted)] font-bold uppercase tracking-wider text-[10px]">Items</span>
                {selectedOrderForDetail.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center bg-[var(--color-bg-tertiary)] p-2.5 rounded-xl border border-[var(--color-border)]">
                    <div>
                      <span className="font-bold text-[var(--color-text-primary)]">{item.name}</span>
                      <span className="text-[var(--color-text-muted)] ml-2">x{item.quantity}</span>
                      <div className="text-[10px] text-[var(--color-text-muted)] font-mono">SKU: {item.sku}</div>
                    </div>
                    <span className="font-bold text-emerald-400">{formatPriceEUR(item.totalPriceEUR)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[var(--color-border)] pt-3 space-y-1.5">
                <div className="flex justify-between"><span className="text-[var(--color-text-muted)]">Subtotal</span><span className="text-[var(--color-text-primary)]">{formatPriceEUR(selectedOrderForDetail.subtotalEUR)}</span></div>
                <div className="flex justify-between"><span className="text-[var(--color-text-muted)]">VAT ({(selectedOrderForDetail.vatRate * 100).toFixed(0)}%)</span><span className="text-[var(--color-text-primary)]">{formatPriceEUR(selectedOrderForDetail.vatAmountEUR)}</span></div>
                <div className="flex justify-between"><span className="text-[var(--color-text-muted)]">Shipping</span><span className="text-[var(--color-text-primary)]">{selectedOrderForDetail.shippingFeeEUR === 0 ? 'Free' : formatPriceEUR(selectedOrderForDetail.shippingFeeEUR)}</span></div>
                <div className="flex justify-between font-bold text-sm pt-1 border-t border-[var(--color-border)]"><span className="text-[var(--color-text-primary)]">Total</span><span className="text-emerald-400">{formatPriceEUR(selectedOrderForDetail.totalEUR)}</span></div>
              </div>

              {selectedOrderForDetail.paidCurrency !== 'EUR' && (
                <div className="text-[10px] text-[var(--color-text-muted)] bg-[var(--color-bg-tertiary)] p-2 rounded-lg border border-[var(--color-border)]">
                  Paid in {selectedOrderForDetail.paidCurrencySymbol}{selectedOrderForDetail.paidAmountConverted.toFixed(2)} {selectedOrderForDetail.paidCurrency} (rate: {selectedOrderForDetail.exchangeRateUsed})
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT ORDER */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-bg-overlay)] backdrop-blur-sm p-4">
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-3">
              <h3 className="font-bold text-base">Edit Order: {editingOrder.id}</h3>
              <button onClick={() => setEditingOrder(null)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[var(--color-text-muted)] font-semibold">Customer Name</label>
                <input type="text" value={editOrderName} onChange={e => setEditOrderName(e.target.value)} className="w-full bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border border-[var(--color-border)] rounded-xl px-3 py-2 mt-1" />
              </div>
              <div>
                <label className="text-[var(--color-text-muted)] font-semibold">Customer Email</label>
                <input type="email" value={editOrderEmail} onChange={e => setEditOrderEmail(e.target.value)} className="w-full bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border border-[var(--color-border)] rounded-xl px-3 py-2 mt-1" />
              </div>
              <div>
                <label className="text-[var(--color-text-muted)] font-semibold">Status</label>
                <select value={editOrderStatus} onChange={e => setEditOrderStatus(e.target.value as any)} className="w-full bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border border-[var(--color-border)] rounded-xl px-3 py-2 mt-1">
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div className="flex space-x-2 pt-2">
                <button onClick={saveEditOrder} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md">Save Changes</button>
                <button onClick={() => setEditingOrder(null)} className="flex-1 bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] font-semibold py-2.5 rounded-xl text-xs border border-[var(--color-border)]">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DELETE ORDER CONFIRM */}
      {deleteConfirmOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-bg-overlay)] backdrop-blur-sm p-4">
          <div className="bg-[var(--color-bg-card)] border border-rose-500/50 text-[var(--color-text-primary)] rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-600/20 text-rose-500 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[var(--color-text-primary)]">Delete Order?</h3>
              <p className="text-xs text-[var(--color-text-muted)]">This will permanently remove order <span className="font-mono font-bold text-blue-400">{deleteConfirmOrderId}</span> from the ledger. This action cannot be undone.</p>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => deleteOrder(deleteConfirmOrderId)} className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all">Yes, Delete</button>
              <button onClick={() => setDeleteConfirmOrderId(null)} className="flex-1 bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] font-semibold py-2.5 rounded-xl text-xs border border-[var(--color-border)]">Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
