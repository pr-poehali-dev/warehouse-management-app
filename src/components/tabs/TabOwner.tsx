import Icon from "@/components/ui/icon";

const stats = [
  { label: "Товаров на складе", value: "248", icon: "Package", color: "#00e5ff" },
  { label: "В использовании", value: "37", icon: "ArrowUpRight", color: "#ff9100" },
  { label: "Выручка за месяц", value: "₽ 142 500", icon: "TrendingUp", color: "#00e676" },
  { label: "Новых операций", value: "12", icon: "Activity", color: "#e040fb" },
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

export default function TabOwner() {
  return (
    <div className="p-4 space-y-5">
      {/* Profile Card */}
      <div className="gradient-card rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-violet-500/5"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-cyan-500/5 blur-2xl"></div>
        <div className="relative flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl gradient-cyan-violet flex items-center justify-center shadow-lg flex-shrink-0">
            <span className="font-oswald text-2xl font-bold text-background">АС</span>
          </div>
          <div className="flex-1">
            <h2 className="font-oswald text-xl font-semibold text-foreground">Алексей Смирнов</h2>
            <p className="text-sm text-muted-foreground">Владелец склада №3</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="status-available text-xs px-2 py-0.5 rounded-full font-medium">
                Активен
              </div>
              <span className="text-xs text-muted-foreground">с 2021 года</span>
            </div>
          </div>
        </div>
        <div className="relative mt-4 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="Phone" size={14} className="text-[#00e5ff]" />
            <span>+7 (999) 123-45-67</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="Mail" size={14} className="text-[#e040fb]" />
            <span>a.smirnov@mail.ru</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="MapPin" size={14} className="text-[#00e676]" />
            <span>Москва, ул. Складская 12</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="Building2" size={14} className="text-[#ff9100]" />
            <span>ООО «ТехноСклад»</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="gradient-card rounded-xl p-4 relative overflow-hidden">
            <div
              className="absolute top-0 right-0 w-16 h-16 rounded-full blur-2xl opacity-30"
              style={{ background: stat.color }}
            ></div>
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
