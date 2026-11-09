/*
 * ✏️ Store policy terms, in one place. The policy pages, FAQ and checkout read from here,
 * so changing a number updates every page that mentions it.
 */
import { SHIPPING } from '../../shared/commerce'

export const POLICY = {
  /** Delivery fee charged on every order (the same value checkout charges). */
  deliveryFee: SHIPPING.flatFee,
  /** Charged for a replacement when the item arrived correct and undamaged. */
  replacementFee: 100,
  /** Damaged / wrong item claims must be raised within this window after delivery. */
  claimWindowHours: 48,
  dispatchTime: '1–3 business days',
  deliveryTime: '4–8 business days',
  refundTime: '5–7 business days',
  shipsTo: 'all serviceable pincodes in India',
  /** Shown as “Last updated” on every policy page. */
  lastUpdated: '2026-11-10',
  jurisdiction: 'India',
}
