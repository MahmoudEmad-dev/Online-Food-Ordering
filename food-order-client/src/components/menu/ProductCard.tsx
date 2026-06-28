import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Product } from '../../types/product';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext';
import formatCurrency from '../../utils/formatCurrency';
import { resolveImageUrl } from '../../utils/imageUrl';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { i18n, t } = useTranslation();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [added, setAdded] = useState(false);

  const currentLang = i18n.language?.startsWith('ar') ? 'ar' : 'en';

  const name = currentLang === 'ar' ? product.nameAr : product.nameEn;
  const description = currentLang === 'ar' ? product.descriptionAr : product.descriptionEn;

  const handleAddToCart = () => {
    addItem(product);
    showToast(t('common.cartItemAdded'), 'success');
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="card flex flex-col h-full animate-fade-in">
      {/* Product Image */}
      <div className="relative pt-[70%] overflow-hidden bg-slate-800">
        <img
          src={resolveImageUrl(product.imageUrl)}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center">
            <span className="bg-red-500 text-white font-bold px-3 py-1 rounded text-sm uppercase">
              {t('menu.soldOut')}
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-5 flex flex-col flex-grow">
        <span className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
          {t(`menu.${product.category.toLowerCase()}`)}
        </span>
        <h3 className="text-xl font-bold mb-2 text-slate-100 line-clamp-1">{name}</h3>
        <p className="text-sm text-slate-400 mb-4 line-clamp-2 flex-grow">{description}</p>

        {/* Action Row */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-700/50">
          <span className="text-2xl font-black text-slate-100">
            {formatCurrency(product.price, currentLang)}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={!product.isAvailable || added}
            className={`btn-primary px-4 py-2 text-sm ${
              added ? 'bg-emerald-600 hover:bg-emerald-600' : ''
            }`}
          >
            {added ? (
              <>
                <span>✓</span> {t('menu.added')}
              </>
            ) : (
              <>
                <span>🛒</span> {t('menu.addToCart')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
