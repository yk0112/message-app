import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { login } = body;
    const currentUser = await getCurrentUser();

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updateUser = await prisma.user.update({
      where: {
        email: currentUser?.email,
      },
      data: {
        isLogin: login ? true : false,
      },
    });

    await pusherServer.trigger("activeChannel", "active:update", {
      email: updateUser.email,
      isLogin: updateUser.isLogin,
    });

    return NextResponse.json(updateUser);
  } catch (error: any) {
    console.log(error, "UPDATE_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
