'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  Star,
  MapPin,
  CheckCircle,
  Clock,
  Briefcase,
  Eye,
  MessageCircle,
  Send,
  Heart,
  Share2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Images,
} from 'lucide-react'
import { PROFESSIONALS, REVIEWS, CATEGORIES } from '@/lib/mock-data'
import ChatModal from '@/components/ui/chat-modal'
import { useToast } from '@/components/ui/toast'

type Props = {
  proId: string
  onBack: () => void
  onNavigate: (page: string) => void
  isLoggedIn?: boolean
}

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const HOURS: Record<string, boolean[]> = {
  Lun: [false, false, false, false, false, false, false, false, true, true, true, true, true, true, false, false, true, true, true, false, false, false, false, false],
  Mar: [false, false, false, false, false, false, false, false, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false],
  Mié: [false, false, false, false, false, false, false, false, true, true, true, true, false, false, false, false, true, true, true, true, false, false, false, false],
  Jue: [false, false, false, false, false, false, false, false, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false],
  Vie: [false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false],
  Sáb: [false, false, false, false, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false],
  Dom: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
}

export default function ProfilePage({ proId, onBack, onNavigate, isLoggedIn = false }: Props) {
  const pro = PROFESSIONALS.find((p) => p.id === proId) ?? PROFESSIONALS[0]
  const { toast } = useToast()
  const [saved, setSaved] = useState(false)
  const [showContact, setShowContact] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'reviews' | 'schedule'>('overview')
  const [sliderIndex, setSliderIndex] = useState(0)

  const catData = CATEGORIES.find((c) => c.name === pro.categories[0])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setShowContact(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver a resultados
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSaved(!saved)}
              className={`p-2.5 rounded-xl border transition-all ${
                saved
                  ? 'border-[var(--coral)] bg-[var(--coral)]/10 text-[var(--coral)]'
                  : 'border-border text-muted-foreground hover:border-foreground'
              }`}
            >
              <Heart className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} />
            </button>
            <button className="p-2.5 rounded-xl border border-border text-muted-foreground hover:border-foreground transition-all">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="md:col-span-2 flex flex-col gap-6">
            {/* Profile header card */}
            <div className="bg-card border border-border rounded-3xl p-6">
              <div className="flex items-start gap-5">
                <div className="relative shrink-0">
                  <img
                    src={pro.avatar}
                    alt={pro.name}
                    className="w-20 h-20 rounded-2xl object-cover"
                  />
                  {pro.available && (
                    <span className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full bg-[var(--turquoise)] border-2 border-card flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-white" />
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="font-heading font-700 text-2xl text-foreground">{pro.name}</h1>
                    {pro.verified && (
                      <CheckCircle className="w-5 h-5 text-[var(--turquoise)]" fill="#2DD4BF" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-[var(--amber-brand)]" fill="var(--amber-brand)" />
                      <span className="text-sm font-semibold text-foreground">{pro.rating}</span>
                      <span className="text-sm text-muted-foreground">({pro.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" /> {pro.location}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {pro.categories.map((cat) => {
                      const cd = CATEGORIES.find((c) => c.name === cat)
                      return (
                        <span
                          key={cat}
                          className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
                          style={{ background: cd?.bg ?? '#F0FDFB', color: cd?.color ?? '#2DD4BF' }}
                        >
                          {cd?.icon} {cat}
                        </span>
                      )
                    })}
                    {pro.available ? (
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--turquoise)]/10 text-[var(--turquoise)]">
                        Disponible ahora
                      </span>
                    ) : (
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                        No disponible
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-border">
                {[
                  { icon: Briefcase, value: `${pro.completedJobs}`, label: 'Trabajos' },
                  { icon: Eye, value: '1.2k', label: 'Visitas al perfil' },
                  { icon: Clock, value: `Desde ${pro.joinedYear}`, label: 'En ProConnect' },
                ].map(({ icon: Icon, value, label }) => (
                  <div key={label} className="flex flex-col items-center text-center">
                    <Icon className="w-4 h-4 text-[var(--turquoise)] mb-1" />
                    <p className="font-heading font-700 text-base text-foreground">{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex bg-card border border-border rounded-2xl p-1 gap-1">
              {(['overview', 'portfolio', 'reviews', 'schedule'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeTab === t
                      ? 'bg-[var(--turquoise)] text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t === 'overview' ? 'Descripción' : t === 'portfolio' ? 'Portafolio' : t === 'reviews' ? 'Reseñas' : 'Horarios'}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === 'overview' && (
              <div className="bg-card border border-border rounded-3xl p-6 flex flex-col gap-5">
                <div>
                  <h3 className="font-heading font-600 text-base text-foreground mb-3">Sobre mí</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{pro.bio}</p>
                </div>
                <div>
                  <h3 className="font-heading font-600 text-base text-foreground mb-3">
                    Especialidades
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {pro.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-medium px-3 py-1.5 rounded-full border border-border text-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'portfolio' && (
              <div className="bg-card border border-border rounded-3xl overflow-hidden">
                {pro.portfolio.length > 0 ? (
                  <>
                    {/* Main slide */}
                    <div className="relative aspect-video bg-muted overflow-hidden">
                      <img
                        key={sliderIndex}
                        src={pro.portfolio[sliderIndex]}
                        alt={`Trabajo ${sliderIndex + 1}`}
                        className="w-full h-full object-cover animate-fade-in"
                        crossOrigin="anonymous"
                      />

                      {/* Navigation arrows */}
                      {pro.portfolio.length > 1 && (
                        <>
                          <button
                            onClick={() => setSliderIndex((i) => (i - 1 + pro.portfolio.length) % pro.portfolio.length)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-foreground/40 hover:bg-foreground/60 backdrop-blur-sm text-white flex items-center justify-center transition-all"
                            aria-label="Foto anterior"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setSliderIndex((i) => (i + 1) % pro.portfolio.length)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-foreground/40 hover:bg-foreground/60 backdrop-blur-sm text-white flex items-center justify-center transition-all"
                            aria-label="Foto siguiente"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </>
                      )}

                      {/* Index badge */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-foreground/50 backdrop-blur-sm text-white text-xs font-medium">
                        {sliderIndex + 1} / {pro.portfolio.length}
                      </div>
                    </div>

                    {/* Thumbnails */}
                    {pro.portfolio.length > 1 && (
                      <div className="flex gap-2 p-4 overflow-x-auto scrollbar-hide">
                        {pro.portfolio.map((img, i) => (
                          <button
                            key={i}
                            onClick={() => setSliderIndex(i)}
                            className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                              i === sliderIndex
                                ? 'border-[var(--turquoise)] opacity-100'
                                : 'border-transparent opacity-60 hover:opacity-90'
                            }`}
                          >
                            <img
                              src={img}
                              alt={`Miniatura ${i + 1}`}
                              className="w-full h-full object-cover"
                              crossOrigin="anonymous"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
                      <Images className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">Sin fotos de trabajos aún.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="flex flex-col gap-4">
                {REVIEWS.map((review) => (
                  <div
                    key={review.id}
                    className="bg-card border border-border rounded-3xl p-5"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={review.avatar}
                        alt={review.author}
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div>
                            <p className="text-sm font-semibold text-foreground">{review.author}</p>
                            <p className="text-xs text-muted-foreground">{review.service} · {review.date}</p>
                          </div>
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <Star
                                key={j}
                                className="w-3.5 h-3.5"
                                style={{ color: 'var(--amber-brand)' }}
                                fill={j < review.rating ? 'var(--amber-brand)' : 'none'}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed mt-2 italic">
                          &quot;{review.comment}&quot;
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="bg-card border border-border rounded-3xl p-6">
                <h3 className="font-heading font-600 text-base text-foreground mb-4">
                  Disponibilidad semanal
                </h3>
                <div className="flex flex-col gap-2">
                  {DAYS.map((day) => (
                    <div key={day} className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-muted-foreground w-8">{day}</span>
                      <div className="flex gap-0.5 flex-1">
                        {Array.from({ length: 24 }).map((_, i) => (
                          <div
                            key={i}
                            className="flex-1 h-5 rounded-sm"
                            style={{
                              background: HOURS[day]?.[i]
                                ? 'var(--turquoise)'
                                : 'var(--muted)',
                              opacity: HOURS[day]?.[i] ? 1 : 0.4,
                            }}
                            title={`${i}:00`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <div className="w-3 h-3 rounded-sm bg-[var(--turquoise)]" /> Disponible
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <div className="w-3 h-3 rounded-sm bg-muted opacity-40" /> No disponible
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            {/* Price card */}
            <div className="bg-card border border-border rounded-3xl p-5 sticky top-24">
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-heading font-800 text-3xl text-foreground">
                  ${pro.price.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground">/{pro.priceUnit}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-5">Precio orientativo. Puede variar según el servicio.</p>

              <button
                onClick={() => isLoggedIn ? setChatOpen(true) : setShowContact(true)}
                className="w-full py-3.5 rounded-full bg-[var(--turquoise)] text-white font-semibold text-sm hover:opacity-90 transition-all shadow-sm flex items-center justify-center gap-2 mb-3"
              >
                <MessageCircle className="w-4 h-4" /> Enviar mensaje
              </button>

              <button
                onClick={() => isLoggedIn ? toast('Presupuesto solicitado. El profesional te contactará pronto.', 'success') : onNavigate('register')}
                className="w-full py-3 rounded-full border border-[var(--coral)] text-[var(--coral)] font-semibold text-sm hover:bg-[var(--coral)]/5 transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" /> Solicitar presupuesto
              </button>

              {/* Contact form modal */}
              {showContact && (
                <div className="fixed inset-0 bg-foreground/40 z-50 flex items-end md:items-center justify-center p-4 animate-fade-in">
                  <div className="bg-card rounded-3xl w-full max-w-md p-6 shadow-xl">
                    <h3 className="font-heading font-700 text-lg text-foreground mb-1">
                      Mensaje a {pro.name.split(' ')[0]}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-5">
                      Describe tu necesidad y coordina los detalles.
                    </p>
                    <form onSubmit={handleSendMessage} className="flex flex-col gap-4">
                      <textarea
                        rows={4}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Hola, me interesa tu servicio de..."
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[var(--turquoise)] resize-none transition-all"
                      />
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setShowContact(false)}
                          className="flex-1 py-3 rounded-full border border-border text-sm font-medium text-muted-foreground"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-3 rounded-full bg-[var(--turquoise)] text-white font-semibold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
                        >
                          <Send className="w-4 h-4" /> Enviar
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chat modal (logged-in users) */}
      <ChatModal
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        contact={{ id: pro.id, name: pro.name, avatar: pro.avatar }}
      />
    </div>
  )
}
