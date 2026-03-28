import { useState } from "react";
import Icon from "@/components/ui/icon";

type Status = "available" | "in-use" | "reserved";

interface Product {
  id: number;
  name: string;
  category: string;
  sku: string;
  qty: number;
  price: number;
  status: Status;
  lastAction: string;
  assignedTo?: string;
}

const initialProducts: Product[] = [
  { id: 1, name: "Дрель Makita DF333D", category: "Электроинструмент", sku: "MK-001", qty: 5, price: 8500, status: "available", lastAction: "28 мар 2026" },
  { id: 2, name: "Перфоратор Bosch GBH 2-26", category: "Электроинструмент", sku: "BS-002", qty: 3, price: 15200, status: "in-use", lastAction: "27 мар 2026", assignedTo: "Иванов П." },
  { id: 3, name: "Шуруповёрт DeWalt DCD796", category: "Электроинструмент", sku: "DW-003", qty: 8, price: 12000, status: "available", lastAction: "26 мар 2026" },
  { id: 4, name: "Сварочный аппарат ESAB", category: "Сварка", sku: "ES-004", qty: 2, price: 45000, status: "reserved", lastAction: "25 мар 2026", assignedTo: "Сидоров А." },
  { id: 5, name: "Болгарка Metabo WB 18", category: "Электроинструмент", sku: "MT-005", qty: 6, price: 9800, status: "available", lastAction: "24 мар 2026" },
  { id: 6, name: "Компрессор Fubag B3600", category: "Пневматика", sku: "FB-006", qty: 1, price: 28000, status: "in-use", lastAction: "23 мар 2026", assignedTo: "Козлов В." },
];

const statusLabels: Record<Status, string> = {
  available: "В наличии",
  "in-use": "В использовании",
  reserved: "Зарезервирован",
};

const statusClass: Record<Status, string> = {
  available: "status-available",
  "in-use": "status-in-use",
  reserved: "status-reserved",
};

const filters = ["Все", "В наличии", "В использовании", "Зарезервирован"];

export default function TabProducts() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Все");
  const [products] = useState<Product[]>(initialProducts);

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "Все" ||
      statusLabels[p.status] === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-4 space-y-4">
      {/* Header actions */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по названию или артикулу..."
            className="w-full bg-muted/50 border border-border/50 rounded-xl pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#00e5ff]/40 transition-colors"
          />
        </div>
        <button className="glow-btn gradient-cyan-violet text-background font-medium text-sm px-4 py-2.5 rounded-xl flex items-center gap-1.5 flex-shrink-0">
          <Icon name="Plus" size={16} />
          <span>Добавить</span>
        </button>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ${
              filter === f
                ? "bg-[#00e5ff]/15 border-[#00e5ff]/40 text-[#00e5ff] font-medium"
                : "border-border/50 text-muted-foreground hover:border-border"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Summary row */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon name="Package" size={13} />
        <span>Показано {filtered.length} из {products.length} товаров</span>
      </div>

      {/* Products List */}
      <div className="space-y-2">
        {filtered.map((product, i) => (
          <div
            key={product.id}
            className="gradient-card rounded-xl p-4 hover:border-white/10 transition-all duration-200 animate-slide-up"
            style={{ animationDelay: `${i * 0.04}s` }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-sm text-foreground">{product.name}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusClass[product.status]}`}>
                    {statusLabels[product.status]}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Icon name="Tag" size={11} />
                    {product.sku}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Icon name="Layers" size={11} />
                    {product.category}
                  </span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-oswald text-base font-bold neon-text-cyan">
                  {product.price.toLocaleString("ru")} ₽
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{product.qty} шт.</p>
              </div>
            </div>

            {product.assignedTo && (
              <div className="mt-2.5 pt-2.5 border-t border-border/40 flex items-center gap-1.5">
                <Icon name="UserCheck" size={12} className="text-[#ff9100]" />
                <span className="text-xs text-[#ff9100]">У: {product.assignedTo}</span>
                <span className="text-xs text-muted-foreground ml-auto">{product.lastAction}</span>
              </div>
            )}
            {!product.assignedTo && (
              <div className="mt-2.5 pt-2.5 border-t border-border/40 flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Icon name="Clock" size={11} />
                  {product.lastAction}
                </span>
                <div className="flex items-center gap-2">
                  <button className="text-[10px] text-[#00e5ff] hover:underline">Выдать</button>
                  <button className="text-[10px] text-muted-foreground hover:text-foreground">Изменить</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
