// Common TypeScript Types for Viet City Wear

export type PackageTier = 'BASIC' | 'STANDARD' | 'SPECIAL'

export interface CitySummary {
  id: string
  name: string
  slug: string
  description: string
  imageUrl?: string | null
}

export interface CartItem {
  productId: string
  name: string
  packageTier: PackageTier
  size: string
  price: number
  quantity: number
  image?: string
}
