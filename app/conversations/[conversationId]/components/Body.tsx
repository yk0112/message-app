"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import useConversation from "@/app/hooks/useConversation";
import { FullMessageType } from "@/app/types";
import MessageBox from "./MessageBox";
import { pusherClient, pusherServer } from "@/app/libs/pusher";
import { find } from "lodash";

interface BodyProps {
  initialMessages: FullMessageType[];
}

const Body: React.FC<BodyProps> = ({ initialMessages = [] }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState(initialMessages);
  const { conversationId } = useConversation();

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView();

    // トークルーム内のメッセージ更新用イベントハンドラ
    const messageHandler = (message: FullMessageType) => {
      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current;
        }

        return [...current, message];
      });

      axios.post(`/api/conversations/${conversationId}/seen`);
      bottomRef?.current?.scrollIntoView();
    };

    // 既読更新用イベントハンドラ
    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
            return newMessage;
          }

          return currentMessage;
        }),
      );
    };

    pusherClient.bind("message:new", messageHandler);
    pusherClient.bind("message:update", updateMessageHandler);

    // アンマウント時にイベントのリッスンを解除
    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("message:new", messageHandler);
      pusherClient.unbind("message:update", updateMessageHandler);
    };
  }, [conversationId]);

  return (
    <div className="flex-1 overflow-y-auto">
      {/* メッセージ一覧を表示*/}
      {messages.map((message, i) => (
        <MessageBox
          isLast={i === messages.length - 1}
          key={message.id}
          data={message}
        />
      ))}
      {/* 最新のメッセージが表示範囲内に来るようにスクロールするための要素*/}
      <div className="pt-24" ref={bottomRef} />
    </div>
  );
};

export default Body;
