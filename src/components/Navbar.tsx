import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  LogOut, 
  Settings, 
  ShoppingCart, 
  Bell,
  Diamond
} from 'lucide-react';
import { getCurrentUser, logout, isAdmin } from '@/lib/auth';
import { loadNotifications } from '@/lib/data';
import type { AuthUser, Notification } from '@/lib/auth';

export default function Navbar() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    if (currentUser) {
      loadNotifications().then(allNotifications => {
        const userNotifications = allNotifications.filter(n => n.userId === currentUser.id && !n.read);
        setNotifications(userNotifications);
      });
    }
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 shadow-lg border-b border-purple-700" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="relative">
              {/* Improved Diamond Logo for Navbar */}
              <div className="w-10 h-10 relative">
                {/* Outer glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full opacity-20 blur-sm"></div>
                
                {/* Main diamond shape */}
                <div className="relative w-full h-full">
                  {/* Top triangle */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[7px] border-l-transparent border-r-transparent border-b-yellow-400"></div>
                  
                  {/* Middle section */}
                  <div className="absolute top-1.5 left-1/2 transform -translate-x-1/2 w-5 h-4 bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500"></div>
                  
                  {/* Bottom triangle */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[12px] border-l-transparent border-r-transparent border-t-yellow-500"></div>
                  
                  {/* Center sparkle */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>
                  
                  {/* Side sparkles */}
                  <div className="absolute top-3 left-1.5 w-0.5 h-0.5 bg-white rounded-full animate-pulse"></div>
                  <div className="absolute top-4 right-1.5 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
            <span className="text-2xl font-bold text-white" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              Luxury Service
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
            <Link to="/" className="text-white hover:text-yellow-400 transition-colors font-medium">
              الرئيسية
            </Link>
            <Link to="/products" className="text-white hover:text-yellow-400 transition-colors font-medium">
              المنتجات
            </Link>
            <Link to="/categories" className="text-white hover:text-yellow-400 transition-colors font-medium">
              الأقسام
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {user ? (
              <>
                {/* Balance */}
                <div className="hidden sm:flex items-center space-x-2 rtl:space-x-reverse bg-purple-800 px-3 py-1 rounded-full">
                  <span className="text-yellow-400 font-bold">{user.balance}</span>
                  <span className="text-white text-sm">عملة</span>
                </div>

                {/* Notifications */}
                <Link to="/profile" className="relative">
                  <Button variant="ghost" size="sm" className="text-white hover:text-yellow-400">
                    <Bell className="w-5 h-5" />
                    {notifications.length > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1">
                        {notifications.length}
                      </Badge>
                    )}
                  </Button>
                </Link>

                {/* Cart */}
                <Button variant="ghost" size="sm" className="text-white hover:text-yellow-400">
                  <ShoppingCart className="w-5 h-5" />
                </Button>

                {/* Admin Panel Link */}
                {isAdmin() && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-purple-900">
                      <Settings className="w-4 h-4 mr-2" />
                      لوحة التحكم
                    </Button>
                  </Link>
                )}

                {/* Profile */}
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="text-white hover:text-yellow-400">
                    <User className="w-5 h-5 mr-2" />
                    {user.username}
                  </Button>
                </Link>

                {/* Logout */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-white hover:text-red-400"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-purple-900">
                  تسجيل الدخول
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}