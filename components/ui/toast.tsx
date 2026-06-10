'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export type Toast = {
  id: string
  message: string
  type: ToastType
  duration?: number
}

type ToastContextType = {
  toast: (message: string, type?: ToastType, duration?: number) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((message: string, type: ToastType = 'success', duration = 3500) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, message, type, duration }])
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5 items-end"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Trigger enter animation
    const enter = requestAnimationFrame(() => setVisible(true))
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onDismiss(toast.id), 300)
    }, toast.duration ?? 3500)
    return () => {
      cancelAnimationFrame(enter)
      clearTimeout(timer)
    }
  }, [toast.id, toast.duration, onDismiss])

  const config: Record<ToastType, { icon: React.ReactNode; bg: string; border: string; text: string }> = {
    success: {
      icon: <CheckCircle className="w-4 h-4 shrink-0" style={{ color: 'var(--turquoise)' }} />,
      bg: 'var(--card)',
      border: 'var(--turquoise)',
      text: 'var(--foreground)',
    },
    error: {
      icon: <AlertCircle className="w-4 h-4 shrink-0" style={{ color: 'var(--coral)' }} />,
      bg: 'var(--card)',
      border: 'var(--coral)',
      text: 'var(--foreground)',
    },
    warning: {
      icon: <AlertTriangle className="w-4 h-4 shrink-0" style={{ color: 'var(--amber-brand)' }} />,
      bg: 'var(--card)',
      border: 'var(--amber-brand)',
      text: 'var(--foreground)',
    },
    info: {
      icon: <Info className="w-4 h-4 shrink-0" style={{ color: 'var(--violet-soft)' }} />,
      bg: 'var(--card)',
      border: 'var(--violet-soft)',
      text: 'var(--foreground)',
    },
  }

  const c = config[toast.type]

  return (
    <div
      role="alert"
      style={{
        background: c.bg,
        borderLeft: `3px solid ${c.border}`,
        color: c.text,
        transition: 'all 0.3s ease',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(24px)',
      }}
      className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg border border-border min-w-[240px] max-w-[340px]"
    >
      {c.icon}
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      <button
        onClick={() => {
          setVisible(false)
          setTimeout(() => onDismiss(toast.id), 300)
        }}
        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Cerrar notificación"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
