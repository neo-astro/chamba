'use client'

import { Zap, Mail, Globe, Send, AtSign } from 'lucide-react'

type Props = { onNavigate: (page: string) => void }

export default function CtaFooter({ onNavigate }: Props) {
  return (
    <>
      {/* CTA Band */}
      <section className="py-16 bg-[var(--turquoise)]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-heading font-800 text-3xl md:text-4xl text-white text-balance mb-4">
            ¿Eres un profesional con múltiples talentos?
          </h2>
          <p className="text-white/80 text-lg leading-relaxed mb-8">
            Crea hasta 10 perfiles de oficio bajo una misma cuenta. Llega a más clientes con cada habilidad que tienes.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('register')}
              className="px-8 py-3.5 rounded-full bg-white text-[var(--turquoise)] font-semibold hover:opacity-90 transition-all shadow-sm"
            >
              Crea tu cuenta gratis
            </button>
            <button
              onClick={() => onNavigate('search')}
              className="px-8 py-3.5 rounded-full border-2 border-white/60 text-white font-semibold hover:border-white transition-all"
            >
              Explorar profesionales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-12">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-[var(--turquoise)] flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" fill="white" />
                </div>
                <span className="font-heading font-700 text-lg">ProConnect</span>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">
                Conectando profesionales con clientes en toda Argentina.
              </p>
              <div className="flex items-center gap-3 mt-4">
                {[Globe, Send, AtSign].map((Icon, i) => (
                  <button
                    key={i}
                    className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-[var(--turquoise)] transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              {
                title: 'Plataforma',
                links: ['Explorar profesionales', 'Cómo funciona', 'Precios', 'Blog'],
              },
              {
                title: 'Empresa',
                links: ['Sobre nosotros', 'Careers', 'Press', 'Contacto'],
              },
              {
                title: 'Legal',
                links: ['Términos de uso', 'Privacidad', 'Cookies', 'RGPD'],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-semibold text-sm mb-4 text-white/80">{col.title}</h4>
                <ul className="flex flex-col gap-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <button className="text-sm text-white/50 hover:text-white transition-colors text-left">
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/40">
              © 2024 ProConnect. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-2 text-sm text-white/40">
              <Mail className="w-3.5 h-3.5" />
              hola@proconnect.ar
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
