import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import productsApi from '../api/productsApi';
import type { Product } from '../types/product';
import ProductCard from '../components/menu/ProductCard';
import { CATEGORIES, type Category } from '../utils/constants';

export default function MenuPage() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith('ar') ? 'ar' : 'en';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await productsApi.getProducts(selectedCategory);
        setProducts(data);
      } catch (err: any) {
        console.error(err);
        setError(t('common.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, t]);

  // Filter products by search query client-side
  const filteredProducts = products.filter((p) => {
    const name = currentLang === 'ar' ? p.nameAr : p.nameEn;
    const desc = currentLang === 'ar' ? p.descriptionAr : p.descriptionEn;
    const query = searchQuery.toLowerCase();
    
    return name.toLowerCase().includes(query) || desc.toLowerCase().includes(query);
  });

  return (
    <div className="menu-page-container animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black gradient-text tracking-tight mb-2">
            {t('menu.title')}
          </h1>
          <p className="text-slate-400">
            {t('app.subtitle')}
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full md:max-w-xs">
          <input
            type="text"
            className="input-field"
            placeholder={t('menu.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-2.5 rounded-full font-semibold transition-base cursor-pointer shrink-0 ${
              selectedCategory === category
                ? 'bg-primary text-white shadow-glow'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-100'
            }`}
          >
            {category === 'All' ? t('menu.all') : t(`menu.${category.toLowerCase()}`)}
          </button>
        ))}
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card h-96 flex flex-col p-4 space-y-4">
              <div className="skeleton h-[60%] w-full" />
              <div className="skeleton h-6 w-1/3" />
              <div className="skeleton h-5 w-2/3" />
              <div className="skeleton h-10 w-full mt-auto" />
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="text-center py-12 card p-8 glass max-w-md mx-auto">
          <span className="text-4xl mb-4 block">⚠️</span>
          <p className="text-red-400 mb-6 font-semibold">{error}</p>
          <button
            onClick={() => setSelectedCategory(selectedCategory)}
            className="btn-primary"
          >
            {t('common.retry')}
          </button>
        </div>
      )}

      {/* Product List */}
      {!loading && !error && (
        <>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 card p-10 glass max-w-sm mx-auto">
              <span className="text-5xl mb-4 block">🔍</span>
              <h3 className="text-xl font-bold mb-2">{t('menu.noProducts')}</h3>
              <p className="text-slate-400 text-sm">
                {t('cart.emptyMessage')}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
