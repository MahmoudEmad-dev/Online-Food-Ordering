import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import formatCurrency from '../utils/formatCurrency';
import { resolveImageUrl } from '../utils/imageUrl';

export default function CartPage() {
  const { t, i18n } = useTranslation();
  const { items, updateQuantity, removeItem, totalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const currentLang = i18n.language?.startsWith('ar') ? 'ar' : 'en';

  const deliveryFee = 0; // Free delivery

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-16 px-4 text-center animate-fade-in max-w-md">
        <div className="card p-10 glass-strong">
          <span className="text-7xl mb-4 block">🛒</span>
          <h2 className="text-2xl font-bold mb-2">{t('cart.empty')}</h2>
          <p className="text-slate-400 mb-8">{t('cart.emptyMessage')}</p>
          <Link to="/menu" className="btn-primary w-full">
            {t('cart.browsMenu')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 animate-fade-in">
      <h1 className="text-4xl font-black mb-8 gradient-text tracking-tight">
        {t('cart.title')}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const product = item.product;
            if (!product) return null;
            const name = currentLang === 'ar' ? product.nameAr : product.nameEn;

            return (
              <div key={item.id} className="card p-4 flex items-center gap-4 glass">
                <img
                  src={resolveImageUrl(product.imageUrl)}
                  alt={name}
                  className="w-20 h-20 object-cover rounded-lg bg-slate-800"
                />

                <div className="flex-grow min-w-0">
                  <h3 className="text-lg font-bold text-slate-100 line-clamp-1">
                    {name}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {formatCurrency(product.price, currentLang)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(product.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-lg hover:border-primary transition-base cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-bold text-slate-100">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(product.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-lg hover:border-primary transition-base cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-end min-w-[80px]">
                  <p className="font-bold text-slate-100">
                    {formatCurrency(product.price * item.quantity, currentLang)}
                  </p>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="text-red-400 hover:text-red-300 text-xs mt-1 hover:underline cursor-pointer"
                  >
                    {t('cart.remove')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cart Summary */}
        <div className="card p-6 glass-strong h-fit">
          <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-slate-700/50">
            {t('cart.title')}
          </h2>

          <div className="space-y-4 mb-6 text-sm text-slate-300">
            <div className="flex justify-between">
              <span>{t('cart.subtotal')}</span>
              <span className="font-semibold text-slate-100">
                {formatCurrency(totalPrice, currentLang)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>{t('cart.deliveryFee')}</span>
              <span className="text-emerald-400 font-semibold">
                {t('cart.free')}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-slate-100 pt-4 border-t border-slate-700/50">
              <span>{t('cart.grandTotal')}</span>
              <span className="text-xl gradient-text">
                {formatCurrency(totalPrice + deliveryFee, currentLang)}
              </span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className="btn-primary w-full py-3.5 text-lg"
          >
            {t('cart.checkout')}
          </button>
        </div>
      </div>
    </div>
  );
}
