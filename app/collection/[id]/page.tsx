import Link from 'next/link';
import { ArrowLeft, Download, User, Calendar, Tag, FileText, AlertCircle } from 'lucide-react';
import { notFound } from 'next/navigation';

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

async function getCollection(id: string): Promise<Collection | null> {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/collections/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function CollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const collection = await getCollection(id);

  if (!collection) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/library" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            Back to Library
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Cover Image */}
            <div className="flex-shrink-0">
              {collection.coverUrl ? (
                <img
                  src={collection.coverUrl}
                  alt={collection.title}
                  className="w-48 h-64 object-cover rounded-lg shadow-lg"
                />
              ) : (
                <div className="w-48 h-64 bg-white/20 rounded-lg flex items-center justify-center">
                  <FileText className="h-16 w-16 text-white/70" />
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold mb-4">{collection.title}</h1>
              <p className="text-xl opacity-90 mb-6">{collection.description || "No description provided"}</p>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-6">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm">
                  <Tag className="h-4 w-4" />
                  {collection.category}
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm">
                  <Calendar className="h-4 w-4" />
                  {new Date(collection.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Download Button */}
              {collection.fileUrl && (
                <a
                  href={collection.fileUrl}
                  download
                  className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-md"
                >
                  <Download className="h-5 w-5" />
                  Download Collection
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">About this Collection</h2>
              <div className="prose max-w-none">
                {collection.description ? (
                  <p className="text-gray-700 leading-relaxed">{collection.description}</p>
                ) : (
                  <p className="text-gray-500 italic">No detailed description provided.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Author
              </h3>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {collection.author.name || collection.author.email.split('@')[0]}
                  </p>
                  <p className="text-sm text-gray-500">{collection.author.email}</p>
                </div>
              </div>
            </div>

            {/* Collection Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Collection Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium">{collection.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Uploaded</span>
                  <span className="font-medium">
                    {new Date(collection.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ID</span>
                  <span className="font-mono text-sm text-gray-500">
                    {collection.id.slice(0, 8)}...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
