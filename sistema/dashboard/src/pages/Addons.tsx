import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Plus, Edit2, Trash2, ChevronDown, ChevronRight } from 'lucide-react';

interface Addon {
  id: number;
  name: string;
  price: number;
  groupId: number;
  available: boolean;
  sortOrder: number;
  createdAt?: string;
}

interface AddonGroup {
  id: number;
  name: string;
  productId: number;
  minOptions: number;
  maxOptions: number;
  sortOrder: number;
  createdAt?: string;
  addons: Addon[];
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category?: string;
  available: boolean;
  imageUrl?: string;
  allergens?: string;
  createdAt?: string;
  updatedAt?: string;
  addonGroups?: AddonGroup[];
}

const Addons: React.FC = () => {
  const { token, user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showAddonModal, setShowAddonModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<AddonGroup | null>(null);
  const [editingGroup, setEditingGroup] = useState<AddonGroup | null>(null);
  const [editingAddon, setEditingAddon] = useState<Addon | null>(null);
  const [groupFormData, setGroupFormData] = useState({
    name: '',
    minOptions: 0,
    maxOptions: 999,
    sortOrder: 0,
  });
  const [addonFormData, setAddonFormData] = useState({
    name: '',
    price: 0,
    available: 1,
    sortOrder: 0,
  });

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      const productsData = await api.get('/products', token);
      // Buscar detalhes de cada produto com grupos de adicionais
      const productsWithAddons = await Promise.all(
        productsData.map(async (product: Product) => {
          try {
            return await api.get(`/products/${product.id}`, token);
          } catch {
            return { ...product, addonGroups: [] };
          }
        })
      );
      setProducts(productsWithAddons);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGroupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...groupFormData,
        product_id: selectedProduct?.id,
      };
      if (editingGroup) {
        await api.put(`/addons/groups/${editingGroup.id}`, data, token);
      } else {
        await api.post('/addons/groups', data, token);
      }
      setShowGroupModal(false);
      resetGroupForm();
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...addonFormData,
        group_id: selectedGroup?.id,
      };
      if (editingAddon) {
        await api.put(`/addons/${editingAddon.id}`, data, token);
      } else {
        await api.post('/addons', data, token);
      }
      setShowAddonModal(false);
      resetAddonForm();
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditGroup = (product: Product, group: AddonGroup) => {
    setSelectedProduct(product);
    setEditingGroup(group);
    setGroupFormData({
      name: group.name,
      minOptions: group.minOptions,
      maxOptions: group.maxOptions,
      sortOrder: group.sortOrder,
    });
    setShowGroupModal(true);
  };

  const handleDeleteGroup = async (groupId: number) => {
    if (confirm('Tem certeza que deseja excluir este grupo e todos os seus adicionais?')) {
      try {
        await api.delete(`/addons/groups/${groupId}`, token);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEditAddon = (group: AddonGroup, addon: Addon) => {
    setSelectedGroup(group);
    setEditingAddon(addon);
    setAddonFormData({
      name: addon.name,
      price: addon.price,
      available: addon.available ? 1 : 0,
      sortOrder: addon.sortOrder,
    });
    setShowAddonModal(true);
  };

  const handleDeleteAddon = async (addonId: number) => {
    if (confirm('Tem certeza que deseja excluir este adicional?')) {
      try {
        await api.delete(`/addons/${addonId}`, token);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const resetGroupForm = () => {
    setSelectedProduct(null);
    setEditingGroup(null);
    setGroupFormData({
      name: '',
      minOptions: 0,
      maxOptions: 999,
      sortOrder: 0,
    });
  };

  const resetAddonForm = () => {
    setSelectedGroup(null);
    setEditingAddon(null);
    setAddonFormData({
      name: '',
      price: 0,
      available: 1,
      sortOrder: 0,
    });
  };

  const canEdit = user?.role === 'admin' || user?.role === 'manager';
  const canDelete = user?.role === 'admin';

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Adicionais</h1>
      </div>

      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <button
              onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {expandedProduct === product.id ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
                <div>
                  <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                  <p className="text-gray-400 text-sm">
                    {(product.addonGroups?.length || 0)} grupos de adicionais
                  </p>
                </div>
              </div>
              {canEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProduct(product);
                    setShowGroupModal(true);
                  }}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Novo Grupo
                </button>
              )}
            </button>

            {expandedProduct === product.id && product.addonGroups && (
              <div className="border-t border-gray-700 p-6 space-y-6">
                {product.addonGroups.map((group) => (
                  <div key={group.id} className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-white font-medium">{group.name}</h4>
                        <p className="text-gray-400 text-sm">
                          Mínimo: {group.minOptions} | Máximo: {group.maxOptions} | {group.addons.length} adicionais
                        </p>
                      </div>
                      {canEdit && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedGroup(group);
                              setShowAddonModal(true);
                            }}
                            className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors"
                            title="Novo Adicional"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditGroup(product, group)}
                            className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                            title="Editar Grupo"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {canDelete && (
                            <button
                              onClick={() => handleDeleteGroup(group.id)}
                              className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                              title="Excluir Grupo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {group.addons.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {group.addons.map((addon) => (
                          <div key={addon.id} className="bg-gray-800 rounded-lg p-3 flex items-center justify-between">
                            <div>
                              <p className="text-white">{addon.name}</p>
                              <p className="text-yellow-400 text-sm font-medium">
                                R$ {addon.price.toFixed(2)}
                              </p>
                            </div>
                            {canEdit && (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleEditAddon(group, addon)}
                                  className="p-1 text-blue-400 hover:bg-blue-500/20 rounded transition-colors"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                {canDelete && (
                                  <button
                                    onClick={() => handleDeleteAddon(addon.id)}
                                    className="p-1 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">Nenhum adicional neste grupo</p>
                    )}
                  </div>
                ))}

                {product.addonGroups.length === 0 && (
                  <p className="text-gray-500 text-center py-4">Nenhum grupo de adicionais para este produto</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal para Grupo */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">
                {editingGroup ? 'Editar Grupo' : 'Novo Grupo'}
              </h2>
              {selectedProduct && (
                <p className="text-gray-400 text-sm">Produto: {selectedProduct.name}</p>
              )}
            </div>
            <form onSubmit={handleGroupSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nome do Grupo</label>
                <input
                  type="text"
                  value={groupFormData.name}
                  onChange={(e) => setGroupFormData({ ...groupFormData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Ex: Escolha seu molho"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Mínimo de Opções</label>
                  <input
                    type="number"
                    value={groupFormData.minOptions}
                    onChange={(e) => setGroupFormData({ ...groupFormData, minOptions: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Máximo de Opções</label>
                  <input
                    type="number"
                    value={groupFormData.maxOptions}
                    onChange={(e) => setGroupFormData({ ...groupFormData, maxOptions: parseInt(e.target.value) || 999 })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    min="1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Ordem</label>
                <input
                  type="number"
                  value={groupFormData.sortOrder}
                  onChange={(e) => setGroupFormData({ ...groupFormData, sortOrder: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min="0"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowGroupModal(false);
                    resetGroupForm();
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

      {/* Modal para Adicional */}
      {showAddonModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">
                {editingAddon ? 'Editar Adicional' : 'Novo Adicional'}
              </h2>
              {selectedGroup && (
                <p className="text-gray-400 text-sm">Grupo: {selectedGroup.name}</p>
              )}
            </div>
            <form onSubmit={handleAddonSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nome do Adicional</label>
                <input
                  type="text"
                  value={addonFormData.name}
                  onChange={(e) => setAddonFormData({ ...addonFormData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Ex: Bacon"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Preço</label>
                <input
                  type="number"
                  step="0.01"
                  value={addonFormData.price}
                  onChange={(e) => setAddonFormData({ ...addonFormData, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Ordem</label>
                <input
                  type="number"
                  value={addonFormData.sortOrder}
                  onChange={(e) => setAddonFormData({ ...addonFormData, sortOrder: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min="0"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="addon-available"
                  checked={!!addonFormData.available}
                  onChange={(e) => setAddonFormData({ ...addonFormData, available: e.target.checked ? 1 : 0 })}
                  className="w-4 h-4 text-yellow-600 rounded"
                />
                <label htmlFor="addon-available" className="text-gray-300">Disponível</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddonModal(false);
                    resetAddonForm();
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
    </div>
  );
};

export default Addons;
