import { isSoldOut } from './product'

/**
 * "Frequently bought together" — a small strategy chain:
 *   1. pairings the admin picked for this product
 *   2. in-stock pieces from *other* categories (complete the look)
 *   3. in-stock pieces from the same category
 * Each strategy only fills the slots the previous one left empty.
 */
const strategies = [
  (seed, catalog) => (seed.pairsWith || []).map((id) => catalog.find((p) => p.id === id)).filter(Boolean),
  (seed, catalog) => catalog.filter((p) => p.category !== seed.category),
  (seed, catalog) => catalog.filter((p) => p.category === seed.category),
]

export function frequentlyBoughtWith(seed, catalog, limit = 2) {
  if (!seed) return []
  const picks = []
  const exclude = new Set([seed.id])
  for (const strategy of strategies) {
    for (const p of strategy(seed, catalog)) {
      if (picks.length >= limit) return picks
      if (exclude.has(p.id) || isSoldOut(p) || !p.images?.length) continue
      exclude.add(p.id)
      picks.push(p)
    }
  }
  return picks
}

/** Cart upsell: aggregate pairings for every product in the cart, minus what's already there. */
export function cartRecommendations(cartProducts, catalog, limit = 4) {
  const inCart = new Set(cartProducts.map((p) => p.id))
  const seen = new Set()
  const out = []
  for (const seed of cartProducts) {
    for (const p of frequentlyBoughtWith(seed, catalog, limit)) {
      if (inCart.has(p.id) || seen.has(p.id)) continue
      seen.add(p.id)
      out.push(p)
      if (out.length >= limit) return out
    }
  }
  return out
}
