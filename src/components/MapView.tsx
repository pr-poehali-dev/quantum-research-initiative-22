import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet"
import L from "leaflet"
import { Plus, X, MapPin, AlertTriangle, MessageCircle, Send } from "lucide-react"

// Fix leaflet default icons
import iconUrl from "leaflet/dist/images/marker-icon.png"
import iconShadow from "leaflet/dist/images/marker-shadow.png"
L.Icon.Default.mergeOptions({ iconUrl, shadowUrl: iconShadow })

const MOCK_MARKERS = [
  { id: 1, lat: 55.76, lng: 37.64, user: "Алексей", fish: "Щука 4.2 кг", avatar: "🎣" },
  { id: 2, lat: 55.74, lng: 37.70, user: "Дмитрий", fish: "Судак 2.8 кг", avatar: "🐟" },
  { id: 3, lat: 55.79, lng: 37.58, user: "Игорь", fish: "Карп 6 кг", avatar: "🎏" },
]

function createPulseIcon(emoji: string) {
  return L.divIcon({
    html: `<div style="
      width:44px;height:44px;border-radius:50%;
      background:rgba(61,155,255,0.18);
      border:2px solid rgba(61,155,255,0.85);
      display:flex;align-items:center;justify-content:center;
      font-size:22px;cursor:pointer;
      animation:pulse-fish 2s infinite;
    ">${emoji}</div>
    <style>
      @keyframes pulse-fish{
        0%{box-shadow:0 0 0 0 rgba(61,155,255,0.7)}
        70%{box-shadow:0 0 0 14px rgba(61,155,255,0)}
        100%{box-shadow:0 0 0 0 rgba(61,155,255,0)}
      }
    </style>`,
    className: "",
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  })
}

function MapMover({ onMove }: { onMove: (lat: number, lng: number, zoom: number) => void }) {
  useMapEvents({
    moveend(e) {
      const c = e.target.getCenter()
      const z = e.target.getZoom()
      onMove(c.lat, c.lng, z)
      localStorage.setItem("vreke_map", JSON.stringify({ lat: c.lat, lng: c.lng, zoom: z }))
    },
  })
  return null
}

export function MapView() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeForm, setActiveForm] = useState<"here" | "sos" | "chat" | null>(null)

  const saved = (() => {
    try { return JSON.parse(localStorage.getItem("vreke_map") || "{}") } catch { return {} }
  })()
  const center: [number, number] = [saved.lat ?? 55.751, saved.lng ?? 37.618]
  const zoom = saved.zoom ?? 12

  const menuItems = [
    { key: "here" as const, label: "Я здесь", icon: <MapPin size={20} />, color: "#30d158", bg: "rgba(48,209,88,0.2)", border: "rgba(48,209,88,0.45)" },
    { key: "sos" as const, label: "SOS", icon: <AlertTriangle size={20} />, color: "#ff453a", bg: "rgba(255,69,58,0.2)", border: "rgba(255,69,58,0.45)" },
    { key: "chat" as const, label: "Чат", icon: <MessageCircle size={20} />, color: "#3d9bff", bg: "rgba(61,155,255,0.2)", border: "rgba(61,155,255,0.45)" },
  ]

  return (
    <div className="relative w-full h-full" style={{ minHeight: 0 }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ width: "100%", height: "100%" }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}" maxZoom={20} />
        <MapMover onMove={() => {}} />
        {MOCK_MARKERS.map(m => (
          <Marker key={m.id} position={[m.lat, m.lng]} icon={createPulseIcon(m.avatar)}>
            <Popup>
              <div style={{ minWidth: 110 }}>
                <strong>{m.user}</strong><br />
                <span style={{ color: "#3d9bff", fontSize: 13 }}>{m.fish}</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Neon crosshair z:9999 */}
      <div
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
        style={{ zIndex: 9999 }}
      >
        <div className="relative w-10 h-10">
          {/* horizontal */}
          <div style={{
            position: "absolute", top: "50%", left: 0, right: 0, height: 2,
            background: "rgba(61,155,255,0.9)",
            boxShadow: "0 0 8px 2px rgba(61,155,255,0.8)",
            transform: "translateY(-50%)",
          }} />
          {/* vertical */}
          <div style={{
            position: "absolute", left: "50%", top: 0, bottom: 0, width: 2,
            background: "rgba(61,155,255,0.9)",
            boxShadow: "0 0 8px 2px rgba(61,155,255,0.8)",
            transform: "translateX(-50%)",
          }} />
          {/* center dot */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            width: 8, height: 8, borderRadius: "50%",
            background: "#3d9bff",
            boxShadow: "0 0 12px 4px rgba(61,155,255,1)",
            transform: "translate(-50%,-50%)",
          }} />
        </div>
      </div>

      {/* FAB + menu */}
      <div className="absolute right-4" style={{ bottom: 24, zIndex: 1000 }}>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="flex gap-3 mb-3 justify-end"
            >
              {menuItems.map(item => (
                <motion.button
                  key={item.key}
                  whileTap={{ scale: 0.88 }}
                  onClick={() => { setActiveForm(item.key); setMenuOpen(false) }}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: item.bg, border: `1.5px solid ${item.border}`, backdropFilter: "blur(12px)", color: item.color }}>
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-semibold" style={{ color: item.color }}>{item.label}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => setMenuOpen(v => !v)}
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl"
          style={{
            background: "rgba(61,155,255,0.92)",
            boxShadow: "0 0 28px rgba(61,155,255,0.55)",
            color: "#fff",
          }}
        >
          <motion.div animate={{ rotate: menuOpen ? 45 : 0 }} transition={{ duration: 0.2 }}>
            <Plus size={26} />
          </motion.div>
        </motion.button>
      </div>

      {/* Bottom form sheet */}
      <AnimatePresence>
        {activeForm && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 32 }}
            className="absolute bottom-0 left-0 right-0 p-5 rounded-t-[28px]"
            style={{
              zIndex: 1001,
              background: "var(--card-glass)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              border: "1px solid var(--card-border)",
              borderBottom: "none",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base" style={{ color: "var(--profile-text)" }}>
                {activeForm === "here" && "📍 Я здесь — отметить улов"}
                {activeForm === "sos" && "🆘 Сигнал бедствия"}
                {activeForm === "chat" && "💬 Чат в точке"}
              </h3>
              <button onClick={() => setActiveForm(null)}>
                <X size={20} style={{ color: "var(--profile-sub)" }} />
              </button>
            </div>

            {activeForm === "here" && (
              <div className="flex flex-col gap-3">
                <input
                  className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid var(--card-border)", color: "var(--profile-text)" }}
                  placeholder="Что поймал? Опиши улов..."
                />
                <select
                  className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid var(--card-border)", color: "var(--profile-text)" }}
                >
                  <option value="">Вид рыбы...</option>
                  {["Щука","Судак","Карп","Окунь","Лещ","Сом","Форель","Жерех"].map(f => <option key={f}>{f}</option>)}
                </select>
                <button
                  className="w-full py-3 rounded-2xl font-bold text-sm"
                  style={{ background: "#30d158", color: "#000" }}
                >
                  Поставить маркер
                </button>
              </div>
            )}

            {activeForm === "sos" && (
              <div className="flex flex-col gap-3">
                <input
                  className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                  style={{ background: "rgba(255,69,58,0.08)", border: "1px solid rgba(255,69,58,0.3)", color: "var(--profile-text)" }}
                  placeholder="Опишите ситуацию..."
                />
                <button
                  className="w-full py-3 rounded-2xl font-bold text-sm"
                  style={{ background: "#ff453a", color: "#fff" }}
                >
                  🆘 Отправить сигнал
                </button>
              </div>
            )}

            {activeForm === "chat" && (
              <div className="flex gap-2">
                <input
                  className="flex-1 px-4 py-3 rounded-2xl text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid var(--card-border)", color: "var(--profile-text)" }}
                  placeholder="Напишите в этой точке..."
                />
                <button
                  className="px-4 py-3 rounded-2xl"
                  style={{ background: "#3d9bff", color: "#fff" }}
                >
                  <Send size={18} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
