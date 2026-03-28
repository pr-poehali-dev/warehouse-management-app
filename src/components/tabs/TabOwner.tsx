import { useState } from "react";
import Icon from "@/components/ui/icon";

interface StockItem {
  id: number;
  emoji: string;
  name: string;
  qty: number;
  cell: string;
  category: string;
  status: "available" | "in-use" | "reserved";
}

const stockItems: StockItem[] = [
  { id: 1, emoji: "🔧", name: "Дрель Makita DF333D", qty: 5, cell: "A-01-03", category: "Электроинструмент", status: "available" },
  { id: 2, emoji: "⚡", name: "Перфоратор Bosch GBH 2-26", qty: 3, cell: "A-01-04", category: "Электроинструмент", status: "in-use" },
  { id: 3, emoji: "🔩", name: "Шуруповёрт DeWalt DCD796", qty: 8, cell: "A-02-01", category: "Электроинструмент", status: "available" },
  { id: 4, emoji: "🔥", name: "Сварочный аппарат ESAB", qty: 2, cell: "B-01-02", category: "Сварка", status: "reserved" },
  { id: 5, emoji: "💿", name: "Болгарка Metabo WB 18", qty: 6, cell: "A-02-03", category: "Электроинструмент", status: "available" },
  { id: 6, emoji: "💨", name: "Компрессор Fubag B3600", qty: 1, cell: "C-03-01", category: "Пневматика", status: "in-use" },
  { id: 7, emoji: "🔑", name: "Набор ключей Stanley", qty: 12, cell: "D-01-05", category: "Ручной инструмент", status: "available" },
  { id: 8, emoji: "📐", name: "Лазерный уровень Bosch", qty: 4, cell: "D-02-02", category: "Измерение", status: "available" },
  { id: 9, emoji: "🪛", name: "Набор отвёрток Wera", qty: 15, cell: "D-01-06", category: "Ручной инструмент", status: "available" },
  { id: 10, emoji: "🔦", name: "Фонарь Fenix TK16", qty: 7, cell: "E-01-01", category: "Освещение", status: "available" },
];

const statusLabel: Record<string, string> = {
  available: "В наличии",
  "in-use": "В использовании",
  reserved: "Зарезервирован",
};

const statusCls: Record<string, string> = {
  available: "status-available",
  "in-use": "status-in-use",
  reserved: "status-reserved",
};

function StockModal({ onClose }: { onClose: () => void }) {
  const [search, setSearch] = useState("");
  const filtered = stockItems.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.cell.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-card rounded-t-2xl border border-border/60 shadow-2xl animate-slide-up"
        style={{ maxHeight: "82vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Header */}
        <div className="px-4 pt-2 pb-3 border-b border-border/40 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-oswald text-lg font-semibold gradient-text">Товары на складе</h2>
            <p className="text-xs text-muted-foreground">{stockItems.length} позиций · 248 единиц</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center hover:bg-muted transition-colors"
          >
            <Icon name="X" size={16} className="text-muted-foreground" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3">
          <div className="relative">
            <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по названию или ячейке..."
              className="w-full bg-muted/50 border border-border/50 rounded-xl pl-8 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#00e5ff]/40 transition-colors"
            />
          </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto px-4 pb-6 space-y-2" style={{ maxHeight: "52vh" }}>
          {filtered.map((item, i) => (
            <div
              key={item.id}
              className="gradient-card rounded-xl p-3 flex items-center gap-3 animate-fade-in"
              style={{ animationDelay: `${i * 0.03}s` }}
            >
              {/* Photo / emoji */}
              <div className="w-12 h-12 rounded-xl bg-muted/60 border border-border/50 flex items-center justify-center flex-shrink-0 text-2xl">
                {item.emoji}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground leading-tight">{item.name}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{item.category}</p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="flex items-center gap-1 text-[10px] text-[#c084fc] bg-[#c084fc]/10 border border-[#c084fc]/20 px-2 py-0.5 rounded-md font-mono">
                    <Icon name="Grid3x3" size={10} />
                    {item.cell}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusCls[item.status]}`}>
                    {statusLabel[item.status]}
                  </span>
                </div>
              </div>

              {/* Qty */}
              <div className="flex-shrink-0 text-right">
                <p className="font-oswald text-xl font-bold neon-text-cyan">{item.qty}</p>
                <p className="text-[10px] text-muted-foreground">шт.</p>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">Ничего не найдено</div>
          )}
        </div>
      </div>
    </div>
  );
}

const stats = [
  { label: "Товаров на складе", value: "248", icon: "Package", color: "#00e5ff", clickable: true },
  { label: "В использовании", value: "37", icon: "ArrowUpRight", color: "#ff9100", clickable: false },
  { label: "Выручка за месяц", value: "₽ 142 500", icon: "TrendingUp", color: "#00e676", clickable: false },
  { label: "Новых операций", value: "12", icon: "Activity", color: "#e040fb", clickable: false },
];

const recentActivity = [
  { action: "Добавлен товар", item: "Дрель Makita DF333D", time: "10:42", date: "Сегодня", type: "add" },
  { action: "Выдан в пользование", item: "Перфоратор Bosch GBH", time: "09:15", date: "Сегодня", type: "out" },
  { action: "Возврат товара", item: "Шуруповёрт DeWalt", time: "18:30", date: "Вчера", type: "return" },
  { action: "Обновлён статус", item: "Сварочный аппарат ESAB", time: "15:00", date: "Вчера", type: "update" },
];

const typeColors: Record<string, string> = {
  add: "#00e676",
  out: "#ff9100",
  return: "#00e5ff",
  update: "#e040fb",
};

const typeIcons: Record<string, string> = {
  add: "Plus",
  out: "ArrowUpRight",
  return: "ArrowDownLeft",
  update: "RefreshCw",
};

interface ProfileData {
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

function getInitials(first: string, last: string) {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

interface EditFieldProps {
  label: string;
  value: string;
  icon: string;
  iconColor: string;
  onChange: (v: string) => void;
  type?: string;
}

function EditField({ label, value, icon, iconColor, onChange, type = "text" }: EditFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] text-muted-foreground flex items-center gap-1.5">
        <Icon name={icon} size={11} style={{ color: iconColor }} />
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-muted/40 border border-border/60 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-[#00e5ff]/50 transition-colors placeholder:text-muted-foreground"
      />
    </div>
  );
}

export default function TabOwner() {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showStock, setShowStock] = useState(false);

  const [profile, setProfile] = useState<ProfileData>({
    firstName: "Алексей",
    lastName: "Смирнов",
    role: "Владелец склада",
    warehouseNumber: "№3",
    since: "2021",
    phone: "+7 (999) 123-45-67",
    email: "a.smirnov@mail.ru",
    address: "Москва, ул. Складская 12",
    company: "ООО «ТехноСклад»",
  });

  const [draft, setDraft] = useState<ProfileData>(profile);

  const handleEdit = () => {
    setDraft(profile);
    setEditing(true);
    setSaved(false);
  };

  const handleSave = () => {
    setProfile(draft);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCancel = () => {
    setDraft(profile);
    setEditing(false);
  };

  const set = (field: keyof ProfileData) => (v: string) =>
    setDraft((p) => ({ ...p, [field]: v }));

  return (
    <div className="p-4 space-y-5">
      {/* Profile Card */}
      <div className="gradient-card rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-violet-500/5"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-cyan-500/5 blur-2xl"></div>

        <div className="relative flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl gradient-cyan-violet flex items-center justify-center shadow-lg flex-shrink-0">
            <span className="font-oswald text-2xl font-bold text-background">
              {getInitials(profile.firstName, profile.lastName)}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="font-oswald text-xl font-semibold text-foreground">
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-sm text-muted-foreground">
              {profile.role} {profile.warehouseNumber}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="status-available text-xs px-2 py-0.5 rounded-full font-medium">Активен</div>
              <span className="text-xs text-muted-foreground">с {profile.since} года</span>
            </div>
          </div>
          {!editing && (
            <button
              onClick={handleEdit}
              className="flex-shrink-0 w-9 h-9 rounded-xl bg-[#00e5ff]/10 border border-[#00e5ff]/25 flex items-center justify-center hover:bg-[#00e5ff]/20 transition-colors"
            >
              <Icon name="Pencil" size={15} className="text-[#00e5ff]" />
            </button>
          )}
        </div>

        {/* View mode */}
        {!editing && (
          <div className="relative mt-4 grid grid-cols-2 gap-3 animate-fade-in">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="Phone" size={14} className="text-[#00e5ff]" />
              <span className="truncate">{profile.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="Mail" size={14} className="text-[#e040fb]" />
              <span className="truncate">{profile.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="MapPin" size={14} className="text-[#00e676]" />
              <span className="truncate">{profile.address}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="Building2" size={14} className="text-[#ff9100]" />
              <span className="truncate">{profile.company}</span>
            </div>
          </div>
        )}

        {/* Edit mode */}
        {editing && (
          <div className="relative mt-4 space-y-3 animate-fade-in">
            <div className="grid grid-cols-2 gap-3">
              <EditField label="Имя" value={draft.firstName} icon="User" iconColor="#00e5ff" onChange={set("firstName")} />
              <EditField label="Фамилия" value={draft.lastName} icon="User" iconColor="#00e5ff" onChange={set("lastName")} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <EditField label="Должность" value={draft.role} icon="Briefcase" iconColor="#c084fc" onChange={set("role")} />
              <EditField label="Склад №" value={draft.warehouseNumber} icon="Warehouse" iconColor="#c084fc" onChange={set("warehouseNumber")} />
            </div>
            <EditField label="Телефон" value={draft.phone} icon="Phone" iconColor="#00e5ff" onChange={set("phone")} type="tel" />
            <EditField label="Email" value={draft.email} icon="Mail" iconColor="#e040fb" onChange={set("email")} type="email" />
            <EditField label="Адрес склада" value={draft.address} icon="MapPin" iconColor="#00e676" onChange={set("address")} />
            <EditField label="Компания" value={draft.company} icon="Building2" iconColor="#ff9100" onChange={set("company")} />
            <EditField label="Работает с (год)" value={draft.since} icon="Calendar" iconColor="#ff9100" onChange={set("since")} />

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleSave}
                className="flex-1 glow-btn gradient-cyan-violet text-background font-medium text-sm py-2.5 rounded-xl flex items-center justify-center gap-2"
              >
                <Icon name="Check" size={15} />
                Сохранить
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-muted/50 border border-border/50 text-muted-foreground text-sm py-2.5 rounded-xl hover:border-border transition-colors flex items-center justify-center gap-2"
              >
                <Icon name="X" size={15} />
                Отмена
              </button>
            </div>
          </div>
        )}

        {/* Saved toast */}
        {saved && (
          <div className="relative mt-3 flex items-center gap-2 bg-[#00e676]/10 border border-[#00e676]/30 rounded-lg px-3 py-2 animate-fade-in">
            <Icon name="CheckCircle2" size={14} className="text-[#00e676]" />
            <span className="text-xs text-[#00e676] font-medium">Данные успешно сохранены</span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            onClick={() => stat.clickable && setShowStock(true)}
            className={`gradient-card rounded-xl p-4 relative overflow-hidden transition-all duration-200 ${
              stat.clickable
                ? "cursor-pointer hover:border-[#00e5ff]/30 hover:scale-[1.02] active:scale-[0.98]"
                : ""
            }`}
          >
            <div
              className="absolute top-0 right-0 w-16 h-16 rounded-full blur-2xl opacity-30"
              style={{ background: stat.color }}
            ></div>
            {stat.clickable && (
              <div className="absolute top-2.5 right-2.5">
                <Icon name="ChevronRight" size={12} className="text-muted-foreground/50" />
              </div>
            )}
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
              style={{ background: `${stat.color}20`, border: `1px solid ${stat.color}30` }}
            >
              <Icon name={stat.icon} size={16} style={{ color: stat.color }} />
            </div>
            <p className="font-oswald text-xl font-bold" style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {showStock && <StockModal onClose={() => setShowStock(false)} />}

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-oswald text-base font-semibold text-foreground">Последние операции</h3>
          <button className="text-xs text-[#00e5ff] hover:underline">Все →</button>
        </div>
        <div className="space-y-2">
          {recentActivity.map((item, i) => (
            <div
              key={i}
              className="gradient-card rounded-xl p-3 flex items-center gap-3 hover:border-white/10 transition-colors"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${typeColors[item.type]}20`, border: `1px solid ${typeColors[item.type]}30` }}
              >
                <Icon name={typeIcons[item.type]} size={14} style={{ color: typeColors[item.type] }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{item.action}</p>
                <p className="text-sm font-medium text-foreground truncate">{item.item}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-medium text-foreground">{item.time}</p>
                <p className="text-[10px] text-muted-foreground">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}