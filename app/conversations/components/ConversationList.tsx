"use client";
import useConversation from "@/app/hooks/useConversation";
import { FullConversationType } from "@/app/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clsx } from "clsx";
import ConversationBox from "./ConversationBox";
import { IoMdPersonAdd } from "react-icons/io";
import { User } from "@prisma/client";
import MakeGroupModal from "./MakeGroupModal";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";
import useChangeCov from "@/app/hooks/useChangeCov";

interface ConversationListProps {
  initialItems: FullConversationType[];
  users: User[];
}

const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
  users,
}) => {
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const session = useSession();
  const { conversationId, isOpen } = useConversation();
  const router = useRouter();

  const pusherChannel = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  useEffect(() => {
    if (!pusherChannel) {
      return;
    }

    pusherClient.subscribe(pusherChannel);

    // 最新メッセージの表示用イベントハンドラ
    const updateHandler = (conversation: FullConversationType) => {
      setItems((current) =>
        current.map((currentConversation) => {
          if (currentConversation.id === conversation.id) {
            return {
              ...currentConversation,
              messages: conversation.messages,
            };
          }

          return currentConversation;
        }),
      );
    };

    // トークルーム作成用イベントハンドラ
    const newHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        if (find(current, { id: conversation.id })) {
          return current;
        }

        return [conversation, ...current];
      });
    };

    // トークルーム削除用イベントハンドラ
    const deleteHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        return current.filter(
          (currentConversation) => currentConversation.id !== conversation.id,
        );
      });

      if (conversationId == conversation.id) {
        router.push("/conversations");
      }
    };

    pusherClient.bind("conversation:update", updateHandler);
    pusherClient.bind("conversation:new", newHandler);
    pusherClient.bind("conversation:delete", deleteHandler);

    return () => {
      pusherClient.unsubscribe(pusherChannel);
      pusherClient.unbind("conversation:update", updateHandler);
      pusherClient.unbind("conversation:new", newHandler);
      pusherClient.unbind("conversation:delete", deleteHandler);
    };
  }, [pusherChannel, router, conversationId]);

  useEffect(() => {
    pusherClient.subscribe("activeChannel");

    const updateHandler = (data: { email: string; isLogin: boolean }) => {
      setItems((items: FullConversationType[]) =>
        items.map((conv: FullConversationType) => {
          if (!conv.isGroup) {
            return useChangeCov(conv, data);
          }
          return conv;
        }),
      );
    };

    pusherClient.bind("active:update", updateHandler);

    return () => {
      pusherClient.unsubscribe("activeChannel");
      pusherClient.unbind("active:update", updateHandler);
    };
  }, [items]);

  return (
    <div>
      <aside
        className={clsx(
          `
        fixed 
        inset-y-0 
        pb-20
        lg:pb-0
        lg:left-20 
        lg:w-80 
        lg:block 
        border-r 
        border-gray-200 
      `,
          isOpen ? "hidden" : "block w-full left-0",
        )}
      >
        <div className="px-5 h-full">
          <div className="flex justify-between mb-4 pt-4">
            <div className="text-2xl font-bold text-neutral-800">Messages</div>
          </div>
          {/* チャットルーム一覧表示*/}
          <div className="h-[85%] overflow-auto">
            {items.map((item) => (
              <ConversationBox
                key={item.id}
                data={item}
                selected={conversationId === item.id}
              />
            ))}
          </div>
        </div>
        {/* グループチャット制作用ボタン */}
        <div
          onClick={() => setIsModalOpen(true)}
          className="
                rounded-full 
                p-2 
                bg-green-500
                text-white 
                cursor-pointer 
                hover:opacity-75 
		shadow-lg
                transition
		absolute lg:bottom-5 lg:right-5
                md:bottom-20 md:right-5
              "
        >
          <IoMdPersonAdd size={35} />
        </div>
      </aside>
      <MakeGroupModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        users={users}
      />
    </div>
  );
};

export default ConversationList;
