import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import adminApi from '../../api/adminApi';
import productsApi from '../../api/productsApi';
import type { Order } from '../../types/order';
import type { Product } from '../../types/product';
import formatCurrency from '../../utils/formatCurrency';

export default function AdminDashboard() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith('ar') ? 'ar' : 'en';

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const [ordersData, productsData] = await Promise.all([
          adminApi.getAllOrders(),
          productsApi.getProducts(),
        ]);
        setOrders(ordersData);
        setProducts(productsData);
      } catch (err: any) {
        console.error(err);
        setError(t('common.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [t]);

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 space-y-6">
        <h1 className="text-4xl font-black mb-8 gradient-text">{t('admin.dashboard')}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card h-32 skeleton" />
          ))}
        </div>
        <div className="card h-96 skeleton" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-16 px-4 text-center max-w-md">
        <div className="card p-8 glass">
          <span className="text-4xl mb-4 block">⚠️</span>
          <p className="text-red-400 mb-6 font-semibold">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary w-full">
            {t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  // Calculate metrics
  const totalOrders = orders.length;
  const totalRevenue = orders
    .filter((o) => o.status === 'Delivered')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter((o) => o.status === 'Pending' || o.status === 'Preparing').length;
  const totalProducts = products.length;

  return (
    <div className="container mx-auto py-12 px-4 animate-fade-in space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black gradient-text tracking-tight mb-2">
            {t('admin.dashboard')}
          </h1>
          <p className="text-slate-400">{t('admin.dashboardSubtitle')}</p>
        </div>

        <div className="flex gap-3">
          <Link to="products" className="btn-secondary text-sm">
            🍔 {t('admin.products')}
          </Link>
          <Link to="orders" className="btn-primary text-sm">
            📦 {t('admin.orders')}
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Orders */}
        <div className="card p-6 glass flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-semibold uppercase">{t('admin.totalOrders')}</p>
            <p className="text-3xl font-black text-slate-100 mt-2">{totalOrders}</p>
          </div>
          <span className="text-4xl bg-slate-800 p-3 rounded-xl">📋</span>
        </div>

        {/* Total Revenue */}
        <div className="card p-6 glass flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-semibold uppercase">{t('admin.totalRevenue')}</p>
            <p className="text-3xl font-black text-emerald-400 mt-2">
              {formatCurrency(totalRevenue, currentLang)}
            </p>
          </div>
          <span className="text-4xl bg-slate-800 p-3 rounded-xl">💰</span>
        </div>

        {/* Pending Orders */}
        <div className="card p-6 glass flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-semibold uppercase">{t('admin.pendingOrders')}</p>
            <p className="text-3xl font-black text-amber-500 mt-2">{pendingOrders}</p>
          </div>
          <span className="text-4xl bg-slate-800 p-3 rounded-xl">⏳</span>
        </div>

        {/* Total Products */}
        <div className="card p-6 glass flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-semibold uppercase">{t('admin.totalProducts')}</p>
            <p className="text-3xl font-black text-slate-100 mt-2">{totalProducts}</p>
          </div>
          <span className="text-4xl bg-slate-800 p-3 rounded-xl">🍔</span>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="card p-6 glass-strong">
        <h2 className="text-xl font-bold text-slate-100 mb-6">{t('admin.recentOrders')}</h2>
        
        {orders.length === 0 ? (
          <p className="text-slate-400 text-center py-8">{t('orders.noOrders')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-sm text-slate-300">
              <thead className="text-xs uppercase text-slate-400 bg-slate-800/50">
                <tr>
                  <th className="p-4">{t('orders.orderNumber')}</th>
                  <th className="p-4">{t('admin.customer')}</th>
                  <th className="p-4">{t('orders.status')}</th>
                  <th className="p-4">{t('orders.total')}</th>
                  <th className="p-4">{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/20">
                    <td className="p-4 font-bold text-slate-100">#{order.id}</td>
                    <td className="p-4">{order.customerName}</td>
                    <td className="p-4">
                      <span className={`badge ${
                        order.status === 'Pending' ? 'badge-pending' :
                        order.status === 'Preparing' ? 'badge-preparing' :
                        order.status === 'OutForDelivery' ? 'badge-delivery' :
                        'badge-delivered'
                      }`}>
                        {t(`orders.statuses.${order.status}`)}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-slate-100">
                      {formatCurrency(order.totalAmount, currentLang)}
                    </td>
                    <td className="p-4">
                      <Link to={`/orders/${order.id}`} className="text-primary hover:underline font-semibold">
                        {t('orders.viewDetails')}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
