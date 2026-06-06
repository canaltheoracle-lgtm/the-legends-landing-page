import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { AdvancedStats, Order } from '../types';
import { DollarSign, ShoppingBag, TrendingUp, XCircle, Clock, AlertCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState<AdvancedStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(thirtyDaysAgo);
  const [endDate, setEndDate] = useState(today);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const query = `?startDate=${startDate}&endDate=${endDate}`;
      const [statsData, ordersData] = await Promise.all([
        api.get(`/orders/stats/advanced${query}`, token),
        api.get(`/orders?status=received&startDate=${startDate}&endDate=${endDate}`, token),
      ]);
      setStats(statsData);
      setRecentOrders(ordersData.slice(0, 5));
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Não foi possível carregar os dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [token, startDate, endDate]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const statusLabels: Record<string, string> = {
    received: 'Recebido', preparing: 'Preparando', ready: 'Pronto',
    delivering: 'Entregando', delivered: 'Entregue', cancelled: 'Cancelado',
  };

  const statusColors: Record<string, string> = {
    received: 'bg-blue-500', preparing: 'bg-yellow-500', ready: 'bg-green-500',
    delivering: 'bg-purple-500', delivered: 'bg-gray-500', cancelled: 'bg-red-500',
  };

  const maxRevenue = stats?.dailyRevenue?.length
    ? Math.max(...stats.dailyRevenue.map(d => d.revenue), 1)
    : 1;

  const maxHour = stats?.hourlyDistribution?.length
    ? Math.max(...stats.hourlyDistribution.map(h => h.count), 1)
    : 1;

  if (loading && !stats) {
    return (
      <div className="text-white flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mb-4"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="text-white">
        <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-400">{error}</p>
          <button onClick={fetchData} className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <span className="text-gray-500">até</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Faturamento</p>
              <p className="text-3xl font-bold text-white mt-2">
                R$ {(stats?.totalRevenue || 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-green-500/20 p-3 rounded-lg">
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total de Pedidos</p>
              <p className="text-3xl font-bold text-white mt-2">{stats?.totalOrders || 0}</p>
            </div>
            <div className="bg-blue-500/20 p-3 rounded-lg">
              <ShoppingBag className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Ticket Médio</p>
              <p className="text-3xl font-bold text-white mt-2">
                R$ {(stats?.averageTicket || 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-yellow-500/20 p-3 rounded-lg">
              <TrendingUp className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Cancelamentos</p>
              <p className="text-3xl font-bold text-white mt-2">{stats?.cancelledOrders || 0}</p>
            </div>
            <div className="bg-red-500/20 p-3 rounded-lg">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">Faturamento Diário</h2>
          </div>
          <div className="p-6 space-y-2 max-h-80 overflow-y-auto">
            {(!stats?.dailyRevenue || stats.dailyRevenue.length === 0) ? (
              <p className="text-gray-500 text-center py-4">Nenhum dado no período</p>
            ) : (
              stats.dailyRevenue.map((day) => (
                <div key={day.date} className="flex items-center gap-3">
                  <span className="text-gray-400 text-xs w-24 shrink-0">
                    {new Date(day.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                  </span>
                  <div className="flex-1 h-6 bg-gray-700 rounded overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-600 to-yellow-500 rounded transition-all duration-500"
                      style={{ width: `${(day.revenue / maxRevenue) * 100}%` }}
                    />
                  </div>
                  <span className="text-white text-xs w-24 text-right">
                    R$ {day.revenue.toFixed(2)}
                  </span>
                  <span className="text-gray-500 text-xs w-12 text-right">
                    {day.orders}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">Produtos Mais Vendidos</h2>
          </div>
          <div className="p-6 max-h-80 overflow-y-auto">
            {(!stats?.topProducts || stats.topProducts.length === 0) ? (
              <p className="text-gray-500 text-center py-4">Nenhum dado no período</p>
            ) : (
              <div className="space-y-3">
                {stats.topProducts.map((product, idx) => (
                  <div key={product.product_name} className="flex items-center gap-4">
                    <span className="text-gray-500 text-sm font-mono w-6">{idx + 1}.</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{product.product_name}</p>
                      <p className="text-gray-500 text-xs">{product.quantity} vendidos</p>
                    </div>
                    <span className="text-yellow-500 text-sm font-medium">
                      R$ {product.revenue.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">Formas de Pagamento</h2>
          </div>
          <div className="p-6 space-y-3">
            {(!stats?.paymentMethods || stats.paymentMethods.length === 0) ? (
              <p className="text-gray-500 text-center py-4">Nenhum dado no período</p>
            ) : (
              stats.paymentMethods.map((pm) => {
                const label = pm.method === 'dinheiro' ? 'Dinheiro' : pm.method === 'pix' ? 'PIX' : pm.method === 'cartao' ? 'Cartão' : pm.method;
                const pct = stats.totalOrders > 0 ? (pm.count / stats.totalOrders) * 100 : 0;
                return (
                  <div key={pm.method}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">{label}</span>
                      <span className="text-gray-400">{pm.count} pedidos • R$ {pm.total.toFixed(2)}</span>
                    </div>
                    <div className="h-4 bg-gray-700 rounded overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-blue-500 rounded transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">Pedidos por Status</h2>
          </div>
          <div className="p-6">
            {(!stats?.statusDistribution || stats.statusDistribution.length === 0) ? (
              <p className="text-gray-500 text-center py-4">Nenhum dado no período</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {stats.statusDistribution.map((s) => (
                  <div key={s.status} className={`${statusColors[s.status] || 'bg-gray-600'} bg-opacity-20 rounded-lg p-4 text-center`}>
                    <p className={`text-2xl font-bold ${statusColors[s.status] ? statusColors[s.status].replace('bg-', 'text-') : 'text-gray-300'}`}>
                      {s.count}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">{statusLabels[s.status] || s.status}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">Horários de Pico</h2>
          </div>
          <div className="p-6 space-y-1.5 max-h-72 overflow-y-auto">
            {(!stats?.hourlyDistribution || stats.hourlyDistribution.length === 0) ? (
              <p className="text-gray-500 text-center py-4">Nenhum dado no período</p>
            ) : (
              stats.hourlyDistribution.map((h) => (
                <div key={h.hour} className="flex items-center gap-3">
                  <span className="text-gray-400 text-xs w-12 text-right">{String(h.hour).padStart(2, '0')}h</span>
                  <div className="flex-1 h-5 bg-gray-700 rounded overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-purple-500 rounded transition-all duration-500"
                      style={{ width: `${(h.count / maxHour) * 100}%` }}
                    />
                  </div>
                  <span className="text-gray-400 text-xs w-8 text-right">{h.count}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="p-6 border-b border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Pedidos Recentes</h2>
            <span className="text-gray-500 text-xs">atualizando a cada 8s</span>
          </div>
          <div className="divide-y divide-gray-700 max-h-72 overflow-y-auto">
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center text-gray-400">Nenhum pedido pendente</div>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="p-4 flex items-center justify-between hover:bg-gray-700 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">#{order.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs text-white ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mt-0.5">{order.customer_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">R$ {order.total.toFixed(2)}</p>
                    <p className="text-gray-500 text-xs">
                      {new Date(order.created_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
