import { X, Trash2, Plus, Minus, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { useState } from 'react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckoutModal = ({ isOpen, onClose }: CheckoutModalProps) => {
  const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    paymentMethod: 'dinheiro',
    notes: '',
  });

  const calculateItemTotal = (item: any) => {
    let itemTotal = item.product.price * item.quantity;
    itemTotal += item.addons.reduce((sum: number, addon: any) => sum + addon.price * item.quantity, 0);
    return itemTotal;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createOrder({
        ...formData,
        items: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
          observation: item.observation,
          addons: item.addons,
        })),
      });
      setStep('success');
      clearCart();
    } catch (error) {
      console.error('Failed to create order:', error);
      alert('Erro ao criar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('cart');
    setFormData({
      customerName: '',
      customerPhone: '',
      customerAddress: '',
      paymentMethod: 'dinheiro',
      notes: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80" 
        onClick={handleClose}
      />
      <AnimatePresence>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative retro-border bg-black w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>

          {step === 'cart' && (
            <div className="p-6">
              <h2 className="text-2xl font-retro text-retro-yellow mb-6">INVENTÁRIO DO CARRINHO</h2>
              
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-10">SEU CARRINHO ESTÁ VAZIO</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-start gap-4 p-3 border-2 border-gray-800">
                        <div className="flex-1">
                          <h3 className="text-sm text-white">{item.product.name}</h3>
                          {item.addons.length > 0 && (
                            <div className="text-xs text-gray-400 mt-1">
                              {item.addons.map(addon => (
                                <div key={addon.id}>+ {addon.name}</div>
                              ))}
                            </div>
                          )}
                          {item.observation && (
                            <p className="text-xs text-yellow-400 mt-1 italic">{item.observation}</p>
                          )}
                          <p className="text-xs text-retro-yellow mt-2">
                            R$ {calculateItemTotal(item).toFixed(2).replace('.', ',')}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 bg-retro-gray flex items-center justify-center text-white"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-white w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 bg-retro-gray flex items-center justify-center text-white"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-retro-red hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t-2 border-gray-800 pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-retro">TOTAL</span>
                      <span className="text-2xl text-retro-yellow font-retro">R$ {total.toFixed(2).replace('.', ',')}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setStep('checkout')}
                    className="retro-button w-full py-4 text-lg"
                  >
                    FINALIZAR PEDIDO
                  </button>
                </>
              )}
            </div>
          )}

          {step === 'checkout' && (
            <div className="p-6">
              <h2 className="text-2xl font-retro text-retro-yellow mb-6">FINALIZAR PEDIDO</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 font-retro mb-2">NOME</label>
                  <input
                    required
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full bg-retro-gray border-2 border-gray-700 text-white px-4 py-3 focus:border-retro-yellow outline-none"
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-retro mb-2">TELEFONE</label>
                  <input
                    required
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="w-full bg-retro-gray border-2 border-gray-700 text-white px-4 py-3 focus:border-retro-yellow outline-none"
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-retro mb-2">ENDEREÇO (ENTREGA)</label>
                  <input
                    type="text"
                    value={formData.customerAddress}
                    onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                    className="w-full bg-retro-gray border-2 border-gray-700 text-white px-4 py-3 focus:border-retro-yellow outline-none"
                    placeholder="Rua, número, bairro"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-retro mb-2">FORMA DE PAGAMENTO</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full bg-retro-gray border-2 border-gray-700 text-white px-4 py-3 focus:border-retro-yellow outline-none"
                  >
                    <option value="dinheiro">Dinheiro</option>
                    <option value="pix">PIX</option>
                    <option value="cartao">Cartão</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-retro mb-2">OBSERVAÇÕES GERAIS</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-retro-gray border-2 border-gray-700 text-white px-4 py-3 focus:border-retro-yellow outline-none h-24 resize-none"
                    placeholder="Ex: sem cebola, ponto da carne..."
                  />
                </div>
                <div className="border-t-2 border-gray-800 pt-4 mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-400 font-retro">TOTAL</span>
                    <span className="text-2xl text-retro-yellow font-retro">R$ {total.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="retro-button w-full py-4 text-lg flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                    {loading ? 'PROCESSANDO...' : 'CONFIRMAR PEDIDO'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 'success' && (
            <div className="p-6 text-center">
              <CheckCircle2 className="w-20 h-20 text-retro-green mx-auto mb-6" />
              <h2 className="text-2xl font-retro text-retro-yellow mb-4">PEDIDO CONFIRMADO!</h2>
              <p className="text-gray-400 mb-6">SEU PEDIDO FOI ENVIADO PARA A COZINHA. AGUARDE!</p>
              <button
                onClick={handleClose}
                className="retro-button px-8 py-3"
              >
                FECHAR
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CheckoutModal;
