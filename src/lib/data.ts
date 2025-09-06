import { User, AuthUser } from './auth';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  categoryId: number;
  stock: number;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  image?: string;
  order: number;
}

export interface Order {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  totalPrice: number;
  couponId?: number;
  status: 'pending' | 'approved' | 'delivered' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
}

export interface Coupon {
  id: number;
  code: string;
  discount: number;
  expiresAt: string;
  maxUses: number;
  usedCount: number;
}

export interface Notification {
  id: number;
  userId: number;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface Log {
  id: number;
  userId: number;
  action: string;
  timestamp: string;
}

// Generic data loading function
const loadData = async <T>(filename: string): Promise<T[]> => {
  try {
    const response = await fetch(`/dataJson/${filename}`);
    if (!response.ok) {
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    return [];
  }
};

// Generic data saving function
const saveData = async <T>(filename: string, data: T[]): Promise<void> => {
  try {
    // In a real app, this would be an API call
    // For now, we'll store in localStorage as fallback
    localStorage.setItem(`dataJson_${filename}`, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${filename}:`, error);
  }
};

// Load from localStorage if available (fallback for file operations)
const loadFromStorage = <T>(filename: string): T[] => {
  try {
    const data = localStorage.getItem(`dataJson_${filename}`);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Users
export const loadUsers = async (): Promise<User[]> => {
  const fileData = await loadData<User>('users.json');
  const storageData = loadFromStorage<User>('users.json');
  return storageData.length > 0 ? storageData : fileData;
};

export const saveUsers = async (users: User[]): Promise<void> => {
  await saveData('users.json', users);
};

// Products
export const loadProducts = async (): Promise<Product[]> => {
  const fileData = await loadData<Product>('products.json');
  const storageData = loadFromStorage<Product>('products.json');
  return storageData.length > 0 ? storageData : fileData;
};

export const saveProducts = async (products: Product[]): Promise<void> => {
  await saveData('products.json', products);
};

// Categories
export const loadCategories = async (): Promise<Category[]> => {
  const fileData = await loadData<Category>('categories.json');
  const storageData = loadFromStorage<Category>('categories.json');
  return storageData.length > 0 ? storageData : fileData;
};

export const saveCategories = async (categories: Category[]): Promise<void> => {
  await saveData('categories.json', categories);
};

// Orders
export const loadOrders = async (): Promise<Order[]> => {
  const fileData = await loadData<Order>('orders.json');
  const storageData = loadFromStorage<Order>('orders.json');
  return storageData.length > 0 ? storageData : fileData;
};

export const saveOrders = async (orders: Order[]): Promise<void> => {
  await saveData('orders.json', orders);
};

// Coupons
export const loadCoupons = async (): Promise<Coupon[]> => {
  const fileData = await loadData<Coupon>('coupons.json');
  const storageData = loadFromStorage<Coupon>('coupons.json');
  return storageData.length > 0 ? storageData : fileData;
};

export const saveCoupons = async (coupons: Coupon[]): Promise<void> => {
  await saveData('coupons.json', coupons);
};

// Notifications
export const loadNotifications = async (): Promise<Notification[]> => {
  const fileData = await loadData<Notification>('notifications.json');
  const storageData = loadFromStorage<Notification>('notifications.json');
  return storageData.length > 0 ? storageData : fileData;
};

export const saveNotifications = async (notifications: Notification[]): Promise<void> => {
  await saveData('notifications.json', notifications);
};

// Logs
export const loadLogs = async (): Promise<Log[]> => {
  const fileData = await loadData<Log>('logs.json');
  const storageData = loadFromStorage<Log>('logs.json');
  return storageData.length > 0 ? storageData : fileData;
};

export const saveLogs = async (logs: Log[]): Promise<void> => {
  await saveData('logs.json', logs);
};

// Helper functions
export const getNextId = <T extends { id: number }>(items: T[]): number => {
  return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
};

export const addLog = async (userId: number, action: string): Promise<void> => {
  const logs = await loadLogs();
  const newLog: Log = {
    id: getNextId(logs),
    userId,
    action,
    timestamp: new Date().toISOString()
  };
  logs.push(newLog);
  await saveLogs(logs);
};

export const addNotification = async (userId: number, message: string): Promise<void> => {
  const notifications = await loadNotifications();
  const newNotification: Notification = {
    id: getNextId(notifications),
    userId,
    message,
    createdAt: new Date().toISOString(),
    read: false
  };
  notifications.push(newNotification);
  await saveNotifications(notifications);
};