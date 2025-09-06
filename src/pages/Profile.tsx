import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Wallet, 
  ShoppingBag, 
  Bell, 
  Edit,
  CheckCircle,
  Clock,
  XCircle,
  Truck
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import LoadingScreen from '@/components/LoadingScreen';
import { getCurrentUser, requireAuth, setCurrentUser } from '@/lib/auth';
import { 
  loadUsers, 
  saveUsers, 
  loadOrders, 
  loadProducts, 
  loadNotifications, 
  saveNotifications,
  addLog 
} from '@/lib/data';
import type { User as UserType, Order, Product, Notification } from '@/lib/data';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Edit form state
  const [editData, setEditData] = useState({
    username: '',
    fullName: '',
    address: '',
    email: ''
  });

  useEffect(() => {
    try {
      const currentUser = requireAuth();
      loadUserData(currentUser.id);
    } catch (error) {
      navigate('/login');
    }
  }, [navigate]);

  const loadUserData = async (userId: number) => {
    try {
      const [usersData, ordersData, productsData, notificationsData] = await Promise.all([
        loadUsers(),
        loadOrders(),
        loadProducts(),
        loadNotifications()
      ]);

      const userData = usersData.find(u => u.id === userId);
      if (!userData) {
        navigate('/login');
        return;
      }

      setUser(userData);
      setEditData({
        username: userData.username,
        fullName: userData.fullName,
        address: userData.address,
        email: userData.email
      });

      // Get user's orders
      const userOrders = ordersData.filter(order => order.userId === userId);
      setOrders(userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setProducts(productsData);

      // Get user's notifications
      const userNotifications = notificationsData.filter(n => n.userId === userId);
      setNotifications(userNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));

    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const users = await loadUsers();
      const userIndex = users.findIndex(u => u.id === user!.id);
      
      if (userIndex === -1) {
        setError('حدث خطأ في العثور على بيانات المستخدم');
        return;
      }

      // Check if username or email already exists (excluding current user)
      const existingUser = users.find(u => 
        u.id !== user!.id && (u.username === editData.username || u.email === editData.email)
      );
      
      if (existingUser) {
        setError('اسم المستخدم أو البريد الإلكتروني مستخدم بالفعل');
        return;
      }

      // Update user data
      users[userIndex] = {
        ...users[userIndex],
        username: editData.username,
        fullName: editData.fullName,
        address: editData.address,
        email: editData.email
      };

      await saveUsers(users);
      
      // Update current user in localStorage
      const updatedAuthUser = {
        id: users[userIndex].id,
        email: users[userIndex].email,
        username: users[userIndex].username,
        fullName: users[userIndex].fullName,
        address: users[userIndex].address,
        role: users[userIndex].role,
        balance: users[userIndex].balance
      };
      
      setCurrentUser(updatedAuthUser);
      setUser(users[userIndex]);
      
      await addLog(user!.id, 'تحديث بيانات الملف الشخصي');
      
      setSuccess('تم حفظ التغييرات بنجاح');
      setEditMode(false);

    } catch (error) {
      setError('حدث خطأ أثناء حفظ التغييرات');
    } finally {
      setSaving(false);
    }
  };

  const markNotificationAsRead = async (notificationId: number) => {
    try {
      const allNotifications = await loadNotifications();
      const updatedNotifications = allNotifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      );
      
      await saveNotifications(updatedNotifications);
      
      // Update local state
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getProductName = (productId: number): string => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : `منتج #${productId}`;
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
    return <LoadingScreen message="جاري تحميل الملف الشخصي..." />;
  }

  if (!user) {
    return <LoadingScreen message="جاري التحقق من البيانات..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" dir="rtl">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            الملف الشخصي
          </h1>
          <p className="text-gray-300">إدارة حسابك ومتابعة طلباتك</p>
        </div>

        <Tabs defaultValue="balance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-lg">
            <TabsTrigger value="balance" className="text-white data-[state=active]:bg-yellow-400 data-[state=active]:text-purple-900">
              <Wallet className="w-4 h-4 mr-2" />
              الرصيد
            </TabsTrigger>
            <TabsTrigger value="profile" className="text-white data-[state=active]:bg-yellow-400 data-[state=active]:text-purple-900">
              <User className="w-4 h-4 mr-2" />
              المعلومات
            </TabsTrigger>
            <TabsTrigger value="orders" className="text-white data-[state=active]:bg-yellow-400 data-[state=active]:text-purple-900">
              <ShoppingBag className="w-4 h-4 mr-2" />
              الطلبات
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-white data-[state=active]:bg-yellow-400 data-[state=active]:text-purple-900">
              <Bell className="w-4 h-4 mr-2" />
              الإشعارات
              {notifications.some(n => !n.read) && (
                <Badge className="mr-1 bg-red-500 text-white text-xs px-1">
                  {notifications.filter(n => !n.read).length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Balance Tab */}
          <TabsContent value="balance">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Wallet className="w-6 h-6 mr-3 text-yellow-400" />
                  رصيد الحساب
                </CardTitle>
                <CardDescription className="text-gray-300">
                  رصيدك الحالي في المتجر
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-bold text-yellow-400 mb-2">
                    {user.balance}
                  </div>
                  <div className="text-xl text-gray-300">عملة</div>
                </div>
                
                <div className="bg-gradient-to-r from-yellow-400/20 to-purple-600/20 rounded-lg p-6 text-center">
                  <h3 className="text-white text-lg font-semibold mb-2">شحن الرصيد</h3>
                  <p className="text-gray-300 mb-4">
                    لشحن رصيدك، يرجى التواصل مع الإدارة أو استخدام إحدى طرق الدفع المتاحة
                  </p>
                  <Button className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold">
                    طلب شحن الرصيد
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="w-6 h-6 mr-3 text-yellow-400" />
                    معلومات الحساب
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditMode(!editMode)}
                    className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-purple-900"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {editMode ? 'إلغاء' : 'تعديل'}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert className="mb-4 bg-red-500/20 border-red-500/50">
                    <AlertDescription className="text-red-200">{error}</AlertDescription>
                  </Alert>
                )}
                {success && (
                  <Alert className="mb-4 bg-green-500/20 border-green-500/50">
                    <AlertDescription className="text-green-200">{success}</AlertDescription>
                  </Alert>
                )}

                {editMode ? (
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="username" className="text-white">اسم المستخدم</Label>
                        <Input
                          id="username"
                          value={editData.username}
                          onChange={(e) => setEditData({...editData, username: e.target.value})}
                          className="bg-white/10 border-white/20 text-white"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-white">الاسم الكامل</Label>
                        <Input
                          id="fullName"
                          value={editData.fullName}
                          onChange={(e) => setEditData({...editData, fullName: e.target.value})}
                          className="bg-white/10 border-white/20 text-white"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">البريد الإلكتروني</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                        className="bg-white/10 border-white/20 text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-white">العنوان</Label>
                      <Input
                        id="address"
                        value={editData.address}
                        onChange={(e) => setEditData({...editData, address: e.target.value})}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={saving}
                      className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold"
                    >
                      {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">اسم المستخدم</Label>
                        <div className="text-white text-lg">{user.username}</div>
                      </div>
                      <div>
                        <Label className="text-gray-300">الاسم الكامل</Label>
                        <div className="text-white text-lg">{user.fullName}</div>
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-300">البريد الإلكتروني</Label>
                      <div className="text-white text-lg">{user.email}</div>
                    </div>
                    <div>
                      <Label className="text-gray-300">العنوان</Label>
                      <div className="text-white text-lg">{user.address || 'غير محدد'}</div>
                    </div>
                    <div>
                      <Label className="text-gray-300">نوع الحساب</Label>
                      <Badge className={user.role === 'admin' ? 'bg-red-500' : 'bg-blue-500'}>
                        {user.role === 'admin' ? 'مدير' : 'مستخدم'}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <ShoppingBag className="w-6 h-6 mr-3 text-yellow-400" />
                  سجل الطلبات
                </CardTitle>
                <CardDescription className="text-gray-300">
                  جميع طلباتك السابقة والحالية
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
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
                        <div className="text-gray-300 mb-2">
                          المنتج: {getProductName(order.productId)}
                        </div>
                        <div className="text-gray-400 text-sm">
                          الكمية: {order.quantity} | التاريخ: {new Date(order.createdAt).toLocaleDateString('ar-EG')}
                        </div>
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
                    <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">لا توجد طلبات</h3>
                    <p className="text-gray-300">لم تقم بأي طلبات بعد</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Bell className="w-6 h-6 mr-3 text-yellow-400" />
                  الإشعارات
                </CardTitle>
                <CardDescription className="text-gray-300">
                  آخر الإشعارات والتحديثات
                </CardDescription>
              </CardHeader>
              <CardContent>
                {notifications.length > 0 ? (
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          notification.read 
                            ? 'bg-white/5 border-white/10 opacity-70' 
                            : 'bg-yellow-400/10 border-yellow-400/30'
                        }`}
                        onClick={() => !notification.read && markNotificationAsRead(notification.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-white">{notification.message}</p>
                            <p className="text-gray-400 text-sm mt-1">
                              {new Date(notification.createdAt).toLocaleString('ar-EG')}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">لا توجد إشعارات</h3>
                    <p className="text-gray-300">ستظهر الإشعارات هنا عند توفرها</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}