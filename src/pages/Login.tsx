import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Gem, Eye, EyeOff } from 'lucide-react';
import { getCurrentUser, setCurrentUser, hashPassword, verifyPassword } from '@/lib/auth';
import { loadUsers, saveUsers, getNextId, addLog } from '@/lib/data';
import LoadingScreen from '@/components/LoadingScreen';
import type { User } from '@/lib/auth';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    fullName: '',
    address: ''
  });

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const users = await loadUsers();
      const user = users.find(u => u.email === loginData.email);

      if (!user) {
        setError('البريد الإلكتروني غير مسجل');
        return;
      }

      if (!verifyPassword(loginData.password, user.password)) {
        setError('كلمة المرور غير صحيحة');
        return;
      }

      const authUser = {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        address: user.address,
        role: user.role,
        balance: user.balance
      };

      setCurrentUser(authUser);
      await addLog(user.id, 'تسجيل دخول');
      
      setSuccess('تم تسجيل الدخول بنجاح');
      setTimeout(() => {
        navigate(user.role === 'admin' ? '/admin' : '/');
      }, 1000);

    } catch (error) {
      setError('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (registerData.password !== registerData.confirmPassword) {
        setError('كلمات المرور غير متطابقة');
        return;
      }

      if (registerData.password.length < 6) {
        setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        return;
      }

      const users = await loadUsers();
      
      if (users.find(u => u.email === registerData.email)) {
        setError('البريد الإلكتروني مسجل بالفعل');
        return;
      }

      if (users.find(u => u.username === registerData.username)) {
        setError('اسم المستخدم مستخدم بالفعل');
        return;
      }

      const newUser: User = {
        id: getNextId(users),
        email: registerData.email,
        password: hashPassword(registerData.password),
        username: registerData.username,
        fullName: registerData.fullName,
        address: registerData.address,
        role: 'user',
        balance: 0,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      await saveUsers(users);
      await addLog(newUser.id, 'إنشاء حساب جديد');

      setSuccess('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول');
      setRegisterData({
        email: '',
        password: '',
        confirmPassword: '',
        username: '',
        fullName: '',
        address: ''
      });

    } catch (error) {
      setError('حدث خطأ أثناء إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    console.log('رابط إعادة تعيين كلمة المرور: /reset-password');
    alert('تم إرسال رابط إعادة تعيين كلمة المرور إلى وحدة التحكم (Console)');
  };

  if (loading) {
    return <LoadingScreen message="جاري المعالجة..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 rtl:space-x-reverse">
            <div className="relative">
              <div className="w-12 h-12 transform rotate-45 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-lg shadow-lg">
                <div className="absolute inset-1 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded transform -rotate-45 flex items-center justify-center">
                  <Gem className="w-5 h-5 text-purple-900" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              Luxury Service
            </h1>
          </div>
        </div>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-2xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              مرحباً بك
            </CardTitle>
            <CardDescription className="text-gray-300">
              سجل دخولك أو أنشئ حساب جديد
            </CardDescription>
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

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/10">
                <TabsTrigger value="login" className="text-white data-[state=active]:bg-yellow-400 data-[state=active]:text-purple-900">
                  تسجيل الدخول
                </TabsTrigger>
                <TabsTrigger value="register" className="text-white data-[state=active]:bg-yellow-400 data-[state=active]:text-purple-900">
                  حساب جديد
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      placeholder="أدخل بريدك الإلكتروني"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">كلمة المرور</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pr-10"
                        placeholder="أدخل كلمة المرور"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="text-left">
                    <Button
                      type="button"
                      variant="link"
                      className="text-yellow-400 hover:text-yellow-300 p-0 h-auto"
                      onClick={handleForgotPassword}
                    >
                      نسيت كلمة المرور؟
                    </Button>
                  </div>
                  <Button type="submit" className="w-full bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold">
                    تسجيل الدخول
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-white">اسم المستخدم</Label>
                      <Input
                        id="username"
                        value={registerData.username}
                        onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="اسم المستخدم"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-white">الاسم الكامل</Label>
                      <Input
                        id="fullName"
                        value={registerData.fullName}
                        onChange={(e) => setRegisterData({...registerData, fullName: e.target.value})}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="الاسم الكامل"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registerEmail" className="text-white">البريد الإلكتروني</Label>
                    <Input
                      id="registerEmail"
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      placeholder="أدخل بريدك الإلكتروني"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-white">العنوان</Label>
                    <Input
                      id="address"
                      value={registerData.address}
                      onChange={(e) => setRegisterData({...registerData, address: e.target.value})}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      placeholder="العنوان (اختياري)"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="registerPassword" className="text-white">كلمة المرور</Label>
                      <div className="relative">
                        <Input
                          id="registerPassword"
                          type={showPassword ? "text" : "password"}
                          value={registerData.password}
                          onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pr-10"
                          placeholder="كلمة المرور"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-white">تأكيد كلمة المرور</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pr-10"
                          placeholder="تأكيد كلمة المرور"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold">
                    إنشاء حساب
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}