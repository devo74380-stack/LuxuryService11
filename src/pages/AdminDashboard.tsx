import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
  Truck,
  DollarSign
} from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import LoadingScreen from '@/components/LoadingScreen';
import { requireAdmin } from '@/lib/auth';
import { 
  loadUsers, 
  loadProducts, 
  loadOrders, 
  saveOrders,
  addNotification,
  addLog
} from '@/lib/data';
import type { Order, Product, User } from '@/lib/data';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    approvedOrders: 0,
    deliveredOrders: 0,
    rejectedOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      requireAdmin();
      loadDashboardData();
    } catch (error) {
      navigate('/login');
    }
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      const [usersData, productsData, ordersData] = await Promise.all([
        loadUsers(),
        loadProducts(),
        loadOrders()
      ]);

      setUsers(usersData);
      setProducts(productsData);

      // Calculate real statistics from data
      const totalRevenue = ordersData
        .filter(order => order.status === 'approved' || order.status === 'delivered')
        .reduce((sum, order) => sum + order.totalPrice, 0);

      const pendingOrders = ordersData.filter(order => order.status === 'pending').length;
      const approvedOrders = ordersData.filter(order => order.status === 'approved').length;
      const deliveredOrders = ordersData.filter(order => order.status === 'delivered').length;
      const rejectedOrders = ordersData.filter(order => order.status === 'rejected').length;

      setStats({
        totalUsers: usersData.length,
        totalProducts: productsData.length,
        totalOrders: ordersData.length,
        totalRevenue,
        pendingOrders,
        approvedOrders,
        deliveredOrders,
        rejectedOrders
      });

      // Get recent orders (last 10)
      const sortedOrders = ordersData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setRecentOrders(sortedOrders.slice(0, 10));

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderAction = async (orderId: number, action: 'approve' | 'deliver' | 'reject', rejectionReason?: string) => {
    try {
      const orders = await loadOrders();
      const orderIndex = orders.findIndex(o => o.id === orderId);
      
      if (orderIndex === -1) return;

      const order = orders[orderIndex];
      let newStatus: Order['status'];
      let notificationMessage: string;

      switch (action) {
        case 'approve':
          newStatus = 'approved';
          notificationMessage = `تم الموافقة على طلبك #${orderId}`;
          break;
        case 'deliver':
          newStatus = 'delivered';
          notificationMessage = `تم تسليم طلبك #${orderId}`;
          break;
        case 'reject':
          newStatus = 'rejected';
          notificationMessage = `تم رفض طلبك #${orderId}${rejectionReason ? ` - السبب: ${rejectionReason}` : ''}`;
          break;
      }

      // Update order
      orders[orderIndex] = {
        ...order,
        status: newStatus,
        rejectionReason: rejectionReason || undefined
      };

      await saveOrders(orders);
      await addNotification(order.userId, notificationMessage);
      await addLog(1, `${action} order #${orderId}`); // Admin user ID = 1

      // Refresh data
      loadDashboardData();

    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const getProductName = (productId: number): string => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : `منتج #${productId}`;
  };

  const getUserName = (userId: number): string => {
    const user = users.find(u => u.id === userId);
    return user ? user.fullName || user.username : `مستخدم #${userId}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'delivered':
        return <Truck className="w-4 h-4 text-blue-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'قيد الانتظار';
      case 'approved':
        return 'تم الموافقة';
      case 'delivered':
        return 'تم التسليم';
      case 'rejected':
        return 'مرفوض';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'delivered':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  if (loading) {
    return <LoadingScreen message="جاري تحميل لوحة التحكم..." />;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" dir="rtl">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            لوحة التحكم الرئيسية
          </h1>
          <p className="text-gray-300">نظرة عامة على أداء المتجر</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">إجمالي المبيعات</p>
                  <p className="text-3xl font-bold text-white">{stats.totalRevenue}</p>
                  <p className="text-gray-400 text-xs">عملة</p>
                </div>
                <DollarSign className="w-12 h-12 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">العملاء</p>
                  <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                  <p className="text-gray-400 text-xs">مستخدم مسجل</p>
                </div>
                <Users className="w-12 h-12 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">المنتجات</p>
                  <p className="text-3xl font-bold text-white">{stats.totalProducts}</p>
                  <p className="text-gray-400 text-xs">منتج متاح</p>
                </div>
                <Package className="w-12 h-12 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">الطلبات</p>
                  <p className="text-3xl font-bold text-white">{stats.totalOrders}</p>
                  <p className="text-gray-400 text-xs">طلب إجمالي</p>
                </div>
                <ShoppingCart className="w-12 h-12 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-yellow-500/10 border-yellow-500/30">
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.pendingOrders}</div>
              <div className="text-sm text-yellow-300">قيد الانتظار</div>
            </CardContent>
          </Card>

          <Card className="bg-green-500/10 border-green-500/30">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.approvedOrders}</div>
              <div className="text-sm text-green-300">تم الموافقة</div>
            </CardContent>
          </Card>

          <Card className="bg-blue-500/10 border-blue-500/30">
            <CardContent className="p-4 text-center">
              <Truck className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.deliveredOrders}</div>
              <div className="text-sm text-blue-300">تم التسليم</div>
            </CardContent>
          </Card>

          <Card className="bg-red-500/10 border-red-500/30">
            <CardContent className="p-4 text-center">
              <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.rejectedOrders}</div>
              <div className="text-sm text-red-300">مرفوض</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white">الطلبات الأخيرة</CardTitle>
            <CardDescription className="text-gray-300">
              آخر الطلبات المسجلة في النظام
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div className="text-lg font-semibold text-white">
                          طلب #{order.id}
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          <div className="flex items-center space-x-1 rtl:space-x-reverse">
                            {getStatusIcon(order.status)}
                            <span>{getStatusText(order.status)}</span>
                          </div>
                        </Badge>
                      </div>
                      <div className="text-yellow-400 font-bold">
                        {order.totalPrice} عملة
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-300 mb-3">
                      <div>العميل: {getUserName(order.userId)}</div>
                      <div>المنتج: {getProductName(order.productId)}</div>
                      <div>الكمية: {order.quantity}</div>
                      <div>التاريخ: {new Date(order.createdAt).toLocaleDateString('ar-EG')}</div>
                    </div>

                    {order.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600 text-white"
                          onClick={() => handleOrderAction(order.id, 'approve')}
                        >
                          موافقة
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-500 hover:bg-red-600 text-white"
                          onClick={() => {
                            const reason = prompt('سبب الرفض (اختياري):');
                            handleOrderAction(order.id, 'reject', reason || undefined);
                          }}
                        >
                          رفض
                        </Button>
                      </div>
                    )}

                    {order.status === 'approved' && (
                      <Button
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={() => handleOrderAction(order.id, 'deliver')}
                      >
                        تم التسليم
                      </Button>
                    )}

                    {order.rejectionReason && (
                      <div className="mt-2 p-2 bg-red-500/20 rounded text-red-300 text-sm">
                        سبب الرفض: {order.rejectionReason}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">لا توجد طلبات</h3>
                <p className="text-gray-300">لم يتم تسجيل أي طلبات بعد</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}