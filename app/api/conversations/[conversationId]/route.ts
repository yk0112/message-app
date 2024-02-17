import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import { User, Message } from "@prisma/client";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

interface IParams {
  conversationId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams },
) {
  try {
    const { conversationId } = params;
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return NextResponse.json(null);
    }

    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });

    if (!existingConversation) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const relatedUsers = await prisma.user.findMany({
      where: {
        conversationIds: {
          has: conversationId,
        },
      },
    });

    relatedUsers.map((user: User) =>
      prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          conversationIds: user.conversationIds.filter(
            (id: string) => id !== conversationId,
          ),
        },
      }),
    );

    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id],
        },
      },
    });

    existingConversation.users.forEach((user: User) => {
      if (user.email) {
        pusherServer.trigger(
          user.email,
          "conversation:delete",
          existingConversation,
        );
      }
    });

    return NextResponse.json(deletedConversation);
  } catch (error) {
    return NextResponse.json(null);
  }
}
