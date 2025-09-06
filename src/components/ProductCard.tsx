import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { loadOrders, saveOrders, loadUsers, saveUsers, getNextId, addLog, addNotification } from '@/lib/data';
import type { Product, Order } from '@/lib/data';

interface ProductCardProps {
  product: Product;
  onPurchase?: () => void;
}

export default function ProductCard({ product, onPurchase }: ProductCardProps) {
  const [loading, setLoading] = useState(false);
  const user = getCurrentUser();

  const handlePurchase = async () => {
    if (!user) {
      alert('يجب تسجيل الدخول أولاً');
      return;
    }

    if (user.balance < product.price) {
      alert('رصيدك غير كافي لشراء هذا المنتج');
      return;
    }

    if (product.stock <= 0) {
      alert('المنتج غير متوفر في المخزون');
      return;
    }

    setLoading(true);

    try {
      // Create order
      const orders = await loadOrders();
      const newOrder: Order = {
        id: getNextId(orders),
        userId: user.id,
        productId: product.id,
        quantity: 1,
        totalPrice: product.price,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      orders.push(newOrder);
      await saveOrders(orders);

      // Deduct balance from user
      const users = await loadUsers();
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex].balance -= product.price;
        await saveUsers(users);
        
        // Update current user in localStorage
        const updatedUser = { ...user, balance: users[userIndex].balance };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }

      // Add notification
      await addNotification(user.id, `تم إنشاء طلب جديد #${newOrder.id} للمنتج ${product.name}`);
      
      // Add log
      await addLog(user.id, `طلب منتج: ${product.name}`);

      alert('تم إنشاء الطلب بنجاح! سيتم مراجعته من قبل الإدارة');
      onPurchase?.();

    } catch (error) {
      alert('حدث خطأ أثناء إنشاء الطلب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 group">
      <CardHeader className="pb-3">
        {product.image && (
          <div className="w-full h-48 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = `<Package className="w-16 h-16 text-white/50" />`;
              }}
            />
          </div>
        )}
        <CardTitle className="text-white text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
          {product.name}
        </CardTitle>
        <CardDescription className="text-gray-300 line-clamp-2">
          {product.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-yellow-400">
            {product.price} <span className="text-sm text-gray-300">عملة</span>
          </div>
          <Badge variant={product.stock > 0 ? "default" : "destructive"} className="bg-white/20">
            {product.stock > 0 ? `متوفر (${product.stock})` : 'غير متوفر'}
          </Badge>
        </div>
        
        <Button 
          onClick={handlePurchase}
          disabled={loading || !user || product.stock <= 0 || (user && user.balance < product.price)}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold disabled:opacity-50"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {loading ? 'جاري المعالجة...' : 'شراء الآن'}
        </Button>
        
        {user && user.balance < product.price && (
          <p className="text-red-400 text-sm text-center">
            رصيدك الحالي: {user.balance} عملة - تحتاج {product.price - user.balance} عملة إضافية
          </p>
        )}
      </CardContent>
    </Card>
  );
}