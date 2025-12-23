import prisma from "../../../lib/prisma";
import { promises as fs } from "fs";
import path from "path";

function stripDataUrl(dataUrl: string) {
	const match = dataUrl.match(/^data:([\w/\-\+.]+);base64,(.*)$/);
	if (!match) return { type: null, data: dataUrl };
	return { type: match[1], data: match[2] };
}

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { title, description, category, coverName, coverData, fileName, fileData, authorId } = body ?? {};

		if (!title || !coverName || !coverData || !fileName || !fileData) {
			return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: { "Content-Type": "application/json" } });
		}

		// Ensure uploads directory
		const uploadsDir = path.resolve(process.cwd(), "public", "uploads");
		await fs.mkdir(uploadsDir, { recursive: true });

		// Save cover
		const cover = stripDataUrl(coverData);
		const coverExt = path.extname(coverName) || (cover.type ? `.${cover.type.split('/').pop()}` : "");
		const coverFileName = `${Date.now()}-${Math.random().toString(36).slice(2,8)}${coverExt}`;
		const coverPath = path.join(uploadsDir, coverFileName);
		await fs.writeFile(coverPath, Buffer.from(cover.data, "base64"));

		// Save data file
		const file = stripDataUrl(fileData);
		const fileExt = path.extname(fileName) || (file.type ? `.${file.type.split('/').pop()}` : "");
		const dataFileName = `${Date.now()}-${Math.random().toString(36).slice(2,8)}${fileExt}`;
		const dataPath = path.join(uploadsDir, dataFileName);
		await fs.writeFile(dataPath, Buffer.from(file.data, "base64"));

		// Determine authorId: prefer provided, else pick first user
		let author = authorId;
		if (!author) {
			const first = await prisma.user.findFirst();
			if (!first) {
				return new Response(JSON.stringify({ error: "No author available. Create a user first." }), { status: 500, headers: { "Content-Type": "application/json" } });
			}
			author = first.id;
		}

		const collection = await prisma.collection.create({
			data: {
				title,
				description: description ?? "",
				category: category ?? "",
				coverUrl: `/uploads/${coverFileName}`,
				fileUrl: `/uploads/${dataFileName}`,
				authorId: author,
			},
		});

		return new Response(JSON.stringify({ ok: true, collection }), { status: 201, headers: { "Content-Type": "application/json" } });
	} catch (err) {
		console.error("Collections POST error:", err);
		return new Response(JSON.stringify({ error: "Server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
	}
}

export async function GET(req: Request) {
	try {
		const collections = await prisma.collection.findMany({ include: { author: true }, orderBy: { createdAt: "desc" } });
		return new Response(JSON.stringify(collections), { status: 200, headers: { "Content-Type": "application/json" } });
	} catch (err) {
		console.error("Collections GET error:", err);
		return new Response(JSON.stringify({ error: "Server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
	}
}
