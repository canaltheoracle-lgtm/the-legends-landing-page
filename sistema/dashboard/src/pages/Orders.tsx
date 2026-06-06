import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Order } from '../types';
import { Filter } from 'lucide-react';

const Orders: React.FC = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(async () => {
      try {
        let url = '/orders';
        if (filterStatus) url += `?status=${filterStatus}`;
        const data = await api.get(url, token);
        setOrders(data);
      } catch (err) {
        console.error(err);
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [token, filterStatus]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let url = '/orders';
      if (filterStatus) {
        url += `?status=${filterStatus}`;
      }
      const data = await api.get(url, token);
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.put(`/orders/${id}/status`, { status }, token);
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const statusLabels: Record<string, string> = {
    received: 'Recebido',
    preparing: 'Preparando',
    ready: 'Pronto',
    delivering: 'Entregando',
    delivered: 'Entregue',
    cancelled: 'Cancelado',
  };

  const statusColors: Record<string, string> = {
    received: 'bg-blue-500',
    preparing: 'bg-yellow-500',
    ready: 'bg-green-500',
    delivering: 'bg-purple-500',
    delivered: 'bg-gray-500',
    cancelled: 'bg-red-500',
  };

  const nextStatuses: Record<string, string[]> = {
    received: ['preparing', 'cancelled'],
    preparing: ['ready', 'cancelled'],
    ready: ['delivering', 'cancelled'],
    delivering: ['delivered', 'cancelled'],
    delivered: [],
    cancelled: [],
  };

  if (loading) {
    return <div className="text-white">Carregando...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Pedidos</h1>
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">Todos</option>
            <option value="received">Recebidos</option>
            <option value="preparing">Preparando</option>
            <option value="ready">Prontos</option>
            <option value="delivering">Entregando</option>
            <option value="delivered">Entregues</option>
            <option value="cancelled">Cancelados</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {orders.length === 0 ? (
          <div className="col-span-full bg-gray-800 rounded-xl border border-gray-700 p-8 text-center text-gray-400">
            Nenhum pedido encontrado
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold text-white">Pedido #{order.id}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs text-white ${statusColors[order.status]}`}
                    >
                      {statusLabels[order.status]}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">
                    {new Date(order.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">R$ {order.total.toFixed(2)}</p>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <p className="text-gray-300 font-medium">{order.customer_name}</p>
                  <p className="text-gray-400 text-sm">{order.customer_phone}</p>
                  {order.customer_address && (
                    <p className="text-gray-400 text-sm">{order.customer_address}</p>
                  )}
                  {order.payment_method && (
                    <p className="text-gray-400 text-sm">
                      Pagamento: {order.payment_method === 'dinheiro' ? 'Dinheiro' : order.payment_method === 'pix' ? 'PIX' : order.payment_method === 'cartao' ? 'Cartão' : order.payment_method}
                    </p>
                  )}
                  {order.notes && (
                    <p className="text-yellow-400 text-sm mt-2">Obs: {order.notes}</p>
                  )}
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <p className="text-gray-300 font-medium mb-3">Itens</p>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id}>
                        <div className="flex justify-between text-gray-300">
                          <span>{item.quantity}x {item.product_name}</span>
                          <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        {item.addons && item.addons.length > 0 && (
                          <div className="ml-4 mt-1 text-xs text-gray-500 space-y-0.5">
                            {item.addons.map((addon) => (
                              <div key={addon.id} className="flex justify-between">
                                <span>+ {addon.addon_name}</span>
                                <span>R$ {(addon.addon_price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {item.observation && (
                          <p className="ml-4 mt-1 text-xs text-yellow-400 italic">
                            Obs: {item.observation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {nextStatuses[order.status].length > 0 && (
                  <div className="border-t border-gray-700 pt-4 mt-4">
                    <p className="text-gray-400 text-sm mb-3">Atualizar status</p>
                    <div className="flex flex-wrap gap-2">
                      {nextStatuses[order.status].map((status) => (
                        <button
                          key={status}
                          onClick={() => updateStatus(order.id, status)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            status === 'cancelled'
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                          }`}
                        >
                          {statusLabels[status]}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
