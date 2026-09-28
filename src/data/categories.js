export const categories = [
  {
    id: 'living-room',
    slug: 'living-room',
    title: 'Living Room',
    tagline: 'Heart of the Home',
    description: 'Bespoke living sanctuaries designed for intimate gatherings, seamless entertaining, and timeless comfort.',
    heroImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    stats: {
      projectsCount: '45+',
      awardWinning: '12 Awards',
      avgTimeline: '4-6 Weeks'
    },
    features: ['Custom Acoustic Joinery', 'Architectural Ambient Lighting', 'Curated Stone Fireplaces', 'Bespoke Italian Seating']
  },
  {
    id: 'bedroom',
    slug: 'bedroom',
    title: 'Bedroom',
    tagline: 'Personal Sanctuaries',
    description: 'Restful master suites and private chambers crafted with tactile fabrics, calming palettes, and acoustic balance.',
    heroImage: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1600&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
    stats: {
      projectsCount: '38+',
      awardWinning: '8 Awards',
      avgTimeline: '3-5 Weeks'
    },
    features: ['Floating Backlit Headboards', 'Integrated Glass Wardrobes', 'Cashmere & Linen Wall Paneling', 'Smart Mood Lighting']
  },
  {
    id: 'full-home',
    slug: 'full-home',
    title: 'Full Home',
    tagline: 'Holistic Architectural Living',
    description: 'Comprehensive end-to-end transformation of luxury villas, penthouses, and residences with unified design narrative.',
    heroImage: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
    stats: {
      projectsCount: '60+',
      awardWinning: '20+ Awards',
      avgTimeline: '10-16 Weeks'
    },
    features: ['Complete Turnkey Execution', 'Structural Spatial Planning', 'Custom Commissioned Artwork', 'Full Smart Home Integration']
  },
  {
    id: 'furniture',
    slug: 'furniture',
    title: 'Furniture',
    tagline: 'Artisanal Bespoke Craft',
    description: 'Custom-crafted luxury furniture, bespoke joinery, and statement architectural pieces designed to elevate every living space.',
    heroImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    stats: {
      projectsCount: '40+',
      awardWinning: '10 Awards',
      avgTimeline: '2-4 Weeks'
    },
    features: ['Solid Teak & Oak Joinery', 'Hand-Stitched Italian Leathers', 'Sculptural Statement Consoles', 'Bespoke Ergonomic Proportions']
  }
];

export const getCategoryBySlug = (slug) => {
  return categories.find((cat) => cat.slug === slug);
};
