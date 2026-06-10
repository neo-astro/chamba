'use client'

import { useState } from 'react'
import { Eye, EyeOff, Zap, ArrowLeft, CheckCircle } from 'lucide-react'

type Props = {
  mode: 'login' | 'register'
  onNavigate: (page: string) => void
  onAuth: () => void
}

export default function AuthPage({ mode, onNavigate, onAuth }: Props) {
  const [show, setShow] = useState(false)
  const [tab, setTab] = useState<'login' | 'register'>(mode)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'both' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAuth()
  }

  const isLogin = tab === 'login'

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel — decoration */}
      <div className="hidden lg:flex flex-col justify-between w-2/5 bg-[var(--turquoise)] p-10">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" fill="white" />
          </div>
          <span className="font-heading font-700 text-white text-lg">ProConnect</span>
        </button>

        <div>
          <h2 className="font-heading font-800 text-4xl text-white leading-tight text-balance mb-4">
            Un perfil.
            <br />
            Infinitos oficios.
          </h2>
          <p className="text-white/70 text-base leading-relaxed mb-8">
            Registra todos tus talentos bajo una misma cuenta y llega a más clientes.
          </p>
          {[
            'Multiperfil profesional ilimitado',
            'Mensajería directa con clientes',
            'Estadísticas de visibilidad',
            'Calificaciones y reseñas verificadas',
          ].map((f) => (
            <div key={f} className="flex items-center gap-3 mb-3">
              <CheckCircle className="w-5 h-5 text-white/90 shrink-0" />
              <span className="text-sm text-white/80">{f}</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-white/40">© 2024 ProConnect. Todos los derechos reservados.</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Back button */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al inicio
          </button>

          {/* Logo (mobile) */}
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-xl bg-[var(--turquoise)] flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="font-heading font-700 text-foreground">ProConnect</span>
          </div>

          {/* Tab switcher */}
          <div className="flex bg-muted rounded-2xl p-1 mb-8">
            {(['login', 'register'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  tab === t
                    ? 'bg-card shadow-sm text-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                {t === 'login' ? 'Iniciar sesión' : 'Registrarse'}
              </button>
            ))}
          </div>

          <h1 className="font-heading font-700 text-2xl text-foreground mb-1">
            {isLogin ? 'Bienvenido de vuelta' : 'Crea tu cuenta'}
          </h1>
          <p className="text-sm text-muted-foreground mb-7">
            {isLogin
              ? 'Ingresa tus credenciales para continuar.'
              : 'Empieza a conectar con clientes hoy.'}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Nombre completo
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ej: María González"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--turquoise)] transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Correo electrónico
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="tu@email.com"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--turquoise)] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--turquoise)] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-foreground mb-2">
                  ¿Cómo usarás ProConnect?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: 'professional', label: 'Soy profesional' },
                    { val: 'client', label: 'Busco servicios' },
                    { val: 'both', label: 'Ambos' },
                  ].map(({ val, label }) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setForm({ ...form, role: val })}
                      className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                        form.role === val
                          ? 'border-[var(--turquoise)] bg-[var(--turquoise)]/10 text-[var(--turquoise)]'
                          : 'border-border text-muted-foreground'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex justify-end">
                <button type="button" className="text-xs text-[var(--turquoise)] font-medium">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[var(--turquoise)] text-white font-semibold text-sm hover:opacity-90 transition-all shadow-sm mt-1"
            >
              {isLogin ? 'Iniciar sesión' : 'Crear cuenta gratuita'}
            </button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-6">
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
            <button
              onClick={() => setTab(isLogin ? 'register' : 'login')}
              className="text-[var(--turquoise)] font-semibold"
            >
              {isLogin ? 'Regístrate gratis' : 'Inicia sesión'}
            </button>
          </p>

          {!isLogin && (
            <p className="text-xs text-muted-foreground text-center mt-3">
              Al registrarte, aceptas nuestros{' '}
              <button className="underline">Términos de uso</button> y{' '}
              <button className="underline">Política de privacidad</button>.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
