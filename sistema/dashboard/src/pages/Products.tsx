import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Settings } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  category_id?: number;
  category_name?: string;
  available: number;
  image_url?: string;
  allergens?: string;
  created_at?: string;
  updated_at?: string;
}

interface Category {
  id: number;
  name: string;
  sort_order: number;
  created_at?: string;
}

const Products: React.FC = () => {
  const { token, user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    available: 1,
    image_url: '',
    allergens: '',
  });
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    sort_order: '',
  });

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        api.get('/products', token),
        api.get('/products/categories', token),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
      };
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, data, token);
      } else {
        await api.post('/products', data, token);
      }
      setShowModal(false);
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category_id: '',
        available: 1,
        image_url: '',
        allergens: '',
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category_id: product.category_id?.toString() || '',
      available: product.available,
      image_url: product.image_url || '',
      allergens: product.allergens || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await api.delete(`/products/${id}`, token);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleToggleAvailable = async (product: Product) => {
    try {
      await api.put(`/products/${product.id}`, {
        ...product,
        available: product.available ? 0 : 1,
      }, token);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...categoryFormData,
        sort_order: parseInt(categoryFormData.sort_order) || 0,
      };
      if (editingCategory) {
        await api.put(`/products/categories/${editingCategory.id}`, data, token);
      } else {
        await api.post('/products/categories', data, token);
      }
      setShowCategoryModal(false);
      setEditingCategory(null);
      setCategoryFormData({
        name: '',
        sort_order: '',
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      sort_order: category.sort_order.toString(),
    });
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta categoria? Produtos desta categoria ficarão sem categoria.')) {
      try {
        await api.delete(`/products/categories/${id}`, token);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const canEdit = user?.role === 'admin' || user?.role === 'manager';
  const canDelete = user?.role === 'admin';

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Cardápio</h1>
        {canEdit && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCategoryModal(true)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Gerenciar Categorias
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Novo Produto
            </button>
          </div>
        )}
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="text-left px-6 py-4 text-white font-medium">Produto</th>
              <th className="text-left px-6 py-4 text-white font-medium">Categoria</th>
              <th className="text-left px-6 py-4 text-white font-medium">Preço</th>
              <th className="text-left px-6 py-4 text-white font-medium">Status</th>
              {canEdit && <th className="text-right px-6 py-4 text-white font-medium">Ações</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4">
                  <p className="text-white font-medium">{product.name}</p>
                  {product.description && (
                    <p className="text-gray-400 text-sm">{product.description}</p>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-300">{product.category_name || '-'}</td>
                <td className="px-6 py-4 text-white font-semibold">R$ {product.price.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => canEdit && handleToggleAvailable(product)}
                    className={`flex items-center gap-2 ${!canEdit ? 'cursor-default' : ''}`}
                  >
                    {product.available ? (
                      <ToggleRight className="w-6 h-6 text-green-500" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-gray-500" />
                    )}
                    <span className={`text-sm ${product.available ? 'text-green-400' : 'text-gray-400'}`}>
                      {product.available ? 'Disponível' : 'Indisponível'}
                    </span>
                  </button>
                </td>
                {canEdit && (
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {canDelete && (
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Preço</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Categoria</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="">Selecione</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">URL da Imagem</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Alérgenos</label>
                <input
                  type="text"
                  value={formData.allergens}
                  onChange={(e) => setFormData({ ...formData, allergens: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Ex: Glúten, Leite, Ovos"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="available"
                  checked={!!formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked ? 1 : 0 })}
                  className="w-4 h-4 text-yellow-600 rounded"
                />
                <label htmlFor="available" className="text-gray-300">Disponível</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingProduct(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">
                {editingCategory ? 'Editar Categoria' : 'Gerenciar Categorias'}
              </h2>
            </div>

            <div className="p-6">
              <form onSubmit={handleCategorySubmit} className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {editingCategory ? 'Novo Nome' : 'Nome da Categoria'}
                  </label>
                  <input
                    type="text"
                    value={categoryFormData.name}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Ex: Hamburgueres"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Ordem</label>
                  <input
                    type="number"
                    value={categoryFormData.sort_order}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, sort_order: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    min="0"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCategoryModal(false);
                      setEditingCategory(null);
                      setCategoryFormData({ name: '', sort_order: '' });
                    }}
                    className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    {editingCategory ? 'Salvar Alterações' : 'Adicionar Categoria'}
                  </button>
                </div>
              </form>

              <div className="space-y-3">
                <h3 className="text-lg font-medium text-white">Categorias Existentes</h3>
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 font-medium">Ordem: {category.sort_order}</span>
                      <span className="text-white font-medium">{category.name}</span>
                    </div>
                    {canEdit && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {canDelete && (
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {categories.length === 0 && (
                  <p className="text-gray-500 text-center py-4">Nenhuma categoria encontrada</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
