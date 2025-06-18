import { 
  users, adminUsers, stores, categories, products, orders, orderItems, cartItems, wishlistItems,
  admins, websiteVisits, notifications, orderTracking, returnPolicies, returns,
  promotions, advertisements, productReviews, settlements, storeAnalytics, inventoryLogs,
  paymentTransactions, coupons, banners, supportTickets, siteSettings, deliveryPartners, deliveries,
  vendorVerifications, fraudAlerts, commissions, productAttributes, adminLogs, deliveryZones,
  type User, type InsertUser, type AdminUser, type InsertAdminUser, type Store, type InsertStore, 
  type Category, type InsertCategory, type Product, type InsertProduct,
  type Order, type InsertOrder, type OrderItem, type InsertOrderItem,
  type CartItem, type InsertCartItem, type WishlistItem, type InsertWishlistItem,
  type Admin, type InsertAdmin, type WebsiteVisit, type InsertWebsiteVisit,
  type Notification, type InsertNotification, type OrderTracking, type InsertOrderTracking,
  type ReturnPolicy, type InsertReturnPolicy, type Return, type InsertReturn,
  type Promotion, type InsertPromotion, type Advertisement, type InsertAdvertisement,
  type ProductReview, type InsertProductReview, type Settlement, type InsertSettlement,
  type StoreAnalytics, type InsertStoreAnalytics, type InventoryLog, type InsertInventoryLog,
  type DeliveryPartner, type InsertDeliveryPartner, type Delivery, type InsertDelivery, type DeliveryZone, type InsertDeliveryZone,
  type PaymentTransaction, type Coupon, type InsertCoupon, type Banner, type InsertBanner,
  type SupportTicket, type InsertSupportTicket, type SiteSetting,
  type VendorVerification, type InsertVendorVerification, type FraudAlert, type InsertFraudAlert,
  type Commission, type InsertCommission, type ProductAttribute, type InsertProductAttribute,
  type AdminLog, type InsertAdminLog
} from "@shared/schema";
import { db } from "./db";
import { eq, and, ilike, or, desc, count, sql, gte, lt, inArray } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;

  // Admin user operations
  getAdminUser(id: number): Promise<AdminUser | undefined>;
  getAdminUserByEmail(email: string): Promise<AdminUser | undefined>;
  createAdminUser(adminUser: InsertAdminUser): Promise<AdminUser>;
  getAdminUsers(): Promise<AdminUser[]>;

  // User approval operations
  getPendingUsers(): Promise<User[]>;
  approveUser(userId: number, adminId: number): Promise<User | undefined>;
  rejectUser(userId: number, adminId: number): Promise<User | undefined>;
  getAllUsersWithStatus(): Promise<User[]>;

  // Store operations
  getStore(id: number): Promise<Store | undefined>;
  getStoresByOwnerId(ownerId: number): Promise<Store[]>;
  getAllStores(): Promise<Store[]>;
  createStore(store: InsertStore): Promise<Store>;
  updateStore(id: number, updates: Partial<InsertStore>): Promise<Store | undefined>;

  // Category operations
  getAllCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, updates: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;

  // Product operations
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByStoreId(storeId: number): Promise<Product[]>;
  getAllProducts(): Promise<Product[]>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Order operations
  getOrder(id: number): Promise<Order | undefined>;
  getOrdersByCustomerId(customerId: number): Promise<Order[]>;
  getOrdersByStoreId(storeId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;

  // Order item operations
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;

  // Cart operations
  getCartItems(userId: number): Promise<CartItem[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(userId: number): Promise<boolean>;

  // Wishlist operations
  getWishlistItems(userId: number): Promise<WishlistItem[]>;
  addToWishlist(wishlistItem: InsertWishlistItem): Promise<WishlistItem>;
  removeFromWishlist(id: number): Promise<boolean>;
  isInWishlist(userId: number, productId: number): Promise<boolean>;

  // Admin operations
  getAdmin(id: number): Promise<Admin | undefined>;
  getAdminByEmail(email: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;

  // Website visit tracking
  recordVisit(visit: InsertWebsiteVisit): Promise<WebsiteVisit>;
  getVisitStats(days?: number): Promise<any>;
  getPageViews(page?: string): Promise<WebsiteVisit[]>;

  // Notifications
  createNotification(notification: InsertNotification): Promise<Notification>;
  getUserNotifications(userId: number): Promise<Notification[]>;
  getNotificationsByUserId(userId: number): Promise<Notification[]>;
  getNotificationsByType(type: string): Promise<Notification[]>;
  markNotificationAsRead(id: number): Promise<Notification>;
  markAllNotificationsAsRead(userId: number): Promise<boolean>;

  // Order tracking
  createOrderTracking(tracking: InsertOrderTracking): Promise<OrderTracking>;
  getOrderTracking(orderId: number): Promise<OrderTracking[]>;
  updateOrderTracking(orderId: number, status: string, description?: string, location?: string): Promise<OrderTracking>;

  // Return policy
  createReturnPolicy(policy: InsertReturnPolicy): Promise<ReturnPolicy>;
  getReturnPolicy(storeId: number): Promise<ReturnPolicy | undefined>;
  updateReturnPolicy(storeId: number, updates: Partial<InsertReturnPolicy>): Promise<ReturnPolicy | undefined>;

  // Returns
  createReturn(returnItem: InsertReturn): Promise<Return>;
  getReturn(id: number): Promise<Return | undefined>;
  getReturnsByCustomer(customerId: number): Promise<Return[]>;
  getReturnsByStore(storeId: number): Promise<Return[]>;
  updateReturnStatus(id: number, status: string): Promise<Return | undefined>;

  // Distance calculation between stores and user location
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number;
  getStoresWithDistance(userLat: number, userLon: number, storeType?: string): Promise<(Store & { distance: number })[]>;

  // Seller hub analytics
  getSellerDashboardStats(storeId: number): Promise<{
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    averageRating: number;
    totalReviews: number;
  }>;
  getStoreAnalytics(storeId: number, days?: number): Promise<StoreAnalytics[]>;
  updateStoreAnalytics(data: InsertStoreAnalytics): Promise<StoreAnalytics>;

  // Promotions
  getStorePromotions(storeId: number): Promise<Promotion[]>;
  createPromotion(promotion: InsertPromotion): Promise<Promotion>;
  updatePromotion(id: number, updates: Partial<InsertPromotion>): Promise<Promotion | undefined>;
  deletePromotion(id: number): Promise<boolean>;

  // Advertisements
  getStoreAdvertisements(storeId: number): Promise<Advertisement[]>;
  createAdvertisement(ad: InsertAdvertisement): Promise<Advertisement>;
  updateAdvertisement(id: number, updates: Partial<InsertAdvertisement>): Promise<Advertisement | undefined>;
  deleteAdvertisement(id: number): Promise<boolean>;

  // Product reviews
  getProductReviews(productId: number): Promise<ProductReview[]>;
  getStoreReviews(storeId: number): Promise<ProductReview[]>;
  createProductReview(review: InsertProductReview): Promise<ProductReview>;
  updateProductReview(id: number, updates: Partial<InsertProductReview>): Promise<ProductReview | undefined>;
  deleteProductReview(id: number): Promise<boolean>;

  // Settlements
  getStoreSettlements(storeId: number): Promise<Settlement[]>;
  createSettlement(settlement: InsertSettlement): Promise<Settlement>;
  updateSettlement(id: number, updates: Partial<InsertSettlement>): Promise<Settlement | undefined>;

  // Inventory management
  getInventoryLogs(storeId: number, productId?: number): Promise<InventoryLog[]>;
  createInventoryLog(log: InsertInventoryLog): Promise<InventoryLog>;
  updateProductStock(productId: number, quantity: number, type: string, reason?: string): Promise<boolean>;

  // Enhanced admin management methods
  getAllOrders(): Promise<Order[]>;
  getAllTransactions(): Promise<PaymentTransaction[]>;
  getAllCoupons(): Promise<Coupon[]>;
  createCoupon(coupon: InsertCoupon): Promise<Coupon>;
  updateCoupon(id: number, updates: Partial<InsertCoupon>): Promise<Coupon | undefined>;
  deleteCoupon(id: number): Promise<boolean>;
  getAllBanners(): Promise<Banner[]>;
  createBanner(banner: InsertBanner): Promise<Banner>;
  updateBanner(id: number, updates: Partial<InsertBanner>): Promise<Banner | undefined>;
  deleteBanner(id: number): Promise<boolean>;
  getAllSupportTickets(): Promise<SupportTicket[]>;
  createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket>;
  updateSupportTicket(id: number, updates: Partial<InsertSupportTicket>): Promise<SupportTicket | undefined>;
  getAllSiteSettings(): Promise<SiteSetting[]>;
  updateSiteSetting(key: string, value: string): Promise<SiteSetting | undefined>;

  // Enhanced admin features
  getDashboardStats(): Promise<any>;
  getAllVendorVerifications(): Promise<VendorVerification[]>;
  updateVendorVerification(id: number, updates: Partial<InsertVendorVerification>): Promise<VendorVerification | undefined>;
  approveVendorVerification(id: number, adminId: number): Promise<VendorVerification | undefined>;
  rejectVendorVerification(id: number, adminId: number, reason: string): Promise<VendorVerification | undefined>;
  getAllFraudAlerts(): Promise<FraudAlert[]>;
  createFraudAlert(alert: InsertFraudAlert): Promise<FraudAlert>;
  updateFraudAlert(id: number, updates: Partial<InsertFraudAlert>): Promise<FraudAlert | undefined>;
  updateFraudAlertStatus(id: number, status: string): Promise<FraudAlert | undefined>;
  getAllCommissions(): Promise<Commission[]>;
  createCommission(commission: InsertCommission): Promise<Commission>;
  updateCommission(id: number, updates: Partial<InsertCommission>): Promise<Commission | undefined>;
  getCommissions(status?: string): Promise<Commission[]>;
  updateCommissionStatus(id: number, status: string): Promise<Commission | undefined>;

  // Dashboard stats methods
  getTotalUsersCount(): Promise<number>;
  getTotalStoresCount(): Promise<number>;
  getTotalOrdersCount(): Promise<number>;
  getTotalRevenue(): Promise<number>;
  getPendingOrdersCount(): Promise<number>;
  getActiveUsersCount(): Promise<number>;
  getPendingVendorVerificationsCount(): Promise<number>;
  getOpenFraudAlertsCount(): Promise<number>;
  getProductAttributes(productId: number): Promise<ProductAttribute[]>;
  createProductAttribute(attribute: InsertProductAttribute): Promise<ProductAttribute>;
  deleteProductAttribute(id: number): Promise<boolean>;
  logAdminAction(log: InsertAdminLog): Promise<AdminLog>;
  getAdminLogs(adminId?: number): Promise<AdminLog[]>;

  // Reset methods
  resetAllSystemData(): Promise<boolean>;
  resetStoreData(storeId: number): Promise<boolean>;

  // Delivery partner operations
  getDeliveryPartner(id: number): Promise<DeliveryPartner | undefined>;
  getDeliveryPartnerByUserId(userId: number): Promise<DeliveryPartner | undefined>;
  getAllDeliveryPartners(): Promise<DeliveryPartner[]>;
  getPendingDeliveryPartners(): Promise<DeliveryPartner[]>;
  createDeliveryPartner(deliveryPartner: InsertDeliveryPartner): Promise<DeliveryPartner>;
  updateDeliveryPartner(id: number, updates: Partial<InsertDeliveryPartner>): Promise<DeliveryPartner | undefined>;
  approveDeliveryPartner(id: number, adminId: number): Promise<DeliveryPartner | undefined>;
  rejectDeliveryPartner(id: number, adminId: number, reason: string): Promise<DeliveryPartner | undefined>;

  // Delivery operations
  getDelivery(id: number): Promise<Delivery | undefined>;
  getDeliveriesByPartnerId(partnerId: number): Promise<Delivery[]>;
  getDeliveriesByOrderId(orderId: number): Promise<Delivery[]>;
  createDelivery(delivery: InsertDelivery): Promise<Delivery>;
  updateDeliveryStatus(id: number, status: string, partnerId?: number): Promise<Delivery | undefined>;
  assignDeliveryToPartner(deliveryId: number, partnerId: number): Promise<Delivery | undefined>;
  getActiveDeliveriesForStore(storeId: number): Promise<any[]>;

  // Delivery tracking
  getDeliveryTrackingData(deliveryId: number): Promise<any>;
  updateDeliveryLocation(deliveryId: number, latitude: number, longitude: number): Promise<void>;
  updateDeliveryStatus(deliveryId: number, status: string, description?: string): Promise<void>;

  // Delivery Zone methods
  createDeliveryZone(data: InsertDeliveryZone): Promise<DeliveryZone>;
  getDeliveryZones(): Promise<DeliveryZone[]>;
  getAllDeliveryZones(): Promise<DeliveryZone[]>;
  updateDeliveryZone(id: number, data: Partial<InsertDeliveryZone>): Promise<DeliveryZone>;
  deleteDeliveryZone(id: number): Promise<void>;
  calculateDeliveryFee(distance: number): Promise<{ fee: number; zone: DeliveryZone | null }>;

  // Admin authentication methods
  authenticateAdmin(email: string, password: string): Promise<AdminUser | null>;

  // Admin profile management methods
  getAdminProfile(adminId: number): Promise<any>;
  updateAdminProfile(adminId: number, updates: any): Promise<any>;
  verifyAdminPassword(adminId: number, password: string): Promise<boolean>;
  changeAdminPassword(adminId: number, currentPassword: string, newPassword: string): Promise<boolean>;

  // Delivery zone management methods
  getAllDeliveryZones(): Promise<any[]>;
  createDeliveryZone(zoneData: any): Promise<any>;
  updateDeliveryZone(id: number, updateData: any): Promise<any>;
  deleteDeliveryZone(id: number): Promise<boolean>;

  // Account deletion methods
  deleteUserNotifications(userId: number): Promise<void>;
  deleteUserWishlist(userId: number): Promise<void>;
  deleteUserReviews(userId: number): Promise<void>;
  deleteStoreProducts(storeId: number): Promise<void>;
  cancelStoreOrders(storeId: number): Promise<void>;
  deleteStore(storeId: number): Promise<void>;
  anonymizeDeliveryPartnerData(userId: number): Promise<void>;
  cancelUserOrders(userId: number): Promise<void>;
  deleteUser(userId: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.phone, phone));
    return user;
  }

  async getUserByToken(token: string): Promise<User | undefined> {
    // Simple token validation - in production this would be more sophisticated
    // For now, assume token is just the user ID for testing purposes
    try {
      const userId = parseInt(token);
      if (isNaN(userId)) return undefined;

      const [user] = await db.select().from(users).where(eq(users.id, userId));
      return user;
    } catch {
      return undefined;
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return updatedUser;
  }

  // Admin user operations
  async getAdminUser(id: number): Promise<AdminUser | undefined> {
    const [adminUser] = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
    return adminUser;
  }

  async getAdminUserByEmail(email: string): Promise<AdminUser | undefined> {
    const [adminUser] = await db.select().from(adminUsers).where(eq(adminUsers.email, email));
    return adminUser;
  }

  async createAdminUser(adminUser: InsertAdminUser): Promise<AdminUser> {
    const [newAdminUser] = await db.insert(adminUsers).values(adminUser).returning();
    return newAdminUser;
  }

  async getAdminUsers(): Promise<AdminUser[]> {
    return await db.select().from(adminUsers);
  }

  // User approval operations
  async getPendingUsers(): Promise<User[]> {
    return await db.select().from(users).where(eq(users.status, 'pending'));
  }

  async approveUser(userId: number, adminId: number): Promise<User | undefined> {
    try {
      console.log(`Attempting to approve user ${userId} by admin ${adminId}`);

      // For now, we'll set approvedBy to null to avoid foreign key constraint issues
      // until we properly migrate the database schema
      const [approvedUser] = await db
        .update(users)
        .set({
          status: 'active',
          approvalDate: new Date(),
          approvedBy: null, // Temporarily set to null to avoid FK constraint
          updatedAt: new Date()
        })
        .where(eq(users.id, userId))
        .returning();

      console.log('User approval successful:', approvedUser);
      return approvedUser;
    } catch (error) {
      console.error('Error in approveUser:', error);
      throw error;
    }
  }

  async rejectUser(userId: number, adminId: number): Promise<User | undefined> {
    try {
      console.log(`Attempting to reject user ${userId} by admin ${adminId}`);

      const [rejectedUser] = await db
        .update(users)
        .set({
          status: 'rejected',
          approvalDate: new Date(),
          approvedBy: null, // Temporarily set to null to avoid FK constraint
          updatedAt: new Date()
        })
        .where(eq(users.id, userId))
        .returning();

      console.log('User rejection successful:', rejectedUser);
      return rejectedUser;
    } catch (error) {
      console.error('Error in rejectUser:', error);
      throw error;
    }
  }

  async getAllUsersWithStatus(): Promise<User[]> {
    try {
      const result = await db.select().from(users).orderBy(desc(users.createdAt));
      return result;
    } catch (error) {
      console.error("Database error in getAllUsersWithStatus:", error);
      throw error;
    }
  }

  // Store operations
  async getStore(id: number): Promise<Store | undefined> {
    const [store] = await db.select().from(stores).where(eq(stores.id, id));
    return store;
  }

  async getStoresByOwnerId(ownerId: number): Promise<Store[]> {
    try {
      const result = await db.select().from(stores).where(eq(stores.ownerId, ownerId));
      return result;
    } catch (error) {
      console.error("Database error in getStoresByOwnerId:", error);
      throw error;
    }
  }

  async getAllStores(): Promise<Store[]> {
    return await db.select().from(stores);
  }

  async createStore(store: InsertStore): Promise<Store> {
    // Generate a unique slug from the store name
    const baseSlug = store.name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();

    let slug = baseSlug;
    let counter = 1;

    // Check if slug exists and make it unique
    while (true) {
      const existingStore = await db.select().from(stores).where(eq(stores.slug, slug)).limit(1);
      if (existingStore.length === 0) {
        break;
      }
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const storeWithSlug = {
      ...store,
      slug,
      isActive: true,
      featured: false,
      rating: "0.00",
      totalReviews: 0,
      state: store.state || 'Not specified'
    };

    const [newStore] = await db.insert(stores).values(storeWithSlug).returning();
    return newStore;
  }

  async updateStore(id: number, updates: Partial<InsertStore>): Promise<Store | undefined> {
    const [updatedStore] = await db.update(stores).set(updates).where(eq(stores.id, id)).returning();
    return updatedStore;
  }

  // Category operations
  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  async updateCategory(id: number, updates: Partial<InsertCategory>): Promise<Category | undefined> {
    const [updatedCategory] = await db
      .update(categories)
      .set(updates)
      .where(eq(categories.id, id))
      .returning();
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Product operations
  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductsByStoreId(storeId: number): Promise<Product[]> {
    return await db.select().from(products)
      .where(eq(products.storeId, storeId))
      .orderBy(desc(products.createdAt));
  }

  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.categoryId, categoryId));
  }

  async searchProducts(query: string): Promise<Product[]> {
    return await db.select().from(products).where(
      or(
        ilike(products.name, `%${query}%`),
        ilike(products.description, `%${query}%`)
      )
    );
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    // Generate slug if not provided
    let slug = product.slug;
    if (!slug) {
      const baseSlug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      let counter = 1;
      slug = baseSlug;

      while (true) {
        const existingProduct = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
        if (existingProduct.length === 0) {
          break;
        }
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    const productWithDefaults = {
      ...product,
      slug,
      isActive: product.isActive !== undefined ? product.isActive : true,
      rating: product.rating || "0.00",
      totalReviews: product.totalReviews || 0,
      stock: product.stock || 0,
      imageUrl: product.imageUrl || "",
      images: product.images || []
    };

    const [newProduct] = await db.insert(products).values(productWithDefaults).returning();
    return newProduct;
  }

  async updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updatedProduct] = await db.update(products).set(updates).where(eq(products.id, id)).returning();
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Order operations
  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getOrdersByCustomerId(customerId: number): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.customerId, customerId)).orderBy(desc(orders.createdAt));
  }

  async getOrdersByStoreId(storeId: number): Promise<Order[]> {
    // Use a simple approach - get all orders and filter on the backend for now
    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));

    // Filter orders that have items from this store
    const storeOrders = [];
    for (const order of allOrders) {
      const orderItemsForStore = await db.select().from(orderItems)
        .where(and(eq(orderItems.orderId, order.id), eq(orderItems.storeId, storeId)));

      if (orderItemsForStore.length > 0) {
        storeOrders.push(order);
      }
    }

    return storeOrders;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [updatedOrder] = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
    return updatedOrder;
  }

  // Order item operations
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const [newOrderItem] = await db.insert(orderItems).values(orderItem).returning();
    return newOrderItem;
  }

  // Cart operations
  async getCartItems(userId: number): Promise<CartItem[]> {
    try {
      return await db.select().from(cartItems).where(eq(cartItems.userId, userId));
    } catch (error) {
      console.error("Error fetching cart items:", error);
      return [];
    }
  }

  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = await db.select().from(cartItems)
      .where(and(eq(cartItems.userId, cartItem.userId), eq(cartItems.productId, cartItem.productId)));

    if (existingItem.length > 0) {
      // Update quantity
      const [updatedItem] = await db.update(cartItems)
        .set({ quantity: existingItem[0].quantity + cartItem.quantity })
        .where(eq(cartItems.id, existingItem[0].id))
        .returning();
      return updatedItem;
    } else {
      // Add new item
      const [newItem] = await db.insert(cartItems).values(cartItem).returning();
      return newItem;
    }
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const [updatedItem] = await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, id)).returning();
    return updatedItem;
  }

  async removeFromCart(id: number): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.id, id));
    return (result.rowCount || 0) > 0;
  }

  async clearCart(userId: number): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.userId, userId));
    return (result.rowCount || 0) >= 0;
  }

  // Wishlist operations
  async getWishlistItems(userId: number): Promise<WishlistItem[]> {
    try {
      return await db.select().from(wishlistItems).where(eq(wishlistItems.userId, userId));
    } catch (error) {
      console.error("Error fetching wishlist items:", error);
      return [];
    }
  }

  async addToWishlist(wishlistItem: InsertWishlistItem): Promise<WishlistItem> {
    // Check if item already exists in wishlist
    const existingItem = await db.select().from(wishlistItems)
      .where(and(eq(wishlistItems.userId, wishlistItem.userId), eq(wishlistItems.productId, wishlistItem.productId)));

    if (existingItem.length > 0) {
      return existingItem[0];
    } else {
      const [newItem] = await db.insert(wishlistItems).values(wishlistItem).returning();
      return newItem;
    }
  }

  async removeFromWishlist(id: number): Promise<boolean> {
    const result = await db.delete(wishlistItems).where(eq(wishlistItems.id, id));
    return (result.rowCount || 0) > 0;
  }

  async isInWishlist(userId: number, productId: number): Promise<boolean> {
    const result = await db.select().from(wishlistItems)
      .where(and(eq(wishlistItems.userId, userId), eq(wishlistItems.productId, productId)))
      .limit(1);
    return result.length > 0;
  }

  // Admin operations
  async getAdmin(id: number): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.id, id));
    return admin;
  }

  async getAdminByEmail(email: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.email, email));
    return admin;
  }

  async createAdmin(admin: InsertAdmin): Promise<Admin> {
    const [newAdmin] = await db.insert(admins).values(admin).returning();
    return newAdmin;
  }

  // Website visit tracking
  async recordVisit(visit: InsertWebsiteVisit): Promise<WebsiteVisit> {
    const [newVisit] = await db.insert(websiteVisits).values(visit).returning();
    return newVisit;
  }

  async getVisitStats(days: number = 30): Promise<any> {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);

    const totalVisits = await db.select({ count: count() })
      .from(websiteVisits)
      .where(gte(websiteVisits.visitedAt, dateThreshold));

    const uniqueVisitors = await db.select({ count: count(websiteVisits.ipAddress) })
      .from(websiteVisits)
      .where(gte(websiteVisits.visitedAt, dateThreshold));

    const pageViews = await db.select({
      page: websiteVisits.page,
      count: count()
    })
    .from(websiteVisits)
    .where(gte(websiteVisits.visitedAt, dateThreshold))
    .groupBy(websiteVisits.page)
    .orderBy(desc(count()));

    return {
      totalVisits: totalVisits[0]?.count || 0,
      uniqueVisitors: uniqueVisitors[0]?.count || 0,
      pageViews
    };
  }

  async getPageViews(page?: string): Promise<WebsiteVisit[]> {
    if (page) {
      return await db.select().from(websiteVisits).where(eq(websiteVisits.page, page)).orderBy(desc(websiteVisits.visitedAt));
    }
    return await db.select().from(websiteVisits).orderBy(desc(websiteVisits.visitedAt));
  }

  // Notifications
  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db.insert(notifications).values(notification).returning();
    return newNotification;
  }

  async getUserNotifications(userId: number): Promise<Notification[]> {
    return await db.select().from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async getNotificationsByUserId(userId: number): Promise<Notification[]> {
    return await db.select().from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async getNotificationsByType(type: string): Promise<Notification[]> {
    return await db.select().from(notifications)
      .where(eq(notifications.type, type))
      .orderBy(desc(notifications.createdAt));
  }

  async markNotificationAsRead(id: number): Promise<Notification> {
    const [updated] = await db.update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id))
      .returning();
    return updated;
  }

  async markAllNotificationsAsRead(userId: number): Promise<boolean> {
    try {
      await db.update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.userId, userId));
      return true;
    } catch {
      return false;
    }
  }

  // Order tracking
  async createOrderTracking(tracking: InsertOrderTracking): Promise<OrderTracking> {
    const [newTracking] = await db.insert(orderTracking).values(tracking).returning();
    return newTracking;
  }

  async getOrderTracking(orderId: number): Promise<OrderTracking[]> {
    return await db.select().from(orderTracking)
      .where(eq(orderTracking.orderId, orderId))
      .orderBy(desc(orderTracking.createdAt));
  }

  async updateOrderTracking(orderId: number, status: string, description?: string, location?: string): Promise<OrderTracking> {
    const trackingData = {
      orderId,
      status,
      description: description || `Order ${status}`,
      location: location || 'Unknown',
      createdAt: new Date()
    };

    const [newTracking] = await db.insert(orderTracking).values(trackingData).returning();
    return newTracking;
  }

  // Return policy
  async createReturnPolicy(policy: InsertReturnPolicy): Promise<ReturnPolicy> {
    const [newPolicy] = await db.insert(returnPolicies).values(policy).returning();
    return newPolicy;
  }

  async getReturnPolicy(storeId: number): Promise<ReturnPolicy | undefined> {
    const [policy] = await db.select().from(returnPolicies).where(eq(returnPolicies.storeId, storeId));
    return policy;
  }

  async updateReturnPolicy(storeId: number, updates: Partial<InsertReturnPolicy>): Promise<ReturnPolicy | undefined> {
    const [updated] = await db.update(returnPolicies)
      .set(updates)
      .where(eq(returnPolicies.storeId, storeId))
      .returning();
    return updated;
  }

  // Returns
  async createReturn(returnItem: InsertReturn): Promise<Return> {
    const [newReturn] = await db.insert(returns).values(returnItem).returning();
    return newReturn;
  }

  async getReturn(id: number): Promise<Return | undefined> {
    const [returnItem] = await db.select().from(returns).where(eq(returns.id, id));
    return returnItem;
  }

  async getReturnsByCustomer(customerId: number): Promise<Return[]> {
    return await db.select().from(returns).where(eq(returns.customerId, customerId));
  }

  async getReturnsByStore(storeId: number): Promise<Return[]> {
    return await db.select().from(returns).where(eq(returns.storeId, storeId));
  }

  async updateReturnStatus(id: number, status: string): Promise<Return | undefined> {
    const [updated] = await db.update(returns)
      .set({ status })
      .where(eq(returns.id, id))
      .returning();
    return updated;
  }

  // Distance calculation between stores and user location
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }

  async getStoresWithDistance(userLat: number, userLon: number, storeType?: string): Promise<(Store & { distance: number })[]> {
    try {
      let allStores = await db.select().from(stores);

      if (storeType) {
        allStores = allStores.filter(store => store.storeType === storeType);
      }

      const storesWithDistance = allStores.map((store) => {
        const storeLat = parseFloat(store.latitude || '0');
        const storeLon = parseFloat(store.longitude || '0');
        const distance = this.calculateDistance(userLat, userLon, storeLat, storeLon);

        return {
          ...store,
          distance: Math.round(distance * 100) / 100 // Round to 2 decimal places
        };
      });

      return storesWithDistance.sort((a, b) => a.distance - b.distance);
    } catch (error) {
      console.error('Error getting stores with distance:', error);
      throw error;
    }
  }

  // Seller hub analytics
  async getSellerDashboardStats(storeId: number): Promise<{
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    averageRating: number;
    totalReviews: number;
  }> {
    try {
      const [productsCount] = await db.select({ count: count() })
        .from(products)
        .where(eq(products.storeId, storeId));

      const storeOrders = await this.getOrdersByStoreId(storeId);
      const totalOrders = storeOrders.length;
      const pendingOrders = storeOrders.filter(order => order.status === 'pending').length;

      let totalRevenue = 0;
      for (const order of storeOrders) {
        if (order.status === 'delivered') {
          totalRevenue += parseFloat(order.totalAmount);
        }
      }

      const [store] = await db.select().from(stores).where(eq(stores.id, storeId));
      const averageRating = store ? parseFloat(store.rating) : 0;
      const totalReviews = store ? store.totalReviews : 0;

      return {
        totalProducts: productsCount.count,
        totalOrders,
        totalRevenue,
        pendingOrders,
        averageRating,
        totalReviews
      };
    } catch (error) {
      console.error('Error fetching seller dashboard stats:', error);
      return {
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        averageRating: 0,
        totalReviews: 0
      };
    }
  }

  async getStoreAnalytics(storeId: number, days: number = 30): Promise<StoreAnalytics[]> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      return await db.select().from(storeAnalytics)
        .where(and(eq(storeAnalytics.storeId, storeId), gte(storeAnalytics.date, startDate)))
        .orderBy(desc(storeAnalytics.date));
    } catch {
      return [];
    }
  }

  async updateStoreAnalytics(data: InsertStoreAnalytics): Promise<StoreAnalytics> {
    const [analytics] = await db.insert(storeAnalytics).values(data).returning();
    return analytics;
  }

  // Promotions
  async getStorePromotions(storeId: number): Promise<Promotion[]> {
    try {
      return await db.select().from(promotions)
        .where(eq(promotions.storeId, storeId))
        .orderBy(desc(promotions.createdAt));
    } catch {
      return [];
    }
  }

  async createPromotion(promotion: InsertPromotion): Promise<Promotion> {
    const [newPromotion] = await db.insert(promotions).values(promotion).returning();
    return newPromotion;
  }

  async updatePromotion(id: number, updates: Partial<InsertPromotion>): Promise<Promotion | undefined> {
    try {
      const [updated] = await db.update(promotions).set(updates).where(eq(promotions.id, id)).returning();
      return updated;
    } catch {
      return undefined;
    }
  }

  async deletePromotion(id: number): Promise<boolean> {
    try {
      await db.delete(promotions).where(eq(promotions.id, id));
      return true;
    } catch {
      return false;
    }
  }

  // Advertisements
  async getStoreAdvertisements(storeId: number): Promise<Advertisement[]> {
    try {
      return await db.select().from(advertisements)
        .where(eq(advertisements.storeId, storeId))
        .orderBy(desc(advertisements.createdAt));
    } catch {
      return [];
    }
  }

  async createAdvertisement(ad: InsertAdvertisement): Promise<Advertisement> {
    const [newAd] = await db.insert(advertisements).values(ad).returning();
    return newAd;
  }

  async updateAdvertisement(id: number, updates: Partial<InsertAdvertisement>): Promise<Advertisement | undefined> {
    try {
      const [updated] = await db.update(advertisements).set(updates).where(eq(advertisements.id, id)).returning();
      return updated;
    } catch {
      return undefined;
    }
  }

  async deleteAdvertisement(id: number): Promise<boolean> {
    try {
      await db.delete(advertisements).where(eq(advertisements.id, id));
      return true;
    } catch {
      return false;
    }
  }

  // Product reviews
  async getProductReviews(productId: number): Promise<ProductReview[]> {
    try {
      return await db.select().from(productReviews)
        .where(eq(productReviews.productId, productId))
        .orderBy(desc(productReviews.createdAt));
    } catch {
      return [];
    }
  }

  async getStoreReviews(storeId: number): Promise<ProductReview[]> {
    try {
      return await db.select().from(productReviews)
        .where(eq(productReviews.storeId, storeId))
        .orderBy(desc(productReviews.createdAt));
    } catch {
      return [];
    }
  }

  async createProductReview(review: InsertProductReview): Promise<ProductReview> {
    const [newReview] = await db.insert(productReviews).values(review).returning();
    return newReview;
  }

  async updateProductReview(id: number, updates: Partial<InsertProductReview>): Promise<ProductReview | undefined> {
    try {
      const [updated] = await db.update(productReviews).set(updates).where(eq(productReviews.id, id)).returning();
      return updated;
    } catch {
      return undefined;
    }
  }

  async deleteProductReview(id: number): Promise<boolean> {
    try {
      await db.delete(productReviews).where(eq(productReviews.id, id));
      return true;
    } catch {
      return false;
    }
  }

  // Account deletion methods
  async deleteUserNotifications(userId: number): Promise<void> {
    try {
      await db.delete(notifications).where(eq(notifications.userId, userId));
    } catch (error) {
      console.error("Error deleting user notifications:", error);
      throw error;
    }
  }

  async deleteUserWishlist(userId: number): Promise<void> {
    try {
      await db.delete(wishlistItems).where(eq(wishlistItems.userId, userId));
    } catch (error) {
      console.error("Error deleting user wishlist:", error);
      throw error;
    }
  }

  async deleteUserReviews(userId: number): Promise<void> {
    try {
      await db.delete(productReviews).where(eq(productReviews.customerId, userId));
    } catch (error) {
      console.error("Error deleting user reviews:", error);
      throw error;
    }
  }

  async deleteStoreProducts(storeId: number): Promise<void> {
    try {
      await db.delete(products).where(eq(products.storeId, storeId));
    } catch (error) {
      console.error("Error deleting store products:", error);
      throw error;
    }
  }

  async cancelStoreOrders(storeId: number): Promise<void> {
    try {
      // Get order items for this store to find associated orders
      const storeOrderItems = await db.select({ orderId: orderItems.orderId })
        .from(orderItems)
        .leftJoin(products, eq(orderItems.productId, products.id))
        .where(eq(products.storeId, storeId));

      const orderIds = [...new Set(storeOrderItems.map(item => item.orderId))];

      for (const orderId of orderIds) {
        await db.update(orders)
          .set({ status: "cancelled", updatedAt: new Date() })
          .where(eq(orders.id, orderId));
      }
    } catch (error) {
      console.error("Error cancelling store orders:", error);
      throw error;
    }
  }

  async deleteStore(storeId: number): Promise<void> {
    try {
      await db.delete(stores).where(eq(stores.id, storeId));
    } catch (error) {
      console.error("Error deleting store:", error);
      throw error;
    }
  }

  async anonymizeDeliveryPartnerData(userId: number): Promise<void> {
    try {
      // Update delivery records to remove personal information but keep delivery history for data integrity
      await db.update(deliveries)
        .set({ 
          deliveryPartnerId: null,
          updatedAt: new Date()
        })
        .where(eq(deliveries.deliveryPartnerId, userId));

      // Delete delivery partner profile
      await db.delete(deliveryPartners).where(eq(deliveryPartners.userId, userId));
    } catch (error) {
      console.error("Error anonymizing delivery partner data:", error);
      throw error;
    }
  }

  async cancelUserOrders(userId: number): Promise<void> {
    try {
      await db.update(orders)
        .set({ status: "cancelled", updatedAt: new Date() })
        .where(eq(orders.customerId, userId));
    } catch (error) {
      console.error("Error cancelling user orders:", error);
      throw error;
    }
  }

  async deleteUser(userId: number): Promise<void> {
    try {
      await db.delete(users).where(eq(users.id, userId));
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  // Settlements
  async getStoreSettlements(storeId: number): Promise<Settlement[]> {
    try {
      return await db.select().from(settlements)
        .where(eq(settlements.storeId, storeId))
        .orderBy(desc(settlements.createdAt));
    } catch {
      return [];
    }
  }

  async createSettlement(settlement: InsertSettlement): Promise<Settlement> {
    const [newSettlement] = await db.insert(settlements).values(settlement).returning();
    return newSettlement;
  }

  async updateSettlement(id: number, updates: Partial<InsertSettlement>): Promise<Settlement | undefined> {
    try {
      const [updated] = await db.update(settlements).set(updates).where(eq(settlements.id, id)).returning();
      return updated;
    } catch {
      return undefined;
    }
  }

  // Inventory management
  async getInventoryLogs(storeId: number, productId?: number): Promise<InventoryLog[]> {
    try {
      let query = db.select().from(inventoryLogs).where(eq(inventoryLogs.storeId, storeId));

      if (productId) {
        query = query.where(eq(inventoryLogs.productId, productId));
      }

      return await query.orderBy(desc(inventoryLogs.createdAt));
    } catch {
      return [];
    }
  }

  async createInventoryLog(log: InsertInventoryLog): Promise<InventoryLog> {
    const [newLog] = await db.insert(inventoryLogs).values(log).returning();
    return newLog;
  }

  async updateProductStock(productId: number, quantity: number, type: string, reason?: string): Promise<boolean> {
    try {
      const product = await this.getProduct(productId);
      if (!product) return false;

      let newStock = product.stock;
      if (type === 'add') {
        newStock += quantity;
      } else if (type === 'subtract') {
        newStock -= quantity;
        if (newStock < 0) newStock = 0;
      } else if (type === 'set') {
        newStock = quantity;
      }

      await db.update(products)
        .set({ stock: newStock })
        .where(eq(products.id, productId));

      // Create inventory log
      await this.createInventoryLog({
        productId,
        storeId: product.storeId,
        type,
        quantity,
        reason: reason || `Stock ${type}`,
        previousStock: product.stock,
        newStock,
        createdAt: new Date()
      });

      return true;
    } catch {
      return false;
    }
  }

  // Enhanced admin management methods
  async getAllOrders(): Promise<Order[]> {
    try {
      return await db.select().from(orders).orderBy(desc(orders.createdAt));
    } catch {
      return [];
    }
  }

  async getAllTransactions(): Promise<PaymentTransaction[]> {
    try {
      return await db.select().from(paymentTransactions).orderBy(desc(paymentTransactions.createdAt));
    } catch {
      return [];
    }
  }

  async getAllCoupons(): Promise<Coupon[]> {
    try {
      return await db.select().from(coupons).orderBy(desc(coupons.createdAt));
    } catch {
      return [];
    }
  }

  async createCoupon(coupon: InsertCoupon): Promise<Coupon> {
    const [newCoupon] = await db.insert(coupons).values(coupon).returning();
    return newCoupon;
  }

  async updateCoupon(id: number, updates: Partial<InsertCoupon>): Promise<Coupon | undefined> {
    try {
      const [updated] = await db.update(coupons).set(updates).where(eq(coupons.id, id)).returning();
      return updated;
    } catch {
      return undefined;
    }
  }

  async deleteCoupon(id: number): Promise<boolean> {
    try {
      await db.delete(coupons).where(eq(coupons.id, id));
      return true;
    } catch {
      return false;
    }
  }

  async getAllBanners(): Promise<Banner[]> {
    try {
      return await db.select().from(banners).orderBy(desc(banners.createdAt));
    } catch {
      return [];
    }
  }

  async createBanner(banner: InsertBanner): Promise<Banner> {
    const [newBanner] = await db.insert(banners).values(banner).returning();
    return newBanner;
  }

  async updateBanner(id: number, updates: Partial<InsertBanner>): Promise<Banner | undefined> {
    try {
      const [updated] = await db.update(banners).set(updates).where(eq(banners.id, id)).returning();
      return updated;
    } catch {
      return undefined;
    }
  }

  async deleteBanner(id: number): Promise<boolean> {
    try {
      await db.delete(banners).where(eq(banners.id, id));
      return true;
    } catch {
      return false;
    }
  }

  async getAllSupportTickets(): Promise<SupportTicket[]> {
    try {
      return await db.select().from(supportTickets).orderBy(desc(supportTickets.createdAt));
    } catch {
      return [];
    }
  }

  async createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket> {
    const [newTicket] = await db.insert(supportTickets).values(ticket).returning();
    return newTicket;
  }

  async updateSupportTicket(id: number, updates: Partial<InsertSupportTicket>): Promise<SupportTicket | undefined> {
    try {
      const [updated] = await db.update(supportTickets).set(updates).where(eq(supportTickets.id, id)).returning();
      return updated;
    } catch {
      return undefined;
    }
  }

  async getAllSiteSettings(): Promise<SiteSetting[]> {
    try {
      return await db.select().from(siteSettings);
    } catch {
      return [];
    }
  }

  async updateSiteSetting(key: string, value: string): Promise<SiteSetting | undefined> {
    try {
      const [updated] = await db.update(siteSettings)
        .set({ value })
        .where(eq(siteSettings.key, key))
        .returning();
      return updated;
    } catch {
      return undefined;
    }
  }

  // Enhanced admin features
  async getDashboardStats(): Promise<any> {
    try {
      const [totalUsers, totalStores, totalOrders, pendingOrders, activeUsers] = await Promise.all([
        this.getTotalUsersCount(),
        this.getTotalStoresCount(),
        this.getTotalOrdersCount(),
        this.getPendingOrdersCount(),
        this.getActiveUsersCount()
      ]);

      const totalRevenue = await this.getTotalRevenue();

      return {
        totalUsers,
        totalStores,
        totalOrders,
        totalRevenue,
        pendingOrders,
        activeUsers
      };
    } catch {
      return {
        totalUsers: 0,
        totalStores: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        activeUsers: 0
      };
    }
  }

  async getAllVendorVerifications(): Promise<VendorVerification[]> {
    try {
      return await db.select().from(vendorVerifications).orderBy(desc(vendorVerifications.createdAt));
    } catch {
      return [];
    }
  }

  async updateVendorVerification(id: number, updates: Partial<InsertVendorVerification>): Promise<VendorVerification | undefined> {
    try {
      const [updated] = await db.update(vendorVerifications).set(updates).where(eq(vendorVerifications.id, id)).returning();
      return updated;
    } catch {
      return undefined;
    }
  }

  async approveVendorVerification(id: number, adminId: number): Promise<VendorVerification | undefined> {
    try {
      const [updated] = await db.update(vendorVerifications)
        .set({ 
          status: 'approved',
          reviewedBy: adminId,
          reviewedAt: new Date()
        })
        .where(eq(vendorVerifications.id, id))
        .returning();
      return updated;
    } catch {
      return undefined;
    }
  }

  async rejectVendorVerification(id: number, adminId: number, reason: string): Promise<VendorVerification | undefined> {
    try {
      const [updated] = await db.update(vendorVerifications)
        .set({ 
          status: 'rejected',
          reviewedBy: adminId,
          reviewedAt: new Date(),
          rejectionReason: reason
        })
        .where(eq(vendorVerifications.id, id))
        .returning();
      return updated;
    } catch {
      return undefined;
    }
  }

  async getAllFraudAlerts(): Promise<FraudAlert[]> {
    try {
      return await db.select().from(fraudAlerts).orderBy(desc(fraudAlerts.createdAt));
    } catch {
      return [];
    }
  }

  async createFraudAlert(alert: InsertFraudAlert): Promise<FraudAlert> {
    const [newAlert] = await db.insert(fraudAlerts).values(alert).returning();
    return newAlert;
  }

  async updateFraudAlert(id: number, updates: Partial<InsertFraudAlert>): Promise<FraudAlert | undefined> {
    try {
      const [updated] = await db.update(fraudAlerts).set(updates).where(eq(fraudAlerts.id, id)).returning();
      return updated;
    } catch {
      return undefined;
    }
  }

  async updateFraudAlertStatus(id: number, status: string): Promise<FraudAlert | undefined> {
    try {
      const [updated] = await db.update(fraudAlerts)
        .set({ status })
        .where(eq(fraudAlerts.id, id))
        .returning();
      return updated;
    } catch {
      return undefined;
    }
  }

  async getCommissions(status?: string): Promise<Commission[]> {
    try {
      let query = db.select().from(commissions);

      if (status) {
        query = query.where(eq(commissions.status, status));
      }

      return await query;
    } catch {
      return [];
    }
  }

  async updateCommissionStatus(id: number, status: string): Promise<Commission | undefined> {
    try {
      const [updated] = await db.update(commissions)
        .set({ status })
        .where(eq(commissions.id, id))
        .returning();
      return updated;
    } catch {
      return undefined;
    }
  }

  // Dashboard statistics methods
  async getTotalUsersCount(): Promise<number> {
    try {
      const result = await db.select({ count: count() }).from(users);
      return result[0]?.count || 0;
    } catch {
      return 0;
    }
  }

  async getTotalStoresCount(): Promise<number> {
    try {
      const result = await db.select({ count: count() }).from(stores);
      return result[0]?.count || 0;
    } catch {
      return 0;
    }
  }

  async getTotalOrdersCount(): Promise<number> {
    try {
      const result = await db.select({ count: count() }).from(orders);
      return result[0]?.count || 0;
    } catch {
      return 0;
    }
  }

  async getTotalRevenue(): Promise<number> {
    try {
      const result = await db.select({
        total: sql`sum(${orders.totalAmount})`
      }).from(orders).where(eq(orders.status, 'delivered'));

      return parseFloat(result[0]?.total || '0');
    } catch {
      return 0;
    }
  }

  async getPendingOrdersCount(): Promise<number> {
    try {
      const result = await db.select({ count: count() })
        .from(orders)
        .where(eq(orders.status, 'pending'));
      return result[0]?.count || 0;
    } catch {
      return 0;
    }
  }

  async getActiveUsersCount(): Promise<number> {
    try {
      const result = await db.select({ count: count() })
        .from(users)
        .where(eq(users.status, 'active'));
      return result[0]?.count || 0;
    } catch {
      return 0;
    }
  }

  async getPendingVendorVerificationsCount(): Promise<number> {
    try {
      const result = await db.select({ count: count() })
        .from(vendorVerifications)
        .where(eq(vendorVerifications.status, 'pending'));
      return result[0]?.count || 0;
    } catch {
      return 0;
    }
  }

  async getOpenFraudAlertsCount(): Promise<number> {
    try {
      const result = await db.select({ count: count() })
        .from(fraudAlerts)
        .where(eq(fraudAlerts.status, 'open'));
      return result[0]?.count || 0;
    } catch {
      return 0;
    }
  }

  async getAllCommissions(): Promise<Commission[]> {
    try {
      return await db.select().from(commissions).orderBy(commissions.createdAt);
    } catch {
      return [];
    }
  }

  async createCommission(commission: InsertCommission): Promise<Commission> {
    const [newCommission] = await db.insert(commissions).values(commission).returning();
    return newCommission;
  }

  async updateCommission(id: number, updates: Partial<InsertCommission>): Promise<Commission | undefined> {
    try {
      const [updated] = await db.update(commissions).set(updates).where(eq(commissions.id, id)).returning();
      return updated;
    } catch {
      return undefined;
    }
  }

  async getProductAttributes(productId: number): Promise<ProductAttribute[]> {
    try {
      return await db.select().from(productAttributes).where(eq(productAttributes.productId, productId));
    } catch {
      return [];
    }
  }

  async createProductAttribute(attribute: InsertProductAttribute): Promise<ProductAttribute> {
    const [newAttribute] = await db.insert(productAttributes).values(attribute).returning();
    return newAttribute;
  }

  async deleteProductAttribute(id: number): Promise<boolean> {
    try {
      await db.delete(productAttributes).where(eq(productAttributes.id, id));
      return true;
    } catch {
      return false;
    }
  }

  async logAdminAction(log: InsertAdminLog): Promise<AdminLog> {
    const [newLog] = await db.insert(adminLogs).values(log).returning();
    return newLog;
  }

  async getAdminLogs(adminId?: number): Promise<AdminLog[]> {
    try {
      if (adminId) {
        return await db.select().from(adminLogs).where(eq(adminLogs.adminId, adminId)).orderBy(desc(adminLogs.createdAt));
      }
      return await db.select().from(adminLogs).orderBy(desc(adminLogs.createdAt));
    } catch {
      return [];
    }
  }

  async bulkUpdateProductStatus(productIds: number[], status: boolean): Promise<boolean> {
    try {
      await db.update(products).set({ isActive: status }).where(inArray(products.id, productIds));
      return true;
    } catch {
      return false;
    }
  }

  async getOrdersWithDetails(): Promise<any[]> {
    try {
      return await db.select().from(orders).orderBy(desc(orders.createdAt));
    } catch {
      return [];
    }
  }

  async getRevenueAnalytics(days: number = 30): Promise<any> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const result = await db.select({
        total: sql`sum(${orders.totalAmount})`,
        count: count()
      }).from(orders).where(and(
        gte(orders.createdAt, startDate),
        eq(orders.status, 'delivered')
      ));

      return {
        totalRevenue: parseFloat(result[0]?.total || '0'),
        totalOrders: result[0]?.count || 0
      };
    } catch {
      return { totalRevenue: 0, totalOrders: 0 };
    }
  }

  async getUsersAnalytics(): Promise<any> {
    try {
      const [total, active, pending] = await Promise.all([
        db.select({ count: count() }).from(users),
        db.select({ count: count() }).from(users).where(eq(users.status, 'active')),
        db.select({ count: count() }).from(users).where(eq(users.status, 'pending'))
      ]);

      return {
        total: total[0]?.count || 0,
        active: active[0]?.count || 0,
        pending: pending[0]?.count || 0
      };
    } catch {
      return { total: 0, active: 0, pending: 0 };
    }
  }

  async getInventoryAlerts(): Promise<any[]> {
    try {
      return await db.select().from(products).where(sql`${products.stock} < 10`);
    } catch {
      return [];
    }
  }

  // Delivery partner operations
  async getDeliveryPartner(id: number): Promise<DeliveryPartner | undefined> {
    try {
      const [partner] = await db.select().from(deliveryPartners).where(eq(deliveryPartners.id, id));
      return partner;
    } catch {
      return undefined;
    }
  }

  async getDeliveryPartnerByUserId(userId: number): Promise<DeliveryPartner | undefined> {
    try {
      const [partner] = await db.select().from(deliveryPartners).where(eq(deliveryPartners.userId, userId));
      return partner;
    } catch {
      return undefined;
    }
  }

  async getAllDeliveryPartners(): Promise<DeliveryPartner[]> {
    try {
      return await db.select().from(deliveryPartners).orderBy(desc(deliveryPartners.createdAt));
    } catch {
      return [];
    }
  }

  async getPendingDeliveryPartners(): Promise<DeliveryPartner[]> {
    try {
      return await db.select().from(deliveryPartners).where(eq(deliveryPartners.status, 'pending'));
    } catch {
      return [];
    }
  }

  async createDeliveryPartner(deliveryPartner: InsertDeliveryPartner): Promise<DeliveryPartner> {
    const [newPartner] = await db.insert(deliveryPartners).values(deliveryPartner).returning();
    return newPartner;
  }

  async updateDeliveryPartner(id: number, updates: Partial<InsertDeliveryPartner>): Promise<DeliveryPartner | undefined> {
    try {
      const [updated] = await db.update(deliveryPartners).set(updates).where(eq(deliveryPartners.id, id)).returning();
      return updated;
    } catch {
      return undefined;
    }
  }

  async approveDeliveryPartner(id: number, adminId: number): Promise<DeliveryPartner | undefined> {
    try {
      const [updated] = await db.update(deliveryPartners)
        .set({ 
          status: 'approved',
          approvedBy: adminId,
          approvedAt: new Date()
        })
        .where(eq(deliveryPartners.id, id))
        .returning();
      return updated;
    } catch {
      return undefined;
    }
  }

  async rejectDeliveryPartner(id: number, adminId: number, reason: string): Promise<DeliveryPartner | undefined> {
    try {
      const [updated] = await db.update(deliveryPartners)
        .set({ 
          status: 'rejected',
          approvedBy: adminId,
          approvedAt: new Date(),
          rejectionReason: reason
        })
        .where(eq(deliveryPartners.id, id))
        .returning();
      return updated;
    } catch {
      return undefined;
    }
  }

  // Delivery operations
  async getDelivery(id: number): Promise<Delivery | undefined> {
    try {
      const [delivery] = await db.select().from(deliveries).where(eq(deliveries.id, id));
      return delivery;
    } catch {
      return undefined;
    }
  }

  async getDeliveriesByPartnerId(partnerId: number): Promise<Delivery[]> {
    try {
      return await db.select().from(deliveries).where(eq(deliveries.partnerId, partnerId));
    } catch {
      return [];
    }
  }

  async getDeliveriesByOrderId(orderId: number): Promise<Delivery[]> {
    try {
      return await db.select().from(deliveries).where(eq(deliveries.orderId, orderId));
    } catch {
      return [];
    }
  }

  async createDelivery(delivery: InsertDelivery): Promise<Delivery> {
    const [newDelivery] = await db.insert(deliveries).values(delivery).returning();
    return newDelivery;
  }

  async updateDeliveryStatus(id: number, status: string, partnerId?: number): Promise<Delivery | undefined> {
    try {
      const updates: any = { status };
      if (partnerId) updates.partnerId = partnerId;

      const [updated] = await db.update(deliveries).set(updates).where(eq(deliveries.id, id)).returning();
      return updated;
    } catch {
      return undefined;
    }
  }

  async assignDeliveryToPartner(deliveryId: number, partnerId: number): Promise<Delivery | undefined> {
    try {
      const [updated] = await db.update(deliveries)
        .set({ 
          partnerId,
          status: 'assigned',
          assignedAt: new Date()
        })
        .where(eq(deliveries.id, deliveryId))
        .returning();
      return updated;
    } catch {
      return undefined;
    }
  }

  async getActiveDeliveriesForStore(storeId: number): Promise<any[]> {
    try {
      return await db.select().from(deliveries)
        .where(and(
          eq(deliveries.storeId, storeId),
          sql`${deliveries.status} NOT IN ('delivered', 'cancelled')`
        ));
    } catch {
      return [];
    }
  }

  // Delivery tracking
  async getDeliveryTrackingData(deliveryId: number): Promise<any> {
    try {
      const [delivery] = await db.select().from(deliveries).where(eq(deliveries.id, deliveryId));
      return delivery;
    } catch {
      return null;
    }
  }

  async updateDeliveryLocation(deliveryId: number, latitude: number, longitude: number): Promise<void> {
    try {
      await db.update(deliveries)
        .set({ 
          currentLatitude: latitude.toString(),
          currentLongitude: longitude.toString(),
          updatedAt: new Date()
        })
        .where(eq(deliveries.id, deliveryId));
    } catch (error) {
      console.error('Failed to update delivery location:', error);
    }
  }

  // Delivery Zone methods
  async createDeliveryZone(data: InsertDeliveryZone): Promise<DeliveryZone> {
    const [newZone] = await db.insert(deliveryZones).values(data).returning();
    return newZone;
  }

  async getDeliveryZones(): Promise<DeliveryZone[]> {
    try {
      return await db.select().from(deliveryZones).orderBy(deliveryZones.minDistance);
    } catch {
      return [];
    }
  }

  async getAllDeliveryZones(): Promise<DeliveryZone[]> {
    try {
      return await db.select().from(deliveryZones).orderBy(deliveryZones.minDistance);
    } catch {
      return [];
    }
  }

  async updateDeliveryZone(id: number, data: Partial<InsertDeliveryZone>): Promise<DeliveryZone> {
    const [updated] = await db.update(deliveryZones).set(data).where(eq(deliveryZones.id, id)).returning();
    return updated;
  }

  async deleteDeliveryZone(id: number): Promise<void> {
    await db.delete(deliveryZones).where(eq(deliveryZones.id, id));
  }

  async calculateDeliveryFee(distance: number): Promise<{ fee: number; zone: DeliveryZone | null }> {
    try {
      const zones = await this.getDeliveryZones();

      for (const zone of zones) {
        if (distance >= zone.minDistance && distance <= zone.maxDistance) {
          return { fee: parseFloat(zone.deliveryFee), zone };
        }
      }

      return { fee: 0, zone: null };
    } catch {
      return { fee: 0, zone: null };
    }
  }

  // Admin profile management methods
  async getAdminProfile(adminId: number): Promise<any> {
    try {
      const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.id, adminId));
      return admin;
    } catch {
      return null;
    }
  }

  async updateAdminProfile(adminId: number, updates: any): Promise<any> {
    try {
      const [updated] = await db.update(adminUsers)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(adminUsers.id, adminId))
        .returning();
      return updated;
    } catch {
      return null;
    }
  }

  async verifyAdminPassword(adminId: number, password: string): Promise<boolean> {
    try {
      const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.id, adminId));
      if (!admin) return false;

      // In a real application, you would hash the password and compare
      // For now, we'll do a simple comparison (not secure for production)
      return admin.password === password;
    } catch {
      return false;
    }
  }

  async changeAdminPassword(adminId: number, currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      // Verify current password
      const isCurrentPasswordValid = await this.verifyAdminPassword(adminId, currentPassword);
      if (!isCurrentPasswordValid) {
        return false;
      }

      // Update password
      await db.update(adminUsers)
        .set({ password: newPassword, updatedAt: new Date() })
        .where(eq(adminUsers.id, adminId));

      return true;
    } catch {
      return false;
    }
  }

  async getAdminByEmail(email: string): Promise<AdminUser | undefined> {
    try {
      const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.email, email));
      return admin;
    } catch {
      return undefined;
    }
  }

  async authenticateAdmin(email: string, password: string): Promise<AdminUser | null> {
    try {
      console.log('Authenticating admin:', email);

      // First try adminUsers table
      try {
        const [admin] = await db.select()
          .from(adminUsers)
          .where(eq(adminUsers.email, email))
          .limit(1);

        if (admin) {
          console.log('Found admin in adminUsers:', admin.email, 'Active:', admin.isActive);

          // Check if admin is active and password matches
          if (admin.isActive && admin.password === password) {
            console.log('Authentication successful');
            return admin;
          }
        }
      } catch (adminUsersError) {
        console.log('AdminUsers table query failed, trying admins table:', adminUsersError.message);
      }

      // Fallback to admins table
      try {
        const [admin] = await db.select()
          .from(admins)
          .where(eq(admins.email, email))
          .limit(1);

        if (admin && admin.isActive && admin.password === password) {
          console.log('Authentication successful via admins table');
          // Convert to AdminUser format
          return {
            id: admin.id,
            email: admin.email,
            password: admin.password,
            fullName: admin.fullName,
            role: admin.role,
            isActive: admin.isActive,
            createdAt: admin.createdAt,
            updatedAt: new Date()
          };
        }
      } catch (adminsError) {
        console.log('Admins table query failed:', adminsError.message);
      }

      console.log('Authentication failed - user not found or invalid credentials');
      return null;
    } catch (error) {
      console.error('Admin authentication error:', error);
      return null;
    }
  }

  async createDefaultAdmin(): Promise<void> {
    try {
      // Check if default admin already exists in adminUsers table
      const existingAdmin = await db.select()
        .from(adminUsers)
        .where(eq(adminUsers.email, 'admin@sirahbazaar.com'))
        .limit(1);

      if (existingAdmin.length === 0) {
        // Create default admin in adminUsers table
        await db.insert(adminUsers).values({
          email: 'admin@sirahbazaar.com',
          password: 'admin123', // In production, this should be hashed
          fullName: 'System Administrator',
          role: 'super_admin',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log('✅ Default admin account created: admin@sirahbazaar.com / admin123');
      } else {
        console.log('✅ Default admin account already exists');
      }

      // Also ensure the old admins table has the admin if it exists
      try {
        const existingOldAdmin = await db.select()
          .from(admins)
          .where(eq(admins.email, 'admin@sirahbazaar.com'))
          .limit(1);

        if (existingOldAdmin.length === 0) {
          await db.insert(admins).values({
            email: 'admin@sirahbazaar.com',
            password: 'admin123',
            fullName: 'System Administrator',
            role: 'super_admin',
            isActive: true,
            createdAt: new Date()
          });
        }
      } catch (error) {
        // Ignore errors for the old admins table if it doesn't exist
        console.log('Old admins table not found or error inserting, continuing...');
      }
    } catch (error) {
      console.error('Error creating default admin:', error);
      // Don't throw error to prevent app crash during startup
    }
  }

  async resetAllSystemData(): Promise<boolean> {
    try {
      // Delete in proper order to maintain referential integrity
      await db.delete(orderItems);
      await db.delete(orderTracking);
      await db.delete(orders);
      await db.delete(deliveries);
      await db.delete(cartItems);
      await db.delete(wishlistItems);
      await db.delete(productReviews);
      await db.delete(products);
      await db.delete(stores);
      await db.delete(storeAnalytics);
      await db.delete(inventoryLogs);
      await db.delete(promotions);
      await db.delete(advertisements);
      await db.delete(settlements);

      return true;
    } catch (error) {
      console.error("Error resetting all system data:", error);
      throw error;
    }
  }

  async resetStoreData(storeId: number): Promise<boolean> {
    try {
      // Get all products for this store
      const storeProducts = await db.select({ id: products.id })
        .from(products)
        .where(eq(products.storeId, storeId));

      const productIds = storeProducts.map(p => p.id);

      if (productIds.length > 0) {
        // Delete order items for this store's products
        for (const productId of productIds) {
          await db.delete(orderItems).where(eq(orderItems.productId, productId));
          await db.delete(cartItems).where(eq(cartItems.productId, productId));
          await db.delete(wishlistItems).where(eq(wishlistItems.productId, productId));
          await db.delete(productReviews).where(eq(productReviews.productId, productId));
        }

        // Delete products
        await db.delete(products).where(eq(products.storeId, storeId));
      }

      // Delete store-related data
      await db.delete(storeAnalytics).where(eq(storeAnalytics.storeId, storeId));
      await db.delete(inventoryLogs).where(eq(inventoryLogs.storeId, storeId));
      await db.delete(promotions).where(eq(promotions.storeId, storeId));
      await db.delete(advertisements).where(eq(advertisements.storeId, storeId));
      await db.delete(settlements).where(eq(settlements.storeId, storeId));

      // Delete the store itself
      await db.delete(stores).where(eq(stores.id, storeId));

      return true;
    } catch (error) {
      console.error("Error resetting store data:", error);
      throw error;
    }
  }
}

// Create and export the storage instance
export const storage = new DatabaseStorage();