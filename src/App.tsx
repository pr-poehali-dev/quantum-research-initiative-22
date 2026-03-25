import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Icon from "@/components/ui/icon"
import { FeedPage } from "@/pages/FeedPage"
import { MapPage } from "@/pages/MapPage"
import { MarketPage } from "@/pages/MarketPage"
import { LuckyPage } from "@/pages/LuckyPage"
import { ProfilePage } from "@/pages/ProfilePage"

const TABS = [
  { id: "feed", label: "Лента", icon: "LayoutList" },
  { id: "map", label: "Карта", icon: "Map" },
  { id: "market", label: "Маркет", icon: "ShoppingBag" },
  { id: "lucky", label: "Удача", icon: "Sparkles" },
  { id: "profile", label: "Профиль", icon: "User" },
]

function TabContent({ tab }: { tab: string }) {
  switch (tab) {
    case "feed": return <FeedPage />
    case "map": return <MapPage />
    case "market": return <MarketPage />
    case "lucky": return <LuckyPage />
    case "profile": return <ProfilePage />
    default: return <FeedPage />
  }
}

export default function App() {
  const [active, setActive] = useState("feed")

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* Sidebar — desktop only */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 py-8 px-4 gap-2 border-r"
        style={{ background: "rgba(28,28,30,0.8)", backdropFilter: "blur(25px)", borderColor: "rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-3 px-3 py-4 mb-4">
          <span className="text-3xl">🎣</span>
          <div>
            <h1 className="font-bold text-lg leading-tight" style={{ color: "var(--text-primary)" }}>FishApp</h1>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>для рыбаков</p>
          </div>
        </div>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all"
            style={{
              background: active === tab.id ? "rgba(61,155,255,0.15)" : "transparent",
              border: `1px solid ${active === tab.id ? "rgba(61,155,255,0.3)" : "transparent"}`,
              color: active === tab.id ? "var(--accent-blue)" : "var(--text-secondary)",
            }}
          >
            <Icon name={tab.icon} size={20} />
            <span className="font-medium text-sm">{tab.label}</span>
          </button>
        ))}

        <div className="mt-auto px-3 py-4 rounded-2xl"
          style={{ background: "rgba(255,214,10,0.08)", border: "1px solid rgba(255,214,10,0.15)" }}>
          <div className="flex items-center gap-2 mb-1">
            <Icon name="Coins" size={16} style={{ color: "var(--accent-gold)" }} />
            <span className="font-bold" style={{ color: "var(--accent-gold)" }}>500 Fishcoins</span>
          </div>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>+1 монета за 5 мин в приложении</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="flex-1 overflow-hidden"
            style={{ paddingBottom: active === "map" ? 0 : undefined }}
          >
            <TabContent tab={active} />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Tab Bar — mobile only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 tab-bar-safe"
        style={{
          background: "rgba(18,18,20,0.95)",
          backdropFilter: "blur(25px)",
          WebkitBackdropFilter: "blur(25px)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}>
        <div className="flex items-center justify-around px-2 py-2">
          {TABS.map(tab => {
            const isActive = active === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all min-w-[56px]"
                style={{
                  background: isActive ? "rgba(61,155,255,0.15)" : "transparent",
                }}
              >
                <Icon
                  name={tab.icon}
                  size={22}
                  style={{ color: isActive ? "var(--accent-blue)" : "var(--text-secondary)" }}
                />
                <span className="text-[10px] font-medium"
                  style={{ color: isActive ? "var(--accent-blue)" : "var(--text-secondary)" }}>
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Mobile content padding for tab bar */}
      <style>{`
        @media (max-width: 768px) {
          .flex-1.overflow-hidden > div {
            padding-bottom: 72px;
          }
        }
      `}</style>
    </div>
  )
}
