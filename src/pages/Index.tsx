import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Diamond, Star, TrendingUp, Users, Package } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import LoadingScreen from '@/components/LoadingScreen';
import { loadProducts, loadCategories, loadUsers, loadOrders } from '@/lib/data';
import type { Product, Category } from '@/lib/data';

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory]);

  const loadData = async () => {
    try {
      const [productsData, categoriesData, usersData, ordersData] = await Promise.all([
        loadProducts(),
        loadCategories(),
        loadUsers(),
        loadOrders()
      ]);

      setProducts(productsData);
      setCategories(categoriesData);
      
      // Calculate stats from real data
      const totalRevenue = ordersData
        .filter(order => order.status === 'approved' || order.status === 'delivered')
        .reduce((sum, order) => sum + order.totalPrice, 0);

      setStats({
        totalUsers: usersData.length,
        totalProducts: productsData.length,
        totalOrders: ordersData.length,
        totalRevenue
      });

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.categoryId === parseInt(selectedCategory));
    }

    setFilteredProducts(filtered);
  };

  const handlePurchase = () => {
    loadData(); // Refresh data after purchase
  };

  if (loading) {
    return <LoadingScreen message="جاري تحميل المتجر..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" dir="rtl">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-purple-600/20"></div>
        <div className="relative max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-4 rtl:space-x-reverse mb-6">
              <div className="relative">
                {/* Improved Diamond Logo */}
                <div className="w-20 h-20 relative">
                  {/* Outer glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full opacity-30 animate-pulse blur-sm"></div>
                  
                  {/* Main diamond shape */}
                  <div className="relative w-full h-full">
                    {/* Top triangle */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[20px] border-r-[20px] border-b-[15px] border-l-transparent border-r-transparent border-b-gradient-to-r border-b-yellow-400"></div>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[18px] border-r-[18px] border-b-[13px] border-l-transparent border-r-transparent border-b-yellow-300"></div>
                    
                    {/* Middle section */}
                    <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-10 h-8 bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500 clip-path-diamond"></div>
                    
                    {/* Bottom triangle */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[20px] border-r-[20px] border-t-[25px] border-l-transparent border-r-transparent border-t-yellow-500"></div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[18px] border-r-[18px] border-t-[23px] border-l-transparent border-r-transparent border-t-yellow-400"></div>
                    
                    {/* Center sparkle */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-90 animate-ping"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
                    
                    {/* Side sparkles */}
                    <div className="absolute top-6 left-3 w-1 h-1 bg-white rounded-full animate-pulse"></div>
                    <div className="absolute top-8 right-3 w-1 h-1 bg-white rounded-full animate-pulse delay-300"></div>
                    <div className="absolute top-12 left-6 w-1 h-1 bg-white rounded-full animate-pulse delay-700"></div>
                  </div>
                </div>
              </div>
              <h1 className="text-6xl font-bold text-white" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                Luxury Service
              </h1>
            </div>
          </div>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            متجرك المتميز للخدمات الفاخرة والمنتجات عالية الجودة
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
                <div className="text-sm text-gray-300">عميل</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-4 text-center">
                <Package className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stats.totalProducts}</div>
                <div className="text-sm text-gray-300">منتج</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stats.totalOrders}</div>
                <div className="text-sm text-gray-300">طلب</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-4 text-center">
                <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stats.totalRevenue}</div>
                <div className="text-sm text-gray-300">إجمالي المبيعات</div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold px-8">
                ابدأ التسوق الآن
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
              تعرف على خدماتنا
            </Button>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              منتجاتنا المميزة
            </h2>
            <p className="text-gray-300 text-lg">
              اكتشف مجموعة واسعة من المنتجات والخدمات عالية الجودة
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="ابحث عن المنتجات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pr-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48 bg-white/10 border-white/20 text-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="اختر القسم" />
              </SelectTrigger>
              <SelectContent className="bg-purple-900 border-purple-700">
                <SelectItem value="all" className="text-white">جميع الأقسام</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()} className="text-white">
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onPurchase={handlePurchase}
                />
              ))}
            </div>
          ) : (
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-12 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">لا توجد منتجات</h3>
                <p className="text-gray-300">
                  {products.length === 0 
                    ? 'لم يتم إضافة أي منتجات بعد' 
                    : 'لا توجد منتجات تطابق البحث الحالي'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}