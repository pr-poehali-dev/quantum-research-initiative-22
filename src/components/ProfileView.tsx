import { useRef } from "react"
import { motion } from "framer-motion"
import { Coins, Fish, MapPin, Heart, Trophy } from "lucide-react"

const RANKS = [
  { name: "Новичок", min: 0, emoji: "🎣" },
  { name: "Любитель", min: 200, emoji: "🐟" },
  { name: "Рыбак", min: 500, emoji: "🎏" },
  { name: "Мастер", min: 1000, emoji: "🏆" },
  { name: "Эксперт", min: 2500, emoji: "⚡" },
  { name: "Легенда", min: 5000, emoji: "👑" },
]

const TROPHIES = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: i === 0 ? "Первая рыба" : i === 1 ? "10 уловов" : i === 2 ? "Ночная ловля" : `Трофей #${i + 1}`,
  emoji: i === 0 ? "🐟" : i === 1 ? "🏅" : i === 2 ? "🌙" : "🔒",
  unlocked: i < 1,
}))

const STATS = [
  { label: "Уловов", value: "3", icon: Fish, color: "#32ade6" },
  { label: "Маркеров", value: "1", icon: MapPin, color: "#3d9bff" },
  { label: "Лайков", value: "48", icon: Heart, color: "#ff453a" },
]

const COINS = 500

export function ProfileView() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const currentRank = RANKS.filter(r => COINS >= r.min).at(-1)!
  const nextRank = RANKS.find(r => r.min > COINS)
  const progress = nextRank
    ? Math.round(((COINS - currentRank.min) / (nextRank.min - currentRank.min)) * 100)
    : 100

  return (
    <div className="h-full overflow-y-auto" style={{ WebkitOverflowScrolling: "touch" }}>
      <div className="flex flex-col gap-4 px-4 pt-5 pb-6">

        {/* Profile hero card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[28px] p-5 flex flex-col items-center gap-4"
          style={{
            background: "var(--card-glass)",
            backdropFilter: "blur(40px) saturate(180%)",
            WebkitBackdropFilter: "blur(40px) saturate(180%)",
            border: "1px solid var(--card-border)",
            boxShadow: "0 8px 32px var(--card-shadow-color)",
          }}
        >
          {/* Avatar */}
          <div className="relative">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
              style={{
                background: "rgba(61,155,255,0.12)",
                border: "2px solid rgba(61,155,255,0.35)",
              }}
            >
              🎣
            </div>
            <div
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-sm"
              style={{
                background: "var(--card-glass)",
                border: "1.5px solid rgba(255,214,10,0.5)",
              }}
            >
              {currentRank.emoji}
            </div>
          </div>

          <div className="text-center">
            <h2 className="font-bold text-xl" style={{ color: "var(--profile-text)" }}>Рыбак_2024</h2>
            <p className="text-sm font-medium mt-0.5" style={{ color: "#3d9bff" }}>{currentRank.name}</p>
          </div>

          {/* Fishcoins badge */}
          <div
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl"
            style={{
              background: "rgba(255,214,10,0.1)",
              border: "1px solid rgba(255,214,10,0.28)",
            }}
          >
            <Coins size={18} style={{ color: "#ffd60a" }} />
            <span className="font-bold text-xl" style={{ color: "#ffd60a" }}>{COINS}</span>
            <span className="text-sm" style={{ color: "rgba(255,214,10,0.7)" }}>Fishcoins</span>
          </div>

          {/* Progress bar */}
          {nextRank && (
            <div className="w-full">
              <div className="flex justify-between mb-1.5">
                <span className="text-[11px]" style={{ color: "var(--profile-sub)" }}>До ранга «{nextRank.name}»</span>
                <span className="text-[11px]" style={{ color: "var(--profile-sub)" }}>ещё {nextRank.min - COINS} FC</span>
              </div>
              <div className="w-full h-2 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  style={{
                    background: "linear-gradient(90deg, #3d9bff, #32ade6)",
                    boxShadow: "0 0 8px rgba(61,155,255,0.5)",
                  }}
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              className="rounded-[20px] p-3 flex flex-col items-center gap-1.5"
              style={{
                background: "var(--card-glass)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid var(--card-border)",
              }}
            >
              <s.icon size={18} style={{ color: s.color }} />
              <span className="font-bold text-lg leading-none" style={{ color: "var(--profile-text)" }}>{s.value}</span>
              <span className="text-[11px]" style={{ color: "var(--profile-sub)" }}>{s.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Trophies */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-[28px] p-4"
          style={{
            background: "var(--card-glass)",
            backdropFilter: "blur(40px) saturate(180%)",
            WebkitBackdropFilter: "blur(40px) saturate(180%)",
            border: "1px solid var(--card-border)",
            boxShadow: "0 8px 32px var(--card-shadow-color)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Trophy size={16} style={{ color: "#ffd60a" }} />
            <h3 className="font-semibold text-sm" style={{ color: "var(--profile-text)" }}>Трофеи</h3>
            <span className="text-xs ml-auto" style={{ color: "var(--profile-sub)" }}>1 / 100</span>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto pb-1"
            style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
          >
            {TROPHIES.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Math.min(i * 0.015, 0.6) }}
                className="flex-shrink-0 flex flex-col items-center gap-1.5"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                  style={{
                    background: t.unlocked ? "rgba(255,214,10,0.12)" : "rgba(255,255,255,0.04)",
                    border: `1.5px solid ${t.unlocked ? "rgba(255,214,10,0.4)" : "rgba(255,255,255,0.07)"}`,
                    boxShadow: t.unlocked ? "0 0 16px rgba(255,214,10,0.18)" : "none",
                    filter: t.unlocked ? "none" : "grayscale(1) opacity(0.35)",
                  }}
                >
                  {t.emoji}
                </div>
                <span
                  className="text-[9px] text-center w-14 leading-tight"
                  style={{ color: t.unlocked ? "#ffd60a" : "var(--profile-sub)" }}
                >
                  {t.unlocked ? t.name : `#${t.id}`}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
