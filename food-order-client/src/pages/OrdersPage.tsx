import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ordersApi from '../api/ordersApi';
import type { Order } from '../types/order';
import formatCurrency from '../utils/formatCurrency';

export default function OrdersPage() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith('ar') ? 'ar' : 'en';

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await ordersApi.getOrders();
        setOrders(data);
      } catch (err: any) {
        console.error(err);
        setError(t('common.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [t]);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'badge-pending';
      case 'Preparing':
        return 'badge-preparing';
      case 'OutForDelivery':
        return 'badge-delivery';
      case 'Delivered':
        return 'badge-delivered';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 space-y-4 max-w-4xl">
        <h1 className="text-4xl font-black mb-8 gradient-text">{t('orders.title')}</h1>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card h-28 skeleton" />
        ))}
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

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl animate-fade-in">
      <h1 className="text-4xl font-black mb-8 gradient-text tracking-tight">
        {t('orders.title')}
      </h1>

      {orders.length === 0 ? (
        <div className="card p-10 text-center glass-strong max-w-md mx-auto">
          <span className="text-6xl mb-4 block">📦</span>
          <h2 className="text-2xl font-bold mb-2">{t('orders.title')}</h2>
          <p className="text-slate-400 mb-8">{t('orders.noOrders')}</p>
          <Link to="/menu" className="btn-primary w-full">
            {t('cart.browsMenu')}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 glass">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-black text-slate-100 text-lg">
                    {t('orders.orderNumber')}{order.id}
                  </span>
                  <span className={`badge ${getStatusClass(order.status)}`}>
                    {t(`orders.statuses.${order.status}`)}
                  </span>
                </div>
                
                <div className="text-slate-400 text-sm space-y-1">
                  <p>📅 {new Date(order.createdAt).toLocaleDateString(currentLang === 'ar' ? 'ar-EG' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                  <p>📍 {order.deliveryAddress}</p>
                </div>
              </div>

              <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-4">
                <div className="text-end">
                  <p className="text-xs text-slate-400">{t('orders.total')}</p>
                  <p className="text-xl font-black text-slate-100">
                    {formatCurrency(order.totalAmount, currentLang)}
                  </p>
                </div>

                <Link to={`/orders/${order.id}`} className="btn-secondary py-2 px-4 text-sm">
                  {t('orders.viewDetails')}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
