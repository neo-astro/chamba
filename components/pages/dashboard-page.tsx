'use client'

import { useState } from 'react'
import {
  LayoutDashboard,
  Briefcase,
  MessageCircle,
  Star,
  Bell,
  Settings,
  LogOut,
  Plus,
  Eye,
  Users,
  TrendingUp,
  ToggleLeft,
  ToggleRight,
  Edit3,
  Trash2,
  X,
  Zap,
  ChevronRight,
  Rocket,
  CheckCircle,
} from 'lucide-react'
import { MY_PROFILES, MOCK_MESSAGES, CATEGORIES, type UserProfile } from '@/lib/mock-data'
import ConfirmModal from '@/components/ui/confirm-modal'
import ChatModal, { type ChatMessage } from '@/components/ui/chat-modal'
import { useToast } from '@/components/ui/toast'

type Props = {
  onNavigate: (page: string) => void
  onLogout?: () => void
  onSearch?: (proId: string) => void
}
type Section = 'overview' | 'profiles' | 'messages' | 'settings'

const MOCK_USER = {
  name: 'María González',
  avatar: 'https://i.pravatar.cc/150?img=47',
  email: 'maria@email.com',
}

const MOCK_NOTIFICATIONS = [
  { id: '1', text: 'Carlos Rodríguez te envió un mensaje', time: 'hace 5 min', read: false, avatar: 'https://i.pravatar.cc/150?img=12' },
  { id: '2', text: 'Tu perfil "Niñero/a" recibió 3 nuevas visitas', time: 'hace 1 h', read: false, avatar: null },
  { id: '3', text: 'Ana Fernández solicitó un presupuesto', time: 'hace 3 h', read: true, avatar: 'https://i.pravatar.cc/150?img=23' },
  { id: '4', text: 'Tu valoración subió a 4.9 ⭐', time: 'ayer', read: true, avatar: null },
]

// Seed chat histories per contact
const CHAT_HISTORIES: Record<string, ChatMessage[]> = {
  '1': [
    { id: 'h1', text: 'Hola! Estoy disponible el lunes para la revisión.', from: 'them', time: '10:30' },
  ],
  '2': [
    { id: 'h2', text: 'Gracias por contactarme. ¿Qué horario te viene mejor?', from: 'them', time: '09:15' },
  ],
  '3': [
    { id: 'h3', text: 'El presupuesto quedó en $15,000 por el mueble completo.', from: 'them', time: 'ayer' },
    { id: 'h4', text: 'Perfecto, me parece razonable. ¿Cuándo podrías empezar?', from: 'me', time: 'ayer', read: true },
  ],
}

export default function DashboardPage({ onNavigate, onLogout, onSearch }: Props) {
  const { toast } = useToast()
  const [section, setSection] = useState<Section>('overview')
  const [profiles, setProfiles] = useState<UserProfile[]>(MY_PROFILES)
  const [showNewProfile, setShowNewProfile] = useState(false)
  const [newProfileCat, setNewProfileCat] = useState('')
  const [newProfileTitle, setNewProfileTitle] = useState('')
  const [newProfileDesc, setNewProfileDesc] = useState('')
  const [newProfilePrice, setNewProfilePrice] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Notifications
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
  const [showNotifs, setShowNotifs] = useState(false)

  // Confirm modal state
  const [confirm, setConfirm] = useState<{
    open: boolean
    title: string
    description: string
    confirmLabel: string
    variant: 'danger' | 'warning' | 'info'
    onConfirm: () => void
  }>({ open: false, title: '', description: '', confirmLabel: 'Confirmar', variant: 'danger', onConfirm: () => {} })

  // Edit profile modal
  const [editingProfile, setEditingProfile] = useState<UserProfile | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editPrice, setEditPrice] = useState('')

  // Boost modal
  const [boostingProfile, setBoostingProfile] = useState<UserProfile | null>(null)

  // Chat modal
  const [chatOpen, setChatOpen] = useState(false)
  const [activeChatMsg, setActiveChatMsg] = useState<(typeof MOCK_MESSAGES)[0] | null>(null)

  const openConfirm = (opts: typeof confirm) => setConfirm(opts)
  const closeConfirm = () => setConfirm((c) => ({ ...c, open: false }))

  const toggleProfile = (id: string) => {
    const p = profiles.find((p) => p.id === id)!
    const next = !p.active
    openConfirm({
      open: true,
      title: next ? 'Activar perfil' : 'Pausar perfil',
      description: next
        ? `Tu perfil "${p.title}" volverá a ser visible en las búsquedas.`
        : `Tu perfil "${p.title}" dejará de aparecer en las búsquedas mientras esté pausado.`,
      confirmLabel: next ? 'Activar' : 'Pausar',
      variant: next ? 'info' : 'warning',
      onConfirm: () => {
        setProfiles((prev) => prev.map((pr) => (pr.id === id ? { ...pr, active: next } : pr)))
        toast(next ? 'Perfil activado exitosamente.' : 'Perfil pausado.', next ? 'success' : 'info')
        closeConfirm()
      },
    })
  }

  const confirmDelete = (id: string) => {
    const p = profiles.find((p) => p.id === id)!
    openConfirm({
      open: true,
      title: 'Eliminar perfil',
      description: `¿Estás seguro de que quieres eliminar "${p.title}"? Esta acción no se puede deshacer.`,
      confirmLabel: 'Eliminar',
      variant: 'danger',
      onConfirm: () => {
        setProfiles((prev) => prev.filter((p) => p.id !== id))
        toast('Perfil eliminado.', 'error')
        closeConfirm()
      },
    })
  }

  const openEdit = (p: UserProfile) => {
    setEditingProfile(p)
    setEditTitle(p.title)
    setEditDesc(p.description)
    setEditPrice(String(p.price))
  }

  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProfile) return
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === editingProfile.id
          ? { ...p, title: editTitle, description: editDesc, price: Number(editPrice) }
          : p
      )
    )
    setEditingProfile(null)
    toast('Perfil actualizado correctamente.', 'success')
  }

  const addProfile = (e: React.FormEvent) => {
    e.preventDefault()
    const cat = CATEGORIES.find((c) => c.name === newProfileCat)
    const newP: UserProfile = {
      id: `p${Date.now()}`,
      category: newProfileCat,
      icon: cat?.icon ?? '⭐',
      color: cat?.color ?? '#2DD4BF',
      bg: cat?.bg ?? '#F0FDFB',
      title: newProfileTitle,
      description: newProfileDesc,
      price: Number(newProfilePrice),
      priceUnit: 'hora',
      active: true,
      views: 0,
      contacts: 0,
      rating: 0,
      location: 'Buenos Aires, Argentina',
    }
    setProfiles((prev) => [...prev, newP])
    setShowNewProfile(false)
    setNewProfileCat('')
    setNewProfileTitle('')
    setNewProfileDesc('')
    setNewProfilePrice('')
    toast('¡Nuevo perfil creado!', 'success')
  }

  const confirmLogout = () => {
    openConfirm({
      open: true,
      title: 'Cerrar sesión',
      description: 'Tu sesión se cerrará. Podrás volver a iniciar sesión en cualquier momento.',
      confirmLabel: 'Cerrar sesión',
      variant: 'warning',
      onConfirm: () => {
        closeConfirm()
        onLogout ? onLogout() : onNavigate('home')
      },
    })
  }

  const activateBoost = (p: UserProfile) => {
    setProfiles((prev) => prev.map((pr) => (pr.id === p.id ? { ...pr, boosted: true } : pr)))
    setBoostingProfile(null)
    toast(`¡Perfil "${p.title}" impulsado! Aparecerá destacado en búsquedas.`, 'success')
  }

  const openChat = (msg: typeof MOCK_MESSAGES[0]) => {
    setActiveChatMsg(msg)
    setChatOpen(true)
    // Mark message as read
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    toast('Todas las notificaciones marcadas como leídas.', 'info')
    setShowNotifs(false)
  }

  const totalViews = profiles.reduce((a, p) => a + p.views, 0)
  const totalContacts = profiles.reduce((a, p) => a + p.contacts, 0)
  const activeProfiles = profiles.filter((p) => p.active).length
  const unreadMessages = MOCK_MESSAGES.filter((m) => m.unread).length
  const unreadNotifs = notifications.filter((n) => !n.read).length

  type NavItem = { id: string; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }
  const NAV: NavItem[] = [
    { id: 'overview', label: 'Resumen', icon: LayoutDashboard },
    { id: 'profiles', label: 'Mis perfiles', icon: Briefcase },
    { id: 'messages', label: 'Mensajes', icon: MessageCircle, badge: unreadMessages },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ]

  const Sidebar = () => (
    <aside className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-border">
        <div className="w-8 h-8 rounded-xl bg-[var(--turquoise)] flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" fill="white" />
        </div>
        <span className="font-heading font-700 text-foreground">ProConnect</span>
      </div>

      {/* User info */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
        <img
          src={MOCK_USER.avatar}
          alt={MOCK_USER.name}
          className="w-10 h-10 rounded-2xl object-cover"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{MOCK_USER.name}</p>
          <p className="text-xs text-muted-foreground truncate">{MOCK_USER.email}</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            aria-label="Notificaciones"
          >
            <Bell className="w-4 h-4 text-muted-foreground" />
          </button>
          {unreadNotifs > 0 && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[var(--coral)] text-white text-[9px] flex items-center justify-center font-bold pointer-events-none">
              {unreadNotifs}
            </span>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {NAV.map(({ id, label, icon: Icon, badge }) => (
          <button
            key={id}
            onClick={() => { setSection(id as Section); setSidebarOpen(false) }}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
              section === id
                ? 'bg-[var(--turquoise)]/10 text-[var(--turquoise)]'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
            {badge !== undefined && badge > 0 && (
              <span className="ml-auto w-5 h-5 rounded-full bg-[var(--coral)] text-white text-xs flex items-center justify-center font-bold">
                {badge}
              </span>
            )}
            {section === id && <ChevronRight className="ml-auto w-3.5 h-3.5" />}
          </button>
        ))}

        {/* Browse pros */}
        <button
          onClick={() => onNavigate('search')}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all mt-1"
        >
          <Users className="w-4 h-4 shrink-0" /> Buscar profesionales
        </button>
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-border">
        <button
          onClick={confirmLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-medium text-muted-foreground hover:text-[var(--coral)] hover:bg-[var(--coral)]/5 transition-all"
        >
          <LogOut className="w-4 h-4" /> Cerrar sesión
        </button>
      </div>
    </aside>
  )

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-card border-r border-border shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-card shadow-xl animate-slide-in-right">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Notifications panel */}
      {showNotifs && (
        <div className="fixed inset-0 z-[150]" onClick={() => setShowNotifs(false)}>
          <div
            className="absolute top-16 right-4 md:right-auto md:left-56 md:top-20 w-80 bg-card border border-border rounded-3xl shadow-2xl animate-fade-in overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="font-heading font-600 text-sm text-foreground">Notificaciones</h3>
              {unreadNotifs > 0 && (
                <button onClick={markAllRead} className="text-xs text-[var(--turquoise)] font-medium">
                  Marcar todas como leídas
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-5 py-3.5 border-b border-border last:border-0 transition-colors ${
                    !n.read ? 'bg-[var(--turquoise)]/5' : ''
                  }`}
                >
                  {n.avatar ? (
                    <img src={n.avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[var(--turquoise)]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Bell className="w-4 h-4 text-[var(--turquoise)]" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs leading-relaxed ${!n.read ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                      {n.text}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
                  </div>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-[var(--turquoise)] shrink-0 mt-1.5" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between bg-card border-b border-border px-4 py-4">
          <button onClick={() => setSidebarOpen(true)} className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[var(--turquoise)] flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" fill="white" />
            </div>
            <span className="font-heading font-700 text-foreground text-sm">Panel</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setShowNotifs(!showNotifs)} className="p-1.5 rounded-lg hover:bg-muted">
                <Bell className="w-5 h-5 text-muted-foreground" />
              </button>
              {unreadNotifs > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--coral)] text-white text-[9px] flex items-center justify-center font-bold">
                  {unreadNotifs}
                </span>
              )}
            </div>
            <img src={MOCK_USER.avatar} alt="" className="w-8 h-8 rounded-xl object-cover" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
          {/* OVERVIEW */}
          {section === 'overview' && (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="font-heading font-700 text-2xl text-foreground mb-1">
                  Hola, {MOCK_USER.name.split(' ')[0]}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Aquí tienes un resumen de tu actividad reciente.
                </p>
              </div>

              {/* Stats cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Eye, value: totalViews.toLocaleString(), label: 'Visitas totales', color: '#2DD4BF', bg: '#F0FDFB' },
                  { icon: Users, value: String(totalContacts), label: 'Contactos recibidos', color: '#FF7F50', bg: '#FFF5F0' },
                  { icon: Briefcase, value: `${activeProfiles}/${profiles.length}`, label: 'Perfiles activos', color: '#A78BFA', bg: '#F5F3FF' },
                  { icon: Star, value: '4.9', label: 'Valoración media', color: '#FBBF24', bg: '#FFFBEB' },
                ].map(({ icon: Icon, value, label, color, bg }) => (
                  <div key={label} className="bg-card border border-border rounded-3xl p-5 flex flex-col gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                      <Icon className="w-5 h-5" style={{ color }} />
                    </div>
                    <div>
                      <p className="font-heading font-700 text-2xl text-foreground">{value}</p>
                      <p className="text-xs text-muted-foreground">{label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick access */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Recent messages */}
                <div className="bg-card border border-border rounded-3xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading font-600 text-base text-foreground">Mensajes recientes</h3>
                    <button onClick={() => setSection('messages')} className="text-xs text-[var(--turquoise)] font-medium">
                      Ver todos
                    </button>
                  </div>
                  <div className="flex flex-col gap-3">
                    {MOCK_MESSAGES.map((msg) => (
                      <button
                        key={msg.id}
                        onClick={() => openChat(msg)}
                        className="flex items-center gap-3 text-left hover:bg-muted/50 rounded-xl p-1.5 -mx-1.5 transition-colors"
                      >
                        <img src={msg.avatar} alt={msg.from} className="w-9 h-9 rounded-xl object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{msg.from}</p>
                          <p className="text-xs text-muted-foreground truncate">{msg.text}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className="text-xs text-muted-foreground">{msg.time}</span>
                          {msg.unread && <span className="w-2 h-2 rounded-full bg-[var(--turquoise)]" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* My profiles quick view */}
                <div className="bg-card border border-border rounded-3xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading font-600 text-base text-foreground">Mis perfiles</h3>
                    <button onClick={() => setSection('profiles')} className="text-xs text-[var(--turquoise)] font-medium">
                      Gestionar
                    </button>
                  </div>
                  <div className="flex flex-col gap-3">
                    {profiles.map((p) => (
                      <div key={p.id} className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ background: p.bg }}>
                          {p.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{p.category}</p>
                          <p className="text-xs text-muted-foreground">{p.views} vistas · {p.contacts} contactos</p>
                        </div>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.active ? 'bg-[var(--turquoise)]/10 text-[var(--turquoise)]' : 'bg-muted text-muted-foreground'}`}>
                          {p.active ? 'Activo' : 'Pausado'}
                        </span>
                      </div>
                    ))}
                    <button
                      onClick={() => setShowNewProfile(true)}
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-dashed border-[var(--turquoise)] text-xs font-semibold text-[var(--turquoise)] hover:bg-[var(--turquoise)]/5 transition-all mt-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Añadir perfil
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PROFILES */}
          {section === 'profiles' && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-heading font-700 text-2xl text-foreground">Mis perfiles profesionales</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {profiles.length} perfil{profiles.length !== 1 ? 'es' : ''} · {activeProfiles} activo{activeProfiles !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={() => setShowNewProfile(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--turquoise)] text-white text-sm font-semibold hover:opacity-90 transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Nuevo perfil
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {profiles.map((p) => (
                  <div
                    key={p.id}
                    className={`bg-card border rounded-3xl p-5 transition-all ${p.active ? 'border-border' : 'border-border opacity-70'}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0" style={{ background: p.bg }}>
                        {p.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: p.bg, color: p.color }}>
                                {p.category}
                              </span>
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.active ? 'bg-[var(--turquoise)]/10 text-[var(--turquoise)]' : 'bg-muted text-muted-foreground'}`}>
                                {p.active ? 'Activo' : 'Pausado'}
                              </span>
                              {p.boosted && (
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--amber-brand)]/15 text-[var(--amber-brand)] flex items-center gap-1">
                                  <Rocket className="w-3 h-3" /> Impulsado
                                </span>
                              )}
                            </div>
                            <h3 className="font-heading font-600 text-base text-foreground mt-1">{p.title}</h3>
                            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{p.description}</p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Toggle */}
                            <button
                              onClick={() => toggleProfile(p.id)}
                              className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
                              title={p.active ? 'Pausar' : 'Activar'}
                            >
                              {p.active ? <ToggleRight className="w-5 h-5 text-[var(--turquoise)]" /> : <ToggleLeft className="w-5 h-5" />}
                            </button>
                            {/* Edit */}
                            <button
                              onClick={() => openEdit(p)}
                              className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
                              title="Editar"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            {/* Boost */}
                            <button
                              onClick={() => setBoostingProfile(p)}
                              className={`p-2 rounded-xl hover:bg-[var(--amber-brand)]/10 transition-colors ${p.boosted ? 'text-[var(--amber-brand)]' : 'text-muted-foreground'}`}
                              title="Impulsar perfil"
                            >
                              <Rocket className="w-4 h-4" />
                            </button>
                            {/* Delete */}
                            <button
                              onClick={() => confirmDelete(p.id)}
                              className="p-2 rounded-xl hover:bg-[var(--coral)]/10 hover:text-[var(--coral)] transition-colors text-muted-foreground"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Eye className="w-3.5 h-3.5" />
                            <span className="font-medium text-foreground">{p.views}</span> vistas
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Users className="w-3.5 h-3.5" />
                            <span className="font-medium text-foreground">{p.contacts}</span> contactos
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Star className="w-3.5 h-3.5 text-[var(--amber-brand)]" fill="var(--amber-brand)" />
                            <span className="font-medium text-foreground">{p.rating > 0 ? p.rating : '—'}</span>
                          </div>
                          <div className="ml-auto text-sm font-semibold text-foreground">
                            ${p.price.toLocaleString()}
                            <span className="text-xs text-muted-foreground font-normal">/{p.priceUnit}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {profiles.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-center bg-card border border-dashed border-border rounded-3xl">
                    <Briefcase className="w-10 h-10 text-muted-foreground/40 mb-3" />
                    <p className="font-heading font-600 text-base text-foreground mb-1">Sin perfiles aún</p>
                    <p className="text-sm text-muted-foreground mb-4">Crea tu primer perfil profesional.</p>
                    <button onClick={() => setShowNewProfile(true)} className="px-5 py-2.5 rounded-full bg-[var(--turquoise)] text-white text-sm font-semibold">
                      Crear perfil
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MESSAGES */}
          {section === 'messages' && (
            <div className="flex flex-col gap-4">
              <h1 className="font-heading font-700 text-2xl text-foreground">Mensajes</h1>
              <div className="bg-card border border-border rounded-3xl overflow-hidden">
                {MOCK_MESSAGES.map((msg, i) => (
                  <button
                    key={msg.id}
                    onClick={() => openChat(msg)}
                    className={`flex items-center gap-4 p-5 w-full text-left hover:bg-muted/50 transition-colors ${
                      i < MOCK_MESSAGES.length - 1 ? 'border-b border-border' : ''
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img src={msg.avatar} alt={msg.from} className="w-11 h-11 rounded-2xl object-cover" />
                      {msg.unread && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[var(--turquoise)] border-2 border-card" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate ${msg.unread ? 'font-semibold text-foreground' : 'font-medium text-foreground'}`}>
                        {msg.from}
                      </p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{msg.text}</p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{msg.time}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {section === 'settings' && (
            <div className="flex flex-col gap-5">
              <h1 className="font-heading font-700 text-2xl text-foreground">Configuración</h1>
              <div className="bg-card border border-border rounded-3xl p-6">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                  <img src={MOCK_USER.avatar} alt={MOCK_USER.name} className="w-16 h-16 rounded-2xl object-cover" />
                  <div>
                    <p className="font-heading font-700 text-lg text-foreground">{MOCK_USER.name}</p>
                    <p className="text-sm text-muted-foreground">{MOCK_USER.email}</p>
                  </div>
                  <button
                    onClick={() => toast('Funcionalidad de edición de foto próximamente.', 'info')}
                    className="ml-auto px-4 py-2 rounded-full border border-border text-sm font-medium text-muted-foreground hover:border-foreground transition-all"
                  >
                    Editar foto
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  {[
                    { label: 'Nombre completo', value: MOCK_USER.name, type: 'text' },
                    { label: 'Correo electrónico', value: MOCK_USER.email, type: 'email' },
                    { label: 'Tel��fono', value: '+54 11 1234-5678', type: 'tel' },
                    { label: 'Ciudad', value: 'Buenos Aires, Argentina', type: 'text' },
                  ].map(({ label, value, type }) => (
                    <div key={label}>
                      <label className="text-xs font-semibold text-foreground block mb-1.5">{label}</label>
                      <input
                        type={type}
                        defaultValue={value}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground outline-none focus:ring-2 focus:ring-[var(--turquoise)] transition-all"
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => toast('Cambios guardados correctamente.', 'success')}
                    className="mt-2 px-6 py-3 rounded-full bg-[var(--turquoise)] text-white font-semibold text-sm hover:opacity-90 transition-all w-fit shadow-sm"
                  >
                    Guardar cambios
                  </button>
                </div>
              </div>

              {/* Danger zone */}
              <div className="bg-card border border-[var(--coral)]/20 rounded-3xl p-6">
                <h3 className="font-heading font-600 text-base text-foreground mb-1">Zona de riesgo</h3>
                <p className="text-sm text-muted-foreground mb-4">Estas acciones son irreversibles. Procede con cuidado.</p>
                <button
                  onClick={() =>
                    openConfirm({
                      open: true,
                      title: 'Eliminar cuenta',
                      description: 'Se eliminarán todos tus perfiles, mensajes y datos permanentemente. Esta acción no se puede deshacer.',
                      confirmLabel: 'Eliminar cuenta',
                      variant: 'danger',
                      onConfirm: () => {
                        closeConfirm()
                        toast('Cuenta eliminada. Hasta pronto.', 'error')
                        setTimeout(() => onLogout?.(), 1800)
                      },
                    })
                  }
                  className="px-5 py-2.5 rounded-full border border-[var(--coral)] text-[var(--coral)] text-sm font-semibold hover:bg-[var(--coral)]/5 transition-all"
                >
                  Eliminar mi cuenta
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* New profile modal */}
      {showNewProfile && (
        <div className="fixed inset-0 bg-foreground/40 z-[100] flex items-end md:items-center justify-center p-4 animate-fade-in">
          <div className="bg-card rounded-3xl w-full max-w-lg p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-heading font-700 text-lg text-foreground">Nuevo perfil profesional</h3>
              <button onClick={() => setShowNewProfile(false)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={addProfile} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">Categoría</label>
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                  {CATEGORIES.map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setNewProfileCat(cat.name)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                        newProfileCat === cat.name
                          ? 'border-[var(--turquoise)] bg-[var(--turquoise)]/10 text-[var(--turquoise)]'
                          : 'border-border text-muted-foreground'
                      }`}
                    >
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">Título del servicio</label>
                <input
                  required
                  value={newProfileTitle}
                  onChange={(e) => setNewProfileTitle(e.target.value)}
                  placeholder="Ej: Clases de guitarra para principiantes"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-[var(--turquoise)]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">Descripción</label>
                <textarea
                  rows={3}
                  value={newProfileDesc}
                  onChange={(e) => setNewProfileDesc(e.target.value)}
                  placeholder="Describe tu servicio, experiencia y lo que ofrecerás..."
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-[var(--turquoise)] resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">Precio por hora ($)</label>
                <input
                  type="number"
                  required
                  value={newProfilePrice}
                  onChange={(e) => setNewProfilePrice(e.target.value)}
                  placeholder="Ej: 1000"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-[var(--turquoise)]"
                />
              </div>
              <div className="flex gap-3 mt-1">
                <button type="button" onClick={() => setShowNewProfile(false)} className="flex-1 py-3 rounded-full border border-border text-sm font-medium text-muted-foreground">
                  Cancelar
                </button>
                <button type="submit" disabled={!newProfileCat || !newProfileTitle} className="flex-1 py-3 rounded-full bg-[var(--turquoise)] text-white font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50">
                  Crear perfil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit profile modal */}
      {editingProfile && (
        <div className="fixed inset-0 bg-foreground/40 z-[100] flex items-end md:items-center justify-center p-4 animate-fade-in">
          <div className="bg-card rounded-3xl w-full max-w-lg p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-heading font-700 text-lg text-foreground">Editar perfil</h3>
              <button onClick={() => setEditingProfile(null)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={saveEdit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">Título del servicio</label>
                <input
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-[var(--turquoise)]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">Descripción</label>
                <textarea
                  rows={3}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-[var(--turquoise)] resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">Precio por hora ($)</label>
                <input
                  type="number"
                  required
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-[var(--turquoise)]"
                />
              </div>
              <div className="flex gap-3 mt-1">
                <button type="button" onClick={() => setEditingProfile(null)} className="flex-1 py-3 rounded-full border border-border text-sm font-medium text-muted-foreground">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 py-3 rounded-full bg-[var(--turquoise)] text-white font-semibold text-sm hover:opacity-90 transition-all">
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Boost modal */}
      {boostingProfile && (
        <div className="fixed inset-0 bg-foreground/40 z-[100] flex items-end md:items-center justify-center p-4 animate-fade-in">
          <div className="bg-card rounded-3xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[var(--amber-brand)]/15 flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-[var(--amber-brand)]" />
                </div>
                <h3 className="font-heading font-700 text-lg text-foreground">Impulsar perfil</h3>
              </div>
              <button onClick={() => setBoostingProfile(null)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-5">
              Al impulsar <strong>&ldquo;{boostingProfile.title}&rdquo;</strong> tu perfil aparecerá destacado en los resultados de búsqueda de manera equitativa con otros perfiles impulsados.
            </p>

            <div className="flex flex-col gap-3 mb-5">
              {[
                { label: '7 días', price: '$1,200', desc: 'Ideal para probar' },
                { label: '30 días', price: '$3,500', desc: 'Más popular', highlight: true },
                { label: '90 días', price: '$8,000', desc: 'Mayor ahorro' },
              ].map((plan) => (
                <div
                  key={plan.label}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    plan.highlight ? 'border-[var(--amber-brand)] bg-[var(--amber-brand)]/5' : 'border-border'
                  }`}
                >
                  <div>
                    <p className={`text-sm font-semibold ${plan.highlight ? 'text-[var(--amber-brand)]' : 'text-foreground'}`}>
                      {plan.label} {plan.highlight && <span className="text-xs font-medium">— Más popular</span>}
                    </p>
                    <p className="text-xs text-muted-foreground">{plan.desc}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-heading font-700 text-base text-foreground">{plan.price}</span>
                    <button
                      onClick={() => activateBoost(boostingProfile)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        plan.highlight
                          ? 'bg-[var(--amber-brand)] text-white hover:opacity-90'
                          : 'border border-border text-muted-foreground hover:border-foreground'
                      }`}
                    >
                      Elegir
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-2 p-3 rounded-xl bg-muted">
              <CheckCircle className="w-4 h-4 text-[var(--turquoise)] shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Los perfiles impulsados aparecen de manera aleatoria y equitativa entre todos los que tengan impulso activo, garantizando visibilidad justa.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Confirm modal */}
      <ConfirmModal
        open={confirm.open}
        title={confirm.title}
        description={confirm.description}
        confirmLabel={confirm.confirmLabel}
        variant={confirm.variant}
        onConfirm={confirm.onConfirm}
        onCancel={closeConfirm}
      />

      {/* Chat modal */}
      {activeChatMsg && (
        <ChatModal
          open={chatOpen}
          contact={{ id: activeChatMsg.id, name: activeChatMsg.from, avatar: activeChatMsg.avatar }}
          initialMessages={CHAT_HISTORIES[activeChatMsg.id] ?? []}
          onClose={() => setChatOpen(false)}
        />
      )}
    </div>
  )
}
