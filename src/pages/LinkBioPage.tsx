import { motion } from "framer-motion"
import { ProfileSection } from "@/components/ProfileSection"
import { LinkCard } from "@/components/LinkCard"
import { SocialFooter } from "@/components/SocialFooter"
import { Globe, Youtube, Mail, ShoppingBag, FileText, MessageCircle, Send, Sun, Moon } from "lucide-react"
import { useTheme } from "@/hooks/useTheme"

const links = [
  {
    title: "Лента уловов",
    description: "Свежие трофеи рыбаков",
    href: "#",
    icon: Globe,
  },
  {
    title: "Карта точек",
    description: "Маркеры и места клёва",
    href: "#",
    icon: ShoppingBag,
  },
  {
    title: "YouTube канал",
    description: "Видео с рыбалки",
    href: "#",
    icon: Youtube,
  },
  {
    title: "Telegram сообщество",
    description: "Чат рыбаков",
    href: "#",
    icon: Send,
  },
  {
    title: "Гайды и советы",
    description: "Техники ловли и снасти",
    href: "#",
    icon: FileText,
  },
]

const socials = [
  { icon: Send, href: "#", label: "Telegram" },
  { icon: MessageCircle, href: "#", label: "WhatsApp" },
  { icon: Mail, href: "#", label: "Email" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 350,
      damping: 25,
    },
  },
}

export function LinkBioPage() {
  const { theme, toggle } = useTheme()
  const isDark = theme === "dark"

  return (
    <main className="relative min-h-screen px-6 py-10 flex flex-col overflow-hidden" style={{ background: "var(--bg-gradient)" }}>

      {/* Theme toggle */}
      <div className="fixed top-4 right-4 z-50">
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
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </motion.button>
      </div>

      {/* Animated gradient orbs */}
      <motion.div
        className="fixed z-0 w-[500px] h-[500px] rounded-full"
        style={{
          background: `radial-gradient(circle, var(--orb1) 0%, transparent 70%)`,
          filter: "blur(60px)",
          top: "-10%",
          left: "-10%",
        }}
        animate={{ x: [0, 100, 50, 0], y: [0, 50, 100, 0], scale: [1, 1.2, 0.9, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="fixed z-0 w-[600px] h-[600px] rounded-full"
        style={{
          background: `radial-gradient(circle, var(--orb2) 0%, transparent 70%)`,
          filter: "blur(80px)",
          top: "30%",
          right: "-20%",
        }}
        animate={{ x: [0, -80, -40, 0], y: [0, 80, -40, 0], scale: [1, 0.85, 1.15, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="fixed z-0 w-[450px] h-[450px] rounded-full"
        style={{
          background: `radial-gradient(circle, var(--orb3) 0%, transparent 70%)`,
          filter: "blur(70px)",
          bottom: "-5%",
          left: "20%",
        }}
        animate={{ x: [0, 60, -30, 0], y: [0, -60, 30, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="fixed z-0 w-[350px] h-[350px] rounded-full"
        style={{
          background: `radial-gradient(circle, var(--orb4) 0%, transparent 70%)`,
          filter: "blur(50px)",
          top: "60%",
          left: "-5%",
        }}
        animate={{ x: [0, 40, 80, 0], y: [0, -40, 20, 0], scale: [1, 1.2, 1, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Animated light overlay */}
      {!isDark && (
        <motion.div
          className="fixed inset-0 z-0 pointer-events-none opacity-60"
          animate={{
            background: [
              "radial-gradient(ellipse 80% 60% at 20% 30%, rgba(255,255,255,0.6), transparent 50%), radial-gradient(ellipse 60% 80% at 80% 70%, rgba(255,255,255,0.4), transparent 50%)",
              "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(255,255,255,0.6), transparent 50%), radial-gradient(ellipse 60% 80% at 30% 80%, rgba(255,255,255,0.4), transparent 50%)",
              "radial-gradient(ellipse 80% 60% at 80% 40%, rgba(255,255,255,0.6), transparent 50%), radial-gradient(ellipse 60% 80% at 60% 60%, rgba(255,255,255,0.4), transparent 50%)",
              "radial-gradient(ellipse 80% 60% at 20% 30%, rgba(255,255,255,0.6), transparent 50%), radial-gradient(ellipse 60% 80% at 80% 70%, rgba(255,255,255,0.4), transparent 50%)",
            ],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Shine sweep */}
      <motion.div
        className="fixed z-0 pointer-events-none"
        style={{
          width: "200%",
          height: "100px",
          background: `linear-gradient(90deg, transparent, var(--shine), transparent)`,
          transform: "rotate(-35deg)",
          top: "20%",
          left: "-50%",
        }}
        animate={{ left: ["-50%", "100%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", repeatDelay: 4 }}
      />

      {/* Noise texture */}
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: "var(--noise-opacity)",
        }}
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 mx-auto max-w-[400px] w-full flex flex-col flex-1 justify-between"
      >
        <motion.div variants={itemVariants} className="pt-2">
          <ProfileSection
            name="FishApp"
            bio="Сообщество рыбаков России 🎣"
            imageUrl="/images/544291433-18043960274659947-5766591717842883293-n.jpg"
          />
        </motion.div>

        <motion.div className="space-y-3 py-8" variants={containerVariants}>
          {links.map((link) => (
            <motion.div key={link.title} variants={itemVariants}>
              <LinkCard {...link} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={itemVariants} className="pb-2">
          <SocialFooter socials={socials} copyright="2025 FishApp" />
        </motion.div>
      </motion.div>
    </main>
  )
}
