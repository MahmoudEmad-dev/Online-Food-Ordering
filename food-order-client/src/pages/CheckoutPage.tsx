import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import ordersApi from '../api/ordersApi';
import formatCurrency from '../utils/formatCurrency';

export default function CheckoutPage() {
  const { t, i18n } = useTranslation();
  const { items, totalPrice, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const currentLang = i18n.language?.startsWith('ar') ? 'ar' : 'en';

  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Online'>('COD');

  // Credit Card Form
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic Validations
    if (!address || address.length < 10) {
      setError(t('checkout.addressError'));
      return;
    }

    if (!phone || phone.length < 8) {
      setError(t('checkout.phoneError'));
      return;
    }

    if (paymentMethod === 'Online') {
      if (!cardNumber || cardNumber.length < 16) {
        setError(t('checkout.cardNumberError'));
        return;
      }
      if (!expiry || !expiry.includes('/')) {
        setError(t('checkout.expiryError'));
        return;
      }
      if (!cvv || cvv.length < 3) {
        setError(t('checkout.cvvError'));
        return;
      }
      if (!cardHolder) {
        setError(t('checkout.cardHolderError'));
        return;
      }
    }

    setIsSubmitting(true);
    if (paymentMethod === 'Online') {
      setPaymentProcessing(true);
    }

    try {
      const requestPayload = {
        deliveryAddress: address,
        phoneNumber: phone,
        notes: notes || undefined,
        paymentMethod: paymentMethod,
      };

      const cardInfo = paymentMethod === 'Online' ? { cardNumber, expiry, cvv } : undefined;

      const newOrder = await ordersApi.placeOrder(requestPayload, cardInfo);
      
      // Clear Cart locally
      clearCart();
      showToast(t('common.orderPlaced'), 'success');
      
      // Redirect to Order Detail Page
      navigate(`/orders/${newOrder.id}`);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || t('common.error'));
      setPaymentProcessing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto py-16 px-4 text-center">
        <div className="card p-10 glass max-w-sm mx-auto">
          <h2 className="text-xl font-bold mb-4">{t('cart.empty')}</h2>
          <button onClick={() => navigate('/menu')} className="btn-primary w-full">
            {t('cart.browsMenu')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4 animate-fade-in relative">
      {/* Processing overlay */}
      {paymentProcessing && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center z-50 animate-fade-in">
          <div className="loading-spinner mb-6 border-t-primary" />
          <h2 className="text-2xl font-black gradient-text animate-pulse">
            {t('checkout.mockPayment.processing')}
          </h2>
          <p className="text-slate-400 mt-2 text-sm">
            {t('checkout.doNotClose')}
          </p>
        </div>
      )}

      <h1 className="text-4xl font-black mb-8 gradient-text tracking-tight">
        {t('checkout.title')}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-xl text-sm animate-pulse-glow">
              ⚠️ {error}
            </div>
          )}

          {/* Delivery Details */}
          <div className="card p-6 glass-strong space-y-4">
            <h2 className="text-xl font-bold text-slate-100 mb-2">📍 {t('checkout.deliveryAddress')}</h2>
            
            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-300">
                {t('checkout.deliveryAddress')}
              </label>
              <textarea
                rows={3}
                className="input-field"
                placeholder={t('checkout.addressPlaceholder')}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-300">
                  {t('checkout.phoneNumber')}
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder={t('checkout.phonePlaceholder')}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-300">
                  {t('checkout.notes')}
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder={t('checkout.notesPlaceholder')}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="card p-6 glass-strong space-y-4">
            <h2 className="text-xl font-bold text-slate-100 mb-2">💳 {t('checkout.paymentMethod')}</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-base ${
                  paymentMethod === 'COD'
                    ? 'border-primary bg-primary/5 text-slate-100'
                    : 'border-slate-700 bg-slate-800/30 text-slate-400 hover:text-slate-200'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="accent-primary"
                  disabled={isSubmitting}
                />
                <div>
                  <p className="font-bold">{t('checkout.cod')}</p>
                  <p className="text-xs text-slate-400">{t('checkout.codDescription')}</p>
                </div>
              </label>

              <label
                className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-base ${
                  paymentMethod === 'Online'
                    ? 'border-primary bg-primary/5 text-slate-100'
                    : 'border-slate-700 bg-slate-800/30 text-slate-400 hover:text-slate-200'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Online'}
                  onChange={() => setPaymentMethod('Online')}
                  className="accent-primary"
                  disabled={isSubmitting}
                />
                <div>
                  <p className="font-bold">{t('checkout.online')}</p>
                  <p className="text-xs text-slate-400">{t('checkout.onlineDescription')}</p>
                </div>
              </label>
            </div>

            {/* Credit Card Input Form */}
            {paymentMethod === 'Online' && (
              <div className="pt-4 border-t border-slate-700/50 space-y-4 animate-fade-in">
                <h3 className="font-bold text-slate-200 mb-2">
                  {t('checkout.mockPayment.title')}
                </h3>
                
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-400">
                    {t('checkout.mockPayment.cardHolder')}
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder={t('checkout.mockPayment.cardHolderPlaceholder')}
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-400">
                    {t('checkout.mockPayment.cardNumber')}
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder={t('checkout.mockPayment.cardPlaceholder')}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').substring(0, 16))}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-400">
                      {t('checkout.mockPayment.expiry')}
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder={t('checkout.mockPayment.expiryPlaceholder')}
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value.substring(0, 5))}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-400">
                      {t('checkout.mockPayment.cvv')}
                    </label>
                    <input
                      type="password"
                      className="input-field"
                      placeholder={t('checkout.mockPayment.cvvPlaceholder')}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Order Items Summary */}
        <div className="space-y-6">
          <div className="card p-6 glass-strong">
            <h2 className="text-xl font-bold mb-6 pb-4 border-b border-slate-700/50">
              {t('orders.items')}
            </h2>

            {/* List Cart Items */}
            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => {
                const name = currentLang === 'ar' ? item.product.nameAr : item.product.nameEn;
                return (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="text-slate-300 line-clamp-1 flex-grow pr-4">
                      {name} <span className="text-slate-500 font-bold">x {item.quantity}</span>
                    </span>
                    <span className="font-semibold text-slate-100 shrink-0">
                      {formatCurrency(item.product.price * item.quantity, currentLang)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Grand Total */}
            <div className="flex justify-between text-base font-bold text-slate-100 pt-4 border-t border-slate-700/50">
              <span>{t('cart.grandTotal')}</span>
              <span className="text-2xl gradient-text">
                {formatCurrency(totalPrice, currentLang)}
              </span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="btn-primary w-full mt-6 py-3.5 text-lg"
            >
              {isSubmitting ? t('checkout.processing') : t('checkout.placeOrder')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
