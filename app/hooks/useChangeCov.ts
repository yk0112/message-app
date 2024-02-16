import { FullConversationType } from "../types";
import { User } from "@prisma/client";

const useOtherUser = (
  conversation: FullConversationType,
  data: { email: string; isLogin: boolean },
) => {
  const updatedUsers = conversation.users.map((user: User) => {
    if (user.email === data.email) {
      return { ...user, isLogin: data.isLogin };
    }
    return user;
  });

  const updatedConversation = { ...conversation, users: updatedUsers };

  return updatedConversation;
};

export default useOtherUser;
