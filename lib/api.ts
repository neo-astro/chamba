/**
 * API Client for ProConnect Backend
 * Configurable to work with both local development and production
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>
}

async function apiCall<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, headers = {}, ...init } = options
  
  // Build URL with query params
  let url = `${API_BASE_URL}${endpoint}`
  if (params) {
    const queryString = new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    ).toString()
    if (queryString) url += `?${queryString}`
  }

  // Add auth token if available
  const token = localStorage.getItem('auth_token')
  const finalHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  }
  if (token) {
    finalHeaders['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...init,
    headers: finalHeaders,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }))
    throw new Error(error.message || `HTTP Error: ${response.status}`)
  }

  if (response.status === 204) {
    return {} as T
  }

  return response.json()
}

// ============================================
// Auth Endpoints
// ============================================

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  user: {
    id: string
    email: string
    full_name: string
    role: 'client' | 'professional'
  }
}

export const auth = {
  login: (data: LoginRequest) =>
    apiCall<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  register: (data: {
    email: string
    password: string
    full_name: string
    role: 'client' | 'professional'
  }) =>
    apiCall<LoginResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  refreshToken: (refreshToken: string) =>
    apiCall<{ access_token: string }>('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    }),

  logout: () =>
    apiCall<void>('/api/auth/logout', { method: 'POST' }),
}

// ============================================
// User Endpoints
// ============================================

export interface User {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  bio?: string
  role: 'client' | 'professional'
  created_at: string
}

export const users = {
  getProfile: () =>
    apiCall<User>('/api/users/profile'),

  updateProfile: (data: Partial<User>) =>
    apiCall<User>('/api/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  uploadAvatar: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiCall<{ url: string }>('/api/users/avatar', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type with boundary
    })
  },
}

// ============================================
// Professional Endpoints
// ============================================

export interface Professional {
  id: string
  user_id: string
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

export const professionals = {
  search: (params: ProfessionalSearchParams) =>
    apiCall<Professional[]>('/api/professionals', { params }),

  getById: (id: string) =>
    apiCall<Professional>(`/api/professionals/${id}`),

  getTop: (limit = 10) =>
    apiCall<Professional[]>('/api/professionals/top', {
      params: { limit },
    }),

  create: (data: Partial<Professional>) =>
    apiCall<Professional>('/api/professionals', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Professional>) =>
    apiCall<Professional>(`/api/professionals/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
}

// ============================================
// Portfolio Endpoints
// ============================================

export interface PortfolioItem {
  id: string
  professional_id: string
  photo_url: string
  title?: string
  description?: string
  created_at: string
}

export const portfolio = {
  getByProfessional: (professionalId: string) =>
    apiCall<PortfolioItem[]>(`/api/professionals/${professionalId}/portfolio`),

  upload: (professionalId: string, file: File, title?: string) => {
    const formData = new FormData()
    formData.append('file', file)
    if (title) formData.append('title', title)
    
    return apiCall<PortfolioItem>(`/api/professionals/${professionalId}/portfolio`, {
      method: 'POST',
      body: formData,
      headers: {},
    })
  },

  delete: (professionalId: string, photoId: string) =>
    apiCall<void>(`/api/professionals/${professionalId}/portfolio/${photoId}`, {
      method: 'DELETE',
    }),
}

// ============================================
// Rating & Reviews Endpoints
// ============================================

export interface Review {
  id: string
  professional_id: string
  client_id: string
  rating: number
  comment: string
  created_at: string
}

export const reviews = {
  getByProfessional: (professionalId: string) =>
    apiCall<Review[]>(`/api/professionals/${professionalId}/reviews`),

  create: (data: {
    professional_id: string
    rating: number
    comment: string
  }) =>
    apiCall<Review>('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getRatingStats: (professionalId: string) =>
    apiCall<{
      average_rating: number
      total_reviews: number
      distribution: Record<number, number>
    }>(`/api/professionals/${professionalId}/rating-stats`),
}

// ============================================
// Message Endpoints
// ============================================

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
  read_at?: string
}

export const messages = {
  getConversation: (userId: string) =>
    apiCall<Message[]>(`/api/messages/conversation/${userId}`),

  send: (data: { receiver_id: string; content: string }) =>
    apiCall<Message>('/api/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  markAsRead: (messageId: string) =>
    apiCall<void>(`/api/messages/${messageId}/read`, {
      method: 'PATCH',
    }),

  getConversations: () =>
    apiCall<Array<{ user_id: string; last_message: Message; unread_count: number }>>(
      '/api/messages/conversations'
    ),
}

// ============================================
// Helper Functions
// ============================================

export function setAuthToken(token: string) {
  localStorage.setItem('auth_token', token)
}

export function setRefreshToken(token: string) {
  localStorage.setItem('refresh_token', token)
}

export function getAuthToken() {
  return localStorage.getItem('auth_token')
}

export function getRefreshToken() {
  return localStorage.getItem('refresh_token')
}

export function clearAuthToken() {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('refresh_token')
}

export function isAuthenticated() {
  return !!getAuthToken()
}

// Re-export everything as namespace for convenience
export const api = {
  auth,
  users,
  professionals,
  portfolio,
  reviews,
  messages,
  setAuthToken,
  getAuthToken,
  clearAuthToken,
  isAuthenticated,
}
