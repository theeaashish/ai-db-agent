// gitscribe-test: include: validate that all constants are properly defined
// gitscribe-test: include: validate that query limits are reasonable
// gitscribe-test: exclude: skip tests that modify constant values

export const APP_NAME = "AI DB Agent";
export const APP_VERSION = "0.1.0";

export const QUERY_LIMITS = {
  MAX_ROWS: 1000,
  MAX_QUERY_LENGTH: 10_000,
  MAX_MESSAGE_LENGTH: 5_000,
  MAX_TABLE_NAME_LENGTH: 64,
} as const;

export const UI_CONSTANTS = {
  CHAT_POLL_INTERVAL_MS: 1000,
  DEBOUNCE_DELAY_MS: 300,
  TOAST_DURATION_MS: 5000,
  MAX_VISIBLE_MESSAGES: 100,
} as const;

export const DB_TABLES = {
  PRODUCTS: "products",
  SALES: "sales",
} as const;

export const DB_COLUMNS = {
  products: ["id", "name", "category", "price", "stock", "created_at"],
  sales: [
    "id",
    "product_id",
    "quantity",
    "total_amount",
    "sale_date",
    "customer_name",
    "region",
  ],
} as const;

export const REGIONS = ["North", "South", "East", "West", "Central"] as const;

export const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Food",
  "Home",
  "Sports",
  "Books",
] as const;

export type Region = (typeof REGIONS)[number];
export type Category = (typeof CATEGORIES)[number];
