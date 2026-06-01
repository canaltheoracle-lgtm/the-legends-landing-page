import React, { useState } from 'react';
import { X, Plus, CheckCircle2 } from 'lucide-react';

interface Addon {
  id: number;
  name: string;
  price: number;
  groupId: number;
  available: boolean;
  sortOrder: number;
}

interface AddonGroup {
  id: number;
  name: string;
  productId: number;
  minOptions: number;
  maxOptions: number;
  sortOrder: number;
  addons: Addon[];
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category?: string;
  available: boolean;
  image?: string;
  allergens?: string;
  variations?: string;
  addonGroups?: AddonGroup[];
}

interface AddonModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (addons: Addon[], observation: string) => void;
}

const AddonModal: React.FC<AddonModalProps> = ({ product, isOpen, onClose, onConfirm }) => {
  const [selectedAddons, setSelectedAddons] = useState<Record<number, Addon[]>>({});
  const [observation, setObservation] = useState('');

  if (!isOpen) return null;

  const toggleAddon = (group: AddonGroup, addon: Addon) => {
    setSelectedAddons(prev => {
      const currentGroup = prev[group.id] || [];
      const isSelected = currentGroup.some(a => a.id === addon.id);

      if (isSelected) {
        return {
          ...prev,
          [group.id]: currentGroup.filter(a => a.id !== addon.id)
        };
      } else {
        const newGroup = [...currentGroup, addon];
        if (newGroup.length <= group.maxOptions) {
          return {
            ...prev,
            [group.id]: newGroup
          };
        }
        return prev;
      }
    });
  };

  const isAddonSelected = (groupId: number, addonId: number) => {
    return selectedAddons[groupId]?.some(a => a.id === addonId) || false;
  };

  const calculateTotal = () => {
    let total = product.price;
    Object.values(selectedAddons).forEach(groupAddons => {
      groupAddons.forEach(addon => {
        total += addon.price;
      });
    });
    return total;
  };

  const handleConfirm = () => {
    const allSelectedAddons = Object.values(selectedAddons).flat();
    onConfirm(allSelectedAddons, observation);
    setSelectedAddons({});
    setObservation('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 p-4 border-b border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">{product.name}</h2>
            <p className="text-yellow-400 font-retro">R$ {product.price.toFixed(2).replace('.', ',')}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {product.addonGroups?.map(group => (
            <div key={group.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold">{group.name}</h3>
                <span className="text-sm text-gray-400">
                  {group.minOptions > 0 ? `Obrigatório: escolha ${group.minOptions}` : 'Opcional'}
                  {group.maxOptions < 999 ? ` (máx ${group.maxOptions})` : ''}
                </span>
              </div>
              <div className="space-y-2">
                {group.addons.map(addon => {
                  const isSelected = isAddonSelected(group.id, addon.id);
                  const isRadio = group.maxOptions === 1;
                  return (
                    <button
                      key={addon.id}
                      onClick={() => toggleAddon(group, addon)}
                      className={`w-full p-3 rounded-lg flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-yellow-600/20 border border-yellow-500'
                          : 'bg-gray-800 border border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isRadio ? (
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            isSelected ? 'border-yellow-500 bg-yellow-500' : 'border-gray-500'
                          }`} />
                        ) : (
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isSelected ? 'border-yellow-500 bg-yellow-500' : 'border-gray-500'
                          }`}>
                            {isSelected && <CheckCircle2 size={14} className="text-black" />}
                          </div>
                        )}
                        <span className="text-white">{addon.name}</span>
                      </div>
                      {addon.price > 0 && (
                        <span className="text-yellow-400 font-retro">+R$ {addon.price.toFixed(2).replace('.', ',')}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="space-y-2">
            <label className="text-white font-semibold">Observações</label>
            <textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Alguma observação especial?"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
              rows={3}
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-900 p-4 border-t border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white font-semibold">Total</span>
            <span className="text-yellow-400 font-retro text-xl">
              R$ {calculateTotal().toFixed(2).replace('.', ',')}
            </span>
          </div>
          <button
            onClick={handleConfirm}
            className="w-full retro-button py-3 text-lg flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddonModal;
