'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Send, Check } from 'lucide-react'

export type ChatMessage = {
  id: string
  text: string
  from: 'me' | 'them'
  time: string
  read?: boolean
}

type Props = {
  open: boolean
  contact: { id: string; name: string; avatar: string }
  initialMessages?: ChatMessage[]
  onClose: () => void
}

// Simulated auto-replies for real-time feel
const AUTO_REPLIES = [
  'Perfecto, me parece bien.',
  'Sí, puedo coordinar eso contigo.',
  'Dejame ver mi agenda y te confirmo.',
  'Gracias por escribirme. ¿Qué horario te vendría mejor?',
  'Con gusto, ¿cuándo te va bien para empezar?',
  'Entendido. Te mando el presupuesto enseguida.',
]

export default function ChatModal({ open, contact, initialMessages = [], onClose }: Props) {
  const contactName = contact.name
  const contactAvatar = contact.avatar
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setMessages(initialMessages)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = () => {
    const text = input.trim()
    if (!text) return

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      text,
      from: 'me',
      time: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
      read: false,
    }
    setMessages((prev) => [...prev, newMsg])
    setInput('')

    // Simulate typing + auto-reply
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)],
        from: 'them',
        time: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, reply])
      // Mark sent message as read after reply
      setMessages((prev) =>
        prev.map((m) => (m.id === newMsg.id ? { ...m, read: true } : m))
      )
    }, 1400 + Math.random() * 800)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/40 animate-fade-in" onClick={onClose} />

      {/* Chat window */}
      <div className="relative bg-card w-full md:max-w-md md:rounded-3xl rounded-t-3xl shadow-2xl z-10 flex flex-col overflow-hidden animate-fade-in-up"
        style={{ height: '88vh', maxHeight: '600px' }}>
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border shrink-0">
          <div className="relative">
            <img
              src={contactAvatar}
              alt={contactName}
              className="w-10 h-10 rounded-2xl object-cover"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[var(--turquoise)] border-2 border-card" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">{contactName}</p>
            <p className="text-xs text-[var(--turquoise)]">En línea</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-colors"
            aria-label="Cerrar chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-2">
              <div className="w-14 h-14 rounded-2xl bg-[var(--turquoise)]/10 flex items-center justify-center">
                <img src={contactAvatar} alt={contactName} className="w-10 h-10 rounded-xl object-cover" />
              </div>
              <p className="text-sm font-semibold text-foreground">{contactName}</p>
              <p className="text-xs text-muted-foreground">
                Inicia la conversación y coordina los detalles del servicio.
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.from === 'me'
                    ? 'bg-[var(--turquoise)] text-white rounded-br-sm'
                    : 'bg-muted text-foreground rounded-bl-sm'
                }`}
              >
                <p>{msg.text}</p>
                <div className={`flex items-center gap-1 mt-1 ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <span
                    className="text-[10px]"
                    style={{ color: msg.from === 'me' ? 'rgba(255,255,255,0.7)' : 'var(--muted-foreground)' }}
                  >
                    {msg.time}
                  </span>
                  {msg.from === 'me' && (
                    <Check
                      className="w-3 h-3"
                      style={{ color: msg.read ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.6)' }}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
                    style={{
                      animation: 'bounce 1.2s ease infinite',
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-border shrink-0">
          <div className="flex items-center gap-2 bg-background border border-border rounded-full px-4 py-2.5 focus-within:ring-2 focus-within:ring-[var(--turquoise)] transition-all">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe un mensaje..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="w-8 h-8 rounded-full bg-[var(--turquoise)] text-white flex items-center justify-center disabled:opacity-40 transition-all hover:opacity-90 shrink-0"
              aria-label="Enviar mensaje"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
