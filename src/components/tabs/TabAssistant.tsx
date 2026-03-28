import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

interface Message {
  id: number;
  role: "assistant" | "user";
  text: string;
  time: string;
}

const quickReplies = [
  "Что на складе сейчас?",
  "Покажи товары в использовании",
  "Сколько заработали за месяц?",
  "Какой товар самый популярный?",
];

const getTime = () =>
  new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

const botReplies: Record<string, string> = {
  "что на складе сейчас?": "На складе сейчас **248 позиций** товаров. Из них:\n• ✅ В наличии: 204 шт.\n• 🔶 В использовании: 37 шт.\n• 🔷 Зарезервировано: 7 шт.",
  "покажи товары в использовании": "Вот товары, которые сейчас в использовании:\n\n1. **Перфоратор Bosch GBH** — у Иванова П.\n2. **Компрессор Fubag B3600** — у Козлова В.\n\nВсего: 37 единиц техники на руках у 12 сотрудников.",
  "сколько заработали за месяц?": "💰 Выручка за март 2026 составила **₽ 142 500**\n\nЭто на **+14.8%** больше, чем в феврале.\nОпераций проведено: 45\nСредний чек: ₽ 3 167",
  "какой товар самый популярный?": "🏆 Самый востребованный товар:\n\n**Шуруповёрт DeWalt DCD796**\n— Использовался 18 раз за месяц\n— Выдавался: 18 раз\n— Возвратов: 16\n— Сейчас: в наличии (8 шт.)",
};

function getBotReply(text: string): string {
  const key = text.toLowerCase().trim();
  for (const [q, a] of Object.entries(botReplies)) {
    if (key.includes(q.replace("?", "").split(" ")[0])) return a;
  }
  return "Хороший вопрос! Я пока учусь отвечать на сложные запросы. Попробуйте выбрать один из быстрых ответов выше, или задайте вопрос иначе.";
}

function formatMessage(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const formatted = line
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-[#00e5ff]">$1</strong>');
    return (
      <span key={i}>
        <span dangerouslySetInnerHTML={{ __html: formatted }} />
        {i < lines.length - 1 && <br />}
      </span>
    );
  });
}

export default function TabAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      text: "Привет! Я ваш складской ассистент 🤖\n\nМогу показать статистику, найти товар, рассказать об операциях. Чем могу помочь?",
      time: getTime(),
    },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), role: "user", text, time: getTime() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const reply = getBotReply(text);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", text: reply, time: getTime() },
      ]);
    }, 700);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Assistant header */}
      <div className="px-4 pt-4 pb-3">
        <div className="gradient-card rounded-xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-cyan-violet flex items-center justify-center flex-shrink-0 animate-glow-pulse">
            <Icon name="Bot" size={20} className="text-background" />
          </div>
          <div>
            <p className="font-oswald text-sm font-semibold gradient-text">Складской ИИ-ассистент</p>
            <p className="text-[10px] text-muted-foreground">Онлайн • Отвечает мгновенно</p>
          </div>
          <div className="ml-auto">
            <div className="w-2 h-2 rounded-full bg-[#00e676] animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 animate-fade-in ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-lg gradient-cyan-violet flex items-center justify-center flex-shrink-0 mt-1">
                <Icon name="Bot" size={13} className="text-background" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                msg.role === "assistant"
                  ? "gradient-card rounded-tl-sm"
                  : "bg-gradient-to-br from-[#00e5ff]/20 to-[#c084fc]/20 border border-[#00e5ff]/20 rounded-tr-sm"
              }`}
            >
              <p className="text-foreground">{formatMessage(msg.text)}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{msg.time}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      <div className="px-4 py-2">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {quickReplies.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="flex-shrink-0 text-[11px] px-3 py-1.5 rounded-full border border-[#00e5ff]/20 text-[#00e5ff] bg-[#00e5ff]/5 hover:bg-[#00e5ff]/10 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="px-4 pb-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Спросите что-нибудь о складе..."
            className="flex-1 bg-muted/50 border border-border/50 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#00e5ff]/40 transition-colors"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim()}
            className="glow-btn gradient-cyan-violet text-background w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Icon name="Send" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
