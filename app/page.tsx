'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Book, FileText, Headphones, Video, ScrollText, Filter, X } from 'lucide-react'

type Collection = {
  id: string
  title: string
  category: string
  meta: string
  cover: string
  description?: string
}

const CATEGORIES = [
  { id: 'all', name: 'All', icon: Filter },
  { id: 'books', name: 'Books', icon: Book },
  { id: 'journals', name: 'Journals', icon: FileText },
  { id: 'audio', name: 'Audio', icon: Headphones },
  { id: 'video', name: 'Video', icon: Video },
  { id: 'manuscripts', name: 'Manuscripts', icon: ScrollText },
]

const COLLECTIONS: Collection[] = [
  {
    id: 'gatsby',
    title: 'The Great Gatsby',
    category: 'books',
    meta: 'Books · 1925 · F. Scott Fitzgerald',
    cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=600&fit=crop',
  },
  {
    id: 'journal-computing',
    title: 'Journal of Computing',
    category: 'journals',
    meta: 'Journals · Vol. 12 · 2023',
    cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
  },
  {
    id: 'shakespeare-audio',
    title: 'Shakespeare Plays (Audio)',
    category: 'audio',
    meta: 'Audio · Narrated collection',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=600&fit=crop',
  },
  {
    id: 'history-documentary',
    title: 'History Documentary',
    category: 'video',
    meta: 'Video · 90 min',
    cover: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop',
  },
  {
    id: 'ancient-scripts',
    title: 'Ancient Scripts',
    category: 'manuscripts',
    meta: 'Manuscripts · Rare',
    cover: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?w=800&h=600&fit=crop',
  },
  // Additional collections for better grid layout
  {
    id: 'modern-physics',
    title: 'Modern Physics',
    category: 'books',
    meta: 'Books · 2022 · Scientific',
    cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&h=600&fit=crop',
  },
  {
    id: 'art-history',
    title: 'Art History Journal',
    category: 'journals',
    meta: 'Journals · Quarterly · Illustrated',
    cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop',
  },
  {
    id: 'classical-music',
    title: 'Classical Music Collection',
    category: 'audio',
    meta: 'Audio · 120+ tracks',
    cover: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=800&h=600&fit=crop',
  },
]

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Filter collections based on category and search
  const filteredCollections = useMemo(() => {
    return COLLECTIONS.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory
      const matchesSearch =
        search === '' ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.meta.toLowerCase().includes(search.toLowerCase())

      return matchesCategory && matchesSearch
    })
  }, [activeCategory, search])

  // Update year in footer
  const currentYear = new Date().getFullYear()

  // Handle category filter
  const handleCategoryFilter = (categoryId: string) => {
    setActiveCategory(categoryId)
    // Close mobile menu on selection
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(false)
    }
  }

  // Reset filters
  const handleResetFilters = () => {
    setActiveCategory('all')
    setSearch('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-800">E-Library Collections</h1>
              <button 
                className="md:hidden p-2 rounded-lg bg-gray-100"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            
            <form className="w-full md:w-auto" role="search" aria-label="Search collections">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="searchInput"
                  type="search"
                  placeholder="Search collections..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Search collections"
                />
              </div>
            </form>
          </div>
        </div>
      </header>

      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:py-20 lg:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Discover Your Next
              <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                Great Read
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-blue-100 md:text-xl">
              Explore our vast collection of books, journals, audio, and more from around the world
            </p>
            <div className="relative mx-auto max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-blue-400" />
                <input
                  type="search"
                  placeholder="Search collections, authors, or topics..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border-0 bg-white py-4 pl-12 pr-10 text-gray-900 placeholder-gray-500 shadow-2xl outline-none ring-2 ring-white/20 transition-all focus:ring-4 focus:ring-blue-400/50"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-sm text-blue-100">
              <span>Popular:</span>
              {['Fiction', 'Science', 'History', 'Biography', 'Technology'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearch(tag)}
                  className="rounded-full bg-white/10 px-3 py-1 hover:bg-white/20 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Layout */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Categories */}
          <aside className={`lg:w-64 ${isMobileMenuOpen ? 'block' : 'hidden'} lg:block`}>
            <nav className="bg-white rounded-xl shadow-sm p-6" aria-label="Categories">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Categories</h2>
                {(activeCategory !== 'all' || search) && (
                  <button 
                    onClick={handleResetFilters}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Reset
                  </button>
                )}
              </div>
              
              <ul className="space-y-2">
                {CATEGORIES.map((category) => {
                  const Icon = category.icon
                  const isActive = activeCategory === category.id
                  const count = category.id === 'all' 
                    ? COLLECTIONS.length 
                    : COLLECTIONS.filter(item => item.category === category.id).length
                  
                  return (
                    <li key={category.id}>
                      <button
                        onClick={() => handleCategoryFilter(category.id)}
                        className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors ${
                          isActive 
                            ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        aria-pressed={isActive}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {count}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
              
              {/* Stats */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Showing</span>
                    <span className="font-semibold text-gray-800">{filteredCollections.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total</span>
                    <span className="font-semibold text-gray-800">{COLLECTIONS.length}</span>
                  </div>
                </div>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1" id="main" tabIndex={-1}>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Collection Items</h2>
              <p className="text-gray-600">
                {activeCategory === 'all' 
                  ? 'All collections' 
                  : `Showing ${CATEGORIES.find(c => c.id === activeCategory)?.name} collections`
                }
              </p>
            </div>

            {/* Collections Grid */}
            <section className="collections-grid">
              {filteredCollections.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCollections.map((item) => (
                    <article 
                      key={item.id} 
                      className="card bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                      data-category={item.category}
                    >
                      <Link href={`/collection/${item.id}`} className="block">
                        <figure className="card-cover relative h-48 overflow-hidden">
                          <Image
                            src={item.cover}
                            alt={`Cover: ${item.title}`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 right-3">
                            <span className="bg-black/70 text-white text-xs px-2 py-1 rounded">
                              {item.category}
                            </span>
                          </div>
                        </figure>
                        
                        <div className="card-body p-5">
                          <h3 className="card-title text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                            {item.title}
                          </h3>
                          <p className="card-meta text-sm text-gray-600">
                            {item.meta}
                          </p>
                          <div className="mt-4">
                            <span className="text-blue-600 text-sm font-medium hover:text-blue-800">
                              View details →
                            </span>
                          </div>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <div className="text-5xl mb-4">📚</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No collections found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your search or category filter</p>
                  <button 
                    onClick={handleResetFilters}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Reset all filters
                  </button>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="site-footer bg-gray-800 text-white mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">E-Library</p>
            <p className="text-gray-300 mb-4">Your gateway to knowledge and discovery</p>
            <p className="text-sm text-gray-400">
              © {currentYear} E-Library — All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Add Tailwind CSS for styling */}
      <style jsx global>{`
        .visually-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}