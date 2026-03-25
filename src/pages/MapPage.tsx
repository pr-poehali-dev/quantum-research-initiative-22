import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet"
import L from "leaflet"
import Icon from "@/components/ui/icon"

const MOCK_MARKERS = [
  { id: 1, lat: 55.76, lng: 37.64, user: "Алексей", fish: "Щука 4.2кг", avatar: "🎣", type: "catch" },
  { id: 2, lat: 55.74, lng: 37.70, user: "Дмитрий", fish: "Судак 2.8кг", avatar: "🐟", type: "catch" },
]

function createPulseIcon(emoji: string) {
  return L.divIcon({
    html: `<div style="
      width:40px;height:40px;border-radius:50%;
      background:rgba(61,155,255,0.2);
      border:2px solid rgba(61,155,255,0.8);
      display:flex;align-items:center;justify-content:center;
      font-size:20px;
      box-shadow:0 0 0 0 rgba(61,155,255,0.6);
      animation:pulse-leaflet 2s infinite;
    ">${emoji}</div>
    <style>@keyframes pulse-leaflet{0%{box-shadow:0 0 0 0 rgba(61,155,255,0.6)}70%{box-shadow:0 0 0 14px rgba(61,155,255,0)}100%{box-shadow:0 0 0 0 rgba(61,155,255,0)}}</style>`,
    className: "",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  })
}

function LocationSaver({ onMove }: { onMove: (lat: number, lng: number) => void }) {
  useMapEvents({
    moveend(e) {
      const c = e.target.getCenter()
      onMove(c.lat, c.lng)
      localStorage.setItem("fishmap_center", JSON.stringify({ lat: c.lat, lng: c.lng }))
    },
    zoomend(e) {
      localStorage.setItem("fishmap_zoom", String(e.target.getZoom()))
    },
  })
  return null
}

export function MapPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeForm, setActiveForm] = useState<"here" | "sos" | "chat" | null>(null)
  const [mapCenter] = useState(() => {
    try {
      const saved = localStorage.getItem("fishmap_center")
      if (saved) return JSON.parse(saved)
    } catch { /* ignore */ }
    return { lat: 55.751, lng: 37.618 }
  })
  const [mapZoom] = useState(() => {
    const saved = localStorage.getItem("fishmap_zoom")
    return saved ? Number(saved) : 12
  })

  const actions = [
    { key: "here", label: "Я здесь", icon: "MapPin", color: "var(--accent-green)", bg: "rgba(48,209,88,0.2)", border: "rgba(48,209,88,0.4)" },
    { key: "sos", label: "SOS", icon: "AlertTriangle", color: "var(--accent-red)", bg: "rgba(255,69,58,0.2)", border: "rgba(255,69,58,0.4)" },
    { key: "chat", label: "Чат", icon: "MessageCircle", color: "var(--accent-blue)", bg: "rgba(61,155,255,0.2)", border: "rgba(61,155,255,0.4)" },
  ]

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={mapZoom}
        style={{ width: "100%", height: "100%", background: "#0b0d0f" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
          attribution="Google Hybrid"
          maxZoom={20}
        />
        <LocationSaver onMove={() => {}} />
        {MOCK_MARKERS.map(m => (
          <Marker key={m.id} position={[m.lat, m.lng]} icon={createPulseIcon(m.avatar)}>
            <Popup>
              <div style={{ color: "#fff", background: "#1c1c1e", padding: "8px 12px", borderRadius: "12px", minWidth: "120px" }}>
                <p style={{ fontWeight: 700, margin: 0 }}>{m.user}</p>
                <p style={{ color: "#3d9bff", margin: "4px 0 0", fontSize: "13px" }}>{m.fish}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Neon crosshair */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center" style={{ zIndex: 9999 }}>
        <div className="relative neon-crosshair w-10 h-10">
          <div className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2"
            style={{ background: "rgba(61,155,255,0.9)", boxShadow: "0 0 12px rgba(61,155,255,1)" }} />
        </div>
      </div>

      {/* Menu button + panel */}
      <div className="absolute bottom-6 right-4" style={{ zIndex: 1000 }}>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 8 }}
              className="flex gap-3 mb-3"
            >
              {actions.map(a => (
                <motion.button
                  key={a.key}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => { setActiveForm(a.key as typeof activeForm); setMenuOpen(false) }}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: a.bg, border: `1.5px solid ${a.border}`, backdropFilter: "blur(12px)" }}>
                    <Icon name={a.icon} size={20} style={{ color: a.color }} />
                  </div>
                  <span className="text-[10px] font-medium" style={{ color: a.color }}>{a.label}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setMenuOpen(v => !v)}
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
          style={{ background: "rgba(61,155,255,0.9)", boxShadow: "0 0 24px rgba(61,155,255,0.5)" }}
        >
          <Icon name={menuOpen ? "X" : "Plus"} size={24} style={{ color: "#fff" }} />
        </motion.button>
      </div>

      {/* Forms */}
      <AnimatePresence>
        {activeForm && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="absolute bottom-0 left-0 right-0 glass-card rounded-b-none p-6"
            style={{ zIndex: 1001 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                {activeForm === "here" && "📍 Я здесь"}
                {activeForm === "sos" && "🆘 Вызов помощи"}
                {activeForm === "chat" && "💬 Чат в точке"}
              </h3>
              <button onClick={() => setActiveForm(null)}>
                <Icon name="X" size={20} style={{ color: "var(--text-secondary)" }} />
              </button>
            </div>

            {activeForm === "here" && (
              <div className="flex flex-col gap-3">
                <input className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-primary)" }}
                  placeholder="Что поймал? Опиши улов..." />
                <select className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-primary)" }}>
                  <option value="">Выберите рыбу</option>
                  {["Щука","Судак","Карп","Окунь","Лещ","Сом","Форель"].map(f => <option key={f}>{f}</option>)}
                </select>
                <button className="w-full py-3 rounded-2xl font-semibold text-sm" style={{ background: "var(--accent-green)", color: "#000" }}>
                  Поставить маркер
                </button>
              </div>
            )}

            {activeForm === "sos" && (
              <div className="flex flex-col gap-3">
                <input className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                  style={{ background: "rgba(255,69,58,0.1)", border: "1px solid rgba(255,69,58,0.3)", color: "var(--text-primary)" }}
                  placeholder="Укажите причину..." />
                <button className="w-full py-3 rounded-2xl font-bold text-sm" style={{ background: "var(--accent-red)", color: "#fff" }}>
                  🆘 Отправить сигнал
                </button>
              </div>
            )}

            {activeForm === "chat" && (
              <div className="flex gap-2">
                <input className="flex-1 px-4 py-3 rounded-2xl text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-primary)" }}
                  placeholder="Сообщение в этой точке..." />
                <button className="px-4 py-3 rounded-2xl font-semibold text-sm" style={{ background: "var(--accent-blue)", color: "#fff" }}>
                  <Icon name="Send" size={18} style={{ color: "#fff" }} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
