"use client";

import { User, Conversation } from "@prisma/client";

import Image from "next/image";
import { useContext } from "react";
import { ActiveListContext } from "./ActiveList";

interface AvatarProps {
  user?: User;
  conversation?: Conversation;
}

const Avatar: React.FC<AvatarProps> = ({ user, conversation }) => {
  const { members } = useContext(ActiveListContext);
  const isActive = members.indexOf(user?.email!) !== -1;
  return (
    <div className="relative">
      <div
        className="
        relative 
        inline-block 
        rounded-full 
        overflow-hidden
        h-9 
        w-9 
        md:h-11 
        md:w-11
      "
      >
        {user != null ? (
          <Image
            fill
            src={user?.image || "/images/placeholder.jpg"}
            alt="Avatar"
          />
        ) : (
          <Image
            fill
            src={conversation?.image || "/images/group.png"}
            alt="Avatar"
          />
        )}
      </div>
      {isActive && (
        <span
          className="
            absolute 
            block 
            rounded-full 
            bg-green-500 
            ring-2 
            ring-white 
            top-0 
            right-0
            h-2 
            w-2 
            md:h-3 
            md:w-3
          "
        />
      )}
    </div>
  );
};

export default Avatar;
