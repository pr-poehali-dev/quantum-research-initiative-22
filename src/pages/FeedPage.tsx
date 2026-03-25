import { useState } from "react"
import { motion } from "framer-motion"
import Icon from "@/components/ui/icon"

const MOCK_POSTS = [
  {
    id: 1,
    user: { name: "Алексей К.", avatar: "🎣", rank: "Мастер" },
    photos: ["/placeholder.jpg"],
    fish: "Щука",
    weight: "4.2 кг",
    gear: "Спиннинг",
    location: "Волга, Самарская обл.",
    likes: 48,
    time: "2 часа назад",
    liked: false,
  },
  {
    id: 2,
    user: { name: "Дмитрий П.", avatar: "🐟", rank: "Эксперт" },
    photos: ["/placeholder.jpg"],
    fish: "Судак",
    weight: "2.8 кг",
    gear: "Фидер",
    location: "Ока, Нижегородская обл.",
    likes: 31,
    time: "5 часов назад",
    liked: true,
  },
  {
    id: 3,
    user: { name: "Сергей М.", avatar: "🎏", rank: "Новичок" },
    photos: ["/placeholder.jpg"],
    fish: "Карп",
    weight: "6.1 кг",
    gear: "Карповое удилище",
    location: "Водохранилище Горьковское",
    likes: 92,
    time: "1 день назад",
    liked: false,
  },
]

export function FeedPage() {
  const [posts, setPosts] = useState(MOCK_POSTS)

  const toggleLike = (id: number) => {
    setPosts(prev =>
      prev.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p)
    )
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-hide pb-4">
      <div className="px-4 pt-6 pb-3 flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Лента улова</h1>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card-light">
          <Icon name="Coins" size={14} style={{ color: "var(--accent-gold)" }} />
          <span className="text-sm font-semibold" style={{ color: "var(--accent-gold)" }}>500</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-4">
        {posts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, type: "spring", stiffness: 300, damping: 24 }}
            className="glass-card overflow-hidden"
          >
            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                style={{ background: "rgba(61,155,255,0.15)", border: "1px solid rgba(61,155,255,0.3)" }}>
                {post.user.avatar}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{post.user.name}</p>
                <p className="text-xs" style={{ color: "var(--accent-blue)" }}>{post.user.rank}</p>
              </div>
              <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{post.time}</span>
            </div>

            <div className="relative w-full aspect-video bg-gray-900 overflow-hidden">
              <img src={post.photos[0]} alt="улов" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(11,13,15,0.7) 0%, transparent 50%)" }} />
            </div>

            <div className="p-4 flex gap-2 flex-wrap">
              {[
                { icon: "Fish", label: post.fish, color: "var(--accent-teal)" },
                { icon: "Weight", label: post.weight, color: "var(--accent-green)" },
                { icon: "Anchor", label: post.gear, color: "var(--accent-blue)" },
              ].map(b => (
                <div key={b.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <Icon name={b.icon} size={12} style={{ color: b.color }} />
                  <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{b.label}</span>
                </div>
              ))}
            </div>

            <div className="px-4 pb-4 flex items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => toggleLike(post.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-full transition-all"
                style={{
                  background: post.liked ? "rgba(255,69,58,0.2)" : "rgba(255,255,255,0.06)",
                  border: `1px solid ${post.liked ? "rgba(255,69,58,0.4)" : "rgba(255,255,255,0.08)"}`,
                }}
              >
                <Icon name={post.liked ? "Heart" : "Heart"} size={16}
                  style={{ color: post.liked ? "var(--accent-red)" : "var(--text-secondary)", fill: post.liked ? "var(--accent-red)" : "none" }} />
                <span className="text-xs font-medium" style={{ color: post.liked ? "var(--accent-red)" : "var(--text-secondary)" }}>{post.likes}</span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full ml-auto"
                style={{ background: "rgba(61,155,255,0.15)", border: "1px solid rgba(61,155,255,0.3)" }}
              >
                <Icon name="MapPin" size={14} style={{ color: "var(--accent-blue)" }} />
                <span className="text-xs font-medium" style={{ color: "var(--accent-blue)" }}>Где это?</span>
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
