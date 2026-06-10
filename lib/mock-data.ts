export type Category = {
  id: string
  name: string
  icon: string
  count: number
  color: string
  bg: string
}

export type Professional = {
  id: string
  name: string
  avatar: string
  categories: string[]
  rating: number
  reviews: number
  location: string
  price: number
  priceUnit: string
  bio: string
  verified: boolean
  available: boolean
  tags: string[]
  portfolio: string[]
  joinedYear: number
  completedJobs: number
  boosted?: boolean
}

export type Review = {
  id: string
  author: string
  avatar: string
  rating: number
  date: string
  comment: string
  service: string
}

export type Message = {
  id: string
  from: string
  avatar: string
  text: string
  time: string
  unread: boolean
}

export type UserProfile = {
  id: string
  category: string
  icon: string
  color: string
  bg: string
  title: string
  description: string
  price: number
  priceUnit: string
  active: boolean
  views: number
  contacts: number
  rating: number
  location: string
  boosted?: boolean
}

export const CATEGORIES: Category[] = [
  { id: 'nanny', name: 'Niñero/a', icon: '👶', count: 342, color: '#2DD4BF', bg: '#F0FDFB' },
  { id: 'plumber', name: 'Plomero', icon: '🔧', count: 218, color: '#FF7F50', bg: '#FFF5F0' },
  { id: 'teacher', name: 'Profesor/a', icon: '📚', count: 589, color: '#A78BFA', bg: '#F5F3FF' },
  { id: 'carpenter', name: 'Carpintero', icon: '🪚', count: 156, color: '#FBBF24', bg: '#FFFBEB' },
  { id: 'electrician', name: 'Electricista', icon: '⚡', count: 203, color: '#2DD4BF', bg: '#F0FDFB' },
  { id: 'cleaner', name: 'Limpieza', icon: '🧹', count: 412, color: '#FF7F50', bg: '#FFF5F0' },
  { id: 'cook', name: 'Cocinero/a', icon: '👨‍🍳', count: 178, color: '#A78BFA', bg: '#F5F3FF' },
  { id: 'luthier', name: 'Luthier', icon: '🎸', count: 47, color: '#FBBF24', bg: '#FFFBEB' },
  { id: 'gardener', name: 'Jardinero', icon: '🌿', count: 265, color: '#2DD4BF', bg: '#F0FDFB' },
  { id: 'painter', name: 'Pintor', icon: '🎨', count: 189, color: '#FF7F50', bg: '#FFF5F0' },
  { id: 'pet', name: 'Cuidado Mascotas', icon: '🐾', count: 231, color: '#A78BFA', bg: '#F5F3FF' },
  { id: 'yoga', name: 'Yoga/Fitness', icon: '🧘', count: 144, color: '#FBBF24', bg: '#FFFBEB' },
]

export const PROFESSIONALS: Professional[] = [
  {
    id: '1',
    name: 'María González',
    avatar: 'https://i.pravatar.cc/150?img=47',
    categories: ['Niñero/a', 'Profesor/a'],
    rating: 4.9,
    reviews: 87,
    location: 'Buenos Aires, Argentina',
    price: 850,
    priceUnit: 'hora',
    bio: 'Maestra jardinera con 8 años de experiencia. También ofrezco clases de lectura y matemáticas para niños de 4 a 12 años.',
    verified: true,
    available: true,
    tags: ['Niños', 'Educación', 'Cuidado infantil'],
    boosted: true,
    portfolio: [
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&q=80',
      'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=600&q=80',
      'https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=600&q=80',
      'https://images.unsplash.com/photo-1471286174890-9c112ac6476d?w=600&q=80',
    ],
    joinedYear: 2019,
    completedJobs: 134,
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    avatar: 'https://i.pravatar.cc/150?img=12',
    categories: ['Plomero', 'Electricista'],
    rating: 4.7,
    reviews: 52,
    location: 'Córdoba, Argentina',
    price: 1200,
    priceUnit: 'hora',
    bio: 'Técnico matriculado con más de 10 años en instalaciones domiciliarias. Trabajo también como electricista certificado.',
    verified: true,
    available: true,
    tags: ['Urgencias', 'Certificado', 'Instalaciones'],
    portfolio: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
      'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80',
      'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&q=80',
    ],
    joinedYear: 2020,
    completedJobs: 98,
  },
  {
    id: '3',
    name: 'Ana Fernández',
    avatar: 'https://i.pravatar.cc/150?img=23',
    categories: ['Profesor/a', 'Yoga/Fitness'],
    rating: 5.0,
    reviews: 63,
    location: 'Rosario, Argentina',
    price: 900,
    priceUnit: 'hora',
    bio: 'Profesora de inglés y francés. Instructora certificada de yoga. Clases presenciales y virtuales disponibles.',
    verified: true,
    available: false,
    tags: ['Idiomas', 'Yoga', 'Online'],
    portfolio: [
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80',
      'https://images.unsplash.com/photo-1545389336-cf090694435e?w=600&q=80',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80',
    ],
    joinedYear: 2018,
    completedJobs: 211,
  },
  {
    id: '4',
    name: 'Javier Morales',
    avatar: 'https://i.pravatar.cc/150?img=33',
    categories: ['Carpintero', 'Luthier'],
    rating: 4.8,
    reviews: 41,
    location: 'Mendoza, Argentina',
    price: 1500,
    priceUnit: 'trabajo',
    bio: 'Artesano especializado en muebles a medida y restauración de instrumentos de cuerda. 15 años de experiencia.',
    verified: false,
    available: true,
    tags: ['Artesanal', 'Instrumentos', 'Muebles'],
    boosted: true,
    portfolio: [
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=80',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
      'https://images.unsplash.com/photo-1490427712608-588d03c78e83?w=600&q=80',
      'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=600&q=80',
    ],
    joinedYear: 2021,
    completedJobs: 67,
  },
  {
    id: '5',
    name: 'Valentina Suárez',
    avatar: 'https://i.pravatar.cc/150?img=56',
    categories: ['Cocinero/a', 'Limpieza'],
    rating: 4.6,
    reviews: 38,
    location: 'La Plata, Argentina',
    price: 700,
    priceUnit: 'hora',
    bio: 'Chef especializada en cocina saludable. También ofrezco servicios de limpieza profunda para hogares y oficinas.',
    verified: true,
    available: true,
    tags: ['Saludable', 'Limpieza', 'Catering'],
    portfolio: [
      'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=600&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80',
    ],
    joinedYear: 2022,
    completedJobs: 45,
  },
  {
    id: '6',
    name: 'Roberto Pérez',
    avatar: 'https://i.pravatar.cc/150?img=65',
    categories: ['Jardinero', 'Pintor'],
    rating: 4.5,
    reviews: 29,
    location: 'Salta, Argentina',
    price: 600,
    priceUnit: 'hora',
    bio: 'Diseño y mantenimiento de jardines. También realizo trabajos de pintura interior y exterior con gran acabado.',
    verified: true,
    available: true,
    tags: ['Exterior', 'Diseño', 'Pintura'],
    portfolio: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&q=80',
    ],
    joinedYear: 2021,
    completedJobs: 53,
  },
]

export const REVIEWS: Review[] = [
  {
    id: '1',
    author: 'Lucía M.',
    avatar: 'https://i.pravatar.cc/150?img=5',
    rating: 5,
    date: 'Marzo 2024',
    comment: 'Excelente profesional, muy puntual y dedicada. Mis hijos la adoran. La recomiendo completamente.',
    service: 'Niñera',
  },
  {
    id: '2',
    author: 'Marcos D.',
    avatar: 'https://i.pravatar.cc/150?img=8',
    rating: 5,
    date: 'Febrero 2024',
    comment: 'Resolvió el problema de plomería en menos de una hora. Muy profesional y precio justo.',
    service: 'Plomero',
  },
  {
    id: '3',
    author: 'Sofía R.',
    avatar: 'https://i.pravatar.cc/150?img=9',
    rating: 5,
    date: 'Enero 2024',
    comment: 'Las clases de inglés son increíbles. Mi hijo mejoró muchísimo en solo un mes.',
    service: 'Profesora',
  },
]

export const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    from: 'Carlos Rodríguez',
    avatar: 'https://i.pravatar.cc/150?img=12',
    text: 'Hola! Estoy disponible el lunes para la revisión.',
    time: 'hace 5 min',
    unread: true,
  },
  {
    id: '2',
    from: 'Ana Fernández',
    avatar: 'https://i.pravatar.cc/150?img=23',
    text: 'Gracias por contactarme. ¿Qué horario te viene mejor?',
    time: 'hace 1 h',
    unread: true,
  },
  {
    id: '3',
    from: 'Javier Morales',
    avatar: 'https://i.pravatar.cc/150?img=33',
    text: 'El presupuesto quedó en $15,000 por el mueble completo.',
    time: 'ayer',
    unread: false,
  },
]

export const MY_PROFILES: UserProfile[] = [
  {
    id: 'p1',
    category: 'Niñero/a',
    icon: '👶',
    color: '#2DD4BF',
    bg: '#F0FDFB',
    title: 'Cuidado infantil y apoyo escolar',
    description: 'Cuidado de niños de 2 a 12 años, apoyo en tareas escolares, actividades lúdicas.',
    price: 850,
    priceUnit: 'hora',
    active: true,
    views: 234,
    contacts: 18,
    rating: 4.9,
    location: 'Buenos Aires, Argentina',
  },
  {
    id: 'p2',
    category: 'Profesor/a',
    icon: '📚',
    color: '#A78BFA',
    bg: '#F5F3FF',
    title: 'Clases de Matemáticas y Física',
    description: 'Repaso y preparación para exámenes. Nivel secundario y universitario inicial.',
    price: 1100,
    priceUnit: 'hora',
    active: false,
    views: 89,
    contacts: 5,
    rating: 4.7,
    location: 'Buenos Aires, Argentina',
  },
]
