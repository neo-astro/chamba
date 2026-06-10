import { useState, useEffect, useCallback } from 'react'
import { auth, getAuthToken, clearAuthToken } from '@/lib/api'

export interface AuthUser {
  id: string
  email: string
  full_name: string
  role: 'client' | 'professional'
}

export interface UseAuthReturn {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
  login: (email: string, password: string) => Promise<AuthUser>
  register: (email: string, password: string, full_name: string, role: 'client' | 'professional') => Promise<AuthUser>
  logout: () => void
  clearError: () => void
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getAuthToken()
        if (token) {
          // Try to fetch user profile
          const response = await fetch('http://localhost:3001/api/users/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          if (response.ok) {
            const userData = await response.json()
            setUser(userData)
          } else {
            clearAuthToken()
          }
        }
      } catch (err) {
        console.error('[v0] Auth check failed:', err)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = useCallback(
    async (email: string, password: string): Promise<AuthUser> => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await auth.login({ email, password })
        localStorage.setItem('auth_token', response.access_token)
        if (response.refresh_token) {
          localStorage.setItem('refresh_token', response.refresh_token)
        }
        setUser(response.user as AuthUser)
        return response.user as AuthUser
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Login failed'
        setError(errorMsg)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const register = useCallback(
    async (email: string, password: string, full_name: string, role: 'client' | 'professional'): Promise<AuthUser> => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await auth.register({
          email,
          password,
          full_name,
          role,
        })
        localStorage.setItem('auth_token', response.access_token)
        if (response.refresh_token) {
          localStorage.setItem('refresh_token', response.refresh_token)
        }
        setUser(response.user as AuthUser)
        return response.user as AuthUser
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Registration failed'
        setError(errorMsg)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const logout = useCallback(() => {
    clearAuthToken()
    setUser(null)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    login,
    register,
    logout,
    clearError,
  }
}
