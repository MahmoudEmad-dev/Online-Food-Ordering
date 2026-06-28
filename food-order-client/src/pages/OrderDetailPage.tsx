import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import ordersApi from '../api/ordersApi';
import type { Order } from '../types/order';
import formatCurrency from '../utils/formatCurrency';
import { resolveImageUrl } from '../utils/imageUrl';

export default function OrderDetailPage() {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const currentLang = i18n.language?.startsWith('ar') ? 'ar' : 'en';

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const orderId = parseInt(id, 10);
        const data = await ordersApi.getOrder(orderId);
        setOrder(data);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || t('common.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, t]);

  // Stepper status definitions
  const statusSteps = ['Pending', 'Preparing', 'OutForDelivery', 'Delivered'] as const;

  const getStepIndex = (status: string) => {
    return statusSteps.indexOf(status as any);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return '📝';
      case 'Preparing': return '🍳';
      case 'OutForDelivery': return '🛵';
      case 'Delivered': return '🎁';
      default: return '🍔';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'text-amber-500';
      case 'Preparing': return 'text-blue-500';
      case 'OutForDelivery': return 'text-purple-500';
      case 'Delivered': return 'text-emerald-500';
      default: return 'text-slate-400';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 max-w-4xl space-y-6">
        <div className="skeleton h-12 w-1/3" />
        <div className="skeleton h-48 w-full" />
        <div className="skeleton h-96 w-full" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto py-16 px-4 text-center max-w-md">
        <div className="card p-8 glass">
          <span className="text-4xl mb-4 block">⚠️</span>
          <p className="text-red-400 mb-6 font-semibold">{error || "Order not found."}</p>
          <Link to="/orders" className="btn-primary w-full">
            {t('checkout.viewOrders')}
          </Link>
        </div>
      </div>
    );
  }

  const currentStepIdx = getStepIndex(order.status);

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl animate-fade-in space-y-8">
      {/* Back to list */}
      <Link to="/orders" className="text-primary hover:underline font-semibold flex items-center gap-2 text-sm w-fit cursor-pointer">
        {currentLang === 'ar' ? '←' : '←'} {t('common.back')}
      </Link>

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">
            {t('orders.orderNumber')}{order.id}
          </h1>
          <p className="text-slate-400 text-sm">
            📅 {new Date(order.createdAt).toLocaleDateString(currentLang === 'ar' ? 'ar-EG' : 'en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>

        <div className="text-start sm:text-end">
          <span className={`text-xl font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
            {getStatusIcon(order.status)} {t(`orders.statuses.${order.status}`)}
          </span>
        </div>
      </div>

      {/* ─── Visual Order Status Tracker Stepper ─── */}
      <div className="card p-8 glass-strong">
        <h2 className="text-lg font-bold text-slate-100 mb-8">{t('orders.trackOrder')}</h2>

        <div className="relative flex justify-between items-center w-full max-w-3xl mx-auto">
          {/* Progress bar line */}
          <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-800 -translate-y-1/2 z-0 rounded" />
          <div 
            className="absolute top-1/2 left-4 h-1 bg-gradient-to-r from-orange-500 to-red-500 -translate-y-1/2 z-0 rounded transition-all duration-1000"
            style={{
              width: `${(currentStepIdx / (statusSteps.length - 1)) * 95}%`,
              right: currentLang === 'ar' ? 'auto' : undefined,
            }}
          />

          {statusSteps.map((step, idx) => {
            const isCompleted = idx <= currentStepIdx;
            const isActive = idx === currentStepIdx;

            return (
              <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all duration-500 ${
                    isCompleted 
                      ? 'bg-primary border-primary text-white scale-110 shadow-glow' 
                      : 'bg-slate-900 border-slate-700 text-slate-500'
                  } ${isActive ? 'animate-bounce' : ''}`}
                >
                  {getStatusIcon(step)}
                </div>
                <span 
                  className={`text-xs font-bold whitespace-nowrap mt-1 ${
                    isCompleted ? 'text-slate-200' : 'text-slate-500'
                  }`}
                >
                  {t(`orders.statuses.${step}`)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-6 glass space-y-4">
            <h2 className="text-xl font-bold text-slate-100 border-b border-slate-700/50 pb-2">
              {t('orders.items')}
            </h2>

            <div className="space-y-4 divide-y divide-slate-850">
              {order.items.map((item, idx) => {
                const name = currentLang === 'ar' ? item.productNameAr : item.productNameEn;
                return (
                  <div key={item.id} className={`flex items-center gap-4 ${idx > 0 ? 'pt-4' : ''}`}>
                    <img
                      src={resolveImageUrl(item.imageUrl)}
                      alt={name}
                      className="w-16 h-16 object-cover rounded-lg bg-slate-800"
                    />

                    <div className="flex-grow min-w-0">
                      <h3 className="text-base font-bold text-slate-100 line-clamp-1">{name}</h3>
                      <p className="text-slate-400 text-xs">
                        {t('orders.total')}: {item.quantity} x {formatCurrency(item.unitPrice, currentLang)}
                      </p>
                    </div>

                    <span className="font-bold text-slate-100 shrink-0">
                      {formatCurrency(item.unitPrice * item.quantity, currentLang)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Details Panel */}
        <div className="space-y-6">
          <div className="card p-6 glass-strong space-y-6">
            <h2 className="text-xl font-bold text-slate-100 border-b border-slate-700/50 pb-2">
              {t('orders.orderDetails')}
            </h2>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">{t('orders.deliveryAddress')}</p>
                <p className="text-slate-200 mt-1">{order.deliveryAddress}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">{t('checkout.phoneNumber')}</p>
                <p className="text-slate-200 mt-1">{order.phoneNumber}</p>
              </div>

              {order.notes && (
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">{t('checkout.notes')}</p>
                  <p className="text-slate-200 mt-1 italic">"{order.notes}"</p>
                </div>
              )}

              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">{t('orders.paymentMethod')}</p>
                <p className="text-slate-200 mt-1 font-semibold">
                  {order.paymentMethod === 'COD' ? t('checkout.cod') : t('checkout.online')}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-700/50 pt-4 space-y-2">
              <div className="flex justify-between text-slate-400 text-sm">
                <span>{t('cart.subtotal')}</span>
                <span>{formatCurrency(order.totalAmount, currentLang)}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-sm">
                <span>{t('cart.deliveryFee')}</span>
                <span className="text-emerald-400 font-semibold">{t('cart.free')}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-100 pt-2 border-t border-slate-700/50">
                <span>{t('orders.total')}</span>
                <span className="text-xl gradient-text">{formatCurrency(order.totalAmount, currentLang)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
