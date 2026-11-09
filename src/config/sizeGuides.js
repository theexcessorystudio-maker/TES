/**
 * Size guides keyed by id. A product opts in via `sizeGuide: 'ring'` (set in the admin panel).
 * Data transcribed from the studio's "Ring Size Guide" chart.
 */
export const SIZE_GUIDES = {
  ring: {
    title: 'Ring Size Guide',
    intro: 'Measure the inside diameter of a ring that fits you well, or wrap a strip of paper around your finger and measure its length for the circumference. Match either number below.',
    columns: [
      { key: 'diameter', label: 'Diameter (mm)' },
      { key: 'circumference', label: 'Circumference (mm)' },
      { key: 'size', label: 'US size' },
    ],
    rows: [
      { diameter: '14.88', circumference: '46.00', size: '4' },
      { diameter: '15.69', circumference: '49.32', size: '5' },
      { diameter: '16.51', circumference: '51.87', size: '6' },
      { diameter: '17.35', circumference: '54.51', size: '7' },
      { diameter: '18.19', circumference: '57.15', size: '8' },
      { diameter: '18.88', circumference: '59.34', size: '9' },
      { diameter: '19.84', circumference: '62.33', size: '10' },
      { diameter: '20.68', circumference: '64.94', size: '11' },
      { diameter: '21.49', circumference: '67.51', size: '12' },
    ],
    tips: ['Measure at the end of the day, when fingers are largest.', 'Between two sizes? Choose the larger one.'],
    downloadUrl: '/size-guides/ring-size-guide.pdf',
  },
}
