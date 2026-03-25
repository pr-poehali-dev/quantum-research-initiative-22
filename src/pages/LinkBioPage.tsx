import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ProfileSection } from "@/components/ProfileSection"
import { LinkCard } from "@/components/LinkCard"
import { SocialFooter } from "@/components/SocialFooter"
import { FeedView } from "@/components/FeedView"
import { MapView } from "@/components/MapView"
import { ProfileView } from "@/components/ProfileView"
import { useTheme } from "@/hooks/useTheme"
import {
  Globe, Youtube, Mail, FileText, MessageCircle, Send,
  Sun, Moon, LayoutList, Map, User, ArrowLeft
} from "lucide-react"
import "leaflet/dist/leaflet.css"

type Screen = "home" | "feed" | "map" | "profile"

const socials = [
  { icon: Send, href: "#", label: "Telegram" },
  { icon: MessageCircle, href: "#", label: "WhatsApp" },
  { icon: Mail, href: "#", label: "Email" },
]

const extraLinks = [
  { title: "YouTube канал", description: "Видео с рыбалки", href: "#", icon: Youtube },
  { title: "Гайды и советы", description: "Техники ловли и снасти", href: "#", icon: FileText },
  { title: "Сайт проекта", description: "Vreke.ru", href: "#", icon: Globe },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 350, damping: 25 } },
}

const TAB_ITEMS = [
  { id: "feed" as Screen, label: "Лента", icon: LayoutList },
  { id: "map" as Screen, label: "Карта", icon: Map },
  { id: "profile" as Screen, label: "Профиль", icon: User },
]

// Animated background — reused across screens
function Background({ isDark }: { isDark: boolean }) {
  return (
    <>
      <motion.div className="fixed z-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--orb1) 0%, transparent 70%)", filter: "blur(60px)", top: "-10%", left: "-10%" }}
        animate={{ x: [0, 100, 50, 0], y: [0, 50, 100, 0], scale: [1, 1.2, 0.9, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div className="fixed z-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--orb2) 0%, transparent 70%)", filter: "blur(80px)", top: "30%", right: "-20%" }}
        animate={{ x: [0, -80, -40, 0], y: [0, 80, -40, 0], scale: [1, 0.85, 1.15, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div className="fixed z-0 w-[450px] h-[450px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--orb3) 0%, transparent 70%)", filter: "blur(70px)", bottom: "-5%", left: "20%" }}
        animate={{ x: [0, 60, -30, 0], y: [0, -60, 30, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      {!isDark && (
        <motion.div className="fixed inset-0 z-0 pointer-events-none opacity-50"
          animate={{
            background: [
              "radial-gradient(ellipse 80% 60% at 20% 30%, rgba(255,255,255,0.6), transparent 50%)",
              "radial-gradient(ellipse 80% 60% at 60% 20%, rgba(255,255,255,0.6), transparent 50%)",
              "radial-gradient(ellipse 80% 60% at 20% 30%, rgba(255,255,255,0.6), transparent 50%)",
            ],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <motion.div className="fixed z-0 pointer-events-none"
        style={{
          width: "200%", height: "90px",
          background: "linear-gradient(90deg, transparent, var(--shine), transparent)",
          transform: "rotate(-35deg)", top: "20%", left: "-50%",
        }}
        animate={{ left: ["-50%", "100%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", repeatDelay: 5 }}
      />
      <div className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: "var(--noise-opacity)",
        }}
      />
    </>
  )
}

// Tab Bar
function TabBar({ active, onSelect }: { active: Screen; onSelect: (s: Screen) => void }) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[9998] flex items-center justify-around px-2 py-2"
      style={{
        background: "var(--card-glass)",
        backdropFilter: "blur(28px) saturate(180%)",
        WebkitBackdropFilter: "blur(28px) saturate(180%)",
        borderTop: "1px solid var(--card-border)",
        paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom, 0px))",
      }}
    >
      {TAB_ITEMS.map(tab => {
        const isActive = active === tab.id
        return (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.88 }}
            onClick={() => onSelect(tab.id)}
            className="flex flex-col items-center gap-1 px-4 py-1.5 rounded-2xl transition-all"
            style={{
              background: isActive ? "rgba(61,155,255,0.14)" : "transparent",
              minWidth: 64,
            }}
          >
            <tab.icon
              size={22}
              style={{ color: isActive ? "#3d9bff" : "var(--profile-sub)", strokeWidth: isActive ? 2.2 : 1.6 }}
            />
            <span
              className="text-[10px] font-semibold"
              style={{ color: isActive ? "#3d9bff" : "var(--profile-sub)" }}
            >
              {tab.label}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}

export function LinkBioPage() {
  const { theme, toggle } = useTheme()
  const isDark = theme === "dark"
  const [screen, setScreen] = useState<Screen>("home")

  const isInner = screen !== "home"

  return (
    <div
      className="relative"
      style={{
        background: "var(--bg-gradient)",
        minHeight: "100dvh",
        height: "100dvh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Background isDark={isDark} />

      {/* Theme toggle */}
      <div className="fixed top-4 right-4 z-[9999]">
        <motion.button
          onClick={toggle}
          whileTap={{ scale: 0.88 }}
          whileHover={{ scale: 1.08 }}
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{
            background: "var(--card-glass)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid var(--card-border)",
            boxShadow: "0 2px 12px var(--card-shadow-color)",
            color: "var(--profile-text)",
          }}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </motion.button>
      </div>

      {/* Back button for inner screens (not map — has its own layout) */}
      {isInner && screen !== "map" && (
        <div className="fixed top-4 left-4 z-[9999]">
          <motion.button
            onClick={() => setScreen("home")}
            whileTap={{ scale: 0.88 }}
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{
              background: "var(--card-glass)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid var(--card-border)",
              color: "var(--profile-text)",
            }}
          >
            <ArrowLeft size={16} />
          </motion.button>
        </div>
      )}

      {/* Screens */}
      <AnimatePresence mode="wait">
        {screen === "home" && (
          <motion.main
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 flex-1 overflow-y-auto px-6 py-10 flex flex-col"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="mx-auto max-w-[400px] w-full flex flex-col flex-1 justify-between"
            >
              <motion.div variants={itemVariants} className="pt-2">
                <ProfileSection
                  name="Vreke"
                  bio="Сообщество рыбаков России 🎣"
                  imageUrl="/images/544291433-18043960274659947-5766591717842883293-n.jpg"
                />
              </motion.div>

              <motion.div className="space-y-3 py-8" variants={containerVariants}>
                {/* Main action cards */}
                <motion.div variants={itemVariants}>
                  <LinkCard
                    title="Лента уловов"
                    description="Свежие трофеи рыбаков"
                    href="#"
                    icon={LayoutList}
                    onClick={(e) => { e?.preventDefault(); setScreen("feed") }}
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <LinkCard
                    title="Карта точек"
                    description="Маркеры и места клёва"
                    href="#"
                    icon={Map}
                    onClick={(e) => { e?.preventDefault(); setScreen("map") }}
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <LinkCard
                    title="Профиль"
                    description="Fishcoins, ранг, трофеи"
                    href="#"
                    icon={User}
                    onClick={(e) => { e?.preventDefault(); setScreen("profile") }}
                  />
                </motion.div>

                {/* Extra links */}
                {extraLinks.map(link => (
                  <motion.div key={link.title} variants={itemVariants}>
                    <LinkCard {...link} />
                  </motion.div>
                ))}
              </motion.div>

              <motion.div variants={itemVariants} className="pb-2">
                <SocialFooter socials={socials} copyright="2025 Vreke" />
              </motion.div>
            </motion.div>
          </motion.main>
        )}

        {screen === "feed" && (
          <motion.div
            key="feed"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="relative z-10 flex-1 pt-16 pb-20 overflow-hidden"
          >
            <FeedView />
          </motion.div>
        )}

        {screen === "map" && (
          <motion.div
            key="map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="relative z-10 flex-1 pb-16 overflow-hidden"
            style={{ display: "flex", flexDirection: "column" }}
          >
            {/* Map back button */}
            <div className="absolute top-4 left-4 z-[9999]">
              <motion.button
                onClick={() => setScreen("home")}
                whileTap={{ scale: 0.88 }}
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{
                  background: "rgba(18,18,22,0.75)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#fff",
                }}
              >
                <ArrowLeft size={16} />
              </motion.button>
            </div>
            <MapView />
          </motion.div>
        )}

        {screen === "profile" && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="relative z-10 flex-1 pt-16 pb-20 overflow-hidden"
          >
            <ProfileView />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab Bar — only on inner screens */}
      {isInner && <TabBar active={screen} onSelect={setScreen} />}
    </div>
  )
}
