import { useState } from "react"
import { motion } from "framer-motion"
import { Heart, MapPin, Fish, Weight, Anchor } from "lucide-react"

const MOCK_POSTS = [
  {
    id: 1,
    user: { name: "Алексей К.", avatar: "🎣", rank: "Мастер" },
    photo: "/placeholder.jpg",
    fish: "Щука",
    weight: "4.2 кг",
    gear: "Спиннинг",
    location: "Волга, Самара",
    likes: 48,
    liked: false,
    text: "Отличная утренняя рыбалка! Щучка взяла на виброхвост у камышей. Вода +12°C, давление 758.",
  },
  {
    id: 2,
    user: { name: "Дмитрий П.", avatar: "🐟", rank: "Эксперт" },
    photo: "/placeholder.jpg",
    fish: "Судак",
    weight: "2.8 кг",
    gear: "Фидер",
    location: "Ока, Нижний",
    likes: 31,
    liked: true,
    text: "Ночная сессия дала результат. Судак очень активен после захода солнца на течении.",
  },
  {
    id: 3,
    user: { name: "Сергей М.", avatar: "🎏", rank: "Новичок" },
    photo: "/placeholder.jpg",
    fish: "Карп",
    weight: "6.1 кг",
    gear: "Карповое удилище",
    location: "Горьковское водохр.",
    likes: 92,
    liked: false,
    text: "Первый трофейный карп! Брал на кукурузу + бойл клубника. Борьба 15 минут — незабываемо!",
  },
  {
    id: 4,
    user: { name: "Михаил В.", avatar: "🦈", rank: "Мастер" },
    photo: "/placeholder.jpg",
    fish: "Сом",
    weight: "18.5 кг",
    gear: "Донка",
    location: "Дон, Ростов",
    likes: 214,
    liked: false,
    text: "Сомяра! Снасть чуть не утащило. Крупный, жирный — отпустил обратно. Удачи всем!",
  },
]

export function FeedView() {
  const [posts, setPosts] = useState(MOCK_POSTS)

  const toggleLike = (id: number) => {
    setPosts(prev => prev.map(p =>
      p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ))
  }

  return (
    <div className="h-full overflow-y-auto" style={{ WebkitOverflowScrolling: "touch" }}>
      <div className="flex flex-col gap-4 px-4 pt-5 pb-6">
        {posts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, type: "spring", stiffness: 300, damping: 26 }}
            className="rounded-[28px] overflow-hidden"
            style={{
              background: "var(--card-glass)",
              backdropFilter: "blur(40px) saturate(180%)",
              WebkitBackdropFilter: "blur(40px) saturate(180%)",
              border: "1px solid var(--card-border)",
              boxShadow: "0 8px 32px var(--card-shadow-color)",
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 pt-4 pb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: "rgba(61,155,255,0.12)", border: "1px solid rgba(61,155,255,0.25)" }}
              >
                {post.user.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm leading-tight" style={{ color: "var(--profile-text)" }}>
                  {post.user.name}
                </p>
                <p className="text-[11px]" style={{ color: "#3d9bff" }}>{post.user.rank}</p>
              </div>
              <div className="flex items-center gap-1" style={{ color: "var(--profile-sub)" }}>
                <MapPin size={11} />
                <span className="text-[11px]">{post.location}</span>
              </div>
            </div>

            {/* Photo */}
            <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
              <img
                src={post.photo}
                alt={post.fish}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)" }}
              />
            </div>

            {/* Text */}
            <div className="px-4 pt-3">
              <p className="text-sm leading-relaxed" style={{ color: "var(--profile-text)" }}>{post.text}</p>
            </div>

            {/* Bubbles */}
            <div className="flex gap-2 px-4 pt-3 flex-wrap">
              {[
                { icon: Fish, label: post.fish, color: "#32ade6" },
                { icon: Weight, label: post.weight, color: "#30d158" },
                { icon: Anchor, label: post.gear, color: "#3d9bff" },
              ].map(b => (
                <div
                  key={b.label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <b.icon size={12} style={{ color: b.color }} />
                  <span className="text-[11px] font-medium" style={{ color: "var(--profile-text)" }}>{b.label}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 px-4 py-4">
              <motion.button
                whileTap={{ scale: 0.82 }}
                onClick={() => toggleLike(post.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full transition-all"
                style={{
                  background: post.liked ? "rgba(255,69,58,0.18)" : "rgba(255,255,255,0.07)",
                  border: `1px solid ${post.liked ? "rgba(255,69,58,0.4)" : "rgba(255,255,255,0.1)"}`,
                }}
              >
                <Heart
                  size={15}
                  style={{
                    color: post.liked ? "#ff453a" : "var(--profile-sub)",
                    fill: post.liked ? "#ff453a" : "none",
                  }}
                />
                <span
                  className="text-xs font-semibold"
                  style={{ color: post.liked ? "#ff453a" : "var(--profile-sub)" }}
                >
                  {post.likes}
                </span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full ml-auto"
                style={{ background: "rgba(61,155,255,0.14)", border: "1px solid rgba(61,155,255,0.3)" }}
              >
                <MapPin size={13} style={{ color: "#3d9bff" }} />
                <span className="text-xs font-semibold" style={{ color: "#3d9bff" }}>Где это?</span>
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}