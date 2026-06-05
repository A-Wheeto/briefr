import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const tasks = await prisma.task.findMany({
    where: { userId: user.id },
    orderBy: { position: "asc" },
  });

  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { title, status = "BACKLOG" } = await request.json();

  const lastTask = await prisma.task.findFirst({
    where: { userId: user.id, status },
    orderBy: { position: "desc" },
  });
  const position = (lastTask?.position ?? 0) + 1000;

  const task = await prisma.task.create({
    data: {
      userId: user.id,
      title,
      status,
      position,
      completedAt: status === "DONE" ? new Date() : null,
    },
  });

  return NextResponse.json(task, { status: 201 });
}
