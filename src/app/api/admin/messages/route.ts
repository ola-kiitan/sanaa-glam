import { MessageType } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  const { searchParams } = new URL(request.url);
  const messageType = searchParams.get("messageType");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const messageTypeFilter =
    messageType && Object.values(MessageType).includes(messageType as MessageType)
      ? (messageType as MessageType)
      : undefined;

  const messages = await prisma.messageLog.findMany({
    where: {
      messageType: messageTypeFilter,
      sentAt: {
        ...(from ? { gte: new Date(from) } : {}),
        ...(to ? { lte: new Date(to) } : {}),
      },
    },
    include: {
      appointment: {
        include: {
          service: { select: { name: true } },
          client: { select: { fullName: true, email: true } },
        },
      },
    },
    orderBy: { sentAt: "desc" },
  });

  return NextResponse.json({ messages });
}
