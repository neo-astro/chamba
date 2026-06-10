'use client'

import HeroSection from '@/components/landing/hero-section'
import CategoriesSection from '@/components/landing/categories-section'
import HowItWorks from '@/components/landing/how-it-works'
import FeaturedPros from '@/components/landing/featured-pros'
import TestimonialsSection from '@/components/landing/testimonials-section'
import CtaFooter from '@/components/landing/cta-footer'

type Props = {
  onNavigate: (page: string) => void
  onSearch: (query: string) => void
  onSelectPro: (id: string) => void
}

export default function LandingPage({ onNavigate, onSearch, onSelectPro }: Props) {
  return (
    <main>
      <HeroSection onNavigate={onNavigate} onSearch={onSearch} />
      <CategoriesSection onNavigate={onNavigate} />
      <HowItWorks />
      <FeaturedPros onNavigate={onNavigate} onSelectPro={onSelectPro} />
      <TestimonialsSection />
      <CtaFooter onNavigate={onNavigate} />
    </main>
  )
}
