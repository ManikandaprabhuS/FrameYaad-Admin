import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, ChevronDown, ChevronUp, Mail, MapPin, Phone, ShoppingCart, UserRound } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import { Customer, Order } from '../../types';
import { customerService } from '../../services/customer.service';
import { showError } from '../../utils/toast';

type CustomerDetails = Omit<Customer, 'orders'> & {
  role: 'CUSTOMER' | 'ADMIN';
  orders: Order[];
};

const CustomerDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<CustomerDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    const loadCustomer = async () => {
      try {
        const data = await customerService.getCustomerById(id as string);
        setCustomer(data as CustomerDetails);
      } catch (error: any) {
        showError(error?.response?.data?.message || 'Failed to load customer details');
      } finally {
        setLoading(false);
      }
    };

    loadCustomer();
  }, [id]);

  const totalSpent = useMemo(
    () => customer?.orders.reduce((sum, order) => sum + Number(order.totalAmount), 0) || 0,
    [customer]
  );

  const lastOrderDate = useMemo(() => {
    if (!customer?.orders.length) return null;
    return [...customer.orders]
      .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())[0]
      ?.createdAt;
  }, [customer]);

  const formatDate = (value?: string | null) =>
    value ? new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not available';

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value);

  const buildAddress = () =>
    [customer?.addressLine, customer?.cityName, customer?.stateName, customer?.countryName, customer?.postalCode]
      .filter(Boolean)
      .join(', ') || 'Not available';

  const statusTone = (status: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' => {
    switch (status) {
      case 'DELIVERED':
        return 'success';
      case 'PROCESSING':
      case 'SHIPPED':
        return 'info';
      case 'CANCELLED':
        return 'error';
      case 'CONFIRMED':
      case 'PENDING':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  const renderOrderItems = (order: Order) => (
    <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4 sm:p-5 shadow-sm">
      <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface mb-3">Order Items</h4>
      <div className="space-y-3">
        {order.orderItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-3 rounded-lg bg-surface border border-outline-variant/50"
          >
            <div className="min-w-0">
              <p className="font-semibold text-sm text-on-surface truncate">{item.productName}</p>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {item.frameSize} · {item.mountType} · {item.glassType}
              </p>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-4 text-sm flex-shrink-0">
              <span className="text-on-surface-variant">Qty: {item.quantity}</span>
              <span className="font-bold text-on-surface">{formatCurrency(Number(item.subtotal))}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-4 pt-3 border-t border-outline-variant">
        <span className="text-xs font-semibold text-on-surface-variant uppercase">Order Total</span>
        <span className="font-bold text-primary">{formatCurrency(Number(order.totalAmount))}</span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-24 rounded-2xl border border-outline-variant bg-surface-container-lowest" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-24 rounded-2xl border border-outline-variant bg-surface-container-lowest" />
          <div className="h-24 rounded-2xl border border-outline-variant bg-surface-container-lowest" />
          <div className="h-24 rounded-2xl border border-outline-variant bg-surface-container-lowest" />
        </div>
        <div className="h-96 rounded-2xl border border-outline-variant bg-surface-container-lowest" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-8 text-center shadow-sm">
        <p className="text-sm font-semibold text-on-surface">Customer not found.</p>
        <button
          onClick={() => navigate('/admin/customers')}
          className="mt-4 rounded-xl border border-outline-variant px-4 py-2 text-sm font-semibold text-secondary hover:bg-surface"
        >
          Back to Customers
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex items-center gap-3 border-b border-outline-variant/60 pb-5">
        <button
          onClick={() => navigate('/admin/customers')}
          className="rounded-xl border border-outline-variant p-2 hover:bg-surface-container-low transition-colors flex-shrink-0"
          title="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="min-w-0 flex-1">
          <nav className="flex items-center gap-1 text-[11px] text-on-surface-variant">
            <Link to="/admin/customers" className="hover:text-primary">
              Customers
            </Link>
            <span>&gt;</span>
            <span className="text-primary font-medium truncate">{customer.name}</span>
          </nav>
          <h2 className="mt-0.5 text-xl sm:text-2xl font-bold text-on-surface truncate">Customer Profile</h2>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-sm">
        <div className="border-b border-outline-variant bg-surface/70 p-4 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <div className="flex h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-xl sm:text-2xl font-bold text-primary uppercase">
                {customer.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-on-surface truncate">{customer.name}</h1>
                  <Badge type={customer.isActive ? 'success' : 'neutral'}>
                    {customer.role}
                  </Badge>
                </div>
                <p className="mt-1 text-xs sm:text-sm text-on-surface-variant truncate">ID: {customer.id.slice(0, 12)}…</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs sm:text-sm text-on-surface-variant">
                  <CalendarDays className="h-4 w-4 flex-shrink-0" />
                  Joined {formatDate(customer.createdAt)}
                </p>
              </div>
            </div>

            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 w-full lg:max-w-md">
              <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-secondary">
                  <Mail className="h-3.5 w-3.5" />
                  Email
                </div>
                <p className="mt-2 break-words text-sm font-semibold text-on-surface">{customer.email}</p>
              </div>
              <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-secondary">
                  <Phone className="h-3.5 w-3.5" />
                  Phone
                </div>
                <p className="mt-2 break-words text-sm font-semibold text-on-surface">{customer.phoneNumber}</p>
              </div>
              <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4 sm:col-span-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-secondary">
                  <MapPin className="h-3.5 w-3.5" />
                  Address
                </div>
                <p className="mt-2 break-words text-sm font-semibold leading-snug text-on-surface">{buildAddress()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:gap-4 p-4 sm:p-6 grid-cols-1 sm:grid-cols-3">
          <div className="rounded-2xl border border-outline-variant bg-surface p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Total Orders</span>
              <ShoppingCart className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-bold text-on-surface">{customer.orders.length}</div>
            <p className="mt-1 text-xs text-on-surface-variant">Completed and active orders</p>
          </div>

          <div className="rounded-2xl border border-outline-variant bg-surface p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Total Spent</span>
              <UserRound className="h-4 w-4 text-secondary" />
            </div>
            <div className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-bold text-secondary">{formatCurrency(totalSpent)}</div>
            <p className="mt-1 text-xs text-on-surface-variant">Lifetime spending</p>
          </div>

          <div className="rounded-2xl border border-outline-variant bg-surface p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Last Order</span>
              <CalendarDays className="h-4 w-4 text-tertiary" />
            </div>
            <div className="mt-2 sm:mt-3 text-base sm:text-lg font-bold text-on-surface">
              {lastOrderDate ? formatDate(lastOrderDate) : 'No orders yet'}
            </div>
            <p className="mt-1 text-xs text-on-surface-variant">Most recent purchase</p>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-outline-variant bg-surface px-4 sm:px-6 py-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface">Order History</h3>
            <p className="mt-1 text-xs text-on-surface-variant">Tap an order to view purchased items.</p>
          </div>
          <div className="text-xs font-medium text-on-surface-variant">
            {customer.orders.length} order{customer.orders.length === 1 ? '' : 's'}
          </div>
        </div>

        {customer.orders.length === 0 ? (
          <div className="p-10 text-center">
            <ShoppingCart className="w-10 h-10 text-outline-variant mx-auto mb-3" />
            <p className="text-sm font-semibold text-on-surface">No orders found.</p>
            <p className="mt-1 text-xs text-on-surface-variant">This customer has not placed any orders yet.</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-outline-variant bg-surface/60 text-xs font-semibold uppercase tracking-wider text-secondary">
                    <th className="px-6 py-4">Order Number</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Total Amount</th>
                    <th className="px-6 py-4">Created Date</th>
                    <th className="px-6 py-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/35">
                  {customer.orders.map((order) => {
                    const isExpanded = expandedOrder === order.id;
                    return (
                      <React.Fragment key={order.id}>
                        <tr className="group hover:bg-surface/40 transition-colors">
                          <td className="px-6 py-4">
                            <button
                              type="button"
                              onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                              className="font-semibold text-primary hover:underline"
                            >
                              {order.orderNumber}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <Badge type={statusTone(order.orderStatus)}>{order.orderStatus}</Badge>
                          </td>
                          <td className="px-6 py-4 font-semibold text-on-surface">{formatCurrency(Number(order.totalAmount))}</td>
                          <td className="px-6 py-4 text-sm text-on-surface-variant">{formatDate(order.createdAt)}</td>
                          <td className="px-6 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-outline-variant px-3 py-1.5 text-xs font-semibold text-secondary hover:bg-surface"
                            >
                              <span>{isExpanded ? 'Hide' : 'Show'}</span>
                              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr>
                            <td colSpan={5} className="bg-surface-container-low px-6 py-5">
                              {renderOrderItems(order)}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden flex flex-col gap-3 p-4">
              {customer.orders.map((order) => {
                const isExpanded = expandedOrder === order.id;
                return (
                  <div
                    key={order.id}
                    className="rounded-xl border border-outline-variant bg-surface-container-lowest overflow-hidden shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      className="w-full p-4 text-left hover:bg-surface/40 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-primary text-sm">{order.orderNumber}</p>
                          <p className="mt-1 text-xs text-on-surface-variant">{formatDate(order.createdAt)}</p>
                        </div>
                        <Badge type={statusTone(order.orderStatus)}>{order.orderStatus}</Badge>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-outline-variant/40">
                        <span className="text-xs text-on-surface-variant">{order.orderItems.length} item(s)</span>
                        <span className="font-bold text-on-surface">{formatCurrency(Number(order.totalAmount))}</span>
                      </div>
                    </button>
                    {isExpanded && (
                      <div className="border-t border-outline-variant bg-surface-container-low p-4">
                        {renderOrderItems(order)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default CustomerDetailsPage;
