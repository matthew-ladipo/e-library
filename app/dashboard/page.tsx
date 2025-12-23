import prisma from "../../lib/prisma";
import Link from "next/link";
import { 
  BookOpen, 
  Users, 
  Clock, 
  FileText, 
  User, 
  FolderOpen,
  ArrowUpRight,
  Upload,
  Library
} from 'lucide-react';

type RecentCollection = {
  id: string;
  title: string;
  category: string;
  coverUrl?: string;
  createdAt: string;
  author: { id: string; name?: string | null; email: string };
};

async function getDashboardData() {
  const [totalCollections, totalUsers, pendingCollections, recent] = await Promise.all([
    prisma.collection.count(),
    prisma.user.count(),
    prisma.collection.count({ where: { isApproved: false } }),
    prisma.collection.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { author: { select: { id: true, name: true, email: true } } },
    }),
  ]);

  const recentCollections: RecentCollection[] = recent.map((c) => ({
    id: c.id,
    title: c.title,
    category: c.category,
    coverUrl: c.coverUrl,
    createdAt: c.createdAt.toISOString(),
    author: { id: c.author.id, name: c.author.name, email: c.author.email },
  }));

  return { totalCollections, totalUsers, pendingCollections, recentCollections };
}

export default async function DashboardPage() {
  const { totalCollections, totalUsers, pendingCollections, recentCollections } = await getDashboardData();

  const statCards = [
    {
      title: "Total Collections",
      value: totalCollections,
      icon: <BookOpen className="h-5 w-5" />,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: "+12%",
      link: "/library"
    },
    {
      title: "Total Users",
      value: totalUsers,
      icon: <Users className="h-5 w-5" />,
      color: "bg-green-500",
      textColor: "text-green-600",
      bgColor: "bg-green-50",
      trend: "+8%",
      link: "/dashboard/users"
    },
    {
      title: "Pending Approval",
      value: pendingCollections,
      icon: <Clock className="h-5 w-5" />,
      color: "bg-amber-500",
      textColor: "text-amber-600",
      bgColor: "bg-amber-50",
      trend: pendingCollections > 0 ? "Needs review" : "All clear",
      link: "/dashboard/approvals"
    },
    {
      title: "Recent Additions",
      value: recentCollections.length,
      icon: <FileText className="h-5 w-5" />,
      color: "bg-purple-500",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50",
      trend: "Last 7 days",
      link: "/dashboard/recent"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
              <p className="text-gray-600 mt-2">Welcome to your e-Library management dashboard</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Link 
                href="/dashboard/upload"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Upload className="h-4 w-4" />
                Upload Collection
              </Link>
              <Link 
                href="/dashboard/my-collections"
                className="inline-flex items-center gap-2 bg-white text-gray-700 px-5 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow"
              >
                <Library className="h-4 w-4" />
                My Collections
              </Link>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => (
              <Link 
                href={stat.link}
                key={index}
                className="group block"
              >
                <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <div className={`${stat.color} text-white p-2 rounded-md`}>
                        {stat.icon}
                      </div>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold mt-2 text-gray-900">{stat.value.toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className={`text-sm font-medium ${stat.textColor}`}>
                        {stat.trend}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Collections Table */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Recent Collections</h2>
                <p className="text-gray-600 text-sm mt-1">Latest additions to the library</p>
              </div>
              <Link 
                href="/library" 
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View all collections
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Collection
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Author
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Created
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentCollections.map((collection) => (
                  <tr 
                    key={collection.id} 
                    className="hover:bg-blue-50/50 transition-colors duration-150"
                  >
                    <td className="py-4 px-6">
                      <Link 
                        href={`/collection/${collection.id}`}
                        className="group block"
                      >
                        <div className="flex items-center gap-3">
                          {collection.coverUrl ? (
                            <div className="h-10 w-10 rounded-lg bg-gray-100 overflow-hidden">
                              <img 
                                src={collection.coverUrl} 
                                alt={collection.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
                              <FolderOpen className="h-5 w-5 text-blue-600" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                              {collection.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              ID: {collection.id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {collection.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {collection.author.name || collection.author.email.split('@')[0]}
                          </p>
                          <p className="text-xs text-gray-500">{collection.author.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-900">
                        {new Date(collection.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(collection.createdAt).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {recentCollections.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No collections yet</h3>
              <p className="text-gray-600 mb-4">Start by uploading your first collection</p>
              <Link
                href="/dashboard/upload"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <Upload className="h-4 w-4" />
                Upload Collection
              </Link>
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              href="/dashboard/analytics"
              className="bg-white p-5 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 flex items-center gap-4 group"
            >
              <div className="p-3 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">View Analytics</h4>
                <p className="text-sm text-gray-600 mt-1">Library usage & statistics</p>
              </div>
            </Link>
            <Link 
              href="/dashboard/settings"
              className="bg-white p-5 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 flex items-center gap-4 group"
            >
              <div className="p-3 rounded-lg bg-green-50 group-hover:bg-green-100 transition-colors">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Manage Users</h4>
                <p className="text-sm text-gray-600 mt-1">User permissions & roles</p>
              </div>
            </Link>
            <Link 
              href="/dashboard/categories"
              className="bg-white p-5 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 flex items-center gap-4 group"
            >
              <div className="p-3 rounded-lg bg-purple-50 group-hover:bg-purple-100 transition-colors">
                <FolderOpen className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Categories</h4>
                <p className="text-sm text-gray-600 mt-1">Manage collection categories</p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}