/**
 * Custom hook for fetching and managing professionals data
 * Supports both mock data (development) and real API (production)
 */

import { useState, useEffect, useCallback } from 'react'
import { professionals as professionalAPI, ProfessionalSearchParams } from '@/lib/api'
import type { Professional } from '@/lib/mock-data'
import { PROFESSIONALS } from '@/lib/mock-data'

interface UseProfessionalsOptions {
  useMockData?: boolean
  enableCache?: boolean
}

interface ProfessionalsState {
  data: Professional[]
  loading: boolean
  error: string | null
}

export function useProfessionals(
  params?: ProfessionalSearchParams,
  options: UseProfessionalsOptions = {}
) {
  const { useMockData = true, enableCache = true } = options
  const [state, setState] = useState<ProfessionalsState>({
    data: [],
    loading: true,
    error: null,
  })

  const [cache, setCache] = useState<Map<string, ProfessionalsState>>(new Map())

  const fetchProfessionals = useCallback(async () => {
    const cacheKey = JSON.stringify(params || {})

    // Check cache first
    if (enableCache && cache.has(cacheKey)) {
      setState(cache.get(cacheKey)!)
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      let data: Professional[]

      if (useMockData) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300))
        data = PROFESSIONALS

        // Apply search params to mock data
        if (params?.search) {
          const q = params.search.toLowerCase()
          data = data.filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              p.categories.some((c) => c.toLowerCase().includes(q)) ||
              p.bio.toLowerCase().includes(q)
          )
        }

        if (params?.categories?.length) {
          data = data.filter((p) =>
            params.categories!.some((cat) => p.categories.includes(cat))
          )
        }

        if (params?.min_price !== undefined) {
          data = data.filter((p) => p.price >= params.min_price!)
        }

        if (params?.max_price !== undefined) {
          data = data.filter((p) => p.price <= params.max_price!)
        }

        if (params?.sort === 'rating') {
          data.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        } else if (params?.sort === 'price') {
          data.sort((a, b) => a.price - b.price)
        }

        if (params?.limit) {
          data = data.slice(0, params.limit)
        }
      } else {
        // Call real API
        const apiParams: ProfessionalSearchParams = {
          limit: params?.limit || 10,
          offset: params?.offset || 0,
          ...params,
        }
        data = await professionalAPI.search(apiParams)
      }

      const newState: ProfessionalsState = {
        data,
        loading: false,
        error: null,
      }

      setState(newState)

      // Cache result
      if (enableCache) {
        setCache((prev) => new Map(prev).set(cacheKey, newState))
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to fetch professionals'
      const errorState: ProfessionalsState = {
        data: [],
        loading: false,
        error,
      }
      setState(errorState)
    }
  }, [params, useMockData, enableCache, cache])

  useEffect(() => {
    fetchProfessionals()
  }, [fetchProfessionals])

  const refetch = useCallback(() => {
    setCache(new Map()) // Clear cache
    fetchProfessionals()
  }, [fetchProfessionals])

  return {
    ...state,
    refetch,
  }
}

/**
 * Hook for fetching a single professional
 */
export function useProfessional(id: string, useMockData = true) {
  const [state, setState] = useState<{
    data: Professional | null
    loading: boolean
    error: string | null
  }>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    const fetchProfessional = async () => {
      try {
        let data: Professional | undefined

        if (useMockData) {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 200))
          data = PROFESSIONALS.find((p) => p.id === id)
        } else {
          data = await professionalAPI.getById(id)
        }

        if (!data) {
          throw new Error('Professional not found')
        }

        setState({ data, loading: false, error: null })
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Failed to fetch professional'
        setState({ data: null, loading: false, error })
      }
    }

    fetchProfessional()
  }, [id, useMockData])

  return state
}

/**
 * Hook for fetching top professionals
 */
export function useTopProfessionals(limit = 10, useMockData = true) {
  const [state, setState] = useState<ProfessionalsState>({
    data: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    const fetchTop = async () => {
      try {
        let data: Professional[]

        if (useMockData) {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 300))
          data = [...PROFESSIONALS].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, limit)
        } else {
          data = await professionalAPI.getTop(limit)
        }

        setState({ data, loading: false, error: null })
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Failed to fetch top professionals'
        setState({ data: [], loading: false, error })
      }
    }

    fetchTop()
  }, [limit, useMockData])

  return state
}
