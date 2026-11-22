/**
 * Registry of the store's info and policy pages. Routes, the footer and the page sidebar are all
 * generated from this list, so adding a page here is the only wiring needed (plus its content
 * component in ./content/index.js). Kept free of page content so the footer can import it cheaply.
 * The order here is the order shown in the footer.
 */
export const POLICY_GROUPS = {
  about: 'About TES',
  help: 'Customer care',
  legal: 'Legal',
}

export const POLICIES = [
  {
    slug: 'about',
    path: '/about',
    title: 'About TES',
    navLabel: 'About us',
    group: 'about',
    summary: 'For your everyday excess.',
    dated: false,
  },
  {
    slug: 'materials',
    path: '/materials',
    title: 'Materials We Use',
    navLabel: 'Materials we use',
    group: 'about',
    summary: 'Every piece at TES is built to be worn on repeat. Here’s what goes into it.',
    dated: false,
  },
  {
    slug: 'care',
    path: '/jewellery-care',
    title: 'Jewellery Care',
    navLabel: 'Jewellery care guide',
    group: 'about',
    summary: 'A little care keeps the shine going.',
    dated: false,
  },
  {
    slug: 'ring-size',
    path: '/ring-size-guide',
    title: 'Ring Size Guide',
    navLabel: 'Ring size guide',
    group: 'about',
    summary: 'Find your fit before you order. We can’t offer size exchanges, so please check the chart first.',
    dated: false,
  },
  {
    slug: 'shipping',
    path: '/shipping-policy',
    title: 'Shipping Policy',
    navLabel: 'Shipping policy',
    group: 'help',
    summary: 'How we dispatch and deliver your order, and what it costs.',
  },
  {
    slug: 'returns',
    path: '/returns-policy',
    title: 'Refund and Cancellation Policy',
    navLabel: 'Refund & cancellation policy',
    group: 'help',
    summary: 'What to do if your order arrives damaged or is not what you ordered.',
  },
  {
    slug: 'contact',
    path: '/contact',
    title: 'Contact Us',
    navLabel: 'Contact us',
    group: 'help',
    summary: 'We are so happy you are here!',
    dated: false,
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
