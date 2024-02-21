"use client";

import clsx from "clsx";
import Image from "next/image";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { FullMessageType } from "@/app/types";
import { User } from "@prisma/client";
import Avatar from "@/app/components/Avatar";

interface MessageBoxProps {
  data: FullMessageType;
  isLast?: boolean;
}

const MessageBox: React.FC<MessageBoxProps> = ({ data, isLast }) => {
  const session = useSession();
  const isOwn = session.data?.user?.email === data?.sender?.email;
  const seenNumber = (data.seen || []).filter(
    (user: User) => user.email !== data?.sender?.email,
  ).length;

  const container = clsx("flex gap-3 p-4", isOwn && "justify-end");

  const avatar = clsx(isOwn && "order-2");

  const body = clsx("flex flex-col gap-2", isOwn && "justify-end");

  const sender = clsx("text-sm text-gray-500 mb-1", isOwn && "text-end");

  const message = clsx(
    "text-sm w-fit overflow-hidden shadow-md",
    isOwn ? "bg-green-500 text-white" : "bg-gray-100",
    data.image ? "rounded-md p-0" : "rounded-md py-2 px-3",
  );

  const MessageElem = () => {
    return (
      <div>
        <div className={sender}>{data.sender.name}</div>
        {/* メッセージ */}
        <div className={message}>
          {data.image ? (
            <Image
              alt="Image"
              height="288"
              width="288"
              src={data.image}
              className="
                object-cover 
                cursor-pointer 
                hover:scale-110 
                transition 
                translate
              "
            />
          ) : (
            <div>{data.body}</div>
          )}
        </div>
      </div>
    );
  };

  const SeenElem = () => {
    return (
      <div className="gap-1 mt-6">
        <div
          className="
            text-xs 
            font-light 
            text-gray-400
            "
        >
          {isOwn && seenNumber > 0 ? `既読 ${seenNumber}` : ""}
        </div>
        <div className="text-xs text-gray-400">
          {format(new Date(data.createdAt), "p")}
        </div>
      </div>
    );
  };

  return (
    <div className={container}>
      {/*ユーザアイコン */}
      <div className={avatar}>
        <Avatar user={data.sender} activeHidden={true} />
      </div>

      <div className={body}>
        {/* ユーザ名,送信時刻,既読 */}
        <div className="flex items-end gap-2">
          {isOwn ? <SeenElem /> : <MessageElem />}
          {isOwn ? <MessageElem /> : <SeenElem />}
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
