import { Conversation, Message, User } from "@prisma/client";

// includeによって外部モデルの情報を取得した場合に利用
export type FullMessageType = Message & {
  sender: User;
  seen: User[];
};

export type FullConversationType = Conversation & {
  users: User[];
  messages: FullMessageType[];
};
