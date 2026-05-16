import { useState, useEffect, useMemo } from 'react'
import { getProducts } from '../lib/supabase'
import ProductCard from '../components/ProductCard'

const fallbackCategories = ['Tissue Repair', 'Dermal', 'Cellular', 'Neuro', 'Circadian']

export default function StorePage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('default')
  const [activeCategory, setActiveCategory] = useState(null)

  useEffect(() => {
    getProducts()
      .then(data => { setProducts(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [])

  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category).filter(Boolean))]
    return cats.length > 0 ? cats : fallbackCategories
  }, [products])

  const filtered = useMemo(() => {
    let list = [...products]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(q))
    }
    if (activeCategory) {
      list = list.filter(p => p.category === activeCategory)
    }
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)
    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name))
    return list
  }, [products, search, sort, activeCategory])

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-14 md:py-20">
        <div className="mb-12">
          <div className="h-10 w-48 bg-[#F5F5F7] rounded-lg animate-pulse mb-3" />
          <div className="h-5 w-80 bg-[#F5F5F7] rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-[#F5F5F7] rounded-2xl mb-4" />
              <div className="h-4 w-20 bg-[#F5F5F7] rounded mb-2" />
              <div className="h-3 w-12 bg-[#F5F5F7] rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 py-24 text-center">
        <p className="text-[#94555A] mb-2">Failed to load products</p>
        <p className="text-[#86868B] text-[14px]">{error}</p>
      </div>
    )
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-14 md:py-20">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-[clamp(2rem,4vw,3rem)] font-bold text-[#1D1D1F] tracking-[-0.03em] mb-3">All Products</h1>
        <p className="text-[#86868B] text-[15px]">Premium research peptides for verified researchers</p>
      </div>

      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868B]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search peptides..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-[#E8E8ED] rounded-full text-[14px] bg-[#FBFBFD] focus:outline-none focus:border-[#1D1D1F]/30 focus:bg-white transition"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-5 py-3 border border-[#E8E8ED] rounded-full text-[14px] bg-[#FBFBFD] focus:outline-none focus:border-[#1D1D1F]/30 transition appearance-none cursor-pointer"
        >
          <option value="default">Sort by</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name">Name</option>
        </select>
      </div>

      {/* Category Chips */}
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all ${!activeCategory ? 'bg-[#1D1D1F] text-white' : 'bg-[#F5F5F7] text-[#86868B] hover:bg-[#E8E8ED]'}`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all ${activeCategory === cat ? 'bg-[#1D1D1F] text-white' : 'bg-[#F5F5F7] text-[#86868B] hover:bg-[#E8E8ED]'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
        {filtered.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-24">
          <p className="text-[#86868B] text-[15px]">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
