import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Stats, Order } from '../types';
import { DollarSign, Clock, ShoppingBag, AlertCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      const [statsData, ordersData] = await Promise.all([
        api.get('/orders/stats', token),
        api.get('/orders?status=received', token),
      ]);
      setStats(statsData);
      setRecentOrders(ordersData.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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

  if (loading) {
    return <div className="text-white">Carregando...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pedidos Pendentes</p>
              <p className="text-3xl font-bold text-white mt-2">{stats?.pendingOrders || 0}</p>
            </div>
            <div className="bg-blue-500/20 p-3 rounded-lg">
              <AlertCircle className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pedidos Hoje</p>
              <p className="text-3xl font-bold text-white mt-2">{stats?.todayOrders || 0}</p>
            </div>
            <div className="bg-green-500/20 p-3 rounded-lg">
              <ShoppingBag className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Faturamento Hoje</p>
              <p className="text-3xl font-bold text-white mt-2">
                R$ {stats?.todayRevenue?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="bg-yellow-500/20 p-3 rounded-lg">
              <DollarSign className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Tempo Médio</p>
              <p className="text-3xl font-bold text-white mt-2">15 min</p>
            </div>
            <div className="bg-purple-500/20 p-3 rounded-lg">
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Pedidos Recentes</h2>
        </div>
        <div className="divide-y divide-gray-700">
          {recentOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-400">Nenhum pedido recente</div>
          ) : (
            recentOrders.map((order) => (
              <div key={order.id} className="p-6 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-medium">Pedido #{order.id}</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs text-white ${statusColors[order.status]}`}
                    >
                      {statusLabels[order.status]}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{order.customer_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">R$ {order.total.toFixed(2)}</p>
                  <p className="text-gray-400 text-xs">{new Date(order.created_at).toLocaleString('pt-BR')}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
