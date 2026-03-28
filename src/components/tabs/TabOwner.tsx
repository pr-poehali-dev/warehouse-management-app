import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";
import { useAppContext, ProfileData } from "@/context/AppContext";

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
  const { products } = useAppContext();
  const [search, setSearch] = useState("");
  const filtered = products.filter(
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
            <p className="text-xs text-muted-foreground">{products.length} позиций · {products.reduce((s, p) => s + p.qty, 0)} единиц</p>
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

const revenueTypeLabel: Record<string, string> = {
  sold: "Продажа",
  realization: "Реализация",
  passive: "Пассивный доход",
};
const revenueTypeColor: Record<string, string> = {
  sold: "#00e676",
  realization: "#00e5ff",
  passive: "#e040fb",
};
const revenueTypeIcon: Record<string, string> = {
  sold: "ShoppingCart",
  realization: "Handshake",
  passive: "Repeat",
};

const emojis = ["🔧","⚡","🔩","🔥","💿","💨","🔑","📐","🪛","🔦","🛠️","⚙️","🔌","🧰","📦"];

function RevenueModal({ onClose }: { onClose: () => void }) {
  const { revenueItems, setRevenueItems } = useAppContext();
  const [filter, setFilter] = useState<"all" | "sold" | "realization" | "passive">("all");
  const [showForm, setShowForm] = useState(false);
  const [savedAnim, setSavedAnim] = useState(false);

  const [form, setForm] = useState({
    emoji: "📦",
    name: "",
    type: "sold" as "sold" | "realization" | "passive",
    amount: "",
    qty: "",
    date: "",
    note: "",
  });

  const totals = {
    sold: revenueItems.filter((i) => i.type === "sold").reduce((s, i) => s + i.amount, 0),
    realization: revenueItems.filter((i) => i.type === "realization").reduce((s, i) => s + i.amount, 0),
    passive: revenueItems.filter((i) => i.type === "passive").reduce((s, i) => s + i.amount, 0),
  };
  const total = totals.sold + totals.realization + totals.passive;
  const filtered = filter === "all" ? revenueItems : revenueItems.filter((i) => i.type === filter);

  const handleAdd = () => {
    if (!form.name.trim() || !form.amount || !form.date.trim()) return;
    const newItem = {
      id: Date.now(),
      emoji: form.emoji,
      name: form.name.trim(),
      type: form.type,
      amount: Number(form.amount),
      qty: form.qty ? Number(form.qty) : undefined,
      date: form.date.trim(),
      note: form.note.trim() || undefined,
    };
    setRevenueItems([newItem, ...revenueItems]);
    setForm({ emoji: "📦", name: "", type: "sold", amount: "", qty: "", date: "", note: "" });
    setShowForm(false);
    setSavedAnim(true);
    setTimeout(() => setSavedAnim(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-card rounded-t-2xl border border-border/60 shadow-2xl animate-slide-up"
        style={{ maxHeight: "92vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Header */}
        <div className="px-4 pt-2 pb-3 border-b border-border/40 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-oswald text-lg font-semibold gradient-text">Выручка за март 2026</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Итого: <span className="text-[#00e676] font-bold">{total.toLocaleString("ru")} ₽</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowForm((v) => !v)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border transition-all ${
                showForm
                  ? "bg-muted border-border text-muted-foreground"
                  : "glow-btn gradient-cyan-violet text-background border-transparent font-medium"
              }`}
            >
              <Icon name={showForm ? "ChevronUp" : "Plus"} size={13} />
              {showForm ? "Свернуть" : "Добавить"}
            </button>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center hover:bg-muted transition-colors flex-shrink-0">
              <Icon name="X" size={16} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Add form */}
        {showForm && (
          <div className="px-4 py-3 border-b border-border/40 space-y-3 animate-fade-in bg-muted/20">
            {/* Emoji picker */}
            <div>
              <p className="text-[10px] text-muted-foreground mb-1.5">Иконка товара</p>
              <div className="flex gap-1.5 flex-wrap">
                {emojis.map((e) => (
                  <button
                    key={e}
                    onClick={() => setForm((p) => ({ ...p, emoji: e }))}
                    className={`w-8 h-8 rounded-lg text-base flex items-center justify-center transition-all ${
                      form.emoji === e
                        ? "bg-[#00e5ff]/20 border border-[#00e5ff]/50 scale-110"
                        : "bg-muted/50 border border-border/40 hover:bg-muted"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Type selector */}
            <div>
              <p className="text-[10px] text-muted-foreground mb-1.5">Тип записи</p>
              <div className="flex gap-2">
                {(["sold", "realization", "passive"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setForm((p) => ({ ...p, type: t }))}
                    className="flex-1 text-[11px] py-2 rounded-xl border transition-all font-medium"
                    style={{
                      background: form.type === t ? `${revenueTypeColor[t]}18` : "transparent",
                      borderColor: form.type === t ? `${revenueTypeColor[t]}50` : "rgba(255,255,255,0.08)",
                      color: form.type === t ? revenueTypeColor[t] : "#6b7280",
                    }}
                  >
                    {revenueTypeLabel[t]}
                  </button>
                ))}
              </div>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-2">
                <input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Название товара *"
                  className="w-full bg-muted/40 border border-border/60 rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#00e5ff]/50 transition-colors"
                />
              </div>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                placeholder="Сумма, ₽ *"
                className="bg-muted/40 border border-border/60 rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#00e5ff]/50 transition-colors"
              />
              <input
                type="number"
                value={form.qty}
                onChange={(e) => setForm((p) => ({ ...p, qty: e.target.value }))}
                placeholder="Кол-во, шт."
                className="bg-muted/40 border border-border/60 rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#00e5ff]/50 transition-colors"
              />
              <input
                value={form.date}
                onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                placeholder="Дата (напр. 28 мар) *"
                className="bg-muted/40 border border-border/60 rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#00e5ff]/50 transition-colors"
              />
              <input
                value={form.note}
                onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
                placeholder="Примечание"
                className="bg-muted/40 border border-border/60 rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#00e5ff]/50 transition-colors"
              />
            </div>

            <button
              onClick={handleAdd}
              disabled={!form.name.trim() || !form.amount || !form.date.trim()}
              className="w-full glow-btn gradient-cyan-violet text-background font-medium text-sm py-2.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              <Icon name="CheckCircle2" size={15} />
              Сохранить запись
            </button>
          </div>
        )}

        {/* Success toast */}
        {savedAnim && (
          <div className="mx-4 mt-2 flex items-center gap-2 bg-[#00e676]/10 border border-[#00e676]/30 rounded-lg px-3 py-2 animate-fade-in">
            <Icon name="CheckCircle2" size={14} className="text-[#00e676]" />
            <span className="text-xs text-[#00e676] font-medium">Запись добавлена</span>
          </div>
        )}

        {/* KPI row */}
        <div className="px-4 py-3 grid grid-cols-3 gap-2">
          {(["sold", "realization", "passive"] as const).map((t) => (
            <div
              key={t}
              className="rounded-xl p-2.5 text-center border transition-all cursor-pointer"
              style={{
                background: filter === t ? `${revenueTypeColor[t]}15` : "rgba(255,255,255,0.03)",
                borderColor: filter === t ? `${revenueTypeColor[t]}40` : "rgba(255,255,255,0.07)",
              }}
              onClick={() => setFilter(filter === t ? "all" : t)}
            >
              <p className="font-oswald text-sm font-bold" style={{ color: revenueTypeColor[t] }}>
                {(totals[t] / 1000).toFixed(1)}k ₽
              </p>
              <p className="text-[9px] text-muted-foreground mt-0.5 leading-tight">{revenueTypeLabel[t]}</p>
            </div>
          ))}
        </div>

        {/* Filter chips */}
        <div className="px-4 pb-2 flex gap-2">
          {([["all", "Все"], ["sold", "Продажи"], ["realization", "Реализация"], ["passive", "Пассивный"]] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`text-[10px] px-2.5 py-1 rounded-full border transition-all flex-shrink-0 ${
                filter === key
                  ? "bg-[#00e5ff]/15 border-[#00e5ff]/40 text-[#00e5ff]"
                  : "border-border/50 text-muted-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="overflow-y-auto px-4 pb-6 space-y-2" style={{ maxHeight: "42vh" }}>
          {filtered.map((item, i) => {
            const globalIdx = items.indexOf(item);
            return (
              <div
                key={i}
                className="gradient-card rounded-xl p-3 flex items-center gap-3 animate-fade-in group"
                style={{ animationDelay: `${i * 0.03}s` }}
              >
                <div className="w-11 h-11 rounded-xl bg-muted/60 border border-border/50 flex items-center justify-center flex-shrink-0 text-xl">
                  {item.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground leading-tight truncate">{item.name}</p>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span
                      className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium"
                      style={{
                        color: revenueTypeColor[item.type],
                        background: `${revenueTypeColor[item.type]}12`,
                        borderColor: `${revenueTypeColor[item.type]}30`,
                      }}
                    >
                      <Icon name={revenueTypeIcon[item.type]} size={9} />
                      {revenueTypeLabel[item.type]}
                    </span>
                    {item.note && (
                      <span className="text-[10px] text-muted-foreground truncate">{item.note}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="text-right">
                    <p className="font-oswald text-base font-bold" style={{ color: revenueTypeColor[item.type] }}>
                      +{item.amount.toLocaleString("ru")} ₽
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {item.qty ? `${item.qty} шт · ` : ""}{item.date}
                    </p>
                  </div>
                  <button
                    onClick={() => setRevenueItems(revenueItems.filter((_, idx) => idx !== globalIdx))}
                    className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20 flex-shrink-0"
                  >
                    <Icon name="Trash2" size={12} className="text-red-400" />
                  </button>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">Записей нет</div>
          )}
        </div>
      </div>
    </div>
  );
}



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
  const { profile, setProfile, avatar, setAvatar, products, revenueItems } = useAppContext();

  const totalQty = products.reduce((s, p) => s + p.qty, 0);
  const inUseCount = products.filter((p) => p.status === "in-use").length;
  const totalRevenue = revenueItems.reduce((s, r) => s + r.amount, 0);

  const stats = [
    { label: "Товаров на складе", value: String(totalQty), icon: "Package", color: "#00e5ff", clickable: true, modal: "stock" },
    { label: "В использовании", value: String(inUseCount), icon: "ArrowUpRight", color: "#ff9100", clickable: false, modal: "" },
    { label: "Выручка за месяц", value: `₽ ${totalRevenue.toLocaleString("ru")}`, icon: "TrendingUp", color: "#00e676", clickable: true, modal: "revenue" },
    { label: "Новых операций", value: String(revenueItems.length), icon: "Activity", color: "#e040fb", clickable: false, modal: "" },
  ];
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showStock, setShowStock] = useState(false);
  const [showRevenue, setShowRevenue] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [draft, setDraft] = useState<ProfileData>(profile);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) setAvatar(ev.target.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

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
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />

          {/* Avatar */}
          <div
            className="relative w-16 h-16 rounded-2xl flex-shrink-0 cursor-pointer group"
            onClick={handleAvatarClick}
          >
            {avatar ? (
              <img
                src={avatar}
                alt="Аватар"
                className="w-16 h-16 rounded-2xl object-cover shadow-lg"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl gradient-cyan-violet flex items-center justify-center shadow-lg">
                <span className="font-oswald text-2xl font-bold text-background">
                  {getInitials(profile.firstName, profile.lastName)}
                </span>
              </div>
            )}
            {/* Hover overlay */}
            <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Icon name="Camera" size={18} className="text-white" />
            </div>
            {/* Camera badge */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full gradient-cyan-violet flex items-center justify-center border-2 border-card shadow">
              <Icon name="Camera" size={10} className="text-background" />
            </div>
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
            onClick={() => {
              if (stat.modal === "stock") setShowStock(true);
              if (stat.modal === "revenue") setShowRevenue(true);
            }}
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
      {showRevenue && <RevenueModal onClose={() => setShowRevenue(false)} />}

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