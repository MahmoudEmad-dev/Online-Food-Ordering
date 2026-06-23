import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import adminApi from '../../api/adminApi';
import type { Order } from '../../types/order';
import formatCurrency from '../../utils/formatCurrency';
import { useToast } from '../../contexts/ToastContext';

export default function AdminOrders() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith('ar') ? 'ar' : 'en';
  const { showToast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Track updating state for individual orders to show localized spin animations
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getAllOrders();
      setOrders(data);
    } catch (err: any) {
      console.error(err);
      setError(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [t]);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      await adminApi.updateOrderStatus(orderId, newStatus);
      // Refresh local state list
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus as any } : order
        )
      );
      showToast(t('admin.statusUpdated'), 'success');
    } catch (err) {
      console.error(err);
      showToast(t('admin.statusUpdateError'), 'error');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Pending': return 'badge-pending';
      case 'Preparing': return 'badge-preparing';
      case 'OutForDelivery': return 'badge-delivery';
      case 'Delivered': return 'badge-delivered';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 space-y-6 max-w-5xl">
        <h1 className="text-4xl font-black mb-8 gradient-text">{t('admin.orders')}</h1>
        <div className="card h-[400px] skeleton" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl animate-fade-in space-y-8 relative">
      <div className="flex items-center gap-4">
        <Link to="/admin" className="text-primary hover:underline font-semibold text-sm">
          {t('admin.backToDashboard')}
        </Link>
        <h1 className="text-4xl font-black gradient-text tracking-tight">
          {t('admin.orders')}
        </h1>
      </div>

      {error ? (
        <div className="card p-8 text-center max-w-sm mx-auto glass">
          <p className="text-red-400 font-semibold mb-4">{error}</p>
          <button onClick={fetchOrders} className="btn-primary">
            {t('common.retry')}
          </button>
        </div>
      ) : (
        <div className="card p-6 glass-strong">
          {orders.length === 0 ? (
            <p className="text-slate-400 text-center py-8">{t('orders.noOrders')}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-start text-sm text-slate-300">
                <thead className="text-xs uppercase text-slate-400 bg-slate-800/50">
                  <tr>
                    <th className="p-4">{t('orders.orderNumber')}</th>
                    <th className="p-4">{t('admin.customer')}</th>
                    <th className="p-4">{t('admin.date')}</th>
                    <th className="p-4">{t('orders.total')}</th>
                    <th className="p-4">{t('orders.status')}</th>
                    <th className="p-4">{t('admin.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-800/10">
                      <td className="p-4 font-bold text-slate-100">#{order.id}</td>
                      <td className="p-4">
                        <div>
                          <p className="font-semibold text-slate-200">{order.customerName}</p>
                          <p className="text-slate-400 text-xs">{order.phoneNumber}</p>
                        </div>
                      </td>
                      <td className="p-4 text-xs">
                        {new Date(order.createdAt).toLocaleDateString(currentLang === 'ar' ? 'ar-EG' : 'en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="p-4 font-semibold text-slate-100">
                        {formatCurrency(order.totalAmount, currentLang)}
                      </td>
                      <td className="p-4">
                        <span className={`badge ${getStatusClass(order.status)}`}>
                          {t(`orders.statuses.${order.status}`)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <select
                            className="input-field py-1 px-2 text-xs w-32 bg-slate-900 border border-slate-700 rounded text-slate-200"
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            disabled={updatingOrderId === order.id}
                          >
                            <option value="Pending">{t('orders.statuses.Pending')}</option>
                            <option value="Preparing">{t('orders.statuses.Preparing')}</option>
                            <option value="OutForDelivery">{t('orders.statuses.OutForDelivery')}</option>
                            <option value="Delivered">{t('orders.statuses.Delivered')}</option>
                          </select>
                          
                          <Link to={`/orders/${order.id}`} className="text-primary hover:underline font-semibold text-xs shrink-0">
                            {t('orders.viewDetails')}
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
