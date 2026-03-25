import { motion } from "framer-motion"
import { type LucideIcon } from "lucide-react"

interface SocialLink {
  icon: LucideIcon
  href: string
  label: string
}

interface SocialFooterProps {
  socials: SocialLink[]
  copyright: string
}

export function SocialFooter({ socials, copyright }: SocialFooterProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-full"
        style={{
          background: "var(--card-glass)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow: `
            inset 0 1px 1px rgba(255, 255, 255, 0.25),
            0 0 0 1px var(--card-border),
            0 2px 8px var(--card-shadow-color)
          `,
        }}
      >
        {socials.map((social) => (
          <motion.a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors"
            style={{ color: "var(--profile-sub)" }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 600, damping: 20 }}
          >
            <social.icon className="h-5 w-5" strokeWidth={1.5} />
          </motion.a>
        ))}
      </div>

      <p className="text-[11px]" style={{ color: "var(--profile-sub)" }}>{copyright}</p>
    </div>
  )
}
