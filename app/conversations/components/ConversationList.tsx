"use client";
import useConversation from "@/app/hooks/useConversation";
import { FullConversationType } from "@/app/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { clsx } from "clsx";
import { MdOutlineAdd, MdOutlineGroupAdd } from "react-icons/md";
import ConversationBox from "./ConversationBox";
import { IoMdPersonAdd } from "react-icons/io";

interface ConversationListProps {
  initialItems: FullConversationType[];
}

const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
}) => {
  const [items, setItems] = useState(initialItems);
  const router = useRouter();

  const { conversationId, isOpen } = useConversation();

  return (
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
        overflow-y-auto 
        border-r 
        border-gray-200 
      `,
        isOpen ? "hidden" : "block w-full left-0",
      )}
    >
      <div className="px-5 h-[90%]">
        <div className="flex justify-between mb-4 pt-4">
          <div className="text-2xl font-bold text-neutral-800">Messages</div>
        </div>
        {/* チャットルーム一覧表示*/}
        {items.map((item) => (
          <ConversationBox
            key={item.id}
            data={item}
            selected={conversationId === item.id}
          />
        ))}
      </div>
      {/* グループチャット制作用ボタン */}
      <div
        className="
                rounded-full 
                p-2 
                bg-green-500
                text-white 
                cursor-pointer 
                hover:opacity-75 
		shadow-lg
                transition
		absolute bottom-5 right-5
              "
      >
        <IoMdPersonAdd size={35} />
      </div>
    </aside>
  );
};

export default ConversationList;
