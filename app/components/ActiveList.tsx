"use client";

import React, { createContext, useEffect, useState } from "react";
import { Channel, Members } from "pusher-js";
import { useSession } from "next-auth/react";
import { pusherClient } from "../libs/pusher";

interface ActiveListProps {
  children: React.ReactNode;
}

interface ActiveListContextType {
  members: string[];
}

export const ActiveListContext = createContext<ActiveListContextType>({
  members: [],
});

const ActiveList = ({ children }: ActiveListProps) => {
  const [members, setMembers] = useState<string[]>([]);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  const add = (id: string) => {
    setMembers((current) => [...current, id]);
  };
  const remove = (id: string) => {
    setMembers((current) => current.filter((memberId) => memberId! == id));
  };
  const set = (ids: string[]) => {
    setMembers(ids);
  };

  const { data: session, status } = useSession();

  useEffect(() => {
    let channel = activeChannel;

    if (!channel) {
      channel = pusherClient.subscribe("presence-messenger");
      setActiveChannel(channel);
    }

    // プレゼンスチャンネルへの接続成功時のイベントハンドラ登録
    channel.bind("pusher:subscription_succeeded", (members: Members) => {
      const initialMembers: string[] = [];
      members.each((member: Record<string, any>) =>
        initialMembers.push(member.id),
      );
      set(initialMembers);
    });

    // チャンネルへのユーザ追加時のイベントハンドラ登録
    channel.bind("pusher:member_added", (member: Record<string, any>) => {
      add(member.id);
    });

    // チャンネルからユーザが退出した場合のイベントハンドラ登録
    channel.bind("pusher:member_removed", (member: Record<string, any>) => {
      remove(member.id);
    });

    return () => {
      if (activeChannel) {
        pusherClient.unsubscribe("presence-messenger");
        setActiveChannel(null);
      }
    };
  }, [session]);

  return (
    <ActiveListContext.Provider value={{ members }}>
      {children}
    </ActiveListContext.Provider>
  );
};

export default ActiveList;
