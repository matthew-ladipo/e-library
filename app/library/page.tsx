"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  Filter,
  Download,
  Eye,
  User,
  Calendar,
  Tag,
  AlertCircle
} from 'lucide-react';

type Collection = {
  id: string;
  title: string;
  description: string;
  category: string;
  coverUrl?: string;
  fileUrl?: string;
  createdAt: string;
  author: { id: string; name?: string | null; email: string };
};

const CATEGORIES = [
  "All",
  "Books",
  "Research Papers",
  "Articles",
  "Journals",
  "Magazines",
  "Documents",
  "Theses",
  "Presentations"
];

export default function LibraryPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    async function fetchCollections() {
      try {
        const res = await fetch('/api/collections');
        if (!res.ok) throw new Error('Failed to fetch collections');
        const data = await res.json();
        setCollections(data);
        setFilteredCollections(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchCollections();
  }, []);

  useEffect(() => {
    let filtered = collections;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(collection =>
        collection.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collection.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collection.author.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collection.author.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(collection => collection.category === selectedCategory);
    }

    setFilteredCollections(filtered);
  }, [collections, searchTerm, selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading library...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Library</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Collections Library</h1>
            <p className="text-xl text-gray-600">Discover and download knowledge from our community</p>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search collections, authors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </header>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredCollections.length} of {collections.length} collections
            {(searchTerm || selectedCategory !== "All") && (
              <span className="ml-2">
                {searchTerm && `for "${searchTerm}"`}
                {searchTerm && selectedCategory !== "All" && " in "}
                {selectedCategory !== "All" && selectedCategory}
              </span>
            )}
          </p>
        </div>

        {/* Collections Grid */}
        {filteredCollections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCollections.map((collection) => (
              <div
                key={collection.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Cover Image */}
                <div className="aspect-[16/9] bg-gray-100 relative overflow-hidden">
                  {collection.coverUrl ? (
                    <img
                      src={collection.coverUrl}
                      alt={collection.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-blue-600" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1 mr-2">
                      {collection.title}
                    </h3>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {collection.description || "No description provided"}
                  </p>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {collection.category}
                    </span>
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
                    <User className="h-3 w-3" />
                    <span>{collection.author.name || collection.author.email.split('@')[0]}</span>
                    <span className="mx-1">•</span>
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(collection.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/collection/${collection.id}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Link>

                    {collection.fileUrl && (
                      <a
                        href={collection.fileUrl}
                        download
                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No collections found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedCategory !== "All"
                ? "Try adjusting your search or filter criteria."
                : "No collections have been uploaded yet."
              }
            </p>
            {(searchTerm || selectedCategory !== "All") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
