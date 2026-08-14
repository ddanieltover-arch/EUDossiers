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
  Check
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Executive Merchant Admin Portal</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Centralized Single Market Hub: Inventory, Regional Orders, GDPR Privacy Suite &amp; Multi-Hub Warehouse Ops.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          
          <button
            onClick={exportInventoryCSV}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition-all shadow-xs"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export CSV Report</span>
          </button>

          <button
            onClick={() => setIsAddProductModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1.5 transition-all shadow-md shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product SKU</span>
          </button>

        </div>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1.5 relative overflow-hidden group">
          <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
            <span>Gross Order Revenue</span>
            <Euro className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{formatPriceEUR(totalGrossRevenueEUR)}</div>
          <div className="text-[11px] text-slate-400 flex items-center space-x-1">
            <TrendingUp className="w-3 h-3 text-emerald-400 inline" />
            <span>{completedOrdersCount} EU Orders Processed</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1.5">
          <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
            <span>Total Catalog SKUs</span>
            <Box className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalSkus} SKUs</div>
          <div className="text-[11px] text-slate-400">{totalUnitsInStock} total units across hubs</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1.5">
          <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
            <span>Inventory Valuation</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-indigo-300">{formatPriceEUR(totalInventoryValueEUR)}</div>
          <div className="text-[11px] text-slate-400">Base EUR asset valuation</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1.5">
          <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
            <span>Low Stock Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{lowStockProducts.length} Items</div>
          <div className="text-[11px] text-slate-400">{outOfStockProducts.length} items out of stock</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1.5">
          <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
            <span>GDPR Compliance</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-400">100% Score</div>
          <div className="text-[11px] text-emerald-400 font-semibold">Art. 15/17 Single Market Compliant</div>
        </div>

      </div>

      {/* Admin Portal Main Navigation Tabs */}
      <div className="flex flex-wrap border-b border-slate-800 bg-slate-900/60 rounded-2xl p-1 gap-1">
        
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
            activeTab === 'overview' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Dashboard Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
            activeTab === 'inventory' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Box className="w-4 h-4" />
          <span>Inventory Stock Table ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
            activeTab === 'orders' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Order Fulfillment Ledger ({orderList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('privacy')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
            activeTab === 'privacy' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>GDPR Privacy Suite</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
            activeTab === 'audit' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
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
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-blue-400" />
                  <span>Stock Units by Product Category</span>
                </h3>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                  {categoryChartData.length} Categories
                </span>
              </div>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData}>
                    <XAxis dataKey="category" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: '12px', borderRadius: '8px' }}
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
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm flex items-center space-x-2">
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
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: '12px', borderRadius: '8px' }}
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
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-indigo-400" />
                    <span>Recent Regional Customer Orders</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
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
                      className="bg-slate-800/60 border border-slate-800 hover:border-slate-700 p-3.5 rounded-xl flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-xl">{countryObj?.flag || '🇪🇺'}</div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-bold text-blue-400">{order.id}</span>
                            <span className="text-xs font-bold text-white">{order.customerName}</span>
                            <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.2 rounded font-bold">
                              {order.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'} • VAT ({countryObj?.name}): €{order.vatAmountEUR.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-sm text-white">{formatPriceEUR(order.totalEUR)}</div>
                        <div className="text-[10px] text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Low Stock Priority Panel (1 column) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Low Stock Priority Restock</span>
                </h3>
                <span className="text-xs text-amber-400 font-bold">{lowStockProducts.length + outOfStockProducts.length} Items</span>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar">
                {[...outOfStockProducts, ...lowStockProducts].slice(0, 5).map(product => (
                  <div key={product.id} className="bg-slate-800/70 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white line-clamp-1 flex items-center space-x-1.5">
                        <span>{product.originFlag}</span>
                        <span>{product.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">SKU: {product.sku} • {product.supplierName}</div>
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
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg space-y-4 p-5">
          
          {/* Table Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by SKU or product name..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800 text-xs text-slate-200 pl-9 pr-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="bg-slate-800 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl focus:outline-none"
              >
                <option value="All">All Categories</option>
                {['Crafts', 'Technology', 'Fashion & Leather', 'Home & Living', 'Skincare & Cosmetics', 'Food & Fine Wine'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <button
                onClick={() => setSelectedStockFilter('all')}
                className={`px-3 py-2 rounded-xl border font-medium transition-colors ${selectedStockFilter === 'all' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-slate-300 border-slate-700'}`}
              >
                All
              </button>

              <button
                onClick={() => setSelectedStockFilter('low')}
                className={`px-3 py-2 rounded-xl border font-medium transition-colors ${selectedStockFilter === 'low' ? 'bg-amber-600 text-white border-amber-500' : 'bg-slate-800 text-slate-300 border-slate-700'}`}
              >
                Low Stock ({lowStockProducts.length})
              </button>

              <button
                onClick={() => setSelectedStockFilter('out')}
                className={`px-3 py-2 rounded-xl border font-medium transition-colors ${selectedStockFilter === 'out' ? 'bg-rose-600 text-white border-rose-500' : 'bg-slate-800 text-slate-300 border-slate-700'}`}
              >
                Out of Stock ({outOfStockProducts.length})
              </button>

            </div>

          </div>

          {/* Table */}
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
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
              <tbody className="divide-y divide-slate-800">
                {filteredProducts.map(p => {
                  const isLow = p.totalStock > 0 && p.totalStock <= p.lowStockThreshold;
                  const isOut = p.totalStock <= 0;

                  return (
                    <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                      
                      <td className="p-3 font-mono text-blue-400 font-semibold">{p.sku}</td>

                      <td className="p-3 font-bold text-white flex items-center space-x-2">
                        <span>{p.originFlag}</span>
                        <span className="truncate max-w-xs">{p.name}</span>
                      </td>

                      <td className="p-3 text-slate-400">{p.category}</td>

                      <td className="p-3 font-semibold text-white">{formatPriceEUR(p.priceEUR)}</td>

                      <td className="p-3 font-extrabold text-sm text-white">{p.totalStock}</td>

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

                      <td className="p-3 text-[11px] text-slate-400">
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
                            className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
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
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg space-y-4 p-5">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-white text-base">European Order Fulfillment Ledger</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Cross-border EU VAT invoices, customer settlement logs, and fulfillment tracking.
              </p>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <select
                value={orderStatusFilter}
                onChange={e => setOrderStatusFilter(e.target.value)}
                className="bg-slate-800 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="COMPLETED">Completed</option>
                <option value="PROCESSING">Processing</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
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
              <tbody className="divide-y divide-slate-800">
                {filteredOrders.map(order => {
                  const countryObj = EU_COUNTRIES.find(c => c.code === order.destinationCountry);
                  return (
                    <tr key={order.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-3 font-mono text-blue-400 font-bold">{order.id}</td>
                      <td className="p-3">
                        <div className="font-bold text-white">{order.customerName}</div>
                        <div className="text-[10px] text-slate-400">{order.customerEmail}</div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-1.5 font-medium text-white">
                          <span>{countryObj?.flag || '🇪🇺'}</span>
                          <span>{countryObj?.name || order.destinationCountry}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">VAT ({(order.vatRate * 100).toFixed(0)}%): €{order.vatAmountEUR.toFixed(2)}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-white">{order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</div>
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
                        <button
                          onClick={() => {
                            if (products.length > 0) {
                              downloadTaxInvoicePDF(products[0]);
                            }
                          }}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-2.5 py-1 rounded text-[11px] font-semibold transition-colors"
                        >
                          Print Tax Spec
                        </button>
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
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                  <span>GDPR Single Market Compliance Suite</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Full Article 15 (DSAR) &amp; Article 17 (Right to Be Forgotten) ledger management.
                </p>
              </div>

              <button
                onClick={downloadDSARPackage}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center space-x-1.5 transition-all shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Export DSAR Audit Bundle</span>
              </button>
            </div>

            {/* Consent Audit Logs */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Active Consent Audit History ({consentLogs.length})</h4>
              
              <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
                {consentLogs.map(log => (
                  <div key={log.id} className="bg-slate-800/60 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white flex items-center space-x-2">
                        <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                        <span>{log.action}</span>
                      </div>
                      <p className="text-slate-400 text-[11px] mt-0.5">{log.details}</p>
                      <div className="text-[10px] text-slate-500 mt-0.5">IP Hash: {log.ipAddressHash}</div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-400 font-mono">{new Date(log.timestamp).toLocaleString()}</span>
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
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center space-x-2">
              <History className="w-4 h-4 text-amber-400" />
              <span>Stock Adjustment &amp; Restock Audit Logs</span>
            </h3>

            <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
              {stockAdjustments.map(adj => (
                <div key={adj.id} className="bg-slate-800/60 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                        adj.adjustmentType === 'RESTOCK' ? 'bg-emerald-950 text-emerald-300' :
                        adj.adjustmentType === 'DAMAGED' ? 'bg-rose-950 text-rose-300' : 'bg-slate-700 text-slate-200'
                      }`}>
                        {adj.adjustmentType}
                      </span>
                      <span className="font-bold text-white">{adj.productName}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-1">{adj.note} • {adj.warehouseName}</p>
                    <div className="text-[10px] text-slate-500 mt-0.5">By {adj.performedBy} on {adj.timestamp}</div>
                  </div>

                  <div className="text-right shrink-0 ml-3">
                    <div className={`font-extrabold text-sm ${adj.quantityChange > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {adj.quantityChange > 0 ? `+${adj.quantityChange}` : adj.quantityChange}
                    </div>
                    <div className="text-[10px] text-slate-500">New Stock: {adj.newStock}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Batch Import */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center space-x-2">
              <Upload className="w-4 h-4 text-blue-400" />
              <span>Batch Inventory Import (JSON)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Paste a JSON array of product objects to batch update stock levels across all European hubs.
            </p>

            <textarea
              rows={8}
              placeholder={`[\n  { "sku": "DE-AUD-010", "totalStock": 50, "priceEUR": 289.00 }\n]`}
              value={importJsonText}
              onChange={e => setImportJsonText(e.target.value)}
              className="w-full bg-slate-800 text-xs font-mono text-slate-200 p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-blue-500"
            />

            {importStatus && (
              <div className="text-xs font-semibold text-blue-400 bg-blue-950/40 p-2.5 rounded-xl border border-blue-800">
                {importStatus}
              </div>
            )}

            <button
              onClick={handleBatchJsonImport}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md"
            >
              Run Batch Stock Update
            </button>
          </div>

        </div>
      )}

      {/* MODAL 1: QUICK STOCK ADJUSTMENT */}
      {adjustModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Adjust Stock: {adjustModalProduct.name}</h3>
              <button onClick={() => setAdjustModalProduct(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStockAdjustmentSubmit} className="space-y-3 text-xs">
              
              <div>
                <label className="text-slate-400 font-semibold">Warehouse Hub:</label>
                <select
                  value={adjWarehouseId}
                  onChange={e => setAdjWarehouseId(e.target.value)}
                  className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-xl px-3 py-2 mt-1"
                >
                  <option value="wh-fra">Frankfurt Hub (DE-01)</option>
                  <option value="wh-ams">Amsterdam Logistics (NL-02)</option>
                  <option value="wh-lyn">Lyon Fulfillment (FR-03)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-semibold">Adjustment Reason:</label>
                <select
                  value={adjType}
                  onChange={e => setAdjType(e.target.value as any)}
                  className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-xl px-3 py-2 mt-1"
                >
                  <option value="RESTOCK">Inbound Shipment Restock (+)</option>
                  <option value="AUDIT_CORRECTION">Stock Audit Correction (+/-)</option>
                  <option value="DAMAGED">Damaged / Written Off (-)</option>
                  <option value="RETURN">Customer Return (+)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-semibold">Quantity Change:</label>
                <input
                  type="number"
                  required
                  value={adjQty}
                  onChange={e => setAdjQty(Number(e.target.value))}
                  className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-xl px-3 py-2 mt-1 font-bold"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold">Audit Note:</label>
                <input
                  type="text"
                  placeholder="e.g. Inbound PO #9822 or damaged pallet"
                  value={adjNote}
                  onChange={e => setAdjNote(e.target.value)}
                  className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-xl px-3 py-2 mt-1"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-md mt-2"
              >
                Save Stock Adjustment
              </button>

            </form>

          </div>
        </div>
      )}

      {/* MODAL 2: ADD NEW PRODUCT */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Add European Product to Inventory</h3>
              <button onClick={() => setIsAddProductModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-3 text-xs">
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 font-semibold">SKU Code</label>
                  <input
                    type="text"
                    required
                    placeholder="DE-AUD-999"
                    value={newSku}
                    onChange={e => setNewSku(e.target.value)}
                    className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-xl px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold">Category</label>
                  <select
                    value={newCat}
                    onChange={e => setNewCat(e.target.value as Category)}
                    className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-xl px-3 py-2 mt-1"
                  >
                    {['Crafts', 'Technology', 'Fashion & Leather', 'Home & Living', 'Skincare & Cosmetics', 'Food & Fine Wine'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bavarian Precision Amplifier"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-xl px-3 py-2 mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 font-semibold">EUR Price (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newPrice}
                    onChange={e => setNewPrice(Number(e.target.value))}
                    className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-xl px-3 py-2 mt-1 font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold">Initial Stock</label>
                  <input
                    type="number"
                    required
                    value={newStock}
                    onChange={e => setNewStock(Number(e.target.value))}
                    className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-xl px-3 py-2 mt-1 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 font-semibold">EU Origin Country</label>
                  <input
                    type="text"
                    required
                    value={newOrigin}
                    onChange={e => setNewOrigin(e.target.value)}
                    className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-xl px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold">Flag Emoji</label>
                  <input
                    type="text"
                    required
                    value={newOriginFlag}
                    onChange={e => setNewOriginFlag(e.target.value)}
                    className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-xl px-3 py-2 mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold">Supplier Name</label>
                <input
                  type="text"
                  required
                  value={newSupplier}
                  onChange={e => setNewSupplier(e.target.value)}
                  className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-xl px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold">Image URL</label>
                <input
                  type="text"
                  required
                  value={newImage}
                  onChange={e => setNewImage(e.target.value)}
                  className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-xl px-3 py-2 mt-1"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-md mt-3"
              >
                Add SKU to European Inventory
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
