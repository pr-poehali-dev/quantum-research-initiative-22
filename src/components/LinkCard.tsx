import { motion } from "framer-motion"
import { ChevronRight, type LucideIcon } from "lucide-react"

interface LinkCardProps {
  title: string
  description?: string
  href: string
  icon: LucideIcon
  onClick?: () => void
}

export function LinkCard({ title, description, href, icon: Icon, onClick }: LinkCardProps) {
  return (
    <motion.a
      href={href}
      target={href !== "#" ? "_blank" : undefined}
      rel="noopener noreferrer"
      onClick={onClick}
      className="group relative flex w-full items-center gap-4 rounded-[20px] px-4 py-4 overflow-hidden cursor-pointer"
      style={{
        background: "var(--card-glass)",
        backdropFilter: "blur(40px) saturate(180%)",
        WebkitBackdropFilter: "blur(40px) saturate(180%)",
        boxShadow: `
          inset 0 1px 1px rgba(255, 255, 255, 0.4),
          inset 0 -1px 1px rgba(255, 255, 255, 0.05),
          0 0 0 1px var(--card-border),
          0 2px 4px var(--card-shadow-color),
          0 8px 16px var(--card-shadow-color),
          0 16px 32px var(--card-shadow-color)
        `,
        border: "1px solid var(--card-border)",
      }}
      whileHover={{
        scale: 1.02,
        y: -4,
      }}
      whileTap={{
        scale: 0.98,
        y: 0,
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-[50%] pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.03) 50%, transparent 100%)",
          borderRadius: "20px 20px 0 0",
        }}
      />

      <div
        className="absolute inset-x-0 bottom-0 h-[30%] pointer-events-none"
        style={{
          background: "linear-gradient(0deg, rgba(0,0,0,0.04) 0%, transparent 100%)",
          borderRadius: "0 0 20px 20px",
        }}
      />

      <motion.div
        className="absolute inset-0 pointer-events-none rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: "radial-gradient(ellipse at center, rgba(255,255,255,0.12), transparent 70%)",
        }}
      />

      <div
        className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
        style={{
          background: "var(--card-glass)",
          boxShadow: `
            inset 0 1px 2px rgba(255, 255, 255, 0.5),
            inset 0 -1px 1px rgba(0, 0, 0, 0.04),
            0 2px 4px var(--card-shadow-color)
          `,
          border: "1px solid var(--card-border)",
          color: "var(--profile-text)",
        }}
      >
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>

      <div className="relative flex-1 min-w-0">
        <h3 className="text-[15px] font-semibold tracking-tight" style={{ color: "var(--profile-text)" }}>{title}</h3>
        {description && <p className="text-[12px] truncate mt-0.5" style={{ color: "var(--profile-sub)" }}>{description}</p>}
      </div>

      <ChevronRight
        className="relative h-5 w-5 transition-all duration-200 group-hover:translate-x-0.5"
        strokeWidth={2}
        style={{ color: "var(--profile-sub)" }}
      />
    </motion.a>
  )
}
