/**
 * SQLite Local Database Schema Definition for Offline-First Mobile Client
 */
export const SQLITE_INIT_TABLES = `
CREATE TABLE IF NOT EXISTS wallets (
  id TEXT PRIMARY KEY NOT NULL,
  family_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  initial_balance REAL DEFAULT 0,
  current_balance REAL DEFAULT 0,
  currency TEXT DEFAULT 'IDR',
  is_active INTEGER DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY NOT NULL,
  family_id TEXT NOT NULL,
  wallet_id TEXT NOT NULL,
  category_id TEXT,
  type TEXT NOT NULL,
  amount REAL NOT NULL,
  transaction_date TEXT NOT NULL,
  description TEXT,
  attachment_url TEXT,
  is_deleted INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY NOT NULL,
  family_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  is_system INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS budgets (
  id TEXT PRIMARY KEY NOT NULL,
  family_id TEXT NOT NULL,
  category_id TEXT NOT NULL,
  period TEXT NOT NULL,
  amount_limit REAL NOT NULL,
  alert_threshold REAL DEFAULT 80,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS financial_goals (
  id TEXT PRIMARY KEY NOT NULL,
  family_id TEXT NOT NULL,
  name TEXT NOT NULL,
  target_amount REAL NOT NULL,
  current_amount REAL DEFAULT 0,
  target_date TEXT,
  status TEXT DEFAULT 'in_progress',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS debts (
  id TEXT PRIMARY KEY NOT NULL,
  family_id TEXT NOT NULL,
  person_name TEXT NOT NULL,
  type TEXT NOT NULL,
  total_amount REAL NOT NULL,
  remaining_amount REAL NOT NULL,
  due_date TEXT,
  status TEXT DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sync_queue (
  id TEXT PRIMARY KEY NOT NULL,
  entity TEXT NOT NULL,
  operation TEXT NOT NULL,
  client_timestamp TEXT NOT NULL,
  payload TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  retry_count INTEGER DEFAULT 0,
  created_at TEXT NOT NULL
);
`;
