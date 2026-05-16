import { useState, useMemo } from 'react'
import { products, categories } from '../data/products'
import ProductCard from '../components/ProductCard'

export default function StorePage() {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('default')
  const [activeCategory, setActiveCategory] = useState(null)

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
  }, [search, sort, activeCategory])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-poppins text-3xl md:text-4xl font-bold text-[#0B0B0B] mb-2">All Products</h1>
        <p className="text-[#555555]">Premium research peptides for verified researchers</p>
      </div>

      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search peptides..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-[#E4E4E7] rounded-full text-sm focus:outline-none focus:border-[#0B0B0B] transition"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2.5 border border-[#E4E4E7] rounded-full text-sm bg-white focus:outline-none focus:border-[#0B0B0B] transition"
        >
          <option value="default">Sort by</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name">Name</option>
        </select>
      </div>

      {/* Category Chips */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${!activeCategory ? 'bg-[#0B0B0B] text-white' : 'bg-[#F8F8F8] text-[#555555] hover:bg-[#E8E8E8]'}`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${activeCategory === cat ? 'bg-[#0B0B0B] text-white' : 'bg-[#F8F8F8] text-[#555555] hover:bg-[#E8E8E8]'}`}
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
        <div className="text-center py-20">
          <p className="text-[#555555]">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
