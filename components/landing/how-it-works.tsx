import { Search, UserCheck, MessageCircle } from 'lucide-react'

const STEPS = [
  {
    number: '01',
    icon: Search,
    title: 'Busca y filtra',
    description:
      'Explora cientos de profesionales por categoría, ubicación, precio y valoración. Sin registro previo.',
    color: '#2DD4BF',
    bg: '#F0FDFB',
  },
  {
    number: '02',
    icon: UserCheck,
    title: 'Revisa perfiles',
    description:
      'Cada profesional puede tener múltiples perfiles de oficio. Lee reseñas reales, ve su portafolio y horarios.',
    color: '#FF7F50',
    bg: '#FFF5F0',
  },
  {
    number: '03',
    icon: MessageCircle,
    title: 'Contacta y contrata',
    description:
      'Envía un mensaje directo o solicita presupuesto. El profesional responde y coordinan el servicio.',
    color: '#A78BFA',
    bg: '#F5F3FF',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="text-center mb-14">
          <h2 className="font-heading font-700 text-3xl md:text-4xl text-foreground text-balance mb-3">
            ¿Cómo funciona?
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
            En tres simples pasos conectas con el profesional ideal para lo que necesitas.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-[#2DD4BF] via-[#FF7F50] to-[#A78BFA] opacity-20" />

          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className="relative flex flex-col items-center text-center p-8 rounded-3xl border border-border bg-card hover:shadow-md transition-all"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: step.bg }}
              >
                <step.icon className="w-7 h-7" style={{ color: step.color }} />
              </div>
              <span
                className="text-xs font-bold tracking-widest mb-2"
                style={{ color: step.color }}
              >
                PASO {step.number}
              </span>
              <h3 className="font-heading font-700 text-xl text-foreground mb-3">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
