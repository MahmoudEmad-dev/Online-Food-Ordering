import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import productsApi from '../../api/productsApi';
import adminApi from '../../api/adminApi';
import type { Product } from '../../types/product';
import formatCurrency from '../../utils/formatCurrency';
import { resolveImageUrl } from '../../utils/imageUrl';
import { useToast } from '../../contexts/ToastContext';

export default function AdminProducts() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith('ar') ? 'ar' : 'en';
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Delete Confirm Dialog
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Form Fields
  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descAr, setDescAr] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('Burgers');
  const [isAvailable, setIsAvailable] = useState(true);

  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productsApi.getProducts();
      setProducts(data);
    } catch (err: any) {
      console.error(err);
      setError(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [t]);

  const openAddModal = () => {
    setEditingProduct(null);
    setNameEn('');
    setNameAr('');
    setDescEn('');
    setDescAr('');
    setPrice('');
    setImageUrl('');
    setCategory('Burgers');
    setIsAvailable(true);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setNameEn(product.nameEn);
    setNameAr(product.nameAr);
    setDescEn(product.descriptionEn);
    setDescAr(product.descriptionAr);
    setPrice(product.price.toString());
    setImageUrl(product.imageUrl);
    setCategory(product.category);
    setIsAvailable(product.isAvailable);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validations
    if (!nameEn || !nameAr || !descEn || !descAr || !price || !imageUrl || !category) {
      setFormError(t('admin.allFieldsRequired'));
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError(t('admin.invalidPrice'));
      return;
    }

    const productPayload = {
      nameEn,
      nameAr,
      descriptionEn: descEn,
      descriptionAr: descAr,
      price: priceNum,
      imageUrl,
      category,
      isAvailable,
    };

    setIsSaving(true);
    try {
      if (editingProduct) {
        await adminApi.updateProduct(editingProduct.id, productPayload);
        showToast(t('admin.productUpdated'), 'success');
      } else {
        await adminApi.createProduct(productPayload);
        showToast(t('admin.productCreated'), 'success');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      console.error(err);
      setFormError(err.response?.data?.message || t('common.error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await adminApi.deleteProduct(id);
      showToast(t('admin.productDeleted'), 'success');
      fetchProducts();
    } catch (err: any) {
      console.error(err);
      showToast(t('admin.productDeleteError'), 'error');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 space-y-6 max-w-5xl">
        <h1 className="text-4xl font-black mb-8 gradient-text">{t('admin.products')}</h1>
        <div className="card h-[400px] skeleton" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl animate-fade-in space-y-8 relative">
      
      {/* Delete Confirm Dialog */}
      {deleteConfirmId !== null && (
        <div className="confirm-overlay">
          <div className="confirm-dialog">
            <div className="confirm-icon">🗑️</div>
            <h3 className="confirm-title">{t('admin.confirmDeleteTitle')}</h3>
            <p className="confirm-message">{t('admin.confirmDelete')}</p>
            <div className="confirm-actions">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="btn-secondary py-2 text-sm"
              >
                {t('admin.cancel')}
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="btn-danger py-2 text-sm px-6"
              >
                {t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Save Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="card w-full max-w-lg p-6 glass-strong max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black text-slate-100 mb-6 border-b border-slate-700/50 pb-2">
              {editingProduct ? t('admin.editProduct') : t('admin.addProduct')}
            </h2>

            {formError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-3 rounded-lg text-sm mb-4">
                ⚠️ {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-400">
                    {t('admin.productName')}
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-400">
                    {t('admin.productNameAr')}
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-400">
                  {t('admin.description')}
                </label>
                <textarea
                  rows={2}
                  className="input-field"
                  value={descEn}
                  onChange={(e) => setDescEn(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-400">
                  {t('admin.descriptionAr')}
                </label>
                <textarea
                  rows={2}
                  className="input-field"
                  value={descAr}
                  onChange={(e) => setDescAr(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-400">
                    {t('admin.price')}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="input-field"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-400">
                    {t('admin.category')}
                  </label>
                  <select
                    className="input-field bg-slate-900"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Burgers">{t('menu.burgers')}</option>
                    <option value="Pizza">{t('menu.pizza')}</option>
                    <option value="Drinks">{t('menu.drinks')}</option>
                    <option value="Desserts">{t('menu.desserts')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-400">
                  {t('admin.imageUrl')}
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isAvailableCheckbox"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="accent-primary"
                />
                <label htmlFor="isAvailableCheckbox" className="text-sm font-semibold text-slate-300">
                  {t('admin.isAvailable')}
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-700/50">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary py-2 text-sm"
                  disabled={isSaving}
                >
                  {t('admin.cancel')}
                </button>
                <button
                  type="submit"
                  className="btn-primary py-2 text-sm px-6"
                  disabled={isSaving}
                >
                  {isSaving ? t('common.loading') : t('admin.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product List Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="text-primary hover:underline font-semibold text-sm">
            {t('admin.backToDashboard')}
          </Link>
          <h1 className="text-4xl font-black gradient-text tracking-tight">{t('admin.products')}</h1>
        </div>

        <button onClick={openAddModal} className="btn-primary text-sm">
          ➕ {t('admin.addProduct')}
        </button>
      </div>

      {error ? (
        <div className="card p-8 text-center max-w-sm mx-auto glass">
          <p className="text-red-400 font-semibold mb-4">{error}</p>
          <button onClick={fetchProducts} className="btn-primary">
            {t('common.retry')}
          </button>
        </div>
      ) : (
        <div className="card p-6 glass-strong">
          {products.length === 0 ? (
            <p className="text-slate-400 text-center py-8">{t('menu.noProducts')}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-start text-sm text-slate-300">
                <thead className="text-xs uppercase text-slate-400 bg-slate-800/50">
                  <tr>
                    <th className="p-4">{t('admin.productName')}</th>
                    <th className="p-4">{t('admin.category')}</th>
                    <th className="p-4">{t('admin.price')}</th>
                    <th className="p-4">{t('admin.isAvailable')}</th>
                    <th className="p-4">{t('admin.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {products.map((product) => {
                    const name = currentLang === 'ar' ? product.nameAr : product.nameEn;
                    return (
                      <tr key={product.id} className="hover:bg-slate-800/10">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={resolveImageUrl(product.imageUrl)}
                              alt={name}
                              className="w-10 h-10 object-cover rounded-lg bg-slate-800"
                            />
                            <span className="font-bold text-slate-100">{name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                          {t(`menu.${product.category.toLowerCase()}`)}
                        </td>
                        <td className="p-4 font-semibold text-slate-100">
                          {formatCurrency(product.price, currentLang)}
                        </td>
                        <td className="p-4">
                          <span className={`badge ${
                            product.isAvailable ? 'badge-delivered' : 'badge-pending'
                          }`}>
                            {product.isAvailable ? t('admin.yes') : t('admin.no')}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => openEditModal(product)}
                              className="text-primary hover:underline font-semibold text-xs cursor-pointer"
                            >
                              {t('common.edit')}
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(product.id)}
                              className="text-red-400 hover:text-red-300 font-semibold text-xs cursor-pointer"
                            >
                              {t('common.delete')}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
