import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard,
  Users,
  Package,
  FolderOpen,
  ShoppingCart,
  Ticket,
  Bell,
  Settings,
  LogOut,
  Gem
} from 'lucide-react';
import { logout } from '@/lib/auth';

const menuItems = [
  { icon: LayoutDashboard, label: 'الرئيسية', path: '/admin' },
  { icon: Users, label: 'المستخدمين', path: '/admin/users' },
  { icon: Package, label: 'المنتجات', path: '/admin/products' },
  { icon: FolderOpen, label: 'الأقسام', path: '/admin/categories' },
  { icon: ShoppingCart, label: 'الطلبات', path: '/admin/orders' },
  { icon: Ticket, label: 'الكوبونات', path: '/admin/coupons' },
  { icon: Bell, label: 'الإشعارات', path: '/admin/notifications' },
  { icon: Settings, label: 'الإعدادات', path: '/admin/settings' },
];

export default function AdminSidebar() {
  const location = useLocation();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="w-64 bg-gradient-to-b from-purple-900 to-indigo-900 min-h-screen border-r border-purple-700" dir="rtl">
      {/* Logo */}
      <div className="p-6 border-b border-purple-700">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="relative">
            <div className="w-10 h-10 transform rotate-45 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-lg shadow-lg">
              <div className="absolute inset-1 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded transform -rotate-45 flex items-center justify-center">
                <Gem className="w-4 h-4 text-purple-900" />
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              لوحة التحكم
            </h2>
            <p className="text-sm text-gray-300">Luxury Service</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start text-right ${
                  isActive 
                    ? 'bg-yellow-400 text-purple-900 hover:bg-yellow-500' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5 ml-3" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-4 left-4 right-4">
        <Button
          variant="outline"
          className="w-full justify-start text-right border-red-500 text-red-400 hover:bg-red-500/20"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 ml-3" />
          تسجيل الخروج
        </Button>
      </div>
    </div>
  );
}