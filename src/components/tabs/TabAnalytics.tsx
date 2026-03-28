import { useState } from "react";
import Icon from "@/components/ui/icon";

const monthData = [
  { month: "Окт", revenue: 95000, operations: 28 },
  { month: "Ноя", revenue: 118000, operations: 34 },
  { month: "Дек", revenue: 132000, operations: 41 },
  { month: "Янв", revenue: 89000, operations: 22 },
  { month: "Фев", revenue: 124000, operations: 37 },
  { month: "Мар", revenue: 142500, operations: 45 },
];

const historyItems = [
  { date: "28 мар", time: "10:42", action: "Добавлен товар", item: "Дрель Makita DF333D", amount: "+8 500 ₽", type: "income" },
  { date: "28 мар", time: "09:15", action: "Выдан в пользование", item: "Перфоратор Bosch GBH", amount: "–", type: "out" },
  { date: "27 мар", time: "18:30", action: "Возврат товара", item: "Шуруповёрт DeWalt", amount: "+12 000 ₽", type: "income" },
  { date: "27 мар", time: "14:00", action: "Списание", item: "Расходный материал", amount: "–1 200 ₽", type: "expense" },
  { date: "26 мар", time: "11:20", action: "Поступление", item: "Болгарка Metabo WB 18", amount: "+9 800 ₽", type: "income" },
  { date: "25 мар", time: "16:45", action: "Резерв", item: "Сварочный аппарат ESAB", amount: "–", type: "reserved" },
  { date: "24 мар", time: "09:00", action: "Продажа", item: "Набор инструментов Stanley", amount: "+22 500 ₽", type: "income" },
];

const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function MiniCalendar() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = firstDay === 0 ? 6 : firstDay - 1;

  const activeDays = new Set([3, 7, 12, 15, 18, 22, 25, 27, 28]);

  const cells: (number | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const monthNames = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
  ];

  return (
    <div className="gradient-card rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-oswald text-sm font-semibold gradient-text">
          {monthNames[month]} {year}
        </h3>
        <Icon name="Calendar" size={15} className="text-muted-foreground" />
      </div>
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] text-muted-foreground py-1 font-medium">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => (
          <div
            key={i}
            className={`aspect-square flex flex-col items-center justify-center rounded-lg text-xs relative
              ${day === today.getDate() ? "gradient-cyan-violet text-background font-bold" : ""}
              ${day && day !== today.getDate() && activeDays.has(day) ? "text-foreground font-medium" : ""}
              ${!day ? "" : "hover:bg-muted/50 cursor-pointer transition-colors"}
              ${!day || (!activeDays.has(day) && day !== today.getDate()) ? "text-muted-foreground" : ""}
            `}
          >
            {day}
            {day && activeDays.has(day) && day !== today.getDate() && (
              <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-[#00e5ff] opacity-60"></span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function BarChart() {
  const maxRevenue = Math.max(...monthData.map((d) => d.revenue));

  return (
    <div className="gradient-card rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-oswald text-sm font-semibold text-foreground">Выручка за 6 месяцев</h3>
        <span className="text-xs text-[#00e676] font-medium">+14.8%</span>
      </div>
      <div className="flex items-end gap-2 h-28">
        {monthData.map((d, i) => (
          <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex items-end" style={{ height: "90px" }}>
              <div
                className="w-full rounded-t-md transition-all duration-500 relative group"
                style={{
                  height: `${(d.revenue / maxRevenue) * 100}%`,
                  background:
                    i === monthData.length - 1
                      ? "linear-gradient(180deg, #00e5ff, rgba(0,229,255,0.3))"
                      : "linear-gradient(180deg, rgba(192,132,252,0.6), rgba(192,132,252,0.2))",
                  animationDelay: `${i * 0.1}s`,
                }}
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] text-muted-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {(d.revenue / 1000).toFixed(0)}k
                </div>
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground">{d.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TabAnalytics() {
  const [historyFilter, setHistoryFilter] = useState("Все");

  const historyFilters = ["Все", "Доходы", "Расходы"];

  const filtered = historyItems.filter((h) => {
    if (historyFilter === "Доходы") return h.type === "income";
    if (historyFilter === "Расходы") return h.type === "expense";
    return true;
  });

  const typeColors: Record<string, string> = {
    income: "#00e676",
    expense: "#ff5252",
    out: "#ff9100",
    reserved: "#e040fb",
  };

  const typeIcons: Record<string, string> = {
    income: "ArrowDownLeft",
    expense: "ArrowUpRight",
    out: "Send",
    reserved: "Lock",
  };

  return (
    <div className="p-4 space-y-4">
      {/* KPI row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="gradient-card rounded-xl p-3 text-center">
          <p className="font-oswald text-lg font-bold neon-text-cyan">142.5k</p>
          <p className="text-[10px] text-muted-foreground">Выручка, ₽</p>
        </div>
        <div className="gradient-card rounded-xl p-3 text-center">
          <p className="font-oswald text-lg font-bold" style={{ color: "#00e676" }}>45</p>
          <p className="text-[10px] text-muted-foreground">Операций</p>
        </div>
        <div className="gradient-card rounded-xl p-3 text-center">
          <p className="font-oswald text-lg font-bold" style={{ color: "#e040fb" }}>248</p>
          <p className="text-[10px] text-muted-foreground">Товаров</p>
        </div>
      </div>

      <BarChart />
      <MiniCalendar />

      {/* History */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-oswald text-base font-semibold">История операций</h3>
          <div className="flex gap-1">
            {historyFilters.map((f) => (
              <button
                key={f}
                onClick={() => setHistoryFilter(f)}
                className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${
                  historyFilter === f
                    ? "bg-[#00e5ff]/15 border-[#00e5ff]/40 text-[#00e5ff]"
                    : "border-border/50 text-muted-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          {filtered.map((item, i) => (
            <div
              key={i}
              className="gradient-card rounded-xl p-3 flex items-center gap-3 animate-fade-in"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: `${typeColors[item.type]}20`,
                  border: `1px solid ${typeColors[item.type]}30`,
                }}
              >
                <Icon name={typeIcons[item.type]} size={14} style={{ color: typeColors[item.type] }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{item.action}</p>
                <p className="text-sm font-medium text-foreground truncate">{item.item}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p
                  className="text-sm font-bold font-oswald"
                  style={{ color: item.type === "expense" ? "#ff5252" : item.type === "income" ? "#00e676" : "#muted-foreground" }}
                >
                  {item.amount}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {item.date} {item.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
