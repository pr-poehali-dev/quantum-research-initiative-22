import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Icon from "@/components/ui/icon"

const TIPS = [
  "🌙 Ночная рыбалка на сома — самое время!",
  "🌊 Щука активна в холодной воде при давлении 755 мм",
  "🌧️ После дождя карп выходит на мелководье",
  "☀️ Утренний клёв судака — первые 2 часа после рассвета",
  "❄️ Зимой окунь берёт на мормышку глубже 4 метров",
  "🌿 Летом карп держится у камышей на закате",
]

const FORECASTS = [
  { day: "Сегодня", score: 9, icon: "⚡", desc: "Клёв отличный", color: "var(--accent-green)" },
  { day: "Завтра", score: 6, icon: "🌤️", desc: "Клёв средний", color: "var(--accent-gold)" },
  { day: "Послезавтра", score: 4, icon: "🌧️", desc: "Клёв слабый", color: "var(--accent-red)" },
]

export function LuckyPage() {
  const [spinning, setSpinning] = useState(false)
  const [tip, setTip] = useState(TIPS[0])
  const [revealed, setRevealed] = useState(false)

  const spin = () => {
    if (spinning) return
    setSpinning(true)
    setRevealed(false)
    setTimeout(() => {
      setTip(TIPS[Math.floor(Math.random() * TIPS.length)])
      setSpinning(false)
      setRevealed(true)
    }, 1200)
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-hide pb-4">
      <div className="px-4 pt-6 pb-3">
        <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>Удача</h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Прогноз клёва и советы рыбака</p>
      </div>

      {/* Lucky spin */}
      <div className="px-4 mb-6">
        <div className="glass-card p-6 flex flex-col items-center gap-4">
          <motion.button
            onClick={spin}
            whileTap={{ scale: 0.92 }}
            animate={spinning ? { rotate: 360 } : { rotate: 0 }}
            transition={spinning ? { duration: 1, repeat: 1, ease: "easeInOut" } : {}}
            className="w-24 h-24 rounded-full flex items-center justify-center text-5xl shadow-2xl"
            style={{
              background: "radial-gradient(circle, rgba(255,214,10,0.25), rgba(255,140,0,0.1))",
              border: "2px solid rgba(255,214,10,0.4)",
              boxShadow: "0 0 40px rgba(255,214,10,0.3)",
            }}
          >
            🎰
          </motion.button>

          <AnimatePresence mode="wait">
            {revealed && (
              <motion.div
                key={tip}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="text-center px-4 py-3 rounded-2xl"
                style={{ background: "rgba(255,214,10,0.1)", border: "1px solid rgba(255,214,10,0.2)" }}
              >
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{tip}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={spin}
            disabled={spinning}
            className="px-8 py-3 rounded-2xl font-bold text-sm transition-all"
            style={{
              background: spinning ? "rgba(255,255,255,0.05)" : "rgba(255,214,10,0.2)",
              border: `1px solid ${spinning ? "rgba(255,255,255,0.1)" : "rgba(255,214,10,0.4)"}`,
              color: spinning ? "var(--text-secondary)" : "var(--accent-gold)",
            }}
          >
            {spinning ? "Гадаю..." : "Узнать удачу (-5 FC)"}
          </button>
        </div>
      </div>

      {/* Клёв прогноз */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Прогноз клёва</h2>
        <div className="flex flex-col gap-3">
          {FORECASTS.map((f, i) => (
            <motion.div
              key={f.day}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card-light flex items-center gap-4 px-4 py-4"
            >
              <span className="text-2xl">{f.icon}</span>
              <div className="flex-1">
                <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{f.day}</p>
                <p className="text-xs" style={{ color: f.color }}>{f.desc}</p>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-20 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${f.score * 10}%`, background: f.color, boxShadow: `0 0 8px ${f.color}` }} />
                </div>
                <span className="text-xs font-bold ml-2" style={{ color: f.color }}>{f.score}/10</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Советы */}
      <div className="px-4">
        <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Советы дня</h2>
        <div className="flex flex-col gap-2">
          {TIPS.slice(0, 4).map((t, i) => (
            <div key={i} className="glass-card-light flex items-start gap-3 px-4 py-3">
              <Icon name="Lightbulb" size={16} style={{ color: "var(--accent-gold)", marginTop: 2, flexShrink: 0 }} />
              <p className="text-sm" style={{ color: "var(--text-primary)" }}>{t}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
