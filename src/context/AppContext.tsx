import { createContext, useContext, useState, ReactNode } from "react";

export interface ProfileData {
  firstName: string;
  lastName: string;
  role: string;
  warehouseNumber: string;
  since: string;
  phone: string;
  email: string;
  address: string;
  company: string;
}

export type ProductStatus = "available" | "in-use" | "reserved";

export interface Product {
  id: number;
  emoji: string;
  name: string;
  category: string;
  sku: string;
  qty: number;
  price: number;
  status: ProductStatus;
  lastAction: string;
  assignedTo?: string;
  cell: string;
}

export type RevenueType = "sold" | "realization" | "passive";

export interface RevenueItem {
  id: number;
  emoji: string;
  name: string;
  type: RevenueType;
  amount: number;
  qty?: number;
  date: string;
  note?: string;
}

interface AppContextType {
  profile: ProfileData;
  setProfile: (p: ProfileData) => void;
  avatar: string | null;
  setAvatar: (a: string | null) => void;
  products: Product[];
  setProducts: (p: Product[]) => void;
  revenueItems: RevenueItem[];
  setRevenueItems: (r: RevenueItem[]) => void;
}

const defaultProfile: ProfileData = {
  firstName: "Алексей",
  lastName: "Смирнов",
  role: "Владелец склада",
  warehouseNumber: "№3",
  since: "2021",
  phone: "+7 (999) 123-45-67",
  email: "a.smirnov@mail.ru",
  address: "Москва, ул. Складская 12",
  company: "ООО «ТехноСклад»",
};

const defaultProducts: Product[] = [
  { id: 1, emoji: "🔧", name: "Дрель Makita DF333D", category: "Электроинструмент", sku: "MK-001", qty: 5, price: 8500, status: "available", lastAction: "28 мар 2026", cell: "A-01-03" },
  { id: 2, emoji: "⚡", name: "Перфоратор Bosch GBH 2-26", category: "Электроинструмент", sku: "BS-002", qty: 3, price: 15200, status: "in-use", lastAction: "27 мар 2026", assignedTo: "Иванов П.", cell: "A-01-04" },
  { id: 3, emoji: "🔩", name: "Шуруповёрт DeWalt DCD796", category: "Электроинструмент", sku: "DW-003", qty: 8, price: 12000, status: "available", lastAction: "26 мар 2026", cell: "A-02-01" },
  { id: 4, emoji: "🔥", name: "Сварочный аппарат ESAB", category: "Сварка", sku: "ES-004", qty: 2, price: 45000, status: "reserved", lastAction: "25 мар 2026", assignedTo: "Сидоров А.", cell: "B-01-02" },
  { id: 5, emoji: "💿", name: "Болгарка Metabo WB 18", category: "Электроинструмент", sku: "MT-005", qty: 6, price: 9800, status: "available", lastAction: "24 мар 2026", cell: "A-02-03" },
  { id: 6, emoji: "💨", name: "Компрессор Fubag B3600", category: "Пневматика", sku: "FB-006", qty: 1, price: 28000, status: "in-use", lastAction: "23 мар 2026", assignedTo: "Козлов В.", cell: "C-03-01" },
  { id: 7, emoji: "🔑", name: "Набор ключей Stanley", category: "Ручной инструмент", sku: "ST-007", qty: 12, price: 3200, status: "available", lastAction: "22 мар 2026", cell: "D-01-05" },
  { id: 8, emoji: "📐", name: "Лазерный уровень Bosch", category: "Измерение", sku: "BS-008", qty: 4, price: 7600, status: "available", lastAction: "21 мар 2026", cell: "D-02-02" },
  { id: 9, emoji: "🪛", name: "Набор отвёрток Wera", category: "Ручной инструмент", sku: "WR-009", qty: 15, price: 4100, status: "available", lastAction: "20 мар 2026", cell: "D-01-06" },
  { id: 10, emoji: "🔦", name: "Фонарь Fenix TK16", category: "Освещение", sku: "FN-010", qty: 7, price: 5500, status: "available", lastAction: "19 мар 2026", cell: "E-01-01" },
];

const defaultRevenue: RevenueItem[] = [
  { id: 1, emoji: "🔧", name: "Дрель Makita DF333D", type: "sold", amount: 17000, qty: 2, date: "05 мар" },
  { id: 2, emoji: "💿", name: "Болгарка Metabo WB 18", type: "sold", amount: 9800, qty: 1, date: "08 мар" },
  { id: 3, emoji: "🔩", name: "Шуруповёрт DeWalt DCD796", type: "sold", amount: 24000, qty: 2, date: "12 мар" },
  { id: 4, emoji: "🔑", name: "Набор ключей Stanley", type: "realization", amount: 15600, qty: 3, date: "14 мар", note: "Реализация через партнёра" },
  { id: 5, emoji: "📐", name: "Лазерный уровень Bosch", type: "realization", amount: 18900, qty: 3, date: "17 мар", note: "Под реализацию" },
  { id: 6, emoji: "💨", name: "Компрессор Fubag B3600", type: "passive", amount: 8400, date: "01–28 мар", note: "Аренда · 28 дней × 300 ₽" },
  { id: 7, emoji: "⚡", name: "Перфоратор Bosch GBH", type: "passive", amount: 12600, date: "03–28 мар", note: "Лизинг · 25 дней × 504 ₽" },
  { id: 8, emoji: "🔥", name: "Сварочный аппарат ESAB", type: "passive", amount: 22000, date: "10–28 мар", note: "Аренда · 18 дней × 1 222 ₽" },
  { id: 9, emoji: "🔦", name: "Фонарь Fenix TK16 (×4)", type: "passive", amount: 6400, date: "15–28 мар", note: "Аренда · 13 дней × 492 ₽" },
  { id: 10, emoji: "🪛", name: "Набор отвёрток Wera", type: "realization", amount: 7800, qty: 2, date: "22 мар", note: "Реализация" },
];

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [revenueItems, setRevenueItems] = useState<RevenueItem[]>(defaultRevenue);

  return (
    <AppContext.Provider value={{ profile, setProfile, avatar, setAvatar, products, setProducts, revenueItems, setRevenueItems }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used inside AppProvider");
  return ctx;
}