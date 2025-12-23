import prisma from "../../../lib/prisma";

type RecentCollection = {
  id: string;
  title: string;
  category: string;
  coverUrl?: string;
  createdAt: string;
  author: { id: string; name?: string | null; email: string };
};

type PrismaCollectionWithAuthor = {
  id: string;
  title: string;
  category: string;
  coverUrl: string | null;
  createdAt: Date;
  author: {
    id: string;
    name: string | null;
    email: string;
  };
};

export async function GET() {
  try {
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

    const recentCollections: RecentCollection[] = (recent as PrismaCollectionWithAuthor[]).map((c) => ({
      id: c.id,
      title: c.title,
      category: c.category,
      coverUrl: c.coverUrl || undefined,
      createdAt: c.createdAt.toISOString(),
      author: { id: c.author.id, name: c.author.name, email: c.author.email },
    }));

    return Response.json({
      totalCollections,
      totalUsers,
      pendingCollections,
      recentCollections
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return Response.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}