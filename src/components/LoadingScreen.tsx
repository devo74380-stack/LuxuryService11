import { Loader2, Diamond } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = "جاري التحميل..." }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center z-50">
      <div className="text-center space-y-6">
        {/* Improved Diamond Logo */}
        <div className="relative">
          <div className="w-20 h-20 relative mx-auto">
            {/* Outer glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full opacity-30 animate-pulse blur-md"></div>
            
            {/* Main diamond shape */}
            <div className="relative w-full h-full">
              {/* Top triangle */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[20px] border-r-[20px] border-b-[15px] border-l-transparent border-r-transparent border-b-yellow-400 animate-pulse"></div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[18px] border-r-[18px] border-b-[13px] border-l-transparent border-r-transparent border-b-yellow-300"></div>
              
              {/* Middle section */}
              <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-10 h-8 bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500 animate-pulse"></div>
              
              {/* Bottom triangle */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[20px] border-r-[20px] border-t-[25px] border-l-transparent border-r-transparent border-t-yellow-500 animate-pulse"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[18px] border-r-[18px] border-t-[23px] border-l-transparent border-r-transparent border-t-yellow-400"></div>
              
              {/* Center sparkle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-90 animate-ping"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
              
              {/* Side sparkles */}
              <div className="absolute top-6 left-3 w-1 h-1 bg-white rounded-full animate-pulse"></div>
              <div className="absolute top-8 right-3 w-1 h-1 bg-white rounded-full animate-pulse delay-300"></div>
              <div className="absolute top-12 left-6 w-1 h-1 bg-white rounded-full animate-pulse delay-700"></div>
              <div className="absolute top-10 right-6 w-1 h-1 bg-white rounded-full animate-pulse delay-1000"></div>
            </div>
          </div>
          
          {/* Rotating ring around diamond */}
          <div className="absolute inset-0 border-2 border-transparent border-t-yellow-400 border-r-yellow-500 rounded-full animate-spin"></div>
        </div>
        
        {/* Brand Name */}
        <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
          Luxury Service
        </h1>
        
        {/* Loading Spinner */}
        <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
          <Loader2 className="w-6 h-6 text-yellow-400 animate-spin" />
          <span className="text-white text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            {message}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}