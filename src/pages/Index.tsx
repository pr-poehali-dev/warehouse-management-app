import { useState } from "react";
import Icon from "@/components/ui/icon";
import TabOwner from "@/components/tabs/TabOwner";
import TabProducts from "@/components/tabs/TabProducts";
import TabAnalytics from "@/components/tabs/TabAnalytics";
import TabAssistant from "@/components/tabs/TabAssistant";
import TabSettings from "@/components/tabs/TabSettings";

const tabs = [
  { id: "owner", label: "Профиль", icon: "User" },
  { id: "products", label: "Товары", icon: "Package" },
  { id: "analytics", label: "Аналитика", icon: "BarChart3" },
  { id: "assistant", label: "Ассистент", icon: "Bot" },
  { id: "settings", label: "Настройки", icon: "Settings" },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState("owner");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border/50 px-6 py-4 flex items-center justify-between sticky top-0 z-10 bg-background/90 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-cyan-violet flex items-center justify-center shadow-lg">
            <Icon name="Warehouse" size={18} className="text-background" />
          </div>
          <div>
            <h1 className="font-oswald text-xl font-semibold gradient-text tracking-wide">
              WORLD OF WAREHOUSES
            </h1>
            <p className="text-[10px] text-muted-foreground leading-none mt-0.5">
              Warehouse management system
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
          <div className="w-2 h-2 rounded-full bg-[#00e676] animate-pulse"></div>
          <span className="text-xs text-muted-foreground">Онлайн</span>
        </div>
      </header>

      <main className="flex-1 overflow-auto pb-20">
        <div key={activeTab} className="animate-fade-in">
          {activeTab === "owner" && <TabOwner />}
          {activeTab === "products" && <TabProducts />}
          {activeTab === "analytics" && <TabAnalytics />}
          {activeTab === "assistant" && <TabAssistant />}
          {activeTab === "settings" && <TabSettings />}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-border/50 bg-card/90 backdrop-blur-xl px-2 py-2 z-10">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[60px] ${
                activeTab === tab.id
                  ? "tab-active"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Icon name={tab.icon} size={20} />
              <span className="text-[10px] font-medium leading-none">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}