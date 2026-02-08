import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export const PLANS_QUERY_KEY = ['plans'] as const
export const LOCATIONS_QUERY_KEY = ['locations'] as const
export const VOLUME_PRICING_QUERY_KEY = ['volumePricing'] as const

export function usePlans() {
    return useQuery({
        queryKey: PLANS_QUERY_KEY,
        queryFn: api.getPlans,
        staleTime: Infinity
    })
}

export function useLocations() {
    return useQuery({
        queryKey: LOCATIONS_QUERY_KEY,
        queryFn: api.getLocations,
        staleTime: Infinity
    })
}

export function useVolumePricing() {
    return useQuery({
        queryKey: VOLUME_PRICING_QUERY_KEY,
        queryFn: api.getVolumePricing,
        staleTime: Infinity
    })
}