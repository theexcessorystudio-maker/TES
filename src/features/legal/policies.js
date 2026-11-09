/**
 * Registry of store policy pages. Routes, the footer and the policy sidebar are all generated
 * from this list, so adding a page here is the only wiring needed (plus its content component
 * in ./content/index.js). Kept free of page content so the footer can import it cheaply.
 */
export const POLICY_GROUPS = {
  help: 'Customer care',
  legal: 'Legal',
}

export const POLICIES = [
  {
    slug: 'contact',
    path: '/contact',
    title: 'Contact Us',
    navLabel: 'Contact us',
    group: 'help',
    summary: 'Real people, quick replies. Reach us about an order, a product or anything else.',
    dated: false,
  },
  {
    slug: 'shipping',
    path: '/shipping-policy',
    title: 'Shipping Policy',
    navLabel: 'Shipping & delivery',
    group: 'help',
    summary: 'How we pack, dispatch and deliver your order, and what it costs.',
  },
  {
    slug: 'returns',
    path: '/returns-policy',
    title: 'Returns, Replacements & Refunds',
    navLabel: 'Returns & replacements',
    group: 'help',
    summary: 'What to do if your order arrives damaged or isn’t what you ordered.',
  },
  {
    slug: 'privacy',
    path: '/privacy-policy',
    title: 'Privacy Policy',
    navLabel: 'Privacy policy',
    group: 'legal',
    summary: 'What information we collect, why we collect it and how we keep it safe.',
  },
  {
    slug: 'terms',
    path: '/terms',
    title: 'Terms & Conditions',
    navLabel: 'Terms & conditions',
    group: 'legal',
    summary: 'The terms that apply when you browse this website or place an order with us.',
  },
]

export const policyBySlug = (slug) => POLICIES.find((p) => p.slug === slug)
export const policyPath = (slug) => policyBySlug(slug)?.path ?? '/'
