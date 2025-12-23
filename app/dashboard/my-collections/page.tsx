"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Download,
  Eye,
  Clock,
  FolderOpen,
  Upload,
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

export default function MyCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCollections() {
      try {
        const res = await fetch('/api/collections');
        if (!res.ok) throw new Error('Failed to fetch collections');
        const data = await res.json();
        setCollections(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchCollections();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your collections...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Collections</h2>
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Collections</h1>
              <p className="text-gray-600 mt-2">Manage and track your uploaded collections</p>
            </div>

            <Link
              href="/dashboard/upload"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Upload className="h-4 w-4" />
              Upload New Collection
            </Link>
          </div>
        </header>

        {/* Collections Grid */}
        {collections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
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
                      <FolderOpen className="h-12 w-12 text-blue-600" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
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

                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                    <Clock className="h-3 w-3" />
                    {new Date(collection.createdAt).toLocaleDateString()}
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No collections yet</h3>
            <p className="text-gray-600 mb-6">You haven't uploaded any collections. Start sharing your knowledge!</p>
            <Link
              href="/dashboard/upload"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Upload className="h-5 w-5" />
              Upload Your First Collection
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
