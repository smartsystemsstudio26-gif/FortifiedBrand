/**
 * Mock Data Service for Admin Analytics & Live Sales Simulation
 */

// Preset customer names for realistic live transaction generation
const MOCK_CUSTOMERS = [
  { name: "Lethabo Mokoena", email: "lethabo.m@domain.co.za", country: "South Africa", flag: "🇿🇦" },
  { name: "Sipho Ndlovu", email: "sipho.ndlovu@gmail.com", country: "South Africa", flag: "🇿🇦" },
  { name: "Marcus Thorne", email: "m.thorne@streetwear.co.uk", country: "United Kingdom", flag: "🇬🇧" },
  { name: "Ananya Patel", email: "ananya.p@designstudio.in", country: "India", flag: "🇮🇳" },
  { name: "Kagiso Dlamini", email: "kagiso@fortified.co.za", country: "South Africa", flag: "🇿🇦" },
  { name: "Elena Rostova", email: "elena.r@fashion.de", country: "Germany", flag: "🇩🇪" },
  { name: "Thabo Bester", email: "tbester@apex.co.za", country: "South Africa", flag: "🇿🇦" },
  { name: "Jordan Hayes", email: "jordan.hayes@nyc.us", country: "United States", flag: "🇺🇸" },
  { name: "Aarav Sharma", email: "aarav.s@globalart.com", country: "United Arab Emirates", flag: "🇦🇪" },
  { name: "Zinhle Khumalo", email: "zinhle.k@creative.co.za", country: "South Africa", flag: "🇿🇦" }
];

const PAYMENT_METHODS = ["Card", "Ozow EFT", "PayFast", "Apple Pay", "Crypto"];

/**
 * Generates historical daily sales data for Recharts area/line charts
 * @param {number} days - Number of days back (e.g. 30)
 * @returns {Array<{date: string, revenue: number, orders: number, units: number, embroidered: number, printed: number}>}
 */
export function generateHistoricalSalesData(days = 30) {
  const result = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);

    // Create realistic weekly fluctuations (higher on weekends)
    const dayOfWeek = d.getDay(); // 0 = Sun, 6 = Sat
    const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.45 : 1.0;
    
    // Seeded random variation
    const baseOrders = Math.floor((Math.sin(i * 0.5) * 4 + 8) * weekendMultiplier);
    const ordersCount = Math.max(2, baseOrders);
    const avgPrice = 1950;
    const revenue = ordersCount * avgPrice + Math.floor(Math.random() * 800);
    const units = ordersCount + Math.floor(Math.random() * 4);

    const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    result.push({
      date: dateStr,
      fullDate: d.toISOString().split("T")[0],
      revenue: revenue,
      orders: ordersCount,
      units: units,
      embroidered: Math.round(revenue * 0.62),
      printed: Math.round(revenue * 0.38)
    });
  }

  return result;
}

/**
 * Generates hourly live chart data for today
 */
export function generateHourlySalesData() {
  const hours = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"];
  return hours.map((hour, idx) => {
    const base = (idx + 1) * 2300;
    const revenue = base + Math.floor(Math.random() * 1500);
    return {
      time: hour,
      revenue: revenue,
      orders: Math.floor(revenue / 1950) + 1,
      target: 8000
    };
  });
}

/**
 * Creates a single simulated live order object using current catalog
 */
export function createMockOrder(productsList = []) {
  const customer = MOCK_CUSTOMERS[Math.floor(Math.random() * MOCK_CUSTOMERS.length)];
  const paymentMethod = PAYMENT_METHODS[Math.floor(Math.random() * PAYMENT_METHODS.length)];
  const orderNum = `FTD-${Math.floor(100000 + Math.random() * 900000)}`;

  // Pick 1 to 2 products
  const selectedItems = [];
  const itemsCount = Math.random() > 0.6 ? 2 : 1;
  const defaultProduct = { id: "p1", name: "MONOLITH OVERSIZED EMBROIDERED TEE", price: 1950, category: "Embroidered Tees" };
  const availableProducts = productsList.length > 0 ? productsList : [defaultProduct];

  for (let i = 0; i < itemsCount; i++) {
    const prod = availableProducts[Math.floor(Math.random() * availableProducts.length)];
    const sizes = ["S", "M", "L", "XL"];
    const colors = prod.colors || ["Black", "White"];

    selectedItems.push({
      id: prod.id,
      name: prod.name || "MONOLITH OVERSIZED TEE",
      price: prod.price || 1950,
      category: prod.category || "Embroidered Tees",
      size: sizes[Math.floor(Math.random() * sizes.length)],
      colour: colors[Math.floor(Math.random() * colors.length)],
      quantity: 1,
      image: Array.isArray(prod.images) && prod.images.length > 0 ? prod.images[0] : null
    });
  }

  const subtotal = selectedItems.reduce((s, item) => s + item.price * item.quantity, 0);
  const isNational = customer.country === "South Africa" || customer.flag === "🇿🇦";
  const shipping = isNational ? 100 : 450;
  const total = subtotal + shipping;

  return {
    id: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    order_number: orderNum,
    customer_name: customer.name,
    customer_email: customer.email,
    customer_phone: "+27 " + Math.floor(600000000 + Math.random() * 300000000),
    shipping_address: "142 Rosebank Street, Sandton, 2196",
    country: customer.country,
    country_flag: customer.flag,
    payment_method: paymentMethod,
    status: "Processing",
    items: selectedItems,
    subtotal: subtotal,
    shipping: shipping,
    total: total,
    created_date: new Date().toISOString(),
    isMockLive: true
  };
}

/**
 * Computes summary analysis for inventory
 */
export function getInventorySummary(productsList = [], threshold = 5) {
  const totalUnits = productsList.reduce((acc, p) => acc + (p.stock || 0), 0);
  const totalValue = productsList.reduce((acc, p) => acc + (p.stock || 0) * (p.price || 0), 0);
  const lowStock = productsList.filter((p) => (p.stock || 0) > 0 && (p.stock || 0) <= threshold);
  const outOfStock = productsList.filter((p) => (p.stock || 0) === 0);
  const healthyStock = productsList.filter((p) => (p.stock || 0) > threshold);

  const categoryBreakdown = productsList.reduce((acc, p) => {
    const cat = p.category || "Uncategorized";
    if (!acc[cat]) {
      acc[cat] = { count: 0, totalUnits: 0, totalValue: 0 };
    }
    acc[cat].count += 1;
    acc[cat].totalUnits += p.stock || 0;
    acc[cat].totalValue += (p.stock || 0) * (p.price || 0);
    return acc;
  }, {});

  return {
    totalUnits,
    totalValue,
    lowStockCount: lowStock.length,
    outOfStockCount: outOfStock.length,
    healthyStockCount: healthyStock.length,
    categoryBreakdown: Object.entries(categoryBreakdown).map(([category, stat]) => ({ category, ...stat }))
  };
}
