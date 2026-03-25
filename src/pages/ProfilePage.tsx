import { useState, useRef } from "react"
import { motion } from "framer-motion"
import Icon from "@/components/ui/icon"

const RANKS = [
  { name: "Новичок", min: 0, icon: "🎣" },
  { name: "Любитель", min: 200, icon: "🐟" },
  { name: "Рыбак", min: 500, icon: "🎏" },
  { name: "Мастер", min: 1000, icon: "🏆" },
  { name: "Эксперт", min: 2500, icon: "⚡" },
  { name: "Легенда", min: 5000, icon: "👑" },
]

const TROPHIES = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: i === 0 ? "Первая рыба" : `Трофей #${i + 1}`,
  emoji: i === 0 ? "🐟" : "🔒",
  unlocked: i === 0,
}))

const STATS = [
  { label: "Уловов", value: "3", icon: "Fish", color: "var(--accent-teal)" },
  { label: "Маркеров", value: "1", icon: "MapPin", color: "var(--accent-blue)" },
  { label: "Лайков", value: "48", icon: "Heart", color: "var(--accent-red)" },
]

export function ProfilePage() {
  const coins = 500
  const currentRank = RANKS.filter(r => coins >= r.min).at(-1)!
  const nextRank = RANKS.find(r => r.min > coins)
  const progress = nextRank ? ((coins - currentRank.min) / (nextRank.min - currentRank.min)) * 100 : 100
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-hide pb-4">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <div className="glass-card p-5 flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
              style={{ background: "rgba(61,155,255,0.15)", border: "2px solid rgba(61,155,255,0.4)" }}>
              🎣
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-sm"
              style={{ background: "var(--card)", border: "1.5px solid rgba(255,214,10,0.5)" }}>
              {currentRank.icon}
            </div>
          </div>
          <div className="text-center">
            <h2 className="font-bold text-xl" style={{ color: "var(--text-primary)" }}>Рыбак_2024</h2>
            <p className="text-sm font-medium" style={{ color: "var(--accent-blue)" }}>{currentRank.name}</p>
          </div>

          {/* Fishcoins */}
          <div className="flex items-center gap-2 px-5 py-3 rounded-2xl"
            style={{ background: "rgba(255,214,10,0.1)", border: "1px solid rgba(255,214,10,0.25)" }}>
            <Icon name="Coins" size={20} style={{ color: "var(--accent-gold)" }} />
            <span className="font-bold text-xl" style={{ color: "var(--accent-gold)" }}>{coins}</span>
            <span className="text-sm" style={{ color: "var(--accent-gold)", opacity: 0.7 }}>Fishcoins</span>
          </div>

          {/* Progress to next rank */}
          {nextRank && (
            <div className="w-full">
              <div className="flex justify-between mb-2">
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>До ранга «{nextRank.name}»</span>
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{nextRank.min - coins} FC</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, var(--accent-blue), var(--accent-teal))", boxShadow: "0 0 8px rgba(61,155,255,0.5)" }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 px-4 mb-4">
        {STATS.map(s => (
          <div key={s.label} className="glass-card p-3 flex flex-col items-center gap-1" style={{ borderRadius: "20px" }}>
            <Icon name={s.icon} size={18} style={{ color: s.color }} />
            <span className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>{s.value}</span>
            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Trophies */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Трофеи</h2>
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>1 / 100</span>
        </div>
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
          style={{ cursor: "grab" }}
        >
          {TROPHIES.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(i * 0.02, 0.5) }}
              className="flex-shrink-0 flex flex-col items-center gap-1"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all"
                style={{
                  background: t.unlocked ? "rgba(255,214,10,0.15)" : "rgba(255,255,255,0.04)",
                  border: `1.5px solid ${t.unlocked ? "rgba(255,214,10,0.4)" : "rgba(255,255,255,0.06)"}`,
                  boxShadow: t.unlocked ? "0 0 16px rgba(255,214,10,0.2)" : "none",
                  filter: t.unlocked ? "none" : "grayscale(1) opacity(0.4)",
                }}
              >
                {t.emoji}
              </div>
              <span className="text-[9px] text-center w-14 truncate" style={{ color: t.unlocked ? "var(--accent-gold)" : "var(--text-secondary)" }}>
                {t.unlocked ? t.name : `#${t.id}`}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
