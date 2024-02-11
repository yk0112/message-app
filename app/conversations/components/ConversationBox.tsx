"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Conversation, Message, User } from "@prisma/client";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { FullConversationType } from "@/app/types";
import useOtherUser from "@/app/hooks/useOtherUser";
import Avatar from "@/app/components/Avatar";
import { Dropdown, Modal, Menu, Button } from "antd";
import useModals from "./ContextMenu";
import { IoIosNotificationsOutline } from "react-icons/io";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { MdHideSource } from "react-icons/md";
import { ImExit } from "react-icons/im";

interface ConversationBoxProps {
  data: FullConversationType;
  selected?: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected,
}) => {
  const otherUser = useOtherUser(data);
  const session = useSession();
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`);
  }, [data.id, router]);

  const handleContextMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
  };

  const lastMessage = useMemo(() => {
    const messages = data.messages || [];

    return messages[messages.length - 1];
  }, [data.messages]);

  const userEmail = useMemo(
    () => session.data?.user?.email,
    [session.data?.user?.email],
  );

  const [isModalOpen, setIsModalOpen] = useState({
    hidden: false,
    delete: false,
    edit: false,
    exit: false,
    notification: false,
  });

  const showModal = (key: string) => {
    setIsModalOpen((prevState) => ({
      ...prevState,
      [key]: true,
    }));
  };

  const handleOk = (key: string) => {
    setIsModalOpen((prevState) => ({
      ...prevState,
      [key]: false,
    }));
  };

  const handleCancel = (key: string) => {
    setIsModalOpen((prevState) => ({
      ...prevState,
      [key]: false,
    }));
  };

  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }

    const seenArray = lastMessage.seen || [];

    if (!userEmail) {
      return false;
    }

    return (
      seenArray.filter((user: User) => user.email === userEmail).length !== 0
    );
  }, [userEmail, lastMessage]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return "Sent an image";
    }

    if (lastMessage?.body) {
      return lastMessage?.body;
    }

    return "Started a conversation";
  }, [lastMessage]);

  const ContextMenu = (
    <Menu
      onClick={({ key }) => {
        showModal(key);
      }}
      items={[
        { label: "非表示", key: "hidden", icon: <MdHideSource /> },
        { label: "トークを削除", key: "delete", icon: <MdDeleteOutline /> },
        { label: "グループを編集", key: "edit", icon: <MdOutlineEdit /> },
        { label: "トークから退会", key: "exit", icon: <ImExit /> },
        {
          label: "通知オフ",
          key: "notification",
          icon: <IoIosNotificationsOutline />,
        },
      ]}
    ></Menu>
  );

  return (
    <div>
      <Dropdown overlay={ContextMenu} trigger={["contextMenu"]}>
        <div
          onClick={handleClick}
          className={clsx(
            `
        w-full 
        relative 
        flex 
        items-center 
        space-x-3 
        p-3 
        hover:bg-neutral-100
        rounded-lg
        transition
        cursor-pointer
        `,
            selected ? "bg-neutral-100" : "bg-white",
          )}
        >
          {/*チャットルームアイコン*/}
          <Avatar user={otherUser} />

          <div className="min-w-0 flex-1">
            <div className="focus:outline-none">
              <span className="absolute inset-0" aria-hidden="true" />
              <div className="flex justify-between items-center mb-1">
                {/*チャットルーム名*/}
                <p className="text-md font-medium text-gray-900">
                  {data.name || otherUser.name}
                </p>

                {/* メッセージ送信日時*/}
                {lastMessage?.createdAt && (
                  <p
                    className="
                  text-xs 
                  text-gray-400 
                  font-light
                "
                  >
                    {format(new Date(lastMessage.createdAt), "p")}
                  </p>
                )}
              </div>
              {/*チャットルーム内の最後のメッセージ*/}
              <p
                className={clsx(
                  `
              truncate 
              text-sm
              `,
                  hasSeen ? "text-gray-500" : "text-black font-medium",
                )}
              >
                {lastMessageText}
              </p>
            </div>
          </div>
        </div>
      </Dropdown>
      {useModals.map((item) => (
        <Modal
          open={isModalOpen[item.key]}
          onOk={() => handleOk(item.key)}
          onCancel={() => handleCancel(item.key)}
          width={item.width}
          footer={[
            <Button
              key="back"
              type="text"
              style={{ background: "white", borderColor: "#3cb371" }}
              onClick={() => handleCancel(item.key)}
            >
              キャンセル
            </Button>,
            <Button
              key="submit"
              type="primary"
              style={{ background: "#3cb371", borderColor: "#3cb371" }}
              onClick={() => handleOk(item.key)}
            >
              {item.okText}
            </Button>,
          ]}
        >
          <p>{item.message}</p>
        </Modal>
      ))}
    </div>
  );
};

export default ConversationBox;
