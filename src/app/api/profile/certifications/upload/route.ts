import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp", "application/pdf"];

const sanitizeFileName = (name: string) => name.replace(/[^a-z0-9._-]/gi, "_");

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.users.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Certificate image is required" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Only PNG, JPG, WEBP, or PDF files are allowed" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File size must be under 5MB" }, { status: 400 });
    }

    const safeName = sanitizeFileName(file.name || "certificate-image");
    const uniqueName = `${Date.now()}-${safeName}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "certificates", user.id.toString());

    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadDir, uniqueName);
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/certificates/${user.id}/${uniqueName}`;

    return NextResponse.json({
      success: true,
      imageUrl: fileUrl,
    });
  } catch (error) {
    console.error("Certificate image upload error:", error);
    return NextResponse.json({ error: "Failed to upload certificate image" }, { status: 500 });
  }
}
