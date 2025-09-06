# Luxury Service - MVP Todo List

## Core Files to Create/Modify:

### 1. Data Structure & Storage
- `public/dataJson/users.json` - User accounts with admin/user roles
- `public/dataJson/products.json` - Product catalog
- `public/dataJson/categories.json` - Product categories
- `public/dataJson/orders.json` - Order management
- `public/dataJson/coupons.json` - Discount coupons
- `public/dataJson/notifications.json` - User notifications
- `public/dataJson/logs.json` - Activity logs

### 2. Authentication & Utils
- `src/lib/auth.ts` - Authentication utilities with JWT/localStorage
- `src/lib/data.ts` - JSON data management functions
- `src/lib/crypto.ts` - Password hashing utilities
- `src/components/LoadingScreen.tsx` - Loading component

### 3. Main Pages
- `src/pages/Index.tsx` - Home page with products
- `src/pages/Login.tsx` - Login/Register page
- `src/pages/Profile.tsx` - User profile with balance, orders, notifications
- `src/pages/AdminDashboard.tsx` - Admin control panel

### 4. Admin Management Pages
- `src/pages/admin/Users.tsx` - User management
- `src/pages/admin/Products.tsx` - Product management
- `src/pages/admin/Orders.tsx` - Order management
- `src/pages/admin/Categories.tsx` - Category management
- `src/pages/admin/Coupons.tsx` - Coupon management

### 5. Components
- `src/components/Navbar.tsx` - Navigation with Arabic support
- `src/components/ProductCard.tsx` - Product display component
- `src/components/AdminSidebar.tsx` - Admin navigation sidebar

## Key Features:
- ✅ Arabic RTL support
- ✅ Real JSON data integration (no dummy data)
- ✅ Secure password hashing
- ✅ Role-based access control
- ✅ Internal currency system
- ✅ Order management workflow
- ✅ Coupon system
- ✅ Notifications system
- ✅ Activity logging
- ✅ Responsive design
- ✅ Diamond logo design
- ✅ Loading screens

## Default Admin Account:
- Email: bebo11hany1@gmail.com
- Password: 12341234
- Role: admin