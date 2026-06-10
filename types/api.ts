// Tipos compartidos entre frontend y backend

// ============================================
// User Types
// ============================================

export interface User {
  id: number
  email: string
  full_name: string
  avatar_url?: string
  bio?: string
  role: 'client' | 'professional'
  created_at: string
  updated_at: string
}

export interface UserProfile extends User {}

// ============================================
// Professional Types
// ============================================

export interface Professional {
  id: number
  user_id: number
  title: string
  bio: string
  categories: string[]
  hourly_rate: number
  location: string
  rating: number
  reviews_count: number
  is_verified: boolean
  is_available: boolean
  created_at: string
  updated_at: string
}

export interface ProfessionalSearchParams {
  search?: string
  categories?: string[]
  min_price?: number
  max_price?: number
  sort?: 'rating' | 'price' | 'recent'
  limit?: number
  offset?: number
}

// ============================================
// Portfolio Types
// ============================================

export interface PortfolioItem {
  id: number
  professional_id: number
  photo_url: string
  title?: string
  description?: string
  created_at: string
}

// ============================================
// Review Types
// ============================================

export interface Review {
  id: number
  professional_id: number
  client_id: number
  rating: number
  comment: string
  created_at: string
  full_name?: string
  avatar_url?: string
}

export interface RatingStats {
  average_rating: number
  total_reviews: number
  distribution: Record<number, number>
}

// ============================================
// Message Types
// ============================================

export interface Message {
  id: number
  sender_id: number
  receiver_id: number
  content: string
  created_at: string
  read_at?: string
}

export interface Conversation {
  user_id: number
  last_message: Message
  unread_count: number
}

// ============================================
// Auth Types
// ============================================

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  full_name: string
  role: 'client' | 'professional'
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  user: {
    id: number
    email: string
    full_name: string
    role: 'client' | 'professional'
  }
}

export interface RefreshTokenRequest {
  refresh_token: string
}

export interface RefreshTokenResponse {
  access_token: string
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  limit: number
  offset: number
}

// ============================================
// JWT Payload
// ============================================

export interface JWTPayload {
  id: number
  email: string
  iat?: number
  exp?: number
}
