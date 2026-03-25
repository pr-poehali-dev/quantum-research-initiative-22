import { motion } from "framer-motion"
import Icon from "@/components/ui/icon"

const PRODUCTS = [
  { id: 1, name: "Спиннинг Strike Pro", price: 3490, coins: 350, emoji: "🎣", category: "Удилища", rating: 4.8 },
  { id: 2, name: "Набор воблеров 20шт", price: 1290, coins: 130, emoji: "🐟", category: "Приманки", rating: 4.9 },
  { id: 3, name: "Фидерное удилище", price: 5200, coins: 520, emoji: "🪝", category: "Удилища", rating: 4.7 },
  { id: 4, name: "Прикормка карп 1кг", price: 390, coins: 40, emoji: "🌾", category: "Прикормки", rating: 4.6 },
  { id: 5, name: "Эхолот Deeper Pro", price: 18900, coins: 1890, emoji: "📡", category: "Электроника", rating: 5.0 },
  { id: 6, name: "Карповая рыболовная сеть", price: 790, coins: 79, emoji: "🕸️", category: "Снасти", rating: 4.5 },
]

const CATEGORIES = ["Все", "Удилища", "Приманки", "Прикормки", "Снасти", "Электроника"]

export function MarketPage() {
  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-hide pb-4">
      <div className="px-4 pt-6 pb-3">
        <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>Маркет</h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Снасти за рубли и Fishcoins</p>
      </div>

      <div className="px-4 mb-4">
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <Icon name="Search" size={16} style={{ color: "var(--text-secondary)" }} />
          <input className="flex-1 bg-transparent text-sm outline-none" placeholder="Поиск снастей..."
            style={{ color: "var(--text-primary)" }} />
        </div>
      </div>

      <div className="flex gap-2 px-4 mb-4 overflow-x-auto scrollbar-hide">
        {CATEGORIES.map((c, i) => (
          <button key={c} className="px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all"
            style={{
              background: i === 0 ? "var(--accent-blue)" : "rgba(255,255,255,0.06)",
              color: i === 0 ? "#fff" : "var(--text-secondary)",
              border: `1px solid ${i === 0 ? "transparent" : "rgba(255,255,255,0.08)"}`,
            }}>
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 px-4">
        {PRODUCTS.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, type: "spring", stiffness: 300, damping: 24 }}
            className="glass-card p-4 flex flex-col gap-3"
            style={{ borderRadius: "24px" }}
          >
            <div className="w-full aspect-square rounded-2xl flex items-center justify-center text-5xl"
              style={{ background: "rgba(255,255,255,0.04)" }}>
              {p.emoji}
            </div>

            <div>
              <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(61,155,255,0.15)", color: "var(--accent-blue)" }}>
                {p.category}
              </span>
              <p className="font-semibold text-sm mt-2 leading-snug" style={{ color: "var(--text-primary)" }}>{p.name}</p>
              <div className="flex items-center gap-1 mt-1">
                <Icon name="Star" size={11} style={{ color: "var(--accent-gold)", fill: "var(--accent-gold)" }} />
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{p.rating}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button className="w-full py-2 rounded-xl text-xs font-bold"
                style={{ background: "rgba(255,255,255,0.08)", color: "var(--text-primary)" }}>
                {p.price.toLocaleString("ru")} ₽
              </button>
              <button className="w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1"
                style={{ background: "rgba(255,214,10,0.15)", border: "1px solid rgba(255,214,10,0.3)", color: "var(--accent-gold)" }}>
                <Icon name="Coins" size={12} style={{ color: "var(--accent-gold)" }} />
                {p.coins} FC
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
