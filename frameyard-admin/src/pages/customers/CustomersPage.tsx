import React, { useState, useEffect } from 'react';
import { useCustomers } from '../../hooks/useCustomers';
import { Link, useNavigate } from 'react-router-dom';
import { DataTable } from '../../components/tables/DataTable';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { Search, Download, Mail, Phone, ShoppingBag, MapPin, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { Customer } from '../../types';
import { showError, showSuccess } from '../../utils/toast';



const getCustomerStatus = (customer: Customer): 'new' | 'active' | 'inactive' => {
  const daysSinceJoin = (Date.now() - new Date(customer.createdAt).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceJoin <= 30) return 'new';
  if (!customer.isActive) return 'inactive';
  return 'active';
};

const getStatusBadgeType = (status: string) => {
  switch (status) {
    case 'active': return 'success';
    case 'new': return 'info';
    case 'inactive': return 'neutral';
    default: return 'neutral';
  }
};

const formatOrderId = (id: string) => `#${id.slice(0, 8).toUpperCase()}`;
const getTotalSpent = (customer: Customer) =>
  customer.orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

export const CustomersPage: React.FC = () => {
 const {  customers,  loading, fetchCustomers} = useCustomers(false);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const PAGE_SIZE = 10;
  useEffect(() => {
  fetchCustomers(currentPage, PAGE_SIZE);}, [currentPage, fetchCustomers]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const openCustomerDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDetailsModalOpen(true);
  };

  const closeCustomerDetails = () => {
    setDetailsModalOpen(false);
    setSelectedCustomer(null);
  };
  const exportCustomerReport = () => {
    if (customers.length === 0) {
      showError('No customers to export');
      return;
    }

  const rows = customers.flatMap((customer) => {

    if (customer.orders.length === 0) {
      return [{
        CustomerName: customer.name,
        Email: customer.email,
        Phone: customer.phoneNumber,
        Address: customer.addressLine,
        City: customer.cityName,
        State: customer.stateName,
        OrderNumber: "",
        OrderStatus: "",
        ProductName: "",
        FrameSize: "",
        MountType: "",
        GlassType: "",
        Quantity: "",
        Price: "",
        Subtotal: "",
      }];
    }

    return customer.orders.flatMap((order: any) => {

      return order.orderItems.map((item: any) => ({
        CustomerName: customer.name,
        Email: customer.email,
        Phone: customer.phoneNumber,
        Address: customer.addressLine,
        City: customer.cityName,
        State: customer.stateName,

        OrderNumber: order.orderNumber,
        OrderStatus: order.orderStatus,

        ProductName: item.productName,
        FrameSize: item.frameSize,
        MountType: item.mountType,
        GlassType: item.glassType,
        Quantity: item.quantity,
        Price: item.price,
        Subtotal: item.subtotal,
      }));

    });

  });

  const csvContent = [
    Object.keys(rows[0]).join(","),
    ...rows.map((row) =>
      Object.values(row)
        .map(value => `"${value ?? ""}"`)
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob(
    [csvContent],
    { type: "text/csv;charset=utf-8;" }
  );

  const url =
    window.URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    `customers-report-${Date.now()}.csv`;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);
  showSuccess('Customers exported successfully');
};

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phoneNumber || '').includes(searchTerm)
  );

  const headers = [
    { key: 'customer', label: 'Customer' },
    { key: 'contact', label: 'Contact' },
    { key: 'location', label: 'Location' },
    { key: 'orders', label: 'Orders', align: 'center' as const },
    { key: 'spent', label: 'Total Spent', align: 'center' as const },
    { key: 'verified', label: 'Verified', align: 'center' as const },
    { key: 'status', label: 'Status', align: 'center' as const },
    { key: 'joined', label: 'Joined' },
  ];

  const renderRow = (customer: Customer) => {
    const status = getCustomerStatus(customer);
    const totalSpent = getTotalSpent(customer);
    const isExpanded = expandedId === customer.id;
    const hasOrders = customer.orders.length > 0;
    const location = [customer.cityName, customer.stateName, customer.countryName]
      .filter(Boolean).join(', ') || '—';

    return (
      <React.Fragment key={customer.id}>
        <tr
          className="hover:bg-surface/40 transition-colors group cursor-pointer"
          onClick={() => setExpandedId(isExpanded ? null : customer.id)}
        >
          {/* Customer Name + Avatar */}
          <td className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0 uppercase">
                {customer.name.charAt(0)}
              </div>
              <div>
  <Link
    to={`/admin/customers/${customer.id}`}
    onClick={(e) => e.stopPropagation()}
    className="font-semibold text-primary hover:underline text-sm"
  >
    {customer.name}
  </Link>

  <div className="text-[11px] text-on-surface-variant">
    ID: {customer.id.slice(0, 8)}…
  </div>
</div>
            </div>
          </td>

          {/* Contact */}
          <td className="px-6 py-4">
            <div className="flex flex-col gap-1 text-xs text-on-surface-variant">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3 h-3 flex-shrink-0" />
                <span className="truncate max-w-[180px]">{customer.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 flex-shrink-0" />
                <span>{customer.phoneNumber || '—'}</span>
              </div>
            </div>
          </td>

          {/* Location */}
          <td className="px-6 py-4">
            <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span>{location}</span>
            </div>
          </td>

          {/* Orders count */}
          <td className="px-6 py-4 text-center">
            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
              hasOrders
                ? 'bg-primary/10 text-primary'
                : 'bg-surface-container text-on-surface-variant'
            }`}>
              {customer.orders.length}
            </span>
          </td>

          {/* Total Spent */}
          <td className="px-6 py-4 text-center">
            <span className={`text-sm font-semibold ${totalSpent > 0 ? 'text-primary' : 'text-on-surface-variant'}`}>
              {totalSpent > 0 ? `₹${totalSpent.toFixed(2)}` : '—'}
            </span>
          </td>

          {/* Email Verified */}
          <td className="px-6 py-4 text-center">
            {customer.isEmailVerified
              ? <CheckCircle className="w-4 h-4 text-success inline" />
              : <XCircle className="w-4 h-4 text-error inline" />
            }
          </td>

          {/* Status */}
          <td className="px-6 py-4 text-center">
            <Badge type={getStatusBadgeType(status) as any}>
              {status === 'new' ? '🌱 New' : status === 'active' ? 'Active' : 'Inactive'}
            </Badge>
          </td>

          {/* Joined Date */}
          <td className="px-6 py-4 text-xs text-on-surface-variant">
            {new Date(customer.createdAt).toLocaleDateString('en-IN', {
              day: '2-digit', month: 'short', year: 'numeric',
            })}
          </td>
        </tr>

        {/* Expanded Order IDs Row */}
        {isExpanded && (
          <tr className="bg-surface-container/40">
            <td colSpan={8} className="px-6 py-4">
              <div className="flex items-start gap-3">
                <ShoppingBag className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
                    Order History
                  </p>
                  {hasOrders ? (
                    <div className="flex flex-wrap gap-2">
                      {customer.orders.map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center gap-2 bg-surface border border-outline-variant rounded-lg px-3 py-1.5 text-xs"
                        >
                          <span className="font-mono font-semibold text-primary">
                            {formatOrderId(order.id)}
                          </span>
                          <span className="text-on-surface-variant">·</span>
                          <span className={`font-medium capitalize ${
                            order.orderStatus === 'DELIVERED' ? 'text-success' :
                            order.orderStatus === 'CANCELLED' ? 'text-error' :
                            order.orderStatus === 'SHIPPED' ? 'text-primary' :
                            'text-on-surface-variant'
                          }`}>
                            {order.orderStatus.toLowerCase()}
                          </span>
                          <span className="text-on-surface-variant">·</span>
                          <span className="font-semibold text-on-surface">₹{Number(order.totalAmount).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant italic">
                      <span className="text-lg">🖼️</span>
                      <span>No frames ordered yet — their wall is waiting for some art!</span>
                    </div>
                  )}
                </div>
              </div>
            </td>
          </tr>
        )}
      </React.Fragment>
    );
  };

  const renderCard = (customer: Customer) => {
    const status = getCustomerStatus(customer);
    const totalSpent = getTotalSpent(customer);
    const hasOrders = customer.orders.length > 0;
    const location = [customer.cityName, customer.stateName, customer.countryName]
      .filter(Boolean).join(', ') || '—';

    return (
      <div
        key={customer.id}
        className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm flex flex-col gap-3 cursor-pointer active:bg-surface-container-low transition-colors"
        onClick={() => openCustomerDetails(customer)}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 text-primary flex items-center justify-center font-bold uppercase flex-shrink-0">
              {customer.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openCustomerDetails(customer);
                }}
                className="font-semibold text-sm text-primary hover:underline text-left truncate block w-full"
              >
                {customer.name}
              </button>
              <Badge type={getStatusBadgeType(status) as any} className="mt-1 text-[10px]">
                {status === 'new' ? '🌱 New' : status}
              </Badge>
            </div>
          </div>
          {customer.isEmailVerified
            ? <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
            : <XCircle className="w-4 h-4 text-error flex-shrink-0" />
          }
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-1 text-xs text-on-surface-variant">
          <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 flex-shrink-0" /><span className="truncate">{customer.email}</span></div>
          <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 flex-shrink-0" />{customer.phoneNumber || '—'}</div>
          <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 flex-shrink-0" /><span className="truncate">{location}</span></div>
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center pt-3 border-t border-outline-variant">
          <div className="flex flex-col">
            <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Orders</span>
            <span className="font-bold text-sm text-on-surface">{customer.orders.length}</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Spent</span>
            <span className="font-bold text-sm text-primary">{totalSpent > 0 ? `₹${totalSpent.toFixed(2)}` : '—'}</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Joined</span>
            <span className="text-xs text-on-surface">{new Date(customer.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
          </div>
        </div>

        {/* Orders preview */}
        <div className="pt-2 border-t border-outline-variant/50">
          <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">Orders</p>
          {hasOrders ? (
            <div className="flex flex-wrap gap-1.5">
              {customer.orders.slice(0, 3).map((order) => (
                <span
                  key={order.id}
                  className="font-mono text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-semibold"
                >
                  {formatOrderId(order.id)}
                </span>
              ))}
              {customer.orders.length > 3 && (
                <span className="text-[10px] text-on-surface-variant px-1 py-0.5">+{customer.orders.length - 3} more</span>
              )}
            </div>
          ) : (
            <p className="text-[11px] text-on-surface-variant italic">🖼️ No frames ordered yet</p>
          )}
        </div>

        <div className="flex items-center justify-end pt-1">
          <span className="text-xs font-semibold text-primary flex items-center gap-1">
            View Details <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    );
  };

  // Summary metrics
  const totalCustomers = customers.length;
  const withOrders = customers.filter(c => c.orders.length > 0).length;
  const now = new Date();

const currentMonth = now.getMonth();
const currentYear = now.getFullYear();

const previousMonth =
  currentMonth === 0 ? 11 : currentMonth - 1;

const previousMonthYear =
  currentMonth === 0
    ? currentYear - 1
    : currentYear;

const newThisMonth = customers.filter((c) => {
  const date = new Date(c.createdAt);

  return (
    date.getMonth() === currentMonth &&
    date.getFullYear() === currentYear
  );
}).length;

const newLastMonth = customers.filter((c) => {
  const date = new Date(c.createdAt);

  return (
    date.getMonth() === previousMonth &&
    date.getFullYear() === previousMonthYear
  );
}).length;

const growthPercentage =
  newLastMonth === 0
    ? 100
    : Math.round(
        ((newThisMonth - newLastMonth) /
          newLastMonth) *
          100
      );
  const verifiedCount = customers.filter(c => c.isEmailVerified).length;

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-on-surface-variant mb-1">
            <span className="text-primary font-semibold">Customers</span>
          </nav>
          <h2 className="text-3xl font-bold text-on-surface">Customers</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            All registered customers — click a row to expand order history.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-xl shadow-sm flex flex-col gap-1">
          <span className="text-xs font-semibold text-on-surface-variant">Total Customers</span>
          <span className="text-2xl font-bold text-on-surface">{totalCustomers}</span>
          <span className="text-[11px] text-tertiary font-medium">All registered users</span>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-xl shadow-sm flex flex-col gap-1">
          <span className="text-xs font-semibold text-on-surface-variant">Have Ordered</span>
          <span className="text-2xl font-bold text-primary">{withOrders}</span>
          <span className="text-[11px] text-on-surface-variant/80">Placed at least 1 order</span>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-xl shadow-sm flex flex-col gap-1">
          <span className="text-xs font-semibold text-on-surface-variant">New This Month</span>
          <span className="text-2xl font-bold text-secondary">{newThisMonth}</span>
          <span className={`text-[11px] font-medium ${growthPercentage >= 0? 'text-success': 'text-error'}`}
>
  {growthPercentage >= 0 ? '↑' : '↓'}{' '}
  {Math.abs(growthPercentage)}%
  vs last month
</span>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-xl shadow-sm flex flex-col gap-1">
          <span className="text-xs font-semibold text-on-surface-variant">Email Verified</span>
          <span className="text-2xl font-bold text-on-surface">{verifiedCount}</span>
          <span className="text-[11px] text-success font-medium">Confirmed accounts</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl shadow-sm flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant w-[18px] h-[18px]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email or phone..."
            className="w-full pl-9 pr-4 py-2.5 border border-outline-variant rounded-lg text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="flex-1 sm:flex-none px-4 py-2.5 text-sm font-semibold text-secondary hover:text-on-surface hover:bg-surface rounded-lg transition-colors"
            >
              Clear
            </button>
          )}
          <button
            onClick={exportCustomerReport}
            className="flex-1 sm:flex-none px-4 py-2.5 border border-outline-variant rounded-lg text-sm font-semibold hover:bg-surface transition-colors flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
        <span className="text-xs text-on-surface-variant text-center sm:text-right sm:ml-auto">
          {filteredCustomers.length} of {totalCustomers} customers
        </span>
      </div>
      {/* Data Table */}
      <DataTable
        headers={headers}
        items={filteredCustomers}
        renderRow={renderRow}
        renderCard={renderCard}
        loading={loading}
        emptyTitle="No customers found"
        emptyMessage={
          searchTerm
            ? `No customers match "${searchTerm}".`
            : "No customers have registered yet. Share your store link to get started!"
        }
      />
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6 p-4 border border-outline-variant rounded-xl bg-surface-container-lowest">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="w-full sm:w-auto px-4 py-2.5 border border-outline-variant rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-surface transition-colors"
        >
          Previous
        </button>
        <span className="text-sm font-medium text-on-surface-variant">
          Page <span className="font-bold text-on-surface">{currentPage}</span>
        </span>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="w-full sm:w-auto px-4 py-2.5 border border-outline-variant rounded-lg text-sm font-semibold hover:bg-surface transition-colors"
        >
          Next
        </button>
      </div>

      {/* Mobile Customer Details Modal */}
      <Modal
        isOpen={detailsModalOpen}
        onClose={closeCustomerDetails}
        title={selectedCustomer ? selectedCustomer.name : 'Customer Details'}
        size="lg"
        footer={
          selectedCustomer ? (
            <>
              <button
                type="button"
                onClick={closeCustomerDetails}
                className="px-4 py-2 border border-outline-variant rounded-lg text-xs font-semibold hover:bg-surface"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  closeCustomerDetails();
                  navigate(`/admin/customers/${selectedCustomer.id}`);
                }}
                className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:bg-primary/95"
              >
                View Full Profile
              </button>
            </>
          ) : undefined
        }
      >
        {selectedCustomer && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 text-primary flex items-center justify-center font-bold text-xl uppercase flex-shrink-0">
                {selectedCustomer.name.charAt(0)}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-lg font-bold text-on-surface">{selectedCustomer.name}</h4>
                  <Badge type={getStatusBadgeType(getCustomerStatus(selectedCustomer)) as any}>
                    {getCustomerStatus(selectedCustomer)}
                  </Badge>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">
                  ID: {selectedCustomer.id.slice(0, 8)}…
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-outline-variant bg-surface p-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-secondary">
                  <Mail className="h-3.5 w-3.5" />
                  Email
                </div>
                <p className="mt-2 break-words text-sm font-semibold text-on-surface">{selectedCustomer.email}</p>
                <p className="mt-1 text-xs text-on-surface-variant">
                  {selectedCustomer.isEmailVerified ? 'Verified' : 'Not verified'}
                </p>
              </div>
              <div className="rounded-xl border border-outline-variant bg-surface p-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-secondary">
                  <Phone className="h-3.5 w-3.5" />
                  Phone
                </div>
                <p className="mt-2 text-sm font-semibold text-on-surface">{selectedCustomer.phoneNumber || '—'}</p>
              </div>
              <div className="rounded-xl border border-outline-variant bg-surface p-4 sm:col-span-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-secondary">
                  <MapPin className="h-3.5 w-3.5" />
                  Address
                </div>
                <p className="mt-2 text-sm font-semibold text-on-surface">
                  {[selectedCustomer.addressLine, selectedCustomer.cityName, selectedCustomer.stateName, selectedCustomer.countryName, selectedCustomer.postalCode]
                    .filter(Boolean).join(', ') || 'Not available'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-outline-variant bg-surface p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-on-surface-variant">Orders</p>
                <p className="mt-1 text-lg font-bold text-on-surface">{selectedCustomer.orders.length}</p>
              </div>
              <div className="rounded-xl border border-outline-variant bg-surface p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-on-surface-variant">Total Spent</p>
                <p className="mt-1 text-lg font-bold text-primary">
                  {getTotalSpent(selectedCustomer) > 0 ? `₹${getTotalSpent(selectedCustomer).toFixed(2)}` : '—'}
                </p>
              </div>
              <div className="rounded-xl border border-outline-variant bg-surface p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-on-surface-variant">Joined</p>
                <p className="mt-1 text-sm font-bold text-on-surface">
                  {new Date(selectedCustomer.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <ShoppingBag className="w-4 h-4 text-primary" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface">Order History</h4>
              </div>
              {selectedCustomer.orders.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                  {selectedCustomer.orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between gap-3 bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-xs"
                    >
                      <span className="font-mono font-semibold text-primary">{formatOrderId(order.id)}</span>
                      <span className={`font-medium capitalize ${
                        order.orderStatus === 'DELIVERED' ? 'text-success' :
                        order.orderStatus === 'CANCELLED' ? 'text-error' :
                        order.orderStatus === 'SHIPPED' ? 'text-primary' :
                        'text-on-surface-variant'
                      }`}>
                        {order.orderStatus.toLowerCase()}
                      </span>
                      <span className="font-semibold text-on-surface">₹{Number(order.totalAmount).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-on-surface-variant italic">No orders placed yet.</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
  
};



export default CustomersPage;
