import { useState } from "react";
import Icon from "@/components/ui/icon";
import { useAppContext } from "@/context/AppContext";

interface ToggleProps {
  value: boolean;
  onChange: (v: boolean) => void;
  color?: string;
}

function Toggle({ value, onChange, color = "#00e5ff" }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0"
      style={{
        background: value ? `${color}30` : "rgba(255,255,255,0.08)",
        border: `1px solid ${value ? color + "50" : "rgba(255,255,255,0.1)"}`,
        boxShadow: value ? `0 0 12px ${color}30` : "none",
      }}
    >
      <span
        className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300"
        style={{
          left: value ? "calc(100% - 22px)" : "2px",
          background: value ? color : "rgba(255,255,255,0.3)",
          boxShadow: value ? `0 0 8px ${color}60` : "none",
        }}
      />
    </button>
  );
}

interface SectionProps {
  title: string;
  icon: string;
  color: string;
  children: React.ReactNode;
}

function Section({ title, icon, color, children }: SectionProps) {
  return (
    <div className="gradient-card rounded-xl overflow-hidden">
      <div
        className="px-4 py-3 flex items-center gap-2 border-b border-border/40"
        style={{ background: `${color}08` }}
      >
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center"
          style={{ background: `${color}20`, border: `1px solid ${color}30` }}
        >
          <Icon name={icon} size={13} style={{ color }} />
        </div>
        <span className="font-oswald text-sm font-semibold" style={{ color }}>
          {title}
        </span>
      </div>
      <div className="divide-y divide-border/30">{children}</div>
    </div>
  );
}

interface SettingRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}

function SettingRow({ label, description, children }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

type AccentColor = "cyan" | "violet" | "green" | "orange";

const accentColors: { key: AccentColor; color: string; label: string }[] = [
  { key: "cyan", color: "#00e5ff", label: "Cyan" },
  { key: "violet", color: "#c084fc", label: "Violet" },
  { key: "green", color: "#00e676", label: "Green" },
  { key: "orange", color: "#ff9100", label: "Orange" },
];

type FontOption = "Golos Text" | "Oswald" | "Rubik";

const fontOptions: FontOption[] = ["Golos Text", "Oswald", "Rubik"];

export default function TabSettings() {
  const { profile } = useAppContext();
  const initials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();

  const [notifications, setNotifications] = useState({
    push: true,
    movements: true,
    reports: false,
    alerts: true,
  });

  const [appearance, setAppearance] = useState({
    darkMode: true,
    compactMode: false,
    animations: true,
    accent: "cyan" as AccentColor,
    font: "Golos Text" as FontOption,
  });

  const [security, setSecurity] = useState({
    pin: false,
    biometric: false,
    autolock: true,
  });

  return (
    <div className="p-4 space-y-4">
      {/* Profile quick edit */}
      <div className="gradient-card rounded-xl p-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl gradient-cyan-violet flex items-center justify-center flex-shrink-0">
          <span className="font-oswald text-lg font-bold text-background">{initials}</span>
        </div>
        <div className="flex-1">
          <p className="font-medium text-sm text-foreground">{profile.firstName} {profile.lastName}</p>
          <p className="text-xs text-muted-foreground">{profile.role} • Склад {profile.warehouseNumber}</p>
        </div>
        <button className="text-xs text-[#00e5ff] border border-[#00e5ff]/30 px-3 py-1.5 rounded-lg hover:bg-[#00e5ff]/10 transition-colors">
          Изменить
        </button>
      </div>

      {/* Appearance */}
      <Section title="Внешний вид" icon="Palette" color="#c084fc">
        <SettingRow label="Тёмная тема" description="Тёмный фон интерфейса">
          <Toggle value={appearance.darkMode} onChange={(v) => setAppearance((p) => ({ ...p, darkMode: v }))} color="#c084fc" />
        </SettingRow>
        <SettingRow label="Компактный режим" description="Уменьшенные отступы">
          <Toggle value={appearance.compactMode} onChange={(v) => setAppearance((p) => ({ ...p, compactMode: v }))} color="#c084fc" />
        </SettingRow>
        <SettingRow label="Анимации" description="Плавные переходы">
          <Toggle value={appearance.animations} onChange={(v) => setAppearance((p) => ({ ...p, animations: v }))} color="#c084fc" />
        </SettingRow>
        <SettingRow label="Акцентный цвет">
          <div className="flex gap-2">
            {accentColors.map((c) => (
              <button
                key={c.key}
                onClick={() => setAppearance((p) => ({ ...p, accent: c.key }))}
                className="w-6 h-6 rounded-full transition-all duration-200"
                style={{
                  background: c.color,
                  boxShadow: appearance.accent === c.key ? `0 0 10px ${c.color}` : "none",
                  transform: appearance.accent === c.key ? "scale(1.2)" : "scale(1)",
                  border: appearance.accent === c.key ? `2px solid white` : "none",
                }}
              />
            ))}
          </div>
        </SettingRow>
        <SettingRow label="Шрифт интерфейса">
          <select
            value={appearance.font}
            onChange={(e) => setAppearance((p) => ({ ...p, font: e.target.value as FontOption }))}
            className="bg-muted/50 border border-border/50 rounded-lg px-2.5 py-1 text-xs text-foreground focus:outline-none focus:border-[#c084fc]/40"
          >
            {fontOptions.map((f) => (
              <option key={f} value={f} className="bg-background">
                {f}
              </option>
            ))}
          </select>
        </SettingRow>
      </Section>

      {/* Notifications */}
      <Section title="Уведомления" icon="Bell" color="#00e5ff">
        <SettingRow label="Push-уведомления" description="Системные оповещения">
          <Toggle value={notifications.push} onChange={(v) => setNotifications((p) => ({ ...p, push: v }))} />
        </SettingRow>
        <SettingRow label="Движение товаров" description="Выдача и возврат">
          <Toggle value={notifications.movements} onChange={(v) => setNotifications((p) => ({ ...p, movements: v }))} />
        </SettingRow>
        <SettingRow label="Еженедельные отчёты" description="Сводка по воскресеньям">
          <Toggle value={notifications.reports} onChange={(v) => setNotifications((p) => ({ ...p, reports: v }))} />
        </SettingRow>
        <SettingRow label="Критические оповещения" description="Нехватка товара">
          <Toggle value={notifications.alerts} onChange={(v) => setNotifications((p) => ({ ...p, alerts: v }))} />
        </SettingRow>
      </Section>

      {/* Security */}
      <Section title="Безопасность" icon="Shield" color="#00e676">
        <SettingRow label="PIN-код" description="4-значный код доступа">
          <Toggle value={security.pin} onChange={(v) => setSecurity((p) => ({ ...p, pin: v }))} color="#00e676" />
        </SettingRow>
        <SettingRow label="Биометрия" description="Touch ID / Face ID">
          <Toggle value={security.biometric} onChange={(v) => setSecurity((p) => ({ ...p, biometric: v }))} color="#00e676" />
        </SettingRow>
        <SettingRow label="Автоблокировка" description="Через 5 минут">
          <Toggle value={security.autolock} onChange={(v) => setSecurity((p) => ({ ...p, autolock: v }))} color="#00e676" />
        </SettingRow>
      </Section>

      {/* App info */}
      <div className="gradient-card rounded-xl p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Версия приложения</span>
          <span className="text-xs font-medium text-foreground">1.0.0</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Последнее обновление</span>
          <span className="text-xs font-medium text-foreground">28 мар 2026</span>
        </div>
      </div>

      {/* Danger zone */}
      <button className="w-full gradient-card rounded-xl p-3 flex items-center justify-center gap-2 border border-red-500/20 hover:border-red-500/40 transition-colors group">
        <Icon name="LogOut" size={15} className="text-red-400 group-hover:text-red-300" />
        <span className="text-sm text-red-400 group-hover:text-red-300 font-medium">Выйти из аккаунта</span>
      </button>
    </div>
  );
}