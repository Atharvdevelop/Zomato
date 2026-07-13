import { useState, useEffect, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

interface UserData {
  id: number;
  username: string;
  email: string;
  mobile: string;
  password?: string;
  isBlocked: boolean;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface OrderData {
  id: number;
  orderId: string;
  userId: number;
  restaurantName: string;
  items: string | OrderItem[];
  totalPrice: number;
  deliveryFee: number;
  platformFee: number;
  gst: number;
  tip: number;
  grandTotal: number;
  address: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductData {
  id: number;
  productname: string;
  productdescription: string;
  productprice: number;
  productcategory: string;
  productstock: number;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'orders' | 'products'>('dashboard');
  
  // Data lists
  const [users, setUsers] = useState<UserData[]>([]);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [products, setProducts] = useState<ProductData[]>([]);
  
  // Search state
  const [userSearch, setUserSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  
  // Modals state
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  
  // Edit User Form State
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editMobile, setEditMobile] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editIsAdmin, setEditIsAdmin] = useState(false);
  const [editIsBlocked, setEditIsBlocked] = useState(false);

  // Edit Product Form State (for quick additions inside dashboard)
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodCategory, setProdCategory] = useState('Starters');
  const [prodStock, setProdStock] = useState('');
  const [prodImage, setProdImage] = useState<File | null>(null);
  const [prodMessage, setProdMessage] = useState('');
  const [prodError, setProdError] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    blockedUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    lowStockItems: 0,
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Authenticate Admin locally
    const session = localStorage.getItem("user");
    if (!session) {
      navigate('/admin-login');
      return;
    }
    const parsedUser = JSON.parse(session);
    if (!parsedUser.isAdmin) {
      navigate('/');
      return;
    }

    fetchAllData();
  }, [navigate]);

  const fetchAllData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      // 1. Fetch Users
      const userRes = await fetch(`${API_BASE_URL}/api/users/all`);
      let fetchedUsers: UserData[] = [];
      if (userRes.ok) {
        fetchedUsers = await userRes.json();
        setUsers(fetchedUsers);
      }

      // 2. Fetch Orders
      const orderRes = await fetch(`${API_BASE_URL}/api/orders/all`);
      let fetchedOrders: OrderData[] = [];
      if (orderRes.ok) {
        fetchedOrders = await orderRes.json();
        setOrders(fetchedOrders);
      }

      // 3. Fetch Products
      const productRes = await fetch(`${API_BASE_URL}/api/products/all`);
      let fetchedProducts: ProductData[] = [];
      if (productRes.ok) {
        fetchedProducts = await productRes.json();
        setProducts(fetchedProducts);
      }

      // Calculate Stats
      const totalRev = fetchedOrders
        .filter(o => o.status !== 'Cancelled')
        .reduce((sum, o) => sum + o.grandTotal, 0);

      const lowStock = fetchedProducts.filter(p => p.productstock < 10).length;

      setStats({
        totalUsers: fetchedUsers.length,
        blockedUsers: fetchedUsers.filter(u => u.isBlocked).length,
        totalOrders: fetchedOrders.length,
        totalRevenue: totalRev,
        lowStockItems: lowStock,
      });

    } catch (error) {
      console.error(error);
      setErrorMsg('Failed to synchronize data with the backend database.');
    } finally {
      setLoading(false);
    }
  };

  // User Actions
  const handleToggleBlock = async (user: UserData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...user,
          isBlocked: !user.isBlocked
        })
      });
      if (res.ok) {
        fetchAllData();
      } else {
        alert("Failed to change user block status.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenUserModal = (user: UserData) => {
    setSelectedUser(user);
    setEditUsername(user.username);
    setEditEmail(user.email);
    setEditMobile(user.mobile);
    setEditPassword(user.password || '');
    setEditIsAdmin(user.isAdmin);
    setEditIsBlocked(user.isBlocked);
    setIsUserModalOpen(true);
  };

  const handleSaveUserEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: editUsername,
          email: editEmail,
          mobile: editMobile,
          password: editPassword,
          isAdmin: editIsAdmin,
          isBlocked: editIsBlocked
        })
      });

      if (res.ok) {
        setIsUserModalOpen(false);
        setSelectedUser(null);
        fetchAllData();
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to update user details.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating user.");
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm("Are you sure you want to permanently delete this user profile?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchAllData();
      } else {
        alert("Failed to delete user.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Order Actions
  const handleOrderStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchAllData();
      } else {
        alert("Failed to change order state.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenOrderModal = (order: OrderData) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this order record?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchAllData();
      } else {
        alert("Failed to delete order.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Product Handler
  const handleAddProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodDesc || !prodPrice || !prodStock) {
      setProdMessage("Please fill in all product fields.");
      setProdError(true);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("productname", prodName);
      formData.append("productdescription", prodDesc);
      formData.append("productprice", prodPrice);
      formData.append("productcategory", prodCategory);
      formData.append("productstock", prodStock);
      if (prodImage) {
        formData.append("image", prodImage);
      }

      const res = await fetch(`${API_BASE_URL}/api/products/create`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setProdMessage("Product created successfully!");
        setProdError(false);
        setProdName('');
        setProdDesc('');
        setProdPrice('');
        setProdStock('');
        setProdImage(null);
        fetchAllData();
      } else {
        const resData = await res.json();
        setProdMessage(resData.message || "Failed to create product.");
        setProdError(true);
      }
    } catch (error) {
      console.error(error);
      setProdMessage("Network error during product creation.");
      setProdError(true);
    }
  };

  const handleQuickRestock = async (product: ProductData) => {
    const newStock = prompt(`Quick Restock ${product.productname}.\nEnter new stock quantity:`, String(product.productstock + 50));
    if (newStock === null || isNaN(Number(newStock))) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productstock: parseInt(newStock, 10) })
      });
      if (res.ok) {
        fetchAllData();
      } else {
        alert("Failed to update product stock.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickPriceChange = async (product: ProductData) => {
    const newPrice = prompt(`Quick Price update for ${product.productname}.\nEnter price (₹):`, String(product.productprice));
    if (newPrice === null || isNaN(Number(newPrice))) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productprice: parseInt(newPrice, 10) })
      });
      if (res.ok) {
        fetchAllData();
      } else {
        alert("Failed to update product price.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const parseOrderItems = (itemsField: string | OrderItem[]): OrderItem[] => {
    if (Array.isArray(itemsField)) return itemsField;
    try {
      return JSON.parse(itemsField);
    } catch (e) {
      console.error("Parse order items error:", e);
      return [];
    }
  };

  // Filter lists
  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.mobile.includes(userSearch) ||
    String(u.id) === userSearch
  );

  const filteredOrders = orders.filter(o => 
    o.orderId.toLowerCase().includes(orderSearch.toLowerCase()) ||
    String(o.userId) === orderSearch ||
    o.restaurantName.toLowerCase().includes(orderSearch.toLowerCase())
  );

  return (
    <div style={dashboardWrapper}>
      {/* Sidebar / Left Column */}
      <div style={sidebarStyle}>
        <div style={logoArea}>
          <div style={logoCircle}>🛡️</div>
          <div>
            <h2 style={sidebarTitle}>Zomato Admin</h2>
            <span style={sidebarTag}>Backoffice Console</span>
          </div>
        </div>
        
        <div style={menuListStyle}>
          <button 
            onClick={() => setActiveTab('dashboard')}
            style={activeTab === 'dashboard' ? activeMenuItem : menuItem}
          >
            📊 Analytics & Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            style={activeTab === 'users' ? activeMenuItem : menuItem}
          >
            👥 User Management
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            style={activeTab === 'orders' ? activeMenuItem : menuItem}
          >
            📦 Order Operations
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            style={activeTab === 'products' ? activeMenuItem : menuItem}
          >
            🍔 Menu & Stock Control
          </button>
        </div>

        <button 
          onClick={() => {
            localStorage.removeItem("isloggedIn");
            localStorage.removeItem("user");
            window.dispatchEvent(new Event("storage"));
            navigate('/admin-login');
          }}
          style={logoutBtn}
        >
          🚪 Admin Sign Out
        </button>
      </div>

      {/* Main Content Area */}
      <div style={mainContentArea}>
        {errorMsg && (
          <div style={alertContainer}>
            <div>⚠️ {errorMsg}</div>
            <button onClick={fetchAllData} style={retryBtn}>Force Sync</button>
          </div>
        )}

        {/* LOADING SHIM */}
        {loading && (
          <div style={loadingOverlay}>
            <div style={spinnerStyle}></div>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>Syncing with MySQL proxy...</span>
          </div>
        )}

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <h1 style={pageHeading}>Overview</h1>
              <p style={pageSubheading}>Live metrics and state logs synced from the primary database cluster.</p>
            </div>

            <div style={statsGrid}>
              <div style={statCard}>
                <div style={statHeader}>
                  <span style={statTitle}>Total Revenue</span>
                  <span style={statIcon}>💰</span>
                </div>
                <div style={statVal}>₹{stats.totalRevenue.toLocaleString()}</div>
                <div style={{ ...statDesc, color: '#10b981' }}>Cumulative order income</div>
              </div>

              <div style={statCard}>
                <div style={statHeader}>
                  <span style={statTitle}>Orders Synced</span>
                  <span style={statIcon}>📦</span>
                </div>
                <div style={statVal}>{stats.totalOrders}</div>
                <div style={statDesc}>Created checkout cycles</div>
              </div>

              <div style={statCard}>
                <div style={statHeader}>
                  <span style={statTitle}>Registrations</span>
                  <span style={statIcon}>👥</span>
                </div>
                <div style={statVal}>{stats.totalUsers}</div>
                <div style={statDesc}>{stats.blockedUsers} blocked accounts</div>
              </div>

              <div style={{ 
                ...statCard, 
                borderLeft: stats.lowStockItems > 0 ? '4px solid #ef4444' : '4px solid #10b981'
              }}>
                <div style={statHeader}>
                  <span style={statTitle}>Low Stock Items</span>
                  <span style={statIcon}>⚠️</span>
                </div>
                <div style={{ 
                  ...statVal, 
                  color: stats.lowStockItems > 0 ? '#ef4444' : '#1e293b' 
                }}>{stats.lowStockItems}</div>
                <div style={statDesc}>Products containing &lt; 10 units</div>
              </div>
            </div>

            {/* Quick Actions / Activity overview */}
            <div style={dashboardPanelGrid}>
              <div style={dashboardSectionCard}>
                <h3 style={panelTitle}>System Diagnostics</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={diagnosticLine}>
                    <span>Database Engine</span>
                    <span style={diagValue}>Sequelize / MySQL</span>
                  </div>
                  <div style={diagnosticLine}>
                    <span>API Endpoint Base</span>
                    <span style={{ ...diagValue, color: '#e23744' }}>{API_BASE_URL}</span>
                  </div>
                  <div style={diagnosticLine}>
                    <span>Environment Mode</span>
                    <span style={diagValue}>{window.location.hostname === 'localhost' ? 'Development (Local)' : 'Production (Cloud)'}</span>
                  </div>
                  <div style={diagnosticLine}>
                    <span>Client Domain</span>
                    <span style={diagValue}>{window.location.origin}</span>
                  </div>
                </div>
              </div>

              <div style={dashboardSectionCard}>
                <h3 style={panelTitle}>Recent low-stock items</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {products.filter(p => p.productstock < 10).slice(0, 4).map(p => (
                    <div key={p.id} style={lowStockRow}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{p.productname}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>Category: {p.productcategory}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={stockDangerBadge}>Stock: {p.productstock}</span>
                        <button onClick={() => handleQuickRestock(p)} style={quickActionBtn}>Restock</button>
                      </div>
                    </div>
                  ))}
                  {products.filter(p => p.productstock < 10).length === 0 && (
                    <div style={emptyDiagnostic}>
                      <span>🟢 All products are sufficiently stocked.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div>
            <div style={headerFlex}>
              <div>
                <h1 style={pageHeading}>User Registry</h1>
                <p style={pageSubheading}>Manually adjust block state, modify registration details, or delete accounts.</p>
              </div>
              <input 
                type="text" 
                placeholder="🔍 Search users (ID, Name, Mobile...)"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                style={searchBoxStyle}
              />
            </div>

            <div style={tableContainer}>
              <table style={tableStyle}>
                <thead>
                  <tr style={tableHeaderRow}>
                    <th style={thStyle}>ID</th>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Mobile</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Role</th>
                    <th style={thStyle}>Registered</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id} style={tableBodyRow}>
                      <td style={{ ...tdStyle, fontWeight: 700 }}>#{user.id}</td>
                      <td style={{ ...tdStyle, fontWeight: 600 }}>{user.username}</td>
                      <td style={tdStyle}>{user.email}</td>
                      <td style={tdStyle}>{user.mobile}</td>
                      <td style={tdStyle}>
                        <span style={user.isBlocked ? blockedBadge : activeBadge}>
                          {user.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <span style={user.isAdmin ? adminBadge : memberBadge}>
                          {user.isAdmin ? 'Admin' : 'Member'}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, color: '#64748b', fontSize: 12 }}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td style={tdStyle}>
                        <div style={actionsGroup}>
                          <button 
                            onClick={() => handleToggleBlock(user)}
                            style={user.isBlocked ? unblockBtnStyle : blockBtnStyle}
                          >
                            {user.isBlocked ? '🔓 Remove Block' : '🔒 Block'}
                          </button>
                          <button 
                            onClick={() => handleOpenUserModal(user)}
                            style={editBtnStyle}
                          >
                            ✏️ Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            style={deleteBtnStyle}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={8} style={noResultsTd}>No users found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDER OPERATIONS */}
        {activeTab === 'orders' && (
          <div>
            <div style={headerFlex}>
              <div>
                <h1 style={pageHeading}>Order Operations</h1>
                <p style={pageSubheading}>Track active carts, update live delivery status, and inspect payments.</p>
              </div>
              <input 
                type="text" 
                placeholder="🔍 Search orders (ID, User, Restaurant...)"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                style={searchBoxStyle}
              />
            </div>

            <div style={tableContainer}>
              <table style={tableStyle}>
                <thead>
                  <tr style={tableHeaderRow}>
                    <th style={thStyle}>Order ID</th>
                    <th style={thStyle}>User ID</th>
                    <th style={thStyle}>Restaurant</th>
                    <th style={thStyle}>Grand Total</th>
                    <th style={thStyle}>Method</th>
                    <th style={thStyle}>Date Placed</th>
                    <th style={thStyle}>Tracking Status</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.id} style={tableBodyRow}>
                      <td style={{ ...tdStyle, fontWeight: 700, color: '#e23744' }}>{order.orderId}</td>
                      <td style={{ ...tdStyle, fontWeight: 700 }}>#{order.userId}</td>
                      <td style={{ ...tdStyle, fontWeight: 600 }}>{order.restaurantName}</td>
                      <td style={{ ...tdStyle, fontWeight: 700 }}>₹{order.grandTotal}</td>
                      <td style={tdStyle}>{order.paymentMethod.toUpperCase()}</td>
                      <td style={{ ...tdStyle, color: '#64748b', fontSize: 12 }}>
                        {new Date(order.createdAt).toLocaleString()}
                      </td>
                      <td style={tdStyle}>
                        <select 
                          value={order.status}
                          onChange={(e) => handleOrderStatusChange(order.orderId, e.target.value)}
                          style={{
                            ...statusSelect,
                            borderColor: getStatusColor(order.status),
                            color: getStatusColor(order.status)
                          }}
                        >
                          <option value="Order Placed">Order Placed</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td style={tdStyle}>
                        <div style={actionsGroup}>
                          <button 
                            onClick={() => handleOpenOrderModal(order)}
                            style={inspectBtnStyle}
                          >
                            🔎 Inspect
                          </button>
                          <button 
                            onClick={() => handleDeleteOrder(order.orderId)}
                            style={deleteBtnStyle}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan={8} style={noResultsTd}>No orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: MENU & STOCK CONTROL */}
        {activeTab === 'products' && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <h1 style={pageHeading}>Menu & Stock Control</h1>
              <p style={pageSubheading}>Add new dishes, restock inventory items, or alter list prices manually.</p>
            </div>

            <div style={productSplitGrid}>
              {/* Form Card */}
              <div style={productFormCard}>
                <h3 style={{ ...panelTitle, marginBottom: 16 }}>Register New Dish</h3>
                {prodMessage && (
                  <div style={{
                    ...alertStyle,
                    color: prodError ? '#ef4444' : '#10b981',
                    backgroundColor: prodError ? 'rgba(239, 68, 68, 0.05)' : 'rgba(16, 185, 129, 0.05)',
                    border: `1px solid ${prodError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)'}`,
                    padding: '8px 12px',
                    borderRadius: 8,
                    fontSize: 13,
                    marginBottom: 16
                  }}>
                    {prodMessage}
                  </div>
                )}
                <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={formLabel}>Dish Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Classic Margherita Pizza"
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      style={formInput}
                      required
                    />
                  </div>
                  <div>
                    <label style={formLabel}>Description</label>
                    <textarea 
                      placeholder="Ingredients, spice level, servings..."
                      value={prodDesc}
                      onChange={(e) => setProdDesc(e.target.value)}
                      style={{ ...formInput, height: 70, resize: 'none' }}
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <label style={formLabel}>Price (₹)</label>
                      <input 
                        type="number" 
                        placeholder="299"
                        value={prodPrice}
                        onChange={(e) => setProdPrice(e.target.value)}
                        style={formInput}
                        required
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={formLabel}>Initial Stock</label>
                      <input 
                        type="number" 
                        placeholder="50"
                        value={prodStock}
                        onChange={(e) => setProdStock(e.target.value)}
                        style={formInput}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label style={formLabel}>Category</label>
                    <select 
                      value={prodCategory} 
                      onChange={(e) => setProdCategory(e.target.value)}
                      style={formInput}
                    >
                      <option value="Starters">Starters</option>
                      <option value="Main Course">Main Course</option>
                      <option value="Biryani">Biryani</option>
                      <option value="Breads">Breads</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Beverages">Beverages</option>
                      <option value="Sides">Sides</option>
                    </select>
                  </div>
                  <div>
                    <label style={formLabel}>Dish Photo</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setProdImage(e.target.files ? e.target.files[0] : null)}
                      style={{ fontSize: 12 }}
                    />
                  </div>
                  <button type="submit" style={submitProductBtn}>Save Menu Item 🍽️</button>
                </form>
              </div>

              {/* Products List Panel */}
              <div style={{ flex: 1 }}>
                <h3 style={{ ...panelTitle, marginBottom: 16 }}>Listed Menu Items ({products.length})</h3>
                <div style={productCardLayout}>
                  {products.map(p => (
                    <div key={p.id} style={productAdminCard}>
                      <img 
                        src={p.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&auto=format"} 
                        alt={p.productname} 
                        style={productCardImg}
                      />
                      <div style={{ padding: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span style={prodBadge}>{p.productcategory}</span>
                          <span style={prodCardPrice}>₹{p.productprice}</span>
                        </div>
                        <h4 style={prodCardTitle}>{p.productname}</h4>
                        
                        <div style={prodStockMeta}>
                          <span style={p.productstock < 10 ? lowStockIndicator : goodStockIndicator}>
                            Stock: {p.productstock}
                          </span>
                        </div>

                        <div style={quickAdminControls}>
                          <button onClick={() => handleQuickPriceChange(p)} style={quickControlBtn}>Edit Price</button>
                          <button onClick={() => handleQuickRestock(p)} style={quickControlBtn}>Add Stock</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: EDIT USER DETAILS */}
      {isUserModalOpen && selectedUser && (
        <div style={modalBackdrop}>
          <div style={modalContainer}>
            <div style={modalHeader}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Edit User Parameters (ID #{selectedUser.id})</h3>
              <button onClick={() => setIsUserModalOpen(false)} style={closeModalBtn}>✕</button>
            </div>
            <form onSubmit={handleSaveUserEdit} style={modalBody}>
              <div>
                <label style={formLabel}>Username</label>
                <input 
                  type="text" 
                  value={editUsername} 
                  onChange={(e) => setEditUsername(e.target.value)} 
                  style={formInput} 
                  required 
                />
              </div>
              <div>
                <label style={formLabel}>Email Address</label>
                <input 
                  type="email" 
                  value={editEmail} 
                  onChange={(e) => setEditEmail(e.target.value)} 
                  style={formInput} 
                  required 
                />
              </div>
              <div>
                <label style={formLabel}>Mobile Number</label>
                <input 
                  type="text" 
                  value={editMobile} 
                  onChange={(e) => setEditMobile(e.target.value)} 
                  style={formInput} 
                  required 
                />
              </div>
              <div>
                <label style={formLabel}>Password (Unencrypted String)</label>
                <input 
                  type="text" 
                  value={editPassword} 
                  onChange={(e) => setEditPassword(e.target.value)} 
                  style={formInput} 
                  required 
                />
              </div>
              
              <div style={{ display: 'flex', gap: 24, padding: '8px 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={editIsAdmin} 
                    onChange={(e) => setEditIsAdmin(e.target.checked)} 
                  />
                  Granted Admin Privileges
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', color: editIsBlocked ? '#ef4444' : 'inherit' }}>
                  <input 
                    type="checkbox" 
                    checked={editIsBlocked} 
                    onChange={(e) => setEditIsBlocked(e.target.checked)} 
                  />
                  Blocked Status (Account Lockout)
                </label>
              </div>

              <div style={modalFooter}>
                <button type="button" onClick={() => setIsUserModalOpen(false)} style={modalCancelBtn}>Cancel</button>
                <button type="submit" style={modalSaveBtn}>Save Parameters</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: INSPECT ORDER DETAILS */}
      {isOrderModalOpen && selectedOrder && (
        <div style={modalBackdrop}>
          <div style={{ ...modalContainer, maxWidth: 600 }}>
            <div style={modalHeader}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Inspect Order ({selectedOrder.orderId})</h3>
                <span style={{ fontSize: 12, color: '#64748b' }}>Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</span>
              </div>
              <button onClick={() => setIsOrderModalOpen(false)} style={closeModalBtn}>✕</button>
            </div>
            <div style={{ ...modalBody, gap: 20 }}>
              {/* Items Breakdown */}
              <div>
                <h4 style={modalSectionHeading}>Ordered Items</h4>
                <div style={itemsDetailsBox}>
                  {parseOrderItems(selectedOrder.items).map((item, idx) => (
                    <div key={idx} style={orderDetailItemLine}>
                      <span>{item.name} <strong style={{ color: '#64748b' }}>x{item.quantity}</strong></span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Address details */}
              <div>
                <h4 style={modalSectionHeading}>Delivery Address</h4>
                <div style={addressBox}>{selectedOrder.address}</div>
              </div>

              {/* Cost breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, borderTop: '1px solid #e2e8f0', paddingTop: 14 }}>
                <div style={orderCostRow}>
                  <span>Cart Total</span>
                  <span>₹{selectedOrder.totalPrice}</span>
                </div>
                <div style={orderCostRow}>
                  <span>Delivery Fee</span>
                  <span>₹{selectedOrder.deliveryFee}</span>
                </div>
                <div style={orderCostRow}>
                  <span>Platform Fee</span>
                  <span>₹{selectedOrder.platformFee}</span>
                </div>
                <div style={orderCostRow}>
                  <span>GST Tax (5%)</span>
                  <span>₹{selectedOrder.gst}</span>
                </div>
                <div style={orderCostRow}>
                  <span>Delivery Tip</span>
                  <span>₹{selectedOrder.tip}</span>
                </div>
                <div style={{ ...orderCostRow, fontWeight: 800, fontSize: 16, borderTop: '1.5px solid #cbd5e1', paddingTop: 8, marginTop: 4 }}>
                  <span>Grand Total Paid</span>
                  <span>₹{selectedOrder.grandTotal}</span>
                </div>
              </div>

              {/* Metadata */}
              <div style={metadataGrid}>
                <div>
                  <div style={metaLabel}>User Account ID</div>
                  <div style={metaValue}>#{selectedOrder.userId}</div>
                </div>
                <div>
                  <div style={metaLabel}>Payment Protocol</div>
                  <div style={metaValue}>{selectedOrder.paymentMethod.toUpperCase()}</div>
                </div>
                <div>
                  <div style={metaLabel}>Restaurant Anchor</div>
                  <div style={metaValue}>{selectedOrder.restaurantName}</div>
                </div>
                <div>
                  <div style={metaLabel}>Current Tracking Status</div>
                  <div style={{ ...metaValue, color: getStatusColor(selectedOrder.status), fontWeight: 700 }}>{selectedOrder.status}</div>
                </div>
              </div>

              <div style={{ ...modalFooter, borderTop: 'none', padding: 0, marginTop: 8 }}>
                <button onClick={() => setIsOrderModalOpen(false)} style={{ ...modalCancelBtn, width: '100%' }}>Close Inspector</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Color matching helper
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Order Placed': return '#f59e0b';
    case 'Preparing': return '#3b82f6';
    case 'Out for Delivery': return '#8b5cf6';
    case 'Delivered': return '#10b981';
    case 'Cancelled': return '#ef4444';
    default: return '#64748b';
  }
};

// Styling Rules (Premium enterprise design)
const dashboardWrapper: CSSProperties = {
  display: 'flex',
  minHeight: 'calc(100vh - 120px)',
  backgroundColor: '#f8fafc',
  fontFamily: 'Inter, sans-serif',
};

const sidebarStyle: CSSProperties = {
  width: '280px',
  backgroundColor: '#0f172a',
  borderRight: '1px solid #1e293b',
  padding: '28px 20px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  boxSizing: 'border-box',
};

const logoArea: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  marginBottom: 40,
};

const logoCircle: CSSProperties = {
  width: 42,
  height: 42,
  borderRadius: 12,
  backgroundColor: 'rgba(226, 55, 68, 0.15)',
  border: '1px solid rgba(226, 55, 68, 0.3)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 20,
};

const sidebarTitle: CSSProperties = {
  fontSize: 16,
  fontWeight: 800,
  color: '#ffffff',
  margin: 0,
};

const sidebarTag: CSSProperties = {
  fontSize: 11,
  color: '#64748b',
  fontWeight: 600,
};

const menuListStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  flex: 1,
};

const menuItem: CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#94a3b8',
  padding: '14px 16px',
  textAlign: 'left',
  fontSize: 14,
  fontWeight: 600,
  borderRadius: 12,
  cursor: 'pointer',
  transition: 'all 0.15s',
  width: '100%',
};

const activeMenuItem: CSSProperties = {
  ...menuItem,
  backgroundColor: '#e23744',
  color: '#ffffff',
  boxShadow: '0 4px 12px rgba(226, 55, 68, 0.25)',
};

const logoutBtn: CSSProperties = {
  background: 'none',
  border: '1.5px solid #334155',
  color: '#cbd5e1',
  borderRadius: 12,
  padding: '12px',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s',
  marginTop: 20,
};

const mainContentArea: CSSProperties = {
  flex: 1,
  padding: '40px 48px',
  boxSizing: 'border-box',
  overflowY: 'auto',
  position: 'relative',
};

const pageHeading: CSSProperties = {
  fontFamily: 'Poppins, sans-serif',
  fontWeight: 900,
  fontSize: 32,
  color: '#0f172a',
  margin: 0,
  letterSpacing: '-0.5px',
};

const pageSubheading: CSSProperties = {
  fontSize: 14,
  color: '#64748b',
  marginTop: 4,
  marginBottom: 0,
};

const statsGrid: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 24,
  marginBottom: 32,
};

const statCard: CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 16,
  padding: '24px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
};

const statHeader: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 12,
};

const statTitle: CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const statIcon: CSSProperties = {
  fontSize: 18,
};

const statVal: CSSProperties = {
  fontSize: 30,
  fontWeight: 900,
  color: '#0f172a',
  lineHeight: 1,
  marginBottom: 6,
  fontFamily: 'Poppins, sans-serif',
};

const statDesc: CSSProperties = {
  fontSize: 12,
  color: '#64748b',
  fontWeight: 500,
};

const dashboardPanelGrid: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 24,
};

const dashboardSectionCard: CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 20,
  padding: '28px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
};

const panelTitle: CSSProperties = {
  fontFamily: 'Poppins, sans-serif',
  fontWeight: 800,
  fontSize: 16,
  color: '#0f172a',
  margin: '0 0 20px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const diagnosticLine: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: 13,
  padding: '10px 0',
  borderBottom: '1px solid #f1f5f9',
};

const diagValue: CSSProperties = {
  fontWeight: 700,
  color: '#334155',
};

const lowStockRow: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 12px',
  backgroundColor: '#fffbeb',
  border: '1px solid #fef3c7',
  borderRadius: 10,
};

const stockDangerBadge: CSSProperties = {
  backgroundColor: '#fef2f2',
  color: '#ef4444',
  border: '1px solid #fecaca',
  fontSize: 11,
  fontWeight: 700,
  padding: '2px 8px',
  borderRadius: 20,
};

const quickActionBtn: CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #d97706',
  color: '#d97706',
  borderRadius: 6,
  padding: '3px 8px',
  fontSize: 11,
  fontWeight: 700,
  cursor: 'pointer',
};

const emptyDiagnostic: CSSProperties = {
  textAlign: 'center',
  padding: '24px 0',
  fontSize: 13,
  color: '#64748b',
};

const headerFlex: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  marginBottom: 28,
  flexWrap: 'wrap',
  gap: 16,
};

const searchBoxStyle: CSSProperties = {
  padding: '12px 18px',
  border: '1.5px solid #cbd5e1',
  borderRadius: 12,
  width: '320px',
  fontSize: 14,
  outline: 'none',
  fontFamily: 'inherit',
  backgroundColor: '#ffffff',
};

const tableContainer: CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: 20,
  border: '1px solid #e2e8f0',
  boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
  overflow: 'hidden',
};

const tableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  textAlign: 'left',
};

const tableHeaderRow: CSSProperties = {
  backgroundColor: '#f8fafc',
  borderBottom: '1px solid #e2e8f0',
};

const thStyle: CSSProperties = {
  padding: '16px 24px',
  fontSize: 12,
  fontWeight: 700,
  color: '#475569',
  textTransform: 'uppercase',
};

const tableBodyRow: CSSProperties = {
  borderBottom: '1px solid #f1f5f9',
  transition: 'background-color 0.15s',
};

const tdStyle: CSSProperties = {
  padding: '16px 24px',
  fontSize: 14,
  color: '#334155',
  verticalAlign: 'middle',
};

const blockedBadge: CSSProperties = {
  backgroundColor: '#fee2e2',
  color: '#ef4444',
  border: '1px solid #fecaca',
  borderRadius: 20,
  padding: '2px 8px',
  fontSize: 11,
  fontWeight: 700,
};

const activeBadge: CSSProperties = {
  backgroundColor: '#dcfce7',
  color: '#10b981',
  border: '1px solid #bbf7d0',
  borderRadius: 20,
  padding: '2px 8px',
  fontSize: 11,
  fontWeight: 700,
};

const adminBadge: CSSProperties = {
  backgroundColor: '#f3e8ff',
  color: '#9333ea',
  border: '1px solid #e9d5ff',
  borderRadius: 20,
  padding: '2px 8px',
  fontSize: 11,
  fontWeight: 700,
};

const memberBadge: CSSProperties = {
  backgroundColor: '#f1f5f9',
  color: '#64748b',
  border: '1px solid #e2e8f0',
  borderRadius: 20,
  padding: '2px 8px',
  fontSize: 11,
  fontWeight: 700,
};

const actionsGroup: CSSProperties = {
  display: 'flex',
  gap: 8,
};

const blockBtnStyle: CSSProperties = {
  backgroundColor: '#f8fafc',
  border: '1px solid #ef4444',
  color: '#ef4444',
  borderRadius: 8,
  padding: '6px 12px',
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
};

const unblockBtnStyle: CSSProperties = {
  backgroundColor: '#f8fafc',
  border: '1px solid #10b981',
  color: '#10b981',
  borderRadius: 8,
  padding: '6px 12px',
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
};

const editBtnStyle: CSSProperties = {
  backgroundColor: '#3b82f6',
  border: 'none',
  color: '#ffffff',
  borderRadius: 8,
  padding: '6px 12px',
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
};

const inspectBtnStyle: CSSProperties = {
  backgroundColor: '#0f172a',
  border: 'none',
  color: '#ffffff',
  borderRadius: 8,
  padding: '6px 12px',
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
};

const deleteBtnStyle: CSSProperties = {
  backgroundColor: '#fee2e2',
  border: 'none',
  color: '#ef4444',
  borderRadius: 8,
  padding: '6px 10px',
  fontSize: 12,
  cursor: 'pointer',
};

const noResultsTd: CSSProperties = {
  textAlign: 'center',
  padding: '48px',
  color: '#64748b',
  fontWeight: 500,
};

const statusSelect: CSSProperties = {
  borderWidth: '1.5px',
  borderStyle: 'solid',
  borderRadius: 10,
  padding: '6px 12px',
  fontSize: 13,
  fontWeight: 700,
  outline: 'none',
  cursor: 'pointer',
  backgroundColor: '#ffffff',
};

const productSplitGrid: CSSProperties = {
  display: 'flex',
  gap: 32,
  alignItems: 'flex-start',
  flexWrap: 'wrap',
};

const productFormCard: CSSProperties = {
  width: '360px',
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 20,
  padding: '24px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
  boxSizing: 'border-box',
  flexShrink: 0,
};

const formLabel: CSSProperties = {
  display: 'block',
  fontSize: 11,
  fontWeight: 700,
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: 6,
};

const formInput: CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  border: '1.5px solid #cbd5e1',
  borderRadius: 8,
  fontSize: 14,
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
  backgroundColor: '#f8fafc',
};

const submitProductBtn: CSSProperties = {
  width: '100%',
  backgroundColor: '#e23744',
  color: '#ffffff',
  padding: '12px',
  borderRadius: 8,
  border: 'none',
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'inherit',
  marginTop: 8,
  boxShadow: '0 4px 12px rgba(226,55,68,0.2)',
};

const productCardLayout: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
  gap: 16,
};

const productAdminCard: CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: 16,
  border: '1px solid #e2e8f0',
  overflow: 'hidden',
  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
  display: 'flex',
  flexDirection: 'column',
};

const productCardImg: CSSProperties = {
  width: '100%',
  height: '110px',
  objectFit: 'cover',
};

const prodBadge: CSSProperties = {
  backgroundColor: '#f1f5f9',
  color: '#475569',
  fontSize: 10,
  fontWeight: 700,
  padding: '2px 8px',
  borderRadius: 20,
};

const prodCardPrice: CSSProperties = {
  fontWeight: 800,
  color: '#e23744',
  fontSize: 14,
};

const prodCardTitle: CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  margin: '8px 0 4px',
  color: '#0f172a',
  height: '18px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const prodStockMeta: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: 11,
  fontWeight: 600,
  marginTop: 6,
  marginBottom: 12,
};

const lowStockIndicator: CSSProperties = {
  color: '#ef4444',
};

const goodStockIndicator: CSSProperties = {
  color: '#10b981',
};

const quickAdminControls: CSSProperties = {
  display: 'flex',
  gap: 6,
  borderTop: '1px solid #f1f5f9',
  paddingTop: 10,
};

const quickControlBtn: CSSProperties = {
  flex: 1,
  backgroundColor: '#f8fafc',
  border: '1.5px solid #cbd5e1',
  color: '#475569',
  borderRadius: 6,
  padding: '4px 0',
  fontSize: 10,
  fontWeight: 700,
  cursor: 'pointer',
};

const alertStyle: CSSProperties = {
  padding: '12px',
  borderRadius: 10,
  fontSize: 13,
  fontWeight: 500,
  lineHeight: 1.5,
};

const modalBackdrop: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(15, 23, 42, 0.45)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContainer: CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: 20,
  width: '100%',
  maxWidth: '480px',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  overflow: 'hidden',
  boxSizing: 'border-box',
};

const modalHeader: CSSProperties = {
  padding: '20px 24px',
  borderBottom: '1px solid #e2e8f0',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const closeModalBtn: CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: 16,
  color: '#64748b',
  cursor: 'pointer',
};

const modalBody: CSSProperties = {
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  maxHeight: '70vh',
  overflowY: 'auto',
};

const modalFooter: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 12,
  paddingTop: 16,
  borderTop: '1px solid #e2e8f0',
};

const modalCancelBtn: CSSProperties = {
  backgroundColor: '#f1f5f9',
  border: 'none',
  color: '#475569',
  padding: '10px 18px',
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
};

const modalSaveBtn: CSSProperties = {
  backgroundColor: '#e23744',
  border: 'none',
  color: '#ffffff',
  padding: '10px 18px',
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
};

const modalSectionHeading: CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  margin: '0 0 10px',
};

const itemsDetailsBox: CSSProperties = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: 12,
  padding: '14px 18px',
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
};

const orderDetailItemLine: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: 14,
  color: '#334155',
};

const addressBox: CSSProperties = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: 12,
  padding: '14px 18px',
  fontSize: 13,
  color: '#475569',
  lineHeight: 1.5,
};

const orderCostRow: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: 13,
  color: '#475569',
};

const metadataGrid: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 16,
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: 12,
  padding: '16px',
};

const metaLabel: CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  color: '#64748b',
  textTransform: 'uppercase',
  marginBottom: 2,
};

const metaValue: CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: '#334155',
};

const alertContainer: CSSProperties = {
  backgroundColor: '#fee2e2',
  color: '#b91c1c',
  border: '1px solid #fca5a5',
  borderRadius: 12,
  padding: '12px 20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 24,
  fontSize: 14,
};

const retryBtn: CSSProperties = {
  backgroundColor: '#b91c1c',
  color: '#ffffff',
  border: 'none',
  borderRadius: 8,
  padding: '6px 12px',
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
};

const loadingOverlay: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 12,
  zIndex: 10,
};

const spinnerStyle: CSSProperties = {
  width: 32,
  height: 32,
  border: '3px solid #cbd5e1',
  borderTopColor: '#e23744',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
};
