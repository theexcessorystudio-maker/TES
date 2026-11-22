/*
 * ✏️ Store policy terms, in one place. The policy pages, FAQ and checkout read from here,
 * so changing a number updates every page that mentions it.
 */
import { SHIPPING } from '../../shared/commerce'

export const POLICY = {
  /** Delivery fee charged below the free-shipping threshold (the same values checkout charges). */
  deliveryFee: SHIPPING.flatFee,
  freeShippingAbove: SHIPPING.freeAbove,
  /** Damaged / wrong item claims must be raised within this window after delivery. */
  claimWindowHours: 24,
  dispatchTime: '24–48 hours',
  deliveryTime: '3–7 business days',
  refundTime: '5–7 business days',
  shipsTo: 'all serviceable pincodes in India',
  /** Shown as “Last updated” on every policy page. */
  lastUpdated: '2026-11-19',
  jurisdiction: 'India',
}
