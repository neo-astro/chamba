'use client'

import { AlertTriangle, Trash2, X } from 'lucide-react'

export type ConfirmVariant = 'danger' | 'warning' | 'info'

type Props = {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: ConfirmVariant
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null

  const config = {
    danger: {
      iconBg: '#FFF1F0',
      iconColor: 'var(--coral)',
      icon: <Trash2 className="w-5 h-5" style={{ color: 'var(--coral)' }} />,
      btnBg: 'var(--coral)',
      btnHover: 'opacity-90',
    },
    warning: {
      iconBg: '#FFFBEB',
      iconColor: 'var(--amber-brand)',
      icon: <AlertTriangle className="w-5 h-5" style={{ color: 'var(--amber-brand)' }} />,
      btnBg: 'var(--amber-brand)',
      btnHover: 'opacity-90',
    },
    info: {
      iconBg: '#F0FDFB',
      iconColor: 'var(--turquoise)',
      icon: <AlertTriangle className="w-5 h-5" style={{ color: 'var(--turquoise)' }} />,
      btnBg: 'var(--turquoise)',
      btnHover: 'opacity-90',
    },
  }

  const c = config[variant]

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/40 animate-fade-in"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative bg-card rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-fade-in-up z-10">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center gap-4 pt-2">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: c.iconBg }}
          >
            {c.icon}
          </div>

          <div>
            <h3 className="font-heading font-700 text-lg text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{description}</p>
          </div>

          <div className="flex gap-3 w-full mt-1">
            <button
              onClick={onCancel}
              className="flex-1 py-3 rounded-full border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground transition-all"
            >
              {cancelLabel}
            </button>
            <button
              onClick={() => { onConfirm(); }}
              style={{ background: c.btnBg }}
              className={`flex-1 py-3 rounded-full text-white text-sm font-semibold ${c.btnHover} transition-all shadow-sm`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
