import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useProducts from '../../hooks/useProducts';
import useOrders from '../../hooks/useOrders';
import useCustomers from '../../hooks/useCustomers';
import KpiCard from '../../components/ui/KpiCard';
import Badge from '../../components/ui/Badge';
import { showError, showSuccess } from '../../utils/toast';
import { 
  ShoppingBag, 
  Users, 
  Package, 
  ArrowRight,
  IndianRupee,
  Download,
  Calendar
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

export const OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { products, fetchProducts, loading: loadingProducts } = useProducts(true);
  const { orders, fetchOrders, loading: loadingOrders } = useOrders(true);
  const { customers, fetchCustomers, loading: loadingCustomers } = useCustomers(true);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchCustomers();
  }, [fetchProducts, fetchOrders, fetchCustomers]);

  const calculatedRevenue = orders.reduce(
    (sum, o) => (o.orderStatus !== 'CANCELLED' ? sum + Number(o.totalAmount || 0) : sum),
    0
  );
  const calculatedOrders = orders.length;
  const calculatedCustomers = customers.length;
  const calculatedProducts = products.filter((product) => product.isActive).length;

  // Date range for revenue chart (defaults to last 30 days)
  const toInputDate = (date: Date) => date.toISOString().split('T')[0];
  const today = new Date();
  const defaultStart = new Date();
  defaultStart.setDate(today.getDate() - 29);

  const [startDate, setStartDate] = useState(toInputDate(defaultStart));
  const [endDate, setEndDate] = useState(toInputDate(today));

  const chartData = useMemo(() => {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const revenueByDay = orders.reduce<Record<string, number>>((acc, order) => {
      if (order.orderStatus === 'CANCELLED') return acc;
      const created = new Date(order.createdAt);
      if (created < start || created > end) return acc;
      const key = toInputDate(created);
      acc[key] = (acc[key] || 0) + Number(order.totalAmount || 0);
      return acc;
    }, {});

    return Object.entries(revenueByDay)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, revenue]) => ({
        key,
        day: new Date(key).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }),
        revenue,
      }));
  }, [orders, startDate, endDate]);

  const rangeRevenueTotal = chartData.reduce((sum, item) => sum + item.revenue, 0);

  const handleExportRevenue = () => {
    if (chartData.length === 0) {
      showError('No revenue data to export for the selected range');
      return;
    }

    const rows = [
      ['Date', 'Revenue'],
      ...chartData.map((item) => [item.key, item.revenue.toFixed(2)]),
      ['Total', rangeRevenueTotal.toFixed(2)],
    ];

    const csvContent = rows
      .map((row) => row.map((value) => `"${value}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `revenue-report-${startDate}_to_${endDate}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    showSuccess('Revenue report exported successfully');
  };

  // Recent 4 orders
  const recentOrders = orders.slice(0, 4);

  // Filter low stock products from products store
  const lowStockAlerts = products
    .flatMap(p => p.variants.map(v => ({
      name: p.name,
      variantName: v.frameSize,
      stock: v.stockQuantity,
      productId: p.id,
      status: v.stockQuantity === 0 ? 'Out of Stock' : v.stockQuantity <= 5 ? 'Critical' : 'Low'
    })))
    .filter(item => item.stock <= 15)
    .slice(0, 4);

  const displayLowStock = lowStockAlerts;

  // Order Fulfillment quantities
  const pendingCount = orders.filter(o => o.orderStatus === 'PENDING').length;
  const processingCount = orders.filter(o => o.orderStatus === 'PROCESSING').length;
  const shippedCount = orders.filter(o => o.orderStatus === 'SHIPPED').length;
  const deliveredCount = orders.filter(o => o.orderStatus === 'DELIVERED').length;
  const cancelledCount = orders.filter(o => o.orderStatus === 'CANCELLED').length;

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <Badge type="success">Delivered</Badge>;
      case 'PROCESSING':
        return <Badge type="info">Processing</Badge>;
      case 'PENDING':
        return <Badge type="warning">Pending</Badge>;
      case 'CANCELLED':
        return <Badge type="error">Cancelled</Badge>;
      default:
        return <Badge type="neutral">{status}</Badge>;
    }
  };

  const getStockStatusBadge = (status: string) => {
    if (status === 'Out of Stock') return <Badge type="error">Out of Stock</Badge>;
    if (status === 'Critical') return <Badge type="error">Critical</Badge>;
    return <Badge type="warning">Low</Badge>;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-on-surface mb-1">Overview</h2>
        <p className="text-sm text-on-surface-variant">Your store's performance at a glance.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Total Revenue"
          value={`₹${calculatedRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={IndianRupee}
        />
        <KpiCard
          title="Total Orders"
          value={calculatedOrders.toLocaleString('en-US')}
          icon={ShoppingBag}
          onClick={() => navigate('/admin/orders')}
        />
        <KpiCard
          title="Total Customers"
          value={calculatedCustomers.toLocaleString('en-US')}
          icon={Users}
          onClick={() => navigate('/admin/customers')}
        />
        <KpiCard
          title="Active Products"
          value={calculatedProducts}
          icon={Package}
          onClick={() => navigate('/admin/products')}
        />
      </div>

      {/* Recharts Chart & Fulfillment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Line Chart */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-[0_1px_3px_rgba(15,23,42,0.08)] flex flex-col">
          <div className="flex flex-col gap-4 mb-6 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Revenue</h3>
              <p className="mt-1 text-xs text-on-surface-variant">
                Total for range: <span className="font-semibold text-primary">₹{rangeRevenueTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 rounded-lg border border-outline-variant bg-surface px-2.5 py-1.5">
                <Calendar className="w-3.5 h-3.5 text-outline-variant flex-shrink-0" />
                <input
                  type="date"
                  value={startDate}
                  max={endDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent text-xs text-on-surface outline-none focus:ring-0"
                  aria-label="Start date"
                />
                <span className="text-xs text-on-surface-variant">to</span>
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  max={toInputDate(today)}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent text-xs text-on-surface outline-none focus:ring-0"
                  aria-label="End date"
                />
              </div>
              <button
                onClick={handleExportRevenue}
                className="flex items-center justify-center gap-1.5 text-xs text-primary font-semibold hover:bg-surface-container px-3 py-2 rounded-lg border border-outline-variant transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>
            </div>
          </div>
          
          <div className="w-full h-64 mt-auto">
            {chartData.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <Calendar className="w-8 h-8 text-outline-variant mb-2" />
                <p className="text-sm font-semibold text-on-surface">No revenue in this range</p>
                <p className="text-xs text-on-surface-variant mt-1">Try selecting a different date range.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} style={{ fontSize: '11px', fill: '#6b7280' }} />
                  <YAxis tickLine={false} axisLine={false} style={{ fontSize: '11px', fill: '#6b7280' }} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip 
                    contentStyle={{ background: '#fff', border: '1px solid #c3c6d7', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(value) => [`₹${value}`, 'Revenue']}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#004ac6"
                    strokeWidth={2.5}
                    dot={{ r: 4, stroke: '#004ac6', strokeWidth: 2, fill: '#fff' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Fulfillment Breakdown */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-[0_1px_3px_rgba(15,23,42,0.08)] flex flex-col">
          <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider mb-6">Order Fulfillment</h3>
          <div className="flex-1 flex flex-col gap-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-outline-variant hover:bg-surface-container transition-colors cursor-pointer" onClick={() => navigate('/admin/orders')}>
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-xs font-semibold text-on-surface">Pending Payment</span>
              </div>
              <span className="text-xs font-bold text-on-surface">{pendingCount}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg border border-outline-variant hover:bg-surface-container transition-colors cursor-pointer" onClick={() => navigate('/admin/orders')}>
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-xs font-semibold text-on-surface">Processing</span>
              </div>
              <span className="text-xs font-bold text-on-surface">{processingCount}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-outline-variant hover:bg-surface-container transition-colors cursor-pointer" onClick={() => navigate('/admin/orders')}>
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-xs font-semibold text-on-surface">Shipped</span>
              </div>
              <span className="text-xs font-bold text-on-surface">{shippedCount}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-outline-variant hover:bg-surface-container transition-colors cursor-pointer" onClick={() => navigate('/admin/orders')}>
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                <span className="text-xs font-semibold text-on-surface">Delivered</span>
              </div>
              <span className="text-xs font-bold text-on-surface">{deliveredCount}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-outline-variant hover:bg-surface-container transition-colors cursor-pointer mt-auto" onClick={() => navigate('/admin/orders')}>
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 block"/>
                <span className="text-xs font-semibold text-on-surface">Cancelled</span>
              </div>
              <span className="text-xs font-bold text-on-surface">{cancelledCount}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Recent Orders Table */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_1px_3px_rgba(15,23,42,0.08)] overflow-hidden flex flex-col">
          <div className="p-5 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
            <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Recent Orders</h3>
            <Link to="/admin/orders" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant bg-surface text-secondary text-xs font-semibold">
                  <th className="p-4 uppercase tracking-wider">Order Number</th>
                  <th className="p-4 uppercase tracking-wider">Customer</th>
                  <th className="p-4 uppercase tracking-wider">Address</th>
                  <th className="p-4 uppercase tracking-wider text-right">Amount</th>
                  <th className="p-4 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-outline-variant/30 text-on-surface">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-surface transition-colors">
                    <td className="p-4 font-semibold text-primary">{order.orderNumber}</td>
                    <td className="p-4 text-on-surface-variant">{order.user?.name || 'Unknown Customer'}</td>
                    <td className="p-4 font-semibold text-primary">{order.addressLine}</td>
                    <td className="p-4 text-right font-semibold">₹{Number(order.totalAmount).toFixed(2)}</td>
                    <td className="p-4">{getOrderStatusBadge(order.orderStatus)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts Table */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_1px_3px_rgba(15,23,42,0.08)] overflow-hidden flex flex-col">
          <div className="p-5 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
            <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Low Stock Alerts</h3>
            <Link to="/admin/products" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
              Manage Inventory <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant bg-surface text-secondary text-xs font-semibold">
                  <th className="p-4 uppercase tracking-wider">Product Name</th>
                  <th className="p-4 uppercase tracking-wider">Variant</th>
                  <th className="p-4 uppercase tracking-wider text-right">Stock</th>
                  <th className="p-4 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-outline-variant/30 text-on-surface">
                {displayLowStock.map((item, idx) => (
                  <tr key={idx} className="hover:bg-surface transition-colors">
                    <td className="p-4 font-semibold">{item.name}</td>
                    <td className="p-4 text-on-surface-variant">{item.variantName}</td>
                    <td className="p-4 text-right font-bold text-error">{item.stock}</td>
                    <td className="p-4">{getStockStatusBadge(item.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OverviewPage;
